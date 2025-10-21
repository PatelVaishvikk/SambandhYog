import mongoose from "mongoose";
import { STORY_BACKGROUNDS } from "@/constants/stories";

function normalizeId(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof mongoose.Types.ObjectId) return value.toString();
  if (typeof value.toString === "function") return value.toString();
  return String(value);
}

export function getBackgroundPreset(backgroundId) {
  const preset = STORY_BACKGROUNDS.find((item) => item.id === backgroundId);
  return preset ?? STORY_BACKGROUNDS[0];
}

function serializeUser(user) {
  if (!user) return null;
  return {
    id: normalizeId(user._id ?? user.id),
    name: user.name,
    username: user.username,
    headline: user.headline ?? "",
    avatarUrl: user.avatarUrl ?? "/default-avatar.png",
  };
}

export function serializeStory(story) {
  if (!story) return null;
  const preset = getBackgroundPreset(story.backgroundId);
  const createdAt = story.createdAt instanceof Date ? story.createdAt.toISOString() : story.createdAt;
  const expiresAt = story.expiresAt instanceof Date ? story.expiresAt.toISOString() : story.expiresAt;
  return {
    id: normalizeId(story._id ?? story.id),
    content: story.content ?? "",
    backgroundId: preset.id,
    gradientClass: preset.gradient,
    textClass: story.textClass ?? preset.textClass,
    createdAt,
    expiresAt,
  };
}

export function serializeStoryGroup(storyDocuments = [], viewerId) {
  if (!Array.isArray(storyDocuments) || !storyDocuments.length) {
    return null;
  }
  const [firstStory] = storyDocuments;
  const author = serializeUser(firstStory.author);
  if (!author) return null;

  const stories = storyDocuments.map((story) => serializeStory(story)).filter(Boolean);

  return {
    user: author,
    isOwn: viewerId ? normalizeId(author.id) === normalizeId(viewerId) : false,
    stories,
  };
}

export function groupStoriesByAuthor(stories) {
  const grouped = new Map();
  stories.forEach((story) => {
    const authorId = normalizeId(story.author?._id ?? story.author?.id ?? story.author);
    if (!authorId) return;
    const bucket = grouped.get(authorId) ?? [];
    bucket.push(story);
    grouped.set(authorId, bucket);
  });
  return grouped;
}

