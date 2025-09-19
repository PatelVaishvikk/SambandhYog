export function requireAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    return handler(req, res);
  };
}
