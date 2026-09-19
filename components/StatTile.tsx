interface StatTileProps {
  value: string;
  unit?: string;
  label: string;
}

export function StatTile({ value, unit, label }: StatTileProps) {
  return (
    <div className="rounded-2xl border border-line bg-bg-1 px-4 py-3">
      <div className="font-display text-2xl font-semibold text-ink">
        {value}
        {unit && <span className="ml-1 text-sm font-medium text-ink-muted">{unit}</span>}
      </div>
      <div className="mt-0.5 text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</div>
    </div>
  );
}
