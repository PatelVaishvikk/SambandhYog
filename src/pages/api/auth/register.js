import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/utils/encryption";
import { signToken } from "@/lib/jwt";
import { createSessionCookie } from "@/lib/cookies";
import { sanitizeUser } from "@/lib/serializers";

function generateUsername(name) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 18);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || "member"}_${suffix}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, email, and password are required" });
    return;
  }

  await connectToDatabase();

  try {
    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }] }).lean();
    if (existing) {
      res.status(409).json({ message: "An account with this email already exists" });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const username = generateUsername(name);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
      headline: "New member",
    });

    const token = signToken({ sub: user._id.toString() });
    res.setHeader("Set-Cookie", createSessionCookie(token));

    res.status(201).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    console.error("Register error", error);
    res.status(500).json({ message: "Could not create account" });
  }
}
