import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { sanitizeUser } from "@/lib/serializers";

export default async function handler(req, res) {
  const {
    query: { username },
    method,
  } = req;

  if (method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  await connectToDatabase();

  try {
    const profile = await User.findOne({ username: username.toLowerCase() });
    if (!profile) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ profile: sanitizeUser(profile) });
  } catch (error) {
    console.error("Fetch profile", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
}
