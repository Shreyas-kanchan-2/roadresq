import { Navigation, Star, ShieldCheck } from "lucide-react";
import { mechanics, type Mechanic } from "@/lib/roadresq/data";

export function MapPanel({
  list = mechanics,
  activeId,
  onSelect,
  label = "Live network · San Francisco metro",
}: {
  list?: Mechanic[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  label?: string;
}) {
  return (
    <div className="panel relative overflow-hidden">
      <div className="absolute inset-0 grid-fade opacity-70" aria-hidden />
      <div
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: "var(--gradient-hero)" }}
        aria-hidden
      />

      {/* stylised roads */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <g stroke="currentColor" className="text-border-strong" strokeWidth="0.5" fill="none">
          <path d="M-5 70 C 20 62, 30 40, 55 34 S 90 26, 108 12" />
          <path d="M-5 30 C 25 34, 40 52, 62 58 S 88 70, 108 88" />
          <path d="M22 -5 L 30 105" />
          <path d="M72 -5 L 66 105" />
        </g>
      </svg>

      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
        {/* driver location */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute inset-0 -m-3 rounded-full bg-primary/25 pin-ping" aria-hidden />
          <span className="relative grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
            <Navigation className="h-3.5 w-3.5" strokeWidth={2.6} />
          </span>
          <span className="absolute left-1/2 top-9 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-surface/90 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
            You
          </span>
        </div>

        {list.map((m) => {
          const active = activeId === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect?.(m.id)}
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1.5 text-[0.68rem] font-medium transition-all duration-300 ${
                active
                  ? "border-primary bg-primary text-primary-foreground glow-ring"
                  : m.available
                    ? "border-border-strong bg-surface-2/90 text-foreground hover:border-primary/60"
                    : "border-border bg-surface/80 text-muted-foreground"
              }`}
              aria-label={`${m.garage}, ${m.distanceKm} km away`}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    m.available ? "bg-success" : "bg-muted-foreground"
                  }`}
                />
                {m.distanceKm} km
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          {label}
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          {list.filter((m) => m.available).length} available now
        </span>
      </div>
    </div>
  );
}

export function MechanicMiniCard({ m }: { m: Mechanic }) {
  return (
    <div className="panel flex items-center gap-3 p-3.5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 font-display text-sm text-foreground">
        {m.name
          .split(" ")
          .map((p) => p[0])
          .join("")}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{m.garage}</p>
        <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {m.rating}
          </span>
          <span>·</span>
          <span>{m.distanceKm} km</span>
          <span>·</span>
          <span className="text-primary">{m.etaMin} min</span>
        </p>
      </div>
    </div>
  );
}
