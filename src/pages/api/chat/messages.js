import { connectToDatabase } from "@/lib/mongodb";
import { requireSessionUser } from "@/lib/session";
import { getSocketServer } from "@/lib/socketServer";
import Conversation from "@/models/Conversation";
import User from "@/models/User";
import Follow from "@/models/Follow";

async function isMutualFollower(userId, otherId) {
  const [a, b] = await Promise.all([
    Follow.findOne({ follower: userId, following: otherId }).lean(),
    Follow.findOne({ follower: otherId, following: userId }).lean(),
  ]);
  return Boolean(a && b);
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
    participant: other
      ? {
          id: other._id.toString(),
          name: other.name,
          username: other.username,
          headline: other.headline ?? "",
          avatarUrl: other.avatarUrl ?? "/default-avatar.png",
        }
      : null,
    messages,
    updatedAt: conversation.updatedAt,
  };
}

function broadcastConversation(conversation) {
  const io = getSocketServer();
  if (!io) return;

  const participants = conversation.participants || [];
  participants.forEach((participant) => {
    const participantId =
      typeof participant === "string"
        ? participant
        : participant?._id?.toString?.();
    if (!participantId) return;

    const payload = serializeConversation(conversation, participantId);
    io.to(participantId).emit("chat:conversation", { conversation: payload });
  });
}

function getConversationParticipants(currentUserId, recipientId) {
  const ids = [currentUserId.toString(), recipientId.toString()].sort();
  return ids;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  await connectToDatabase();

  const user = await requireSessionUser(req, res);
  if (!user) return;

  const { conversationId, recipientId, content } = req.body ?? {};
  const trimmedContent = typeof content === "string" ? content.trim() : "";

  try {
    let conversation = null;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId).populate("participants", "name username headline avatarUrl");
      if (!conversation || !conversation.participants.some((participant) => participant._id.equals(user._id))) {
        res.status(404).json({ message: "Conversation not found" });
        return;
      }
    } else {
      if (!recipientId) {
        res.status(400).json({ message: "recipientId is required when conversationId is not provided" });
        return;
      }

      const recipient = await User.findById(recipientId);
      if (!recipient) {
        res.status(404).json({ message: "Recipient not found" });
        return;
      }

      const mutual = await isMutualFollower(user._id, recipient._id);
      if (!mutual) {
        res.status(403).json({ message: "Chat is limited to mutual followers" });
        return;
      }

      const participantIds = getConversationParticipants(user._id, recipient._id);

      conversation = await Conversation.findOne({ participants: { $size: 2, $all: participantIds } }).populate(
        "participants",
        "name username headline avatarUrl"
      );

      if (!conversation) {
        conversation = await Conversation.create({ participants: participantIds, messages: [] });
        await conversation.populate("participants", "name username headline avatarUrl");
      }
    }

    const otherParticipant = conversation.participants.find((participant) => !participant._id.equals(user._id));
    if (!otherParticipant || !(await isMutualFollower(user._id, otherParticipant._id))) {
      res.status(403).json({ message: "Chat is limited to mutual followers" });
      return;
    }

    if (trimmedContent) {
      conversation.messages.push({ sender: user._id, content: trimmedContent });
    }

    conversation.updatedAt = new Date();
    await conversation.save();
    await conversation.populate("participants", "name username headline avatarUrl");

    broadcastConversation(conversation);

    res.status(200).json({ conversation: serializeConversation(conversation, user._id) });
  } catch (error) {
    console.error("Send message error", error);
    res.status(500).json({ message: "Failed to send message" });
  }
}
