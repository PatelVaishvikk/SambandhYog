import Card from "@/components/ui/Card";

export default function ChatWidgetSkeleton({ compact = false }) {
  return (
    <Card
      padding={compact ? "p-4" : "p-6"}
      contentClassName={`space-y-4 ${compact ? "" : "min-h-[320px]"}`}
      className="opacity-80"
    >
      <div className="space-y-3">
        <div className="h-4 w-32 rounded-full bg-white/10 animate-pulse" />
        <div className="h-6 w-48 rounded-full bg-white/10 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded-3xl bg-white/10 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 rounded-full bg-white/10 animate-pulse" />
            <div className="h-3 w-32 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded-3xl bg-white/10 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-28 rounded-full bg-white/10 animate-pulse" />
            <div className="h-3 w-20 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="h-9 rounded-full bg-white/10 animate-pulse" />
    </Card>
  );
}

