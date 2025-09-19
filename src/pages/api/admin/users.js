export default function handler(req, res) {
  res.status(200).json({ users: [{ id: "user_1", name: "Neha Kapoor" }] });
}
