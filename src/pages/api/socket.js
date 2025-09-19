import { Server } from "socket.io";
import cookie from "cookie";
import { SESSION_COOKIE_NAME } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import { setSocketServer } from "@/lib/socketServer";
import User from "@/models/User";

const path = "/api/socket";

async function attachSocketServer(res) {
  const io = new Server(res.socket.server, {
    path,
    addTrailingSlash: false,
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) {
        return next(new Error("UNAUTHORIZED"));
      }
      const parsedCookies = cookie.parse(cookieHeader);
      const token = parsedCookies[SESSION_COOKIE_NAME];
      if (!token) {
        return next(new Error("UNAUTHORIZED"));
      }

      const payload = verifyToken(token);
      if (!payload?.sub) {
        return next(new Error("UNAUTHORIZED"));
      }

      await connectToDatabase();
      const user = await User.findById(payload.sub).select("name username avatarUrl");
      if (!user) {
        return next(new Error("UNAUTHORIZED"));
      }

      socket.data.user = {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl ?? "/default-avatar.png",
      };

      return next();
    } catch (error) {
      console.error("Socket auth error", error);
      return next(new Error("UNAUTHORIZED"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;
    if (user) {
      socket.join(user.id);
      socket.emit("session", { user });
    }

    socket.on("disconnect", () => {
      // Placeholder for presence tracking/logging
    });
  });

  setSocketServer(io);

  res.socket.server.io = io;
}

export default async function handler(req, res) {
  if (!res.socket.server) {
    res.status(500).end();
    return;
  }

  if (!res.socket.server.io) {
    await attachSocketServer(res);
  } else {
    setSocketServer(res.socket.server.io);
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
