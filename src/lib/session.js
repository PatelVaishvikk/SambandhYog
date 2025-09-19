import { SESSION_COOKIE_NAME } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

function extractSessionToken(req) {
  const header = req.headers.cookie;
  if (!header) return null;
  const cookies = header.split(";").map((cookie) => cookie.trim());
  const session = cookies.find((cookie) => cookie.startsWith(`${SESSION_COOKIE_NAME}=`));
  return session ? session.split("=")[1] : null;
}

export async function getSessionUser(req) {
  const token = extractSessionToken(req);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload?.sub) return null;

  await connectToDatabase();
  const user = await User.findById(payload.sub);
  return user;
}

export async function requireSessionUser(req, res) {
  const user = await getSessionUser(req);
  if (!user) {
    res.status(401).json({ message: "Not authenticated" });
    return null;
  }
  return user;
}
