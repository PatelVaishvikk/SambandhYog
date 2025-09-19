import clsx from "clsx";

const baseStyles = "inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "bg-emerald-500 text-white shadow hover:bg-emerald-600",
  secondary: "border border-slate-300 bg-white text-slate-700 hover:border-emerald-200 hover:text-emerald-600",
  ghost: "text-slate-500 hover:text-emerald-600 hover:bg-slate-100",
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
      ? "px-6 py-3 text-base"
      : size === "sm"
      ? "px-4 py-2 text-sm"
      : "px-5 py-2.5 text-sm";

  return (
    <Component className={clsx(baseStyles, variants[variant], sizeStyles, className)} {...props}>
      {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
      {children}
    </Component>
  );
}

