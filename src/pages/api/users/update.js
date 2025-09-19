import { connectToDatabase } from "@/lib/mongodb";
import { sanitizeUser } from "@/lib/serializers";
import { requireSessionUser } from "@/lib/session";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  await connectToDatabase();

  const user = await requireSessionUser(req, res);
  if (!user) return;

  try {
    const allowedFields = (({ name, headline, bio, location, avatarUrl, links }) => ({
      ...(name !== undefined ? { name } : {}),
      ...(headline !== undefined ? { headline } : {}),
      ...(bio !== undefined ? { bio } : {}),
      ...(location !== undefined ? { location } : {}),
      ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      ...(links !== undefined ? { links } : {}),
    }))(req.body ?? {});

    if (!Object.keys(allowedFields).length) {
      res.status(400).json({ message: "No updates provided" });
      return;
    }

    if (allowedFields.name) {
      allowedFields.name = allowedFields.name.trim();
    }

    Object.assign(user, allowedFields);
    await user.save();

    res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    console.error("Update profile error", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
}
