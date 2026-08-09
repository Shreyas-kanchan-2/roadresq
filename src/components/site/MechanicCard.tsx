import { BadgeCheck, Clock, MapPin, Star, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Mechanic } from "@/lib/roadresq/data";

export function MechanicCard({
  m,
  onRequest,
  pending,
  selected,
}: {
  m: Mechanic;
  onRequest?: (m: Mechanic) => void;
  pending?: boolean;
  selected?: boolean;
}) {
  return (
    <article
      className={`panel rise flex flex-col gap-4 p-5 transition-colors duration-300 ${
        selected ? "border-primary/60" : "hover:border-border-strong"
      }`}
    >
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2 font-display text-sm">
            {m.name
              .split(" ")
              .map((p) => p[0])
              .join("")}
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold text-foreground">
              {m.garage}
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
              {m.name}
              {m.verified && (
                <>
                  <span>·</span>
                  <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                  Verified
                </>
              )}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.12em] ${
            m.available
              ? "border-success/40 bg-success/10 text-success"
              : "border-border bg-secondary text-muted-foreground"
          }`}
        >
          {m.available ? "Available" : "On a job"}
        </span>
      </header>

      <dl className="grid grid-cols-3 gap-2 text-center">
        <Stat icon={MapPin} value={`${m.distanceKm} km`} label="Distance" />
        <Stat icon={Clock} value={`${m.etaMin} min`} label="ETA" highlight />
        <Stat icon={Star} value={m.rating.toFixed(1)} label={`${m.jobs} jobs`} />
      </dl>

      <ul className="flex flex-wrap gap-1.5">
        {m.services.map((s) => (
          <li
            key={s}
            className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-xs text-muted-foreground"
          >
            {s}
          </li>
        ))}
      </ul>

      <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border pt-4">
        <p className="min-w-0 text-xs text-muted-foreground">
          Call-out from{" "}
          <span className="font-medium text-foreground">${m.priceFrom}</span> · estimate confirmed
          on site
        </p>
        <Button
          size="sm"
          disabled={!m.available || pending}
          onClick={() => onRequest?.(m)}
          className="shrink-0"
        >
          {pending ? "Requesting…" : "Request help"}
        </Button>
      </div>
    </article>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  highlight,
}: {
  icon: typeof Wrench;
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 px-2 py-2.5">
      <Icon
        className={`mx-auto h-3.5 w-3.5 ${highlight ? "text-primary" : "text-muted-foreground"}`}
      />
      <p
        className={`mt-1.5 font-display text-sm font-semibold ${
          highlight ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 truncate text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
