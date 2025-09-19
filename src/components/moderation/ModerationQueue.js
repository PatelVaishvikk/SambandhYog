import Card from "@/components/ui/Card";

export default function ModerationQueue({ items = [] }) {
  if (!items.length) {
    return (
      <Card>
        <p className="text-sm text-slate-300">Your moderation queue is clear. ?</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Queue</h3>
      <ul className="space-y-3 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="font-semibold text-white">{item.title}</p>
            <p className="text-xs text-slate-500">Reported for: {item.reason}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
