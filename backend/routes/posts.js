const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  addComment,
  createPost,
  getPostById,
  listPosts,
  toggleLike
} = require("../data/store");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (_req, res) => {
  try {
    const posts = await listPosts();
    return res.json({ posts });
  } catch (_error) {
    return res.status(500).json({
      message: "Unable to load posts right now."
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const content = req.body?.content?.trim();
    const imageUrl = req.body?.imageUrl?.trim();

    if (!content && !imageUrl) {
      return res.status(400).json({
        message: "Add text or an image to create a post."
      });
    }

    const post = await createPost({
      authorId: req.user.id,
      authorName: req.user.name,
      content: content || "",
      imageUrl: imageUrl || ""
    });

    return res.status(201).json({ post });
  } catch (_error) {
    return res.status(500).json({
      message: "Unable to create the post right now."
    });
  }
});

router.post("/:id/comments", async (req, res) => {
  try {
    const content = req.body?.content?.trim();

    if (!content) {
      return res.status(400).json({
        message: "Comment content is required."
      });
    }

    const post = await addComment({
      postId: req.params.id,
      authorId: req.user.id,
      authorName: req.user.name,
      content
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found."
      });
    }

    return res.status(201).json({ post });
  } catch (_error) {
    return res.status(400).json({
      message: "Unable to add the comment."
    });
  }
});

router.post("/:id/like", async (req, res) => {
  try {
    const post = await getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found."
      });
    }

    const updatedPost = await toggleLike({
      postId: req.params.id,
      userId: req.user.id
    });

    return res.json({ post: updatedPost });
  } catch (_error) {
    return res.status(400).json({
      message: "Unable to update the like."
    });
  }
});

module.exports = router;
