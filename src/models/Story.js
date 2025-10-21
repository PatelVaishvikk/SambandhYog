"use strict";

import mongoose from "mongoose";

const StorySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
      maxlength: 400,
    },
    backgroundId: {
      type: String,
      trim: true,
      default: "aurora",
    },
    textClass: {
      type: String,
      trim: true,
      default: "text-white",
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    viewers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
StorySchema.index({ author: 1, createdAt: -1 });

export default mongoose.models.Story || mongoose.model("Story", StorySchema);

