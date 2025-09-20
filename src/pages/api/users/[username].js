import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Follow from "@/models/Follow";
import FollowRequest from "@/models/FollowRequest";
import { requireSessionUser } from "@/lib/session";
import { sanitizeUser } from "@/lib/serializers";

function buildRelationship({ viewerId, profileId, viewerFollows, profileFollows, pendingRequest }) {
  const isSelf = viewerId && profileId && viewerId.equals(profileId);
  return {
    isSelf,
    follows: Boolean(isSelf || viewerFollows),
    followedBy: Boolean(profileFollows),
    pending: Boolean(pendingRequest),
  };
}

export default async function handler(req, res) {
  const {
    query: { username },
    method,
  } = req;

  if (method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  if (!username) {
    res.status(400).json({ message: "Username is required" });
    return;
  }

  await connectToDatabase();

  const viewer = await requireSessionUser(req, res);
  if (!viewer) return;

  try {
    const profile = await User.findOne({ username: username.toLowerCase() });
    if (!profile) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const [viewerFollows, profileFollows, pendingRequest] = await Promise.all([
      Follow.findOne({ follower: viewer._id, following: profile._id }).lean(),
      Follow.findOne({ follower: profile._id, following: viewer._id }).lean(),
      FollowRequest.findOne({ requester: viewer._id, recipient: profile._id, status: "pending" }).lean(),
    ]);

    const relationship = buildRelationship({
      viewerId: viewer._id,
      profileId: profile._id,
      viewerFollows,
      profileFollows,
      pendingRequest,
    });

    if (!relationship.isSelf && !relationship.follows) {
      res.status(403).json({
        message: "Follow this member to view their profile",
        profile: sanitizeUser(profile),
        relationship,
      });
      return;
    }

    res.status(200).json({ profile: sanitizeUser(profile), relationship });
  } catch (error) {
    console.error("Fetch profile", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
}
