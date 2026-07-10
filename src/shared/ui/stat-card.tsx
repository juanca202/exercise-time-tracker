export function StatCard({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "flex min-w-[160px] flex-col gap-2 border border-border border-l-4 border-l-accent bg-surface px-6 py-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
          : "flex min-w-[160px] flex-col gap-2 border border-border bg-surface px-6 py-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
      }
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-xs font-medium tracking-[0.05em] text-ink-muted uppercase">
          {label}
        </span>
      </div>
      <span className="text-2xl font-semibold text-ink">{value}</span>
    </div>
  );
}
