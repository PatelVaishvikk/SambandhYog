import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";

const REPORTS = [
  { id: "rep_1", postTitle: "Weekly wins", reason: "Possible duplicate", status: "In review" },
  { id: "rep_2", postTitle: "AMA recap", reason: "Tone check", status: "Resolved" },
];

export default function AdminReportsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-16">
        <h1 className="text-3xl font-semibold text-white">Reports</h1>
        <div className="space-y-3">
          {REPORTS.map((report) => (
            <Card key={report.id} className="space-y-2 p-5">
              <p className="text-sm font-semibold text-white">{report.postTitle}</p>
              <p className="text-xs text-slate-400">Reason: {report.reason}</p>
              <p className="text-xs text-emerald-300">Status: {report.status}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
