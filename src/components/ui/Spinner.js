export default function Spinner({ size = "md" }) {
  const dimension = size === "lg" ? 32 : size === "sm" ? 16 : 20;
  const border = size === "lg" ? 4 : 3;
  return (
    <span
      className="inline-flex animate-spin rounded-full border-slate-200 border-t-emerald-500"
      style={{ width: dimension, height: dimension, borderWidth: border }}
    />
  );
}

