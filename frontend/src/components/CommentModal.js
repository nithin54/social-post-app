import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography
} from "@mui/material";

const formatDate = (date) =>
  new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  });

export default function CommentModal({ open, post, onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await onSubmit(post.id, content.trim());
      setContent("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Comments</DialogTitle>
      <DialogContent dividers>
        {!post ? null : (
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {post.authorName}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                {formatDate(post.createdAt)}
              </Typography>
              {post.content ? (
                <Typography sx={{ whiteSpace: "pre-wrap", mb: post.imageUrl ? 2 : 0 }}>
                  {post.content}
                </Typography>
              ) : null}
              {post.imageUrl ? (
                <Box
                  component="img"
                  src={post.imageUrl}
                  alt={`${post.authorName}'s post`}
                  sx={{
                    display: "block",
                    width: "100%",
                    maxHeight: 420,
                    objectFit: "cover",
                    borderRadius: 4
                  }}
                />
              ) : null}
            </Box>

            <Divider />

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Stack spacing={1.5}>
              {post.comments.length === 0 ? (
                <Typography color="text.secondary">
                  No comments yet. Start the conversation.
                </Typography>
              ) : (
                post.comments.map((comment) => (
                  <CommentBubble key={comment.id} comment={comment} />
                ))
              )}
            </Stack>

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  required
                  multiline
                  minRows={2}
                  placeholder="Write a comment"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                />
                <Button disabled={submitting} type="submit" variant="contained">
                  {submitting ? "Sending..." : "Add Comment"}
                </Button>
              </Stack>
            </form>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CommentBubble({ comment }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        backgroundColor: "rgba(15, 118, 110, 0.06)"
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        {comment.authorName}
      </Typography>
      <Typography
        variant="caption"
        display="block"
        color="text.secondary"
        sx={{ mb: 1 }}
      >
        {formatDate(comment.createdAt)}
      </Typography>
      <Typography>{comment.content}</Typography>
    </Box>
  );
}
