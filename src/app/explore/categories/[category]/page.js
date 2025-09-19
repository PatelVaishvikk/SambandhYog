import Card from "@/components/ui/Card";
import { POST_CATEGORIES } from "@/lib/constants";

export default function CategoryPage({ params }) {
  const { category } = params;
  const formatted = category.replace(/-/g, " ");
  const available = POST_CATEGORIES.map((item) => item.toLowerCase());

  if (!available.includes(formatted.toLowerCase())) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-6 py-20">
        <Card>
          <p className="text-sm text-slate-300">This category is coming soon. Explore other themes in the meantime.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold text-white">{formatted} stories</h1>
      <Card className="space-y-3">
        <p className="text-sm text-slate-300">We are curating the best conversations for this space. Stay tuned!</p>
      </Card>
    </div>
  );
}
