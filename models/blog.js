const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    _id: String,
    title: String,
    description: String,
    cover_picture_url: String,
    user_id: {
      type: String,
      ref: "User",
    },
    deleted_at: String,
    is_draft: Boolean,
  },
  { timestamps: true }
);

blogSchema.index({ title: "text" });

module.exports = mongoose.model("Blog", blogSchema);
