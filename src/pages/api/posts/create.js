export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const post = { id: "post_new", ...req.body };
  res.status(201).json({ success: true, post });
}
