import Card from "@/components/ui/Card";

export default function MomentumLabSkeleton() {
  return (
    <Card contentClassName="space-y-5">
      <div className="space-y-2">
        <div className="h-3 w-32 rounded-full bg-white/10 animate-pulse" />
        <div className="h-5 w-60 rounded-full bg-white/10 animate-pulse" />
        <div className="h-3 w-44 rounded-full bg-white/10 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-28 rounded-full bg-white/10 animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-8 w-20 rounded-full bg-white/10 animate-pulse" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 w-28 rounded-full bg-white/10 animate-pulse" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-16 rounded-2xl bg-white/10 animate-pulse" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 w-28 rounded-full bg-white/10 animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-3 w-44 rounded-full bg-white/10 animate-pulse" />
              <div className="h-2 w-full rounded-full bg-white/10 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

