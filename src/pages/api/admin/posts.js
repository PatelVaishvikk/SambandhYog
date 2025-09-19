export default function handler(req, res) {
  res.status(200).json({ total: 128, pendingReview: 2 });
}
