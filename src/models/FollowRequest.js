import mongoose from "mongoose";

const FollowRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

FollowRequestSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export default mongoose.models.FollowRequest || mongoose.model("FollowRequest", FollowRequestSchema);
