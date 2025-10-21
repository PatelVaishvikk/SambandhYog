import Card from "@/components/ui/Card";

function Placeholder() {
  return (
    <Card contentClassName="space-y-4">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-3xl bg-white/10 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded-full bg-white/10 animate-pulse" />
          <div className="h-3 w-24 rounded-full bg-white/10 animate-pulse" />
        </div>
        <div className="h-6 w-16 rounded-full bg-white/10 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-48 rounded-full bg-white/10 animate-pulse" />
        <div className="h-3 w-full rounded-full bg-white/10 animate-pulse" />
        <div className="h-3 w-3/4 rounded-full bg-white/10 animate-pulse" />
      </div>
      <div className="flex gap-3">
        <div className="h-8 w-20 rounded-full bg-white/10 animate-pulse" />
        <div className="h-8 w-24 rounded-full bg-white/10 animate-pulse" />
      </div>
    </Card>
  );
}

export default function PostListSkeleton({ count = 2 }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, index) => (
        <Placeholder key={index} />
      ))}
    </div>
  );
}

