import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { requireSessionUser } from "@/lib/session";
import Follow from "@/models/Follow";
import FollowRequest from "@/models/FollowRequest";
import User from "@/models/User";
import { sanitizeUser } from "@/lib/serializers";
import { createNotification } from "@/lib/notifications";

function resolveTargetUser(query) {
  if (!query) return null;
  if (mongoose.Types.ObjectId.isValid(query)) {
    return { _id: query };
  }
  return { username: query.toLowerCase() };
}

async function ensureFollow(followerId, followingId) {
  const existing = await Follow.findOne({ follower: followerId, following: followingId });
  if (existing) {
    return false;
  }

  await Follow.create({ follower: followerId, following: followingId });
  await User.findByIdAndUpdate(followerId, { $inc: { following: 1 } });
  await User.findByIdAndUpdate(followingId, { $inc: { followers: 1 } });
  return true;
}

async function notifyFollowEvent(payload) {
  try {
    await createNotification(payload);
  } catch (error) {
    console.error("Create notification error", error);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  await connectToDatabase();

  const user = await requireSessionUser(req, res);
  if (!user) return;

  const { targetUserId, requestId, action } = req.body ?? {};

  try {
    if (action === "accept" || action === "decline") {
      if (!requestId) {
        res.status(400).json({ message: "requestId is required" });
        return;
      }

      const request = await FollowRequest.findOne({ _id: requestId, recipient: user._id });
      if (!request) {
        res.status(404).json({ message: "Follow request not found" });
        return;
      }

      if (action === "accept") {
        await ensureFollow(request.requester, request.recipient);
        request.status = "accepted";
        await request.save();
        await notifyFollowEvent({
          userId: request.requester,
          type: "follow-accepted",
          message: `${user.name} accepted your follow request.`,
          data: { userId: user._id.toString() },
        });
        const updatedUser = await User.findById(user._id);
        res.status(200).json({ success: true, status: "accepted", user: sanitizeUser(updatedUser) });
      } else {
        request.status = "declined";
        await request.save();
        const updatedUser = await User.findById(user._id);
        res.status(200).json({ success: true, status: "declined", user: sanitizeUser(updatedUser) });
      }
      return;
    }

    if (!targetUserId) {
      res.status(400).json({ message: "targetUserId is required" });
      return;
    }

    const targetQuery = resolveTargetUser(targetUserId);
    if (!targetQuery) {
      res.status(400).json({ message: "Invalid target" });
      return;
    }

    const targetUser = await User.findOne(targetQuery);
    if (!targetUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (targetUser._id.equals(user._id)) {
      res.status(400).json({ message: "You cannot follow yourself" });
      return;
    }

    const alreadyFollowing = await Follow.findOne({ follower: user._id, following: targetUser._id });
    if (alreadyFollowing) {
      const updatedUser = await User.findById(user._id);
      res.status(200).json({ success: true, status: "following", user: sanitizeUser(updatedUser) });
      return;
    }

    const reverseRequest = await FollowRequest.findOne({
      requester: targetUser._id,
      recipient: user._id,
      status: "pending",
    });

    if (reverseRequest) {
      await ensureFollow(reverseRequest.requester, reverseRequest.recipient);
      reverseRequest.status = "accepted";
      await reverseRequest.save();
      await notifyFollowEvent({
        userId: targetUser._id,
        type: "follow-accepted",
        message: `${user.name} accepted your follow request.`,
        data: { userId: user._id.toString() },
      });
      const updatedUser = await User.findById(user._id);
      res.status(200).json({ success: true, status: "accepted", user: sanitizeUser(updatedUser) });
      return;
    }

    const followRequest = await FollowRequest.findOneAndUpdate(
      { requester: user._id, recipient: targetUser._id },
      { requester: user._id, recipient: targetUser._id, status: "pending" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await notifyFollowEvent({
      userId: targetUser._id,
      type: "follow-request",
      message: `${user.name} requested to follow you.`,
      data:
        followRequest && followRequest._id
          ? { userId: user._id.toString(), requestId: followRequest._id.toString() }
          : { userId: user._id.toString() },
    });

    res.status(200).json({ success: true, status: "pending" });
  } catch (error) {
    console.error("Follow action error", error);
    res.status(500).json({ message: "Failed to process follow request" });
  }
}
