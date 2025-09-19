export default function handler(req, res) {
  res.status(200).json({ reports: [{ id: "report_1", status: "open" }] });
}
