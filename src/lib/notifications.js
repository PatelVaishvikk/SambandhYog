import Notification from "@/models/Notification";
import { getSocketServer } from "@/lib/socketServer";

export function serializeNotification(notification) {
  if (!notification) return null;
  const plain = typeof notification.toObject === "function" ? notification.toObject() : { ...notification };
  plain.id = plain._id?.toString?.() ?? plain.id;
  plain.userId = plain.userId?.toString?.() ?? plain.userId;
  delete plain._id;
  delete plain.__v;
  return plain;
}

export async function createNotification({ userId, type, message, data = {} }) {
  if (!userId || !type || !message) {
    throw new Error("userId, type, and message are required to create a notification");
  }

  const notification = await Notification.create({ userId, type, message, data });
  const serialized = serializeNotification(notification);

  const io = getSocketServer();
  if (io && serialized?.userId) {
    io.to(serialized.userId).emit("notification:new", { notification: serialized });
  }

  return serialized;
}

export async function markNotificationsRead({ userId, ids, read = true }) {
  if (!userId) return { modifiedCount: 0 };
  const query = { userId };
  if (Array.isArray(ids) && ids.length) {
    query._id = { $in: ids };
  }

  const result = await Notification.updateMany(query, { $set: { read } });
  return result;
}

export async function deleteNotifications({ userId, ids }) {
  if (!userId) return { deletedCount: 0 };
  const query = { userId };
  if (Array.isArray(ids) && ids.length) {
    query._id = { $in: ids };
  }

  const result = await Notification.deleteMany(query);
  return result;
}
