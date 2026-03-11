"use client";

interface InsightCardProps {
  type: "belief_challenged" | "recurring_topic" | "position_shift";
  label: string;
  count: number;
}

const typeLabels = {
  belief_challenged: "Belief Challenged",
  recurring_topic: "Recurring Topic",
  position_shift: "Position Shift",
};

const typeColors = {
  belief_challenged: "bg-red-50 border-red-200 text-red-800",
  recurring_topic: "bg-amber-50 border-amber-200 text-amber-800",
  position_shift: "bg-emerald-50 border-emerald-200 text-emerald-800",
};

export function InsightCard({ type, label, count }: InsightCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-warm-border p-5 shadow-sm shadow-warm-border/50">
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${typeColors[type]}`}
        >
          {typeLabels[type]}
        </span>
        <span className="text-sm text-muted-foreground">
          {count}x
        </span>
      </div>
      <p className="text-[15px] leading-relaxed text-foreground">{label}</p>
    </div>
  );
}
