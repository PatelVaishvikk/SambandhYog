import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    body: String,
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model("Comment", schema);
