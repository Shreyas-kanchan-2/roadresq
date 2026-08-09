import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Crosshair,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MechanicCard } from "@/components/site/MechanicCard";
import { MapPanel } from "@/components/site/MapPanel";
import {
  issueCategories,
  matchMechanics,
  vehicleTypes,
  type Mechanic,
} from "@/lib/roadresq/data";
import {
  newRequestId,
  requestSchema,
  saveRequest,
  type RequestInput,
} from "@/lib/roadresq/store";

type Search = { vehicle?: string; issue?: string; location?: string };

export const Route = createFileRoute("/request")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    vehicle: typeof search.vehicle === "string" ? search.vehicle : undefined,
    issue: typeof search.issue === "string" ? search.issue : undefined,
    location: typeof search.location === "string" ? search.location : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Request Roadside Help — Nearby Verified Mechanics | ROADRESQ" },
      {
        name: "description",
        content:
          "Describe the breakdown, share your location and see nearby verified mechanics with distance, rating, ETA and services. Dispatch in under a minute.",
      },
      { property: "og:title", content: "Request Roadside Help | ROADRESQ" },
      {
        property: "og:description",
        content:
          "Tell ROADRESQ what happened and get matched with nearby verified mechanics in minutes.",
      },
    ],
  }),
  component: RequestPage,
});

type Stage = "form" | "matching" | "results";

function RequestPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage>("form");
  const [form, setForm] = useState<RequestInput>({
    vehicleType: search.vehicle ?? "",
    issueId: search.issue ?? "",
    symptoms: "",
    location: search.location ?? "",
    phone: "",
    photoName: undefined,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RequestInput, string>>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [activePin, setActivePin] = useState<string | null>(null);

  const matches = useMemo(
    () => matchMechanics(form.issueId, form.vehicleType),
    [form.issueId, form.vehicleType],
  );

  const set = <K extends keyof RequestInput>(key: K, value: RequestInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = () => {
    const parsed = requestSchema.safeParse(form);
    if (!parsed.success) {
      const next: Partial<Record<keyof RequestInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof RequestInput;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Check the highlighted fields", {
        description: "We need these details to dispatch the right mechanic.",
      });
      return;
    }
    setStage("matching");
    window.setTimeout(() => {
      setStage("results");
      setActivePin(matches[0]?.id ?? null);
      toast.success(`${matches.filter((m) => m.available).length} mechanics available nearby`);
    }, 2200);
  };

  const confirm = (m: Mechanic) => {
    setPendingId(m.id);
    window.setTimeout(() => {
      const base = m.priceFrom;
      saveRequest({
        ...form,
        id: newRequestId(),
        mechanicId: m.id,
        status: "received",
        createdAt: Date.now(),
        estimateLow: base,
        estimateHigh: Math.round(base * 2.4),
        etaMin: m.etaMin,
      });
      toast.success(`${m.name} has been dispatched`, {
        description: `ETA ${m.etaMin} minutes · tracking is live`,
      });
      navigate({ to: "/track" });
    }, 1100);
  };

  return (
    <div className="min-h-screen">
      <SiteNav />

      <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Request help
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
              {stage === "results" ? "Nearby help, ranked for your fault" : "What happened?"}
            </h1>
          </div>
          {stage === "results" && (
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={() => setStage("form")}
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Edit details
            </Button>
          )}
        </div>

        {stage === "form" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="panel rise space-y-7 p-5 sm:p-7">
              <Field label="Vehicle type" error={errors.vehicleType}>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {vehicleTypes.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => set("vehicleType", v.id)}
                      className={`flex flex-col items-start gap-2 rounded-xl border px-3 py-3 text-left text-xs transition-colors ${
                        form.vehicleType === v.id
                          ? "border-primary/60 bg-primary/10 text-foreground"
                          : "border-border bg-background/40 text-muted-foreground hover:border-border-strong"
                      }`}
                    >
                      <v.icon
                        className={`h-4 w-4 ${form.vehicleType === v.id ? "text-primary" : ""}`}
                      />
                      <span className="truncate">{v.label}</span>
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Issue category" error={errors.issueId}>
                <div className="grid gap-2 sm:grid-cols-2">
                  {issueCategories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => set("issueId", c.id)}
                      className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors ${
                        form.issueId === c.id
                          ? "border-primary/60 bg-primary/10"
                          : "border-border bg-background/40 hover:border-border-strong"
                      }`}
                    >
                      <c.icon
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          form.issueId === c.id ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-foreground">{c.label}</span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {c.blurb}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </Field>

              <Field
                label="Describe the symptoms"
                error={errors.symptoms}
                hint="Sounds, warning lights, when it started — detail helps the mechanic arrive prepared."
              >
                <Textarea
                  value={form.symptoms}
                  onChange={(e) => set("symptoms", e.target.value)}
                  rows={4}
                  maxLength={600}
                  placeholder="Engine turns over slowly then clicks. Dashboard lights dimmed. Started after the car sat overnight in the cold."
                />
                <p className="mt-2 text-right text-xs text-muted-foreground">
                  {form.symptoms.length}/600
                </p>
              </Field>

              <Field label="Your location" error={errors.location}>
                <div className="flex gap-2">
                  <Input
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    maxLength={160}
                    placeholder="e.g. I-280 northbound, exit 43 layby"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0"
                    onClick={() => {
                      set("location", "Pinned: 37.7842, -122.4012 · Alameda St layby");
                      toast.success("Location pinned from device");
                    }}
                  >
                    <Crosshair className="h-4 w-4" />
                    <span className="ml-1.5 hidden sm:inline">Use GPS</span>
                  </Button>
                </div>
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Phone number" error={errors.phone}>
                  <Input
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    inputMode="tel"
                    maxLength={20}
                    placeholder="+1 415 555 0134"
                  />
                </Field>
                <Field label="Photo (optional)">
                  <button
                    type="button"
                    onClick={() => {
                      set("photoName", form.photoName ? undefined : "breakdown-photo.jpg");
                      toast.success(form.photoName ? "Photo removed" : "Photo attached (demo)");
                    }}
                    className="flex h-10 w-full items-center gap-2.5 rounded-md border border-dashed border-input bg-background/40 px-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    <Camera className="h-4 w-4 shrink-0" />
                    <span className="truncate">{form.photoName ?? "Attach a photo"}</span>
                  </button>
                </Field>
              </div>

              <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Details are shared only with the mechanic you choose
                </p>
                <Button size="lg" onClick={submit} className="shrink-0">
                  Find nearby help <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </div>

            <aside className="space-y-4">
              <MapPanel label="Coverage around your area" />
              <div className="panel space-y-3 p-5">
                <p className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" /> Not sure what's wrong?
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  The AI Breakdown Assistant reads your description and suggests a likely category
                  plus immediate safe steps.
                </p>
                <Button asChild variant="secondary" className="w-full">
                  <a href="/assistant">Open the assistant</a>
                </Button>
              </div>
            </aside>
          </div>
        )}

        {stage === "matching" && <MatchingState />}

        {stage === "results" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="space-y-4">
              {matches.length === 0 ? (
                <EmptyState onRetry={() => setStage("form")} />
              ) : (
                matches.map((m) => (
                  <MechanicCard
                    key={m.id}
                    m={m}
                    selected={activePin === m.id}
                    pending={pendingId === m.id}
                    onRequest={confirm}
                  />
                ))
              )}
            </div>
            <aside className="space-y-4 lg:sticky lg:top-24">
              <MapPanel list={matches} activeId={activePin} onSelect={setActivePin} />
              <div className="panel space-y-2 p-5 text-sm">
                <p className="font-display font-semibold text-foreground">Your request</p>
                <Row
                  k="Vehicle"
                  v={vehicleTypes.find((v) => v.id === form.vehicleType)?.label ?? "—"}
                />
                <Row
                  k="Issue"
                  v={issueCategories.find((c) => c.id === form.issueId)?.label ?? "—"}
                />
                <Row k="Location" v={form.location} />
                <Row k="Callback" v={form.phone} />
              </div>
            </aside>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-t border-border pt-2 text-xs">
      <span className="text-muted-foreground">{k}</span>
      <span className="truncate text-right text-foreground">{v}</span>
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</Label>
      {hint && <p className="mt-1 text-xs text-muted-foreground/80">{hint}</p>}
      <div className="mt-2.5">{children}</div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function MatchingState() {
  return (
    <div className="panel rise mt-8 overflow-hidden">
      <div className="relative h-0.5 w-full overflow-hidden bg-border">
        <span className="sweep absolute inset-y-0 w-1/3 bg-primary" aria-hidden />
      </div>
      <div className="flex flex-col items-center px-6 py-20 text-center">
        <span className="relative grid h-16 w-16 place-items-center rounded-full border border-primary/40 bg-primary/10">
          <span className="absolute inset-0 rounded-full bg-primary/20 pin-ping" aria-hidden />
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </span>
        <h2 className="mt-7 font-display text-2xl font-bold text-foreground">
          Matching you with nearby mechanics
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Checking skill fit, live availability and travel time across the network.
        </p>
        <div className="mt-8 w-full max-w-sm space-y-2.5">
          {["Verifying location", "Filtering by capability", "Ranking by arrival time"].map(
            (s, i) => (
              <div
                key={s}
                className="rise flex items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-3 text-left text-sm text-muted-foreground"
                style={{ animationDelay: `${i * 350}ms` }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {s}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="panel px-6 py-16 text-center">
      <h2 className="font-display text-xl font-semibold text-foreground">
        No mechanics matched that combination
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Widen the issue category or check your vehicle type and try again.
      </p>
      <Button variant="outline" className="mt-6" onClick={onRetry}>
        <RefreshCw className="mr-1.5 h-4 w-4" /> Adjust request
      </Button>
    </div>
  );
}
