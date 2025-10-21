import Card from "@/components/ui/Card";

export default function PostFormSkeleton() {
  return (
    <Card contentClassName="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded-full bg-white/10 animate-pulse" />
          <div className="h-5 w-48 rounded-full bg-white/10 animate-pulse" />
        </div>
        <div className="h-8 w-20 rounded-full bg-white/10 animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded-full bg-white/10 animate-pulse" />
          <div className="h-11 rounded-3xl bg-white/10 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-28 rounded-full bg-white/10 animate-pulse" />
          <div className="h-32 rounded-3xl bg-white/10 animate-pulse" />
        </div>
      </div>
      <div className="flex justify-end">
        <div className="h-10 w-32 rounded-full bg-white/10 animate-pulse" />
      </div>
    </Card>
  );
}

