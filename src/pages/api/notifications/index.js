import { connectToDatabase } from "@/lib/mongodb";
import { requireSessionUser } from "@/lib/session";
import Notification from "@/models/Notification";
import { serializeNotification, markNotificationsRead, deleteNotifications } from "@/lib/notifications";

export default async function handler(req, res) {
  await connectToDatabase();
  const user = await requireSessionUser(req, res);
  if (!user) return;

  const userId = user._id;

  try {
    if (req.method === "GET") {
      const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean({ virtuals: false });

      res.status(200).json({ notifications: notifications.map((item) => serializeNotification(item)) });
      return;
    }

    if (req.method === "PATCH") {
      const { ids, read = true, action } = req.body ?? {};

      if (action === "mark-all-read") {
        await markNotificationsRead({ userId });
      } else {
        await markNotificationsRead({ userId, ids, read: Boolean(read) });
      }

      res.status(200).json({ success: true });
      return;
    }

    if (req.method === "DELETE") {
      const { ids } = req.body ?? {};
      await deleteNotifications({ userId, ids });
      res.status(200).json({ success: true });
      return;
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Notifications API error", error);
    res.status(500).json({ message: "Failed to process notifications" });
  }
}
