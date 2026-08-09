import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MapPanel, MechanicMiniCard } from "@/components/site/MapPanel";
import {
  howItWorks,
  issueCategories,
  mechanics,
  serviceCatalog,
  trustMetrics,
  vehicleTypes,
} from "@/lib/roadresq/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ROADRESQ — Emergency Roadside Assistance, Dispatched in Minutes" },
      {
        name: "description",
        content:
          "Stranded? Help is already on the way. ROADRESQ connects drivers to verified mechanics and mobile garages nearby, with live tracking and upfront estimates.",
      },
      { property: "og:title", content: "ROADRESQ — Help is already on the way" },
      {
        property: "og:description",
        content:
          "Emergency roadside dispatch: verified mechanics, live ETA tracking and upfront estimates, 24/7.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [vehicle, setVehicle] = useState("car");
  const [issue, setIssue] = useState("battery");
  const [location, setLocation] = useState("");
  const [activePin, setActivePin] = useState<string | null>("m1");

  const nearest = mechanics.slice(0, 3);

  return (
    <div className="min-h-screen">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-glow" aria-hidden />
        <div className="absolute inset-0 grid-fade opacity-40" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Live dispatch · 2,400+ verified mechanics
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] text-balance-tight text-foreground sm:text-5xl lg:text-6xl">
              Stranded?{" "}
              <span className="text-primary">Help is already on the way.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Tell us the vehicle, the symptom and where you are. ROADRESQ dispatches the nearest
              verified mechanic or mobile garage — with a live ETA and the price agreed before any
              spanner turns.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/request">
                  Get roadside help <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/assistant">
                  <Sparkles className="mr-1.5 h-4 w-4" /> Diagnose the symptom
                </Link>
              </Button>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4 lg:max-w-xl">
              {trustMetrics.map((t) => (
                <div key={t.label}>
                  <dt className="font-display text-2xl font-bold text-foreground">{t.value}</dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">{t.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Emergency request panel */}
          <div className="glass rise rounded-3xl p-5 sm:p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Emergency request
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  No account needed · 30 seconds
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.12em] text-primary">
                24/7
              </span>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Vehicle type
                </Label>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  {vehicleTypes.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehicle(v.id)}
                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                        vehicle === v.id
                          ? "border-primary/60 bg-primary/10 text-foreground"
                          : "border-border bg-background/40 text-muted-foreground hover:border-border-strong"
                      }`}
                    >
                      <v.icon
                        className={`h-4 w-4 shrink-0 ${vehicle === v.id ? "text-primary" : ""}`}
                      />
                      <span className="truncate">{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  What's happening
                </Label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {issueCategories.slice(0, 5).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setIssue(c.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        issue === c.id
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-border bg-background/40 text-muted-foreground hover:border-border-strong"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="hero-location"
                  className="text-xs uppercase tracking-[0.14em] text-muted-foreground"
                >
                  Location
                </Label>
                <Input
                  id="hero-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Road, junction or landmark"
                  className="mt-2.5"
                  maxLength={160}
                />
              </div>

              <Button asChild size="lg" className="w-full">
                <Link
                  to="/request"
                  search={{ vehicle, issue, location: location.trim() || undefined }}
                >
                  Find help near me <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>

              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                ID-checked, insured mechanics only
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="hairline mx-auto max-w-6xl" />

      {/* MAP + NEARBY */}
      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <div>
            <SectionLabel>Live network</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
              See who's actually close
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Dispatch ranks by skill fit first, then distance and live availability — so the person
              who arrives can finish the job.
            </p>
            <div className="mt-7">
              <MapPanel activeId={activePin} onSelect={setActivePin} />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Nearest available
            </p>
            {nearest.map((m) => (
              <MechanicMiniCard key={m.id} m={m} />
            ))}
            <div className="panel space-y-3 p-4">
              <p className="flex items-center gap-2 text-sm text-foreground">
                <Clock className="h-4 w-4 text-primary" /> Median arrival 8–14 minutes
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Estimates are confirmed on site before work starts. Cancel free until your mechanic
                is en route.
              </p>
              <Button asChild variant="secondary" className="w-full">
                <Link to="/request">Request assistance</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <SectionLabel>Services</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Roadside work, done properly
            </h2>
          </div>
          <Link
            to="/services"
            className="hidden shrink-0 items-center gap-1.5 text-sm text-primary hover:underline sm:flex"
          >
            All services <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCatalog.map((s) => (
            <div
              key={s.title}
              className="panel group p-5 transition-colors hover:border-border-strong"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background/40 text-primary transition-colors group-hover:border-primary/40">
                <s.icon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-balance-tight text-foreground sm:text-4xl">
          Three steps between breakdown and back on the road
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {howItWorks.map((s) => (
            <div key={s.step} className="panel relative overflow-hidden p-6">
              <span className="font-display text-sm font-bold tracking-[0.2em] text-primary">
                {s.step}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MECHANIC CTA */}
      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12">
          <div className="absolute inset-0 hero-glow opacity-70" aria-hidden />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <SectionLabel>For mechanics</SectionLabel>
              <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
                Fill the gaps in your day with jobs nearby
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Set your radius and skills, accept only what suits you, and get paid per completed
                job. No monthly fee, no lead auctions.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild size="lg" className="w-full">
                <Link to="/mechanics">Open mechanic dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link to="/how-it-works">See the dispatch model</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      {children}
    </span>
  );
}
