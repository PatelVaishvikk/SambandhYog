"use strict";

import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { requireSessionUser } from "@/lib/session";
import Story from "@/models/Story";
import { STORY_MAX_CHARACTERS } from "@/constants/stories";
import { getBackgroundPreset, groupStoriesByAuthor, serializeStoryGroup } from "@/lib/stories";

function normalize(value) {
  if (!value) return null;
  return typeof value.toString === "function" ? value.toString() : value;
}

async function getAuthorGroup(authorId) {
  const activeStories = await Story.find({
    author: authorId,
    expiresAt: { $gt: new Date() },
  })
    .sort({ createdAt: -1 })
    .populate("author", "name username headline avatarUrl");

  const grouped = groupStoriesByAuthor(activeStories);
  const stories = grouped.get(normalize(authorId));
  if (!stories || !stories.length) {
    return null;
  }
  const sorted = stories.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  return serializeStoryGroup(sorted, authorId);
}

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await connectToDatabase();

  const user = await requireSessionUser(req, res);
  if (!user) return;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid story id" });
    return;
  }

  const story = await Story.findById(id);
  if (!story) {
    res.status(404).json({ message: "Story not found" });
    return;
  }

  if (story.author.toString() !== user._id.toString()) {
    res.status(403).json({ message: "You cannot modify this story" });
    return;
  }

  if (method === "PATCH") {
    const { content, backgroundId } = req.body ?? {};
    const trimmed = typeof content === "string" ? content.trim() : "";
    if (!trimmed) {
      res.status(400).json({ message: "Story content is required" });
      return;
    }
    if (trimmed.length > STORY_MAX_CHARACTERS) {
      res.status(400).json({ message: `Story is too long (max ${STORY_MAX_CHARACTERS} characters)` });
      return;
    }

    const preset = getBackgroundPreset(backgroundId);
    story.content = trimmed;
    story.backgroundId = preset.id;
    story.textClass = preset.textClass;
    await story.save();

    const group = await getAuthorGroup(user._id);
    res.status(200).json({ group });
    return;
  }

  if (method === "DELETE") {
    await story.deleteOne();
    const group = await getAuthorGroup(user._id);
    res.status(200).json({ group, removedId: id });
    return;
  }

  res.status(405).json({ message: "Method not allowed" });
}

