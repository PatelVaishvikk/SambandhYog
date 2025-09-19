export default function handler(req, res) {
  const { q = "" } = req.query;
  res.status(200).json({
    results: [
      {
        id: "user_1",
        name: "Neha Kapoor",
        headline: "Growth PM @ Uplift",
      },
    ].filter((item) => item.name.toLowerCase().includes(q.toLowerCase())),
  });
}
