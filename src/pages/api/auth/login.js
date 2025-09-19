import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyPassword } from "@/utils/encryption";
import { signToken } from "@/lib/jwt";
import { createSessionCookie } from "@/lib/cookies";
import { sanitizeUser } from "@/lib/serializers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  await connectToDatabase();

  try {
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const passwordMatches = await verifyPassword(password, user.password);
    if (!passwordMatches) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = signToken({ sub: user._id.toString() });
    res.setHeader("Set-Cookie", createSessionCookie(token));

    res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({ message: "Could not log in" });
  }
}
