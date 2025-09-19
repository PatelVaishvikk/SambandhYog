import Navigation from "@/components/layout/Navigation";
import Card from "@/components/ui/Card";
import SearchBar from "@/components/common/SearchBar";
import CategoryTags from "@/components/common/CategoryTags";
import { POST_CATEGORIES } from "@/lib/constants";

export default function ExplorePage() {
  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">Discover inspiring professionals and stories</h1>
        <p className="text-sm text-slate-500">Join mentorship circles, learn from contributors, and explore curated themes.</p>
        <Navigation current="/explore" />
      </div>
      <SearchBar placeholder="Search people, themes, and achievements" />
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Popular categories</h2>
        <CategoryTags items={POST_CATEGORIES} />
      </Card>
    </div>
  );
}

