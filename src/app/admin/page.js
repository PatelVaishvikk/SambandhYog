import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";

export default function AdminHomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-16">
        <h1 className="text-3xl font-semibold text-white">Admin overview</h1>
        <Card className="space-y-3">
          <p className="text-sm text-slate-300">Monitor community health, review reports, and manage members.</p>
        </Card>
      </main>
    </div>
  );
}
