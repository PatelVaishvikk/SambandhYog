import Card from "@/components/ui/Card";

export default function StoryReelSkeleton() {
  return (
    <Card contentClassName="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded-full bg-white/10 animate-pulse" />
        <div className="h-8 w-24 rounded-full bg-white/10 animate-pulse" />
      </div>
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 w-24 rounded-3xl bg-white/10 animate-pulse" />
        ))}
      </div>
    </Card>
  );
}
