import Header from "@/components/layout/Header";
import AdminPanel from "@/components/moderation/AdminPanel";
import ContentFilter from "@/components/moderation/ContentFilter";
import ModerationQueue from "@/components/moderation/ModerationQueue";

const STATS = {
  "Open reports": 2,
  "Average response (hrs)": 1.5,
  "Positive sentiment": "94%",
  Escalations: 0,
};

const QUEUE_ITEMS = [
  { id: "queue_1", title: "Post flagged for spam", reason: "Spam" },
  { id: "queue_2", title: "Comment flagged for tone", reason: "Tone" },
];

export default function ModerationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-16">
        <h1 className="text-3xl font-semibold text-white">Moderation control center</h1>
        <AdminPanel stats={STATS} />
        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <ModerationQueue items={QUEUE_ITEMS} />
          <ContentFilter />
        </div>
      </main>
    </div>
  );
}
