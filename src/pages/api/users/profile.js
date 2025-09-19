export default function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  res.status(200).json({
    profile: {
      id: "user_1",
      name: "Neha Kapoor",
      headline: "Growth PM @ Uplift",
    },
  });
}
