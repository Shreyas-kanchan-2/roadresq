import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  Receipt,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MapPanel } from "@/components/site/MapPanel";
import { mechanics, safetyTips, issueCategories, vehicleTypes } from "@/lib/roadresq/data";
import {
  clearRequest,
  loadRequest,
  nextStatus,
  saveRequest,
  statusMeta,
  statusSteps,
  type StoredRequest,
} from "@/lib/roadresq/store";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Your Mechanic — Live ETA and Job Status | ROADRESQ" },
      {
        name: "description",
        content:
          "Follow your roadside job from request received to completed, with live ETA, mechanic profile, upfront estimate and roadside safety guidance.",
      },
      { property: "og:title", content: "Track Your Mechanic | ROADRESQ" },
      {
        property: "og:description",
        content: "Live job status, ETA and direct contact with your assigned ROADRESQ mechanic.",
      },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const [req, setReq] = useState<StoredRequest | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReq(loadRequest());
    setReady(true);
    const sync = () => setReq(loadRequest());
    window.addEventListener("roadresq:change", sync);
    return () => window.removeEventListener("roadresq:change", sync);
  }, []);

  // Simulated dispatch progression for the demo.
  useEffect(() => {
    if (!req || req.status === "completed") return;
    const t = window.setTimeout(() => {
      const updated = { ...req, status: nextStatus(req.status) };
      saveRequest(updated);
      toast.success(statusMeta[updated.status].label, {
        description: statusMeta[updated.status].note,
      });
    }, 9000);
    return () => window.clearTimeout(t);
  }, [req]);

  const mechanic = mechanics.find((m) => m.id === req?.mechanicId) ?? mechanics[0]!;

  if (!ready) {
    return (
      <div className="min-h-screen">
        <SiteNav />
        <div className="mx-auto max-w-6xl px-5 py-24 lg:px-8">
          <div className="panel h-72 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!req) {
    return (
      <div className="min-h-screen">
        <SiteNav />
        <div className="mx-auto max-w-3xl px-5 py-24 text-center lg:px-8">
          <h1 className="font-display text-3xl font-bold text-foreground">No active request</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Once you request a mechanic, this page tracks the job stage by stage — assignment, ETA,
            arrival and completion.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/request">
              Start a request <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const currentIndex = statusSteps.indexOf(req.status);
  const issue = issueCategories.find((c) => c.id === req.issueId);
  const vehicle = vehicleTypes.find((v) => v.id === req.vehicleType);
  const etaRemaining = Math.max(0, req.etaMin - currentIndex * 5);

  return (
    <div className="min-h-screen">
      <SiteNav />

      <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Job {req.id}
            </span>
            <h1 className="mt-3 truncate font-display text-3xl font-bold text-foreground sm:text-4xl">
              {statusMeta[req.status].label}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              {statusMeta[req.status].note}
            </p>
          </div>
          <div className="shrink-0 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-center">
            <p className="font-display text-2xl font-bold text-primary">
              {req.status === "completed" ? "Done" : `${etaRemaining}′`}
            </p>
            <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
              {req.status === "completed" ? "Job closed" : "ETA"}
            </p>
          </div>
        </header>

        <div className="mt-9 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            {/* Timeline */}
            <section className="panel p-5 sm:p-7">
              <ol className="space-y-1">
                {statusSteps.map((s, i) => {
                  const done = i < currentIndex;
                  const active = i === currentIndex;
                  return (
                    <li key={s} className="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
                      <div className="flex flex-col items-center">
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors ${
                            done
                              ? "border-success/50 bg-success/15 text-success"
                              : active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background/40 text-muted-foreground"
                          }`}
                        >
                          {done ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span className="text-xs font-semibold">{i + 1}</span>
                          )}
                        </span>
                        {i < statusSteps.length - 1 && (
                          <span
                            className={`mt-1 w-px flex-1 ${done ? "bg-success/40" : "bg-border"}`}
                            aria-hidden
                          />
                        )}
                      </div>
                      <div className={`min-w-0 pb-6 ${active ? "" : "opacity-70"}`}>
                        <p className="font-display text-base font-semibold text-foreground">
                          {statusMeta[s].label}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {statusMeta[s].note}
                        </p>
                        {active && req.status !== "completed" && (
                          <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary pin-ping" />
                            In progress
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                {req.status !== "completed" ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const updated = { ...req, status: nextStatus(req.status) };
                      saveRequest(updated);
                      toast.success(statusMeta[updated.status].label);
                    }}
                  >
                    Advance demo status
                  </Button>
                ) : (
                  <Button asChild size="sm" variant="secondary">
                    <Link to="/request">Start a new request</Link>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    clearRequest();
                    toast.success("Demo request cleared");
                  }}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear request
                </Button>
              </div>
            </section>

            {/* Safety */}
            <section className="panel p-5 sm:p-7">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                <ShieldAlert className="h-4.5 w-4.5 text-warning" /> While you wait
              </h2>
              <ul className="mt-4 space-y-2.5">
                {safetyTips.map((t) => (
                  <li key={t} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* Mechanic profile */}
            <section className="panel p-5 sm:p-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface-2 font-display text-sm">
                  {mechanic.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-base font-semibold text-foreground">
                    {mechanic.name}
                  </h2>
                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                    {mechanic.garage}
                    <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                  </p>
                </div>
              </div>

              <dl className="mt-5 space-y-2 text-sm">
                <Row icon={Clock} k="ETA" v={`${etaRemaining} min`} />
                <Row icon={MapPin} k="Distance" v={`${mechanic.distanceKm} km away`} />
                <Row
                  icon={Receipt}
                  k="Estimate"
                  v={`$${req.estimateLow}–$${req.estimateHigh}`}
                />
              </dl>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  onClick={() => toast.success(`Calling ${mechanic.name} (demo)`)}
                >
                  <Phone className="mr-1.5 h-4 w-4" /> Call
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.success("Message sent to your mechanic (demo)")}
                >
                  <MessageSquare className="mr-1.5 h-4 w-4" /> Message
                </Button>
              </div>
            </section>

            <MapPanel
              list={[mechanic]}
              activeId={mechanic.id}
              label={`${mechanic.garage} · en route`}
            />

            <section className="panel space-y-2 p-5 text-sm">
              <p className="font-display font-semibold text-foreground">Request details</p>
              <Detail k="Vehicle" v={vehicle?.label ?? req.vehicleType} />
              <Detail k="Issue" v={issue?.label ?? req.issueId} />
              <Detail k="Service" v={issue?.service ?? "On-site inspection"} />
              <Detail k="Location" v={req.location} />
              <Detail k="Callback" v={req.phone} />
              {req.photoName && <Detail k="Photo" v={req.photoName} />}
              <p className="border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                “{req.symptoms}”
              </p>
            </section>
          </aside>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function Row({ icon: Icon, k, v }: { icon: typeof Clock; k: string; v: string }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 border-t border-border pt-2">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <dt className="text-xs text-muted-foreground">{k}</dt>
      <dd className="truncate text-sm text-foreground">{v}</dd>
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-t border-border pt-2 text-xs">
      <span className="text-muted-foreground">{k}</span>
      <span className="truncate text-right text-foreground">{v}</span>
    </div>
  );
}
