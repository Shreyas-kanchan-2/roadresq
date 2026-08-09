import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Sparkles, Stethoscope, Wrench, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { diagnose, urgencyCopy, type Diagnosis } from "@/lib/roadresq/diagnose";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Breakdown Assistant — Likely Fault and Safe Next Steps | ROADRESQ" },
      {
        name: "description",
        content:
          "Describe your breakdown and get a likely issue category, urgency level, immediate safe steps and the recommended roadside service. Guidance only — not a substitute for inspection.",
      },
      { property: "og:title", content: "AI Breakdown Assistant | ROADRESQ" },
      {
        property: "og:description",
        content:
          "Get a likely fault category, urgency and safe next steps from your description of the breakdown.",
      },
    ],
  }),
  component: Assistant,
});

const examples = [
  "Engine cranks slowly then just clicks, dashboard lights went dim after sitting overnight.",
  "Temperature gauge in the red and there's steam coming from the bonnet on the motorway.",
  "Steering wheel started shaking and there's a loud flapping noise from the rear left wheel.",
];

function Assistant() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    if (text.trim().length < 10) {
      toast.error("Add a little more detail", {
        description: "At least a sentence about sounds, lights or when it started.",
      });
      return;
    }
    setLoading(true);
    setResult(null);
    window.setTimeout(() => {
      const d = diagnose(text);
      setResult(d);
      setLoading(false);
      if (d) toast.success("Assessment ready");
    }, 1400);
  };

  return (
    <div className="min-h-screen">
      <SiteNav />

      <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8 lg:py-16">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          AI breakdown assistant
        </span>
        <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight text-balance-tight text-foreground sm:text-4xl">
          Describe what you're seeing and hearing
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          The assistant narrows the likely category and gives you safe immediate steps. It is
          guidance, not a verdict — a mechanic still confirms the fault on site.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="panel p-5 sm:p-6">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              maxLength={600}
              placeholder="e.g. Car won't start, single click when I turn the key, interior lights very dim."
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">{text.length}/600</p>
              <Button onClick={run} disabled={loading}>
                <Sparkles className="mr-1.5 h-4 w-4" />
                {loading ? "Assessing…" : "Assess symptoms"}
              </Button>
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Try an example
              </p>
              <div className="mt-3 space-y-2">
                {examples.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setText(e)}
                    className="w-full rounded-xl border border-border bg-background/40 px-3.5 py-3 text-left text-xs leading-relaxed text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {loading && (
              <div className="panel space-y-3 p-6">
                <div className="h-4 w-1/3 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-full animate-pulse rounded bg-secondary" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-secondary" />
              </div>
            )}

            {!loading && !result && (
              <div className="panel px-6 py-14 text-center">
                <Stethoscope className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-4 font-display text-base font-semibold text-foreground">
                  No assessment yet
                </p>
                <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                  Add a description on the left and the assistant will suggest a likely category.
                </p>
              </div>
            )}

            {!loading && result && (
              <>
                <div className="panel rise p-5 sm:p-6">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        Likely issue
                      </p>
                      <h2 className="mt-1.5 font-display text-xl font-bold text-foreground">
                        {result.likelyIssue}
                      </h2>
                    </div>
                    <span className="shrink-0 rounded-full border border-border bg-secondary px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                      {result.confidence} signal
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {result.summary}
                  </p>

                  <div
                    className={`mt-5 flex items-start gap-3 rounded-xl border px-4 py-3 ${
                      result.urgency === "high"
                        ? "border-destructive/40 bg-destructive/10"
                        : result.urgency === "moderate"
                          ? "border-warning/40 bg-warning/10"
                          : "border-border bg-background/40"
                    }`}
                  >
                    <AlertTriangle
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        result.urgency === "high"
                          ? "text-destructive"
                          : result.urgency === "moderate"
                            ? "text-warning"
                            : "text-muted-foreground"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {urgencyCopy[result.urgency].label}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {urgencyCopy[result.urgency].hint}
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-6 font-display text-sm font-semibold text-foreground">
                    Immediate safe steps
                  </h3>
                  <ol className="mt-3 space-y-2.5">
                    {result.steps.map((s, i) => (
                      <li
                        key={s}
                        className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-border text-[0.65rem] text-primary">
                          {i + 1}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ol>

                  <div className="mt-6 grid gap-2 border-t border-border pt-5 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        Recommended service
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-foreground">
                        <Wrench className="h-3.5 w-3.5 text-primary" />
                        {result.recommendedService}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        Nearby help to look for
                      </p>
                      <p className="mt-1 text-foreground">{result.nearbyServiceType}</p>
                    </div>
                  </div>

                  <Button asChild className="mt-6 w-full" size="lg">
                    <Link to="/request" search={{ issue: result.likelyIssueId }}>
                      Dispatch a mechanic for this <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <p className="px-1 text-xs leading-relaxed text-muted-foreground">
                  This assessment is indicative only. It cannot rule out other faults, and no
                  roadside description replaces a professional inspection. If you smell fuel, see
                  smoke or suspect a brake or steering fault, stop driving and wait somewhere safe.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
