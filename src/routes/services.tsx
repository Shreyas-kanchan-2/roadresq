import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { serviceCatalog, issueCategories } from "@/lib/roadresq/data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Roadside Services — Jump Starts, Tyres, Fuel & Recovery | ROADRESQ" },
      {
        name: "description",
        content:
          "Mobile battery, tyre, fuel, cooling, diagnostics, lockout and recovery services delivered by verified ROADRESQ mechanics, 24/7.",
      },
      { property: "og:title", content: "Roadside Services | ROADRESQ" },
      {
        property: "og:description",
        content:
          "Everything ROADRESQ mechanics handle at the roadside — from jump starts to heavy recovery.",
      },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 hero-glow opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Services
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-balance-tight text-foreground sm:text-5xl">
            Fixed at the roadside where possible, recovered where it isn't
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Every job starts with a diagnosis and an agreed price. If a roadside repair isn't safe,
            we recover the vehicle instead of guessing.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/request">
              Get roadside help <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCatalog.map((s) => (
            <div key={s.title} className="panel p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background/40 text-primary">
                <s.icon className="h-4.5 w-4.5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 lg:px-8">
        <div className="panel overflow-hidden">
          <div className="border-b border-border px-6 py-5">
            <h2 className="font-display text-xl font-semibold text-foreground">
              What we dispatch for
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick the closest match when you request help — the mechanic confirms on arrival.
            </p>
          </div>
          <ul className="divide-y divide-border">
            {issueCategories.map((c) => (
              <li
                key={c.id}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 px-6 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
              >
                <c.icon className="h-4.5 w-4.5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{c.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.blurb}</p>
                </div>
                <span className="col-span-2 text-xs text-muted-foreground sm:col-span-1 sm:text-right">
                  {c.service}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
