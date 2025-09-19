export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  res.status(200).json({ success: true, comment: { id: "comment_1", ...req.body } });
}
