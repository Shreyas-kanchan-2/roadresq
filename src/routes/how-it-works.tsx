import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Radar, Receipt } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { howItWorks, statusMetaList } from "@/lib/roadresq/journey";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How ROADRESQ Dispatch Works — From Breakdown to Back on the Road" },
      {
        name: "description",
        content:
          "How ROADRESQ matches stranded drivers with verified mechanics: skill-fit ranking, live ETA tracking, upfront estimates and a five-stage job timeline.",
      },
      { property: "og:title", content: "How ROADRESQ Works" },
      {
        property: "og:description",
        content:
          "Skill-fit matching, live tracking and upfront estimates — the ROADRESQ dispatch model explained.",
      },
    ],
  }),
  component: HowItWorks,
});

const principles = [
  {
    icon: Radar,
    title: "Skill fit before proximity",
    body: "The closest van is useless without the right tools. We rank capability first, then distance.",
  },
  {
    icon: Receipt,
    title: "Price agreed before work",
    body: "A call-out band up front, a firm estimate on site. Nothing starts until you approve it.",
  },
  {
    icon: ShieldCheck,
    title: "Verified people only",
    body: "ID, trade credentials and public liability insurance checked before a mechanic goes live.",
  },
];

function HowItWorks() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 hero-glow opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            How it works
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-balance-tight text-foreground sm:text-5xl">
            Dispatch that behaves like a good workshop, not a call centre
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            One request, ranked matches, and a job you can follow stage by stage until you're moving
            again.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.map((s) => (
            <div key={s.step} className="panel p-6">
              <span className="font-display text-sm font-bold tracking-[0.2em] text-primary">
                {s.step}
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8 lg:px-8">
        <div className="panel p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-foreground">The job timeline</h2>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Every request moves through the same five stages. You see each one as it happens.
          </p>
          <ol className="mt-8 space-y-6">
            {statusMetaList.map((s, i) => (
              <li key={s.key} className="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
                <div className="flex flex-col items-center">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10 font-display text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  {i < statusMetaList.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-border" aria-hidden />
                  )}
                </div>
                <div className="min-w-0 pb-1">
                  <p className="font-display text-base font-semibold text-foreground">{s.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} className="panel p-6">
              <p.icon className="h-5 w-5 text-primary" />
              <h2 className="mt-4 font-display text-base font-semibold text-foreground">
                {p.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/request">
              Get roadside help <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/mechanics">Join as a mechanic</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
