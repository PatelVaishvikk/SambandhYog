import { fetchUsers } from "@/lib/api";
import Follow from "@/models/Follow";
import FollowRequest from "@/models/FollowRequest";
import { requireSessionUser } from "@/lib/session";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const user = await requireSessionUser(req, res);
  if (!user) return;

  try {
    const { q = "", limit } = req.query ?? {};
    const users = await fetchUsers({ search: q, limit });

    const viewerId = user._id.toString();
    const directory = users.filter((entry) => entry.id !== viewerId);
    const directoryIds = directory.map((entry) => entry.id);

    let followingSet = new Set();
    let outgoingSet = new Set();
    const incomingMap = new Map();

    if (directoryIds.length) {
      const [followingDocs, outgoingRequests, incomingRequests] = await Promise.all([
        Follow.find({ follower: viewerId, following: { $in: directoryIds } }).select("following").lean(),
        FollowRequest.find({ requester: viewerId, recipient: { $in: directoryIds }, status: "pending" })
          .select("recipient")
          .lean(),
        FollowRequest.find({ requester: { $in: directoryIds }, recipient: viewerId, status: "pending" })
          .select("requester")
          .lean(),
      ]);

      followingSet = new Set(followingDocs.map((doc) => doc.following.toString()));
      outgoingSet = new Set(outgoingRequests.map((doc) => doc.recipient.toString()));
      incomingRequests.forEach((doc) => {
        incomingMap.set(doc.requester.toString(), doc._id.toString());
      });
    }

    const results = directory.map((entry) => {
      let relationship = "none";
      let requestId = null;

      if (followingSet.has(entry.id)) {
        relationship = "following";
      } else if (outgoingSet.has(entry.id)) {
        relationship = "pending";
      } else if (incomingMap.has(entry.id)) {
        relationship = "requested-you";
        requestId = incomingMap.get(entry.id);
      }

      return {
        ...entry,
        relationship,
        requestId,
      };
    });

    res.status(200).json({ users: results });
  } catch (error) {
    console.error("Search users", error);
    res.status(500).json({ message: "Failed to search users" });
  }
}
