import { connectToDatabase } from "@/lib/mongodb";
import { requireSessionUser } from "@/lib/session";
import Follow from "@/models/Follow";
import FollowRequest from "@/models/FollowRequest";
import Conversation from "@/models/Conversation";

function serializeConnectionUser(userDoc, extras = {}) {
  if (!userDoc) return null;
  return {
    id: userDoc._id.toString(),
    name: userDoc.name,
    username: userDoc.username,
    headline: userDoc.headline ?? "",
    avatarUrl: userDoc.avatarUrl ?? "/default-avatar.png",
    ...extras,
  };
}

function serializeConversation(conversation, currentUserId) {
  const currentId = currentUserId.toString();
  const participants = conversation.participants || [];
  const other = participants.find((participant) => participant._id.toString() !== currentId);

  const messages = (conversation.messages || []).slice(-20).map((message) => ({
    id: message._id?.toString() ?? `${message.createdAt.valueOf()}`,
    from: message.sender.toString() === currentId ? "me" : "them",
    content: message.content,
    createdAt: message.createdAt,
  }));

  return {
    id: conversation._id.toString(),
    participant: serializeConnectionUser(other),
    messages,
    updatedAt: conversation.updatedAt,
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  await connectToDatabase();

  const user = await requireSessionUser(req, res);
  if (!user) return;

  try {
    const userId = user._id;

    const [followersDocs, followingsDocs, incomingRequests, outgoingRequests, conversations] = await Promise.all([
      Follow.find({ following: userId }).populate("follower", "name username headline avatarUrl"),
      Follow.find({ follower: userId }).select("following"),
      FollowRequest.find({ recipient: userId, status: "pending" }).populate("requester", "name username headline avatarUrl"),
      FollowRequest.find({ requester: userId, status: "pending" }).populate("recipient", "name username headline avatarUrl"),
      Conversation.find({ participants: userId })
        .sort({ updatedAt: -1 })
        .populate("participants", "name username headline avatarUrl"),
    ]);

    const followingSet = new Set(followingsDocs.map((doc) => doc.following.toString()));

    const followers = followersDocs.map((doc) => {
      const follower = doc.follower;
      const status = followingSet.has(follower._id.toString()) ? "following" : "needs-follow-back";
      return serializeConnectionUser(follower, { status });
    });

    const requests = incomingRequests.map((request) =>
      serializeConnectionUser(request.requester, { requestId: request._id.toString() })
    );

    const outgoing = outgoingRequests.map((request) =>
      serializeConnectionUser(request.recipient, { requestId: request._id.toString(), status: "pending" })
    );

    const serializedConversations = conversations
      .map((conversation) => serializeConversation(conversation, userId))
      .filter((conversation) => conversation.participant);

    res.status(200).json({
      followers,
      requests,
      outgoing,
      conversations: serializedConversations,
    });
  } catch (error) {
    console.error("Connections error", error);
    res.status(500).json({ message: "Failed to fetch connections" });
  }
}
