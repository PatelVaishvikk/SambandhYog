import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CategoryTags from "@/components/common/CategoryTags";
import { POST_CATEGORIES } from "@/lib/constants";

const curatedHighlights = [
  {
    title: "Mentorship circles",
    description: "Join weekly cohorts pairing mentors with learners focused on purposeful growth.",
  },
  {
    title: "Career break support",
    description: "Stories and resources from members navigating transitions with confidence.",
  },
  {
    title: "Founder journeys",
    description: "Transparent reflections from builders raising heart-led companies.",
  },
];

export default function ExplorePage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="rounded-[32px] border border-white/10 bg-white/10 p-8 text-white shadow-surface">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-200">Explore</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">Discover the people and stories shaping positive careers</h1>
            <p className="text-sm text-slate-200">
              Find mentors, collaborators, and communities that match your goals. Follow members, request guidance, and
              celebrate progress together.
            </p>
          </div>
          <div className="flex gap-3">
            <Button as={Link} href="/explore/users" size="sm">
              Browse members
            </Button>
            <Button as={Link} href="/explore/categories/leadership" size="sm" variant="secondary">
              Featured topics
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {curatedHighlights.map((item) => (
          <Card key={item.title} contentClassName="space-y-2">
            <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            <p className="text-sm text-slate-300">{item.description}</p>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Popular categories</h2>
            <p className="text-sm text-slate-400">Jump into active circles curated by the community.</p>
          </div>
          <Button as={Link} href="/explore/categories/leadership" size="sm" variant="ghost">
            View all
          </Button>
        </header>
        <Card contentClassName="space-y-4">
          <CategoryTags items={POST_CATEGORIES} />
        </Card>
      </section>
    </div>
  );
}
