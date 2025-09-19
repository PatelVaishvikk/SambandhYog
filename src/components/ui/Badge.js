import clsx from "clsx";

const baseClass = "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold";

const variants = {
  default: "bg-slate-100 text-slate-600",
  success: "bg-emerald-100 text-emerald-600",
  warning: "bg-amber-100 text-amber-500",
};

export default function Badge({ children, className, variant = "default" }) {
  return <span className={clsx(baseClass, variants[variant] ?? variants.default, className)}>{children}</span>;
}

