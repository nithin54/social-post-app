import React, { useEffect, useState } from "react";
import { Alert, Box, Stack, Typography } from "@mui/material";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import CommentModal from "./CommentModal";
import {
  addComment,
  createPost,
  fetchPosts,
  toggleLike
} from "../services/api";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data.posts);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleCreatePost = async (payload) => {
    const data = await createPost(payload);
    setPosts((current) => [data.post, ...current]);
  };

  const handleToggleLike = async (postId) => {
    const data = await toggleLike(postId);

    setPosts((current) =>
      current.map((post) => (post.id === postId ? data.post : post))
    );

    if (selectedPost?.id === postId) {
      setSelectedPost(data.post);
    }
  };

  const handleAddComment = async (postId, content) => {
    const data = await addComment(postId, content);

    setPosts((current) =>
      current.map((post) => (post.id === postId ? data.post : post))
    );
    setSelectedPost(data.post);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Your feed
        </Typography>
        <Typography color="text.secondary">
          Share something new, keep up with recent posts, and jump into the
          conversation.
        </Typography>
      </Box>

      {message ? <Alert severity="error">{message}</Alert> : null}

      <CreatePost onSubmit={handleCreatePost} />

      {loading ? (
        <Typography color="text.secondary">Loading posts...</Typography>
      ) : posts.length === 0 ? (
        <Alert severity="info">
          No posts yet. Create the first one to get the feed moving.
        </Alert>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onCommentClick={() => setSelectedPost(post)}
            onLike={() => handleToggleLike(post.id)}
          />
        ))
      )}

      <CommentModal
        open={Boolean(selectedPost)}
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onSubmit={handleAddComment}
      />
    </Stack>
  );
}
