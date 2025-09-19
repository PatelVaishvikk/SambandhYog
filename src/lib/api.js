import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Follow from "@/models/Follow";

export async function fetchUsers({ search = "", limit = 40 } = {}) {
  await connectToDatabase();

  const normalizedLimit = Math.min(Math.max(Number(limit) || 40, 1), 100);
  const trimmedSearch = search.trim();

  const query = trimmedSearch
    ? {
        $or: [
          { name: { $regex: trimmedSearch, $options: "i" } },
          { username: { $regex: trimmedSearch, $options: "i" } },
          { headline: { $regex: trimmedSearch, $options: "i" } },
          { location: { $regex: trimmedSearch, $options: "i" } },
        ],
      }
    : {};

  const userDocs = await User.find(query)
    .sort(trimmedSearch ? { createdAt: -1 } : { createdAt: -1 })
    .limit(normalizedLimit)
    .lean();

  const userIds = userDocs.map((user) => user._id);
  let followerMap = new Map();

  if (userIds.length) {
    const followerCounts = await Follow.aggregate([
      { $match: { following: { $in: userIds } } },
      { $group: { _id: "$following", count: { $sum: 1 } } },
    ]);
    followerMap = new Map(followerCounts.map((entry) => [entry._id.toString(), entry.count]));
  }

  return userDocs.map((user) => ({
    id: user._id.toString(),
    name: user.name,
    username: user.username,
    headline: user.headline ?? "",
    location: user.location ?? "",
    avatarUrl: user.avatarUrl ?? "/default-avatar.png",
    followers: followerMap.get(user._id.toString()) ?? 0,
  }));
}


