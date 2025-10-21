import clsx from "clsx";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary:
    "bg-gradient-to-r from-brand-500 via-brand-400 to-accent-400 text-white shadow-[0_14px_30px_-18px_rgba(99,102,241,0.85)] hover:from-brand-400 hover:via-brand-300 hover:to-accent-300",
  secondary:
    "border border-white/20 bg-night-600/90 text-slate-100 hover:border-brand-300/60 hover:text-white hover:bg-night-600",
  ghost: "text-slate-200 hover:text-white hover:bg-white/10",
};

export default function Button({
  as: Component = "button",
  className,
  variant = "primary",
  size = "md",
  icon: Icon,
  children,
  ...props
}) {
  const sizeStyles =
    size === "lg"
      ? "px-7 py-3.5 text-base"
      : size === "sm"
      ? "px-4 py-2 text-sm"
      : "px-6 py-2.5 text-sm";

  const hydrationProps = Component === "button" ? { suppressHydrationWarning: true } : {};

  return (
    <Component className={clsx(baseStyles, variants[variant], sizeStyles, className)} {...hydrationProps} {...props}>
      {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
      {children}
    </Component>
  );
}

