import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

const formatDate = (date) =>
  new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  });

export default function PostCard({ post, onLike, onCommentClick }) {
  return (
    <Card
      elevation={0}
      sx={{
        overflow: "hidden",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        background: "rgba(255, 255, 255, 0.94)"
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ px: 2.5, pt: 2.5, width: "100%" }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Avatar sx={{ bgcolor: "primary.main", width: 46, height: 46 }}>
              {post.authorName?.[0]?.toUpperCase() || "U"}
            </Avatar>
            <Stack>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {post.authorName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(post.createdAt)}
              </Typography>
            </Stack>
          </Stack>

          {post.content ? (
            <Typography sx={{ whiteSpace: "pre-wrap", mb: post.imageUrl ? 2 : 0 }}>
              {post.content}
            </Typography>
          ) : null}
        </Box>

        {post.imageUrl ? (
          <Box
            sx={{
              position: "relative",
              px: 1.5,
              pb: 1.5
            }}
          >
            <Box
              component="img"
              src={post.imageUrl}
              alt={`${post.authorName}'s post`}
              sx={{
                display: "block",
                width: "100%",
                maxHeight: 620,
                minHeight: 300,
                objectFit: "cover",
                borderRadius: 4,
                backgroundColor: "#0f172a"
              }}
            />
          </Box>
        ) : null}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 2, pb: 2 }}
        >
          <Stack direction="row" spacing={2}>
            <Tooltip title="Like">
              <IconButton
                onClick={onLike}
                sx={{
                  backgroundColor: "rgba(248, 113, 113, 0.08)",
                  "&:hover": {
                    backgroundColor: "rgba(248, 113, 113, 0.16)"
                  }
                }}
              >
                {post.likeCount > 0 ? (
                  <FavoriteRoundedIcon sx={{ color: "#ef4444" }} />
                ) : (
                  <FavoriteBorderRoundedIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Comments">
              <IconButton
                onClick={onCommentClick}
                sx={{
                  backgroundColor: "rgba(15, 118, 110, 0.08)",
                  "&:hover": {
                    backgroundColor: "rgba(15, 118, 110, 0.16)"
                  }
                }}
              >
                <ChatBubbleOutlineRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack alignItems="flex-end">
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {post.likeCount} likes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.comments.length} comments
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
