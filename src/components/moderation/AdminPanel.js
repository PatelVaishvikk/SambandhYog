import Card from "@/components/ui/Card";

export default function AdminPanel({ stats = {} }) {
  return (
    <Card className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-white">Moderation overview</h2>
        <p className="text-sm text-slate-400">Track reports, queue health, and response velocity.</p>
      </header>
      <dl className="grid gap-4 sm:grid-cols-2">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <dt className="text-xs uppercase tracking-wide text-slate-500">{key}</dt>
            <dd className="mt-2 text-2xl font-semibold text-white">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
