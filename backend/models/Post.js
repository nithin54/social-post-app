const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    content: { type: String, required: true, trim: true }
  },
  {
    timestamps: true,
    _id: true
  }
);

const postSchema = new mongoose.Schema(
  {
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    content: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "" },
    comments: {
      type: [commentSchema],
      default: []
    },
    likedBy: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);
