import Card from "@/components/ui/Card";

export default function ProfileStats({ stats = {} }) {
  const entries = Object.entries(stats);
  if (!entries.length) return null;
  return (
    <Card contentClassName="grid gap-4 sm:grid-cols-3">
      {entries.map(([key, value]) => (
        <div key={key} className="text-center">
          <p className="text-xs uppercase tracking-wide text-slate-500">{key}</p>
          <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
        </div>
      ))}
    </Card>
  );
}

