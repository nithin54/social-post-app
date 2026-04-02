const Post = require("../models/Post");
const User = require("../models/User");
const { clearDatabase, isDatabaseConnected } = require("../db");

const memoryState = {
  users: [],
  posts: []
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const serializeUserDocument = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt
});

const serializePostDocument = (post) => ({
  id: post._id.toString(),
  authorId: post.authorId,
  authorName: post.authorName,
  content: post.content,
  imageUrl: post.imageUrl || "",
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  likeCount: post.likedBy.length,
  likedBy: [...post.likedBy],
  comments: post.comments.map((comment) => ({
    id: comment._id.toString(),
    authorId: comment.authorId,
    authorName: comment.authorName,
    content: comment.content,
    createdAt: comment.createdAt
  }))
});

const sanitizeMemoryUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt
});

const serializeMemoryPost = (post) => ({
  id: post.id,
  authorId: post.authorId,
  authorName: post.authorName,
  content: post.content,
  imageUrl: post.imageUrl || "",
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  likeCount: post.likedBy.length,
  likedBy: [...post.likedBy],
  comments: post.comments.map((comment) => ({
    id: comment.id,
    authorId: comment.authorId,
    authorName: comment.authorName,
    content: comment.content,
    createdAt: comment.createdAt
  }))
});

const createId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

function getStorageMode() {
  return isDatabaseConnected() ? "mongodb" : "memory";
}

async function createUser({ name, email, passwordHash }) {
  if (isDatabaseConnected()) {
    const user = await User.create({ name, email, passwordHash });
    return serializeUserDocument(user);
  }

  const user = {
    id: createId(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString()
  };

  memoryState.users.push(user);
  return sanitizeMemoryUser(user);
}

async function findUserByEmail(email) {
  const normalizedEmail = email.toLowerCase();

  if (isDatabaseConnected()) {
    return User.findOne({ email: normalizedEmail });
  }

  const user = memoryState.users.find((item) => item.email === normalizedEmail);
  return user ? clone(user) : null;
}

async function createPost({ authorId, authorName, content, imageUrl }) {
  if (isDatabaseConnected()) {
    const post = await Post.create({
      authorId,
      authorName,
      content,
      imageUrl
    });

    return serializePostDocument(post);
  }

  const now = new Date().toISOString();
  const post = {
    id: createId(),
    authorId,
    authorName,
    content,
    imageUrl: imageUrl || "",
    createdAt: now,
    updatedAt: now,
    likedBy: [],
    comments: []
  };

  memoryState.posts.unshift(post);
  return serializeMemoryPost(post);
}

async function listPosts() {
  if (isDatabaseConnected()) {
    const posts = await Post.find().sort({ createdAt: -1 });
    return posts.map(serializePostDocument);
  }

  return memoryState.posts.map(serializeMemoryPost);
}

async function getPostById(postId) {
  if (isDatabaseConnected()) {
    const post = await Post.findById(postId);
    return post ? serializePostDocument(post) : null;
  }

  const post = memoryState.posts.find((item) => item.id === postId);
  return post ? serializeMemoryPost(post) : null;
}

async function addComment({ postId, authorId, authorName, content }) {
  if (isDatabaseConnected()) {
    const post = await Post.findById(postId);

    if (!post) {
      return null;
    }

    post.comments.push({
      authorId,
      authorName,
      content
    });

    await post.save();
    return serializePostDocument(post);
  }

  const post = memoryState.posts.find((item) => item.id === postId);

  if (!post) {
    return null;
  }

  post.comments.push({
    id: createId(),
    authorId,
    authorName,
    content,
    createdAt: new Date().toISOString()
  });
  post.updatedAt = new Date().toISOString();

  return serializeMemoryPost(post);
}

async function toggleLike({ postId, userId }) {
  if (isDatabaseConnected()) {
    const post = await Post.findById(postId);

    if (!post) {
      return null;
    }

    const likeIndex = post.likedBy.indexOf(userId);

    if (likeIndex >= 0) {
      post.likedBy.splice(likeIndex, 1);
    } else {
      post.likedBy.push(userId);
    }

    await post.save();
    return serializePostDocument(post);
  }

  const post = memoryState.posts.find((item) => item.id === postId);

  if (!post) {
    return null;
  }

  const likeIndex = post.likedBy.indexOf(userId);

  if (likeIndex >= 0) {
    post.likedBy.splice(likeIndex, 1);
  } else {
    post.likedBy.push(userId);
  }

  post.updatedAt = new Date().toISOString();
  return serializeMemoryPost(post);
}

async function resetStore() {
  if (isDatabaseConnected()) {
    await clearDatabase();
    return;
  }

  memoryState.users = [];
  memoryState.posts = [];
}

module.exports = {
  addComment,
  createPost,
  createUser,
  findUserByEmail,
  getPostById,
  getStorageMode,
  listPosts,
  resetStore,
  toggleLike
};
