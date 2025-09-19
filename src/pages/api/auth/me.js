import { getSessionUser } from "@/lib/session";
import { sanitizeUser } from "@/lib/serializers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const user = await getSessionUser(req);
  if (!user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  res.status(200).json({ user: sanitizeUser(user) });
}
