import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

export default function CreatePost({ onSubmit }) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Please keep the image under 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImageUrl(reader.result?.toString() || "");
      setError("");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const trimmedContent = content.trim();

      if (!trimmedContent && !imageUrl) {
        throw new Error("Add a caption or an image before posting.");
      }

      await onSubmit({
        content: trimmedContent,
        imageUrl
      });

      setContent("");
      setImageUrl("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid rgba(148, 163, 184, 0.18)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(240,253,250,0.95) 100%)"
      }}
    >
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h6">Create a post</Typography>
          <Typography color="text.secondary" variant="body2">
            Add a caption, attach an image, and publish a media post.
          </Typography>
        </Box>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              multiline
              minRows={3}
              maxRows={8}
              placeholder="Write a caption for your post"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
            {imageUrl ? (
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 4,
                  border: "1px solid rgba(148, 163, 184, 0.25)"
                }}
              >
                <Box
                  component="img"
                  src={imageUrl}
                  alt="Post preview"
                  sx={{
                    display: "block",
                    width: "100%",
                    maxHeight: 460,
                    objectFit: "cover"
                  }}
                />
                <IconButton
                  aria-label="Remove image"
                  onClick={() => setImageUrl("")}
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    backgroundColor: "rgba(15, 23, 42, 0.72)",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(15, 23, 42, 0.9)"
                    }
                  }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </Box>
            ) : null}
            <Box>
              <Button
                component="label"
                startIcon={<ImageOutlinedIcon />}
                variant="outlined"
              >
                Add Image
                <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              </Button>
            </Box>
            <Button disabled={submitting} type="submit" variant="contained">
              {submitting ? "Posting..." : "Post"}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
