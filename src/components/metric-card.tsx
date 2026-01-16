type MetricCardProps = {
  label: string;
  value: string;
  delta?: string;
  accent?: "gold" | "teal";
  size?: "default" | "compact";
};

export default function MetricCard({
  label,
  value,
  delta,
  accent = "gold",
  size = "default",
}: MetricCardProps) {
  const accentClass =
    accent === "teal"
      ? "from-emerald-300 via-teal-300 to-emerald-500"
      : "from-amber-300 via-amber-400 to-orange-500";
  const paddingClass = size === "compact" ? "px-4 py-3" : "px-5 py-4";
  const valueClass = size === "compact" ? "text-xl" : "text-2xl";

  return (
    <div
      className={`soft-card ${paddingClass} ${accent === "teal" ? "border-emerald-300/30" : "gold-border"} gold-glow`}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">
        {label}
      </p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={`${valueClass} font-semibold text-white`}>{value}</span>
        {delta ? (
          <span
            className={`text-xs font-semibold uppercase tracking-[0.2em] text-transparent bg-gradient-to-r ${accentClass} bg-clip-text`}
          >
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
}
