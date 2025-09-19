import Button from "@/components/ui/Button";

export default function EmptyState({ title = "Nothing to see yet", description = "Check back later or create something new.", actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-10 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="max-w-md text-sm text-slate-400">{description}</p>
      {actionLabel ? (
        <Button onClick={onAction}>{actionLabel}</Button>
      ) : null}
    </div>
  );
}
