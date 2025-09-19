import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reason: String,
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model("Report", schema);
