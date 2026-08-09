import { createFileRoute } from "@tanstack/react-router";
import { Check, Clock, MapPin, Star, TrendingUp, Wallet, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { issueCategories } from "@/lib/roadresq/data";

export const Route = createFileRoute("/mechanics")({
  head: () => ({
    meta: [
      { title: "Mechanic Dashboard — Accept Roadside Jobs Nearby | ROADRESQ" },
      {
        name: "description",
        content:
          "Demo ROADRESQ mechanic dashboard: incoming roadside requests, active job controls, availability toggle and weekly earnings and rating stats.",
      },
      { property: "og:title", content: "For Mechanics | ROADRESQ" },
      {
        property: "og:description",
        content:
          "Fill gaps in your day with nearby roadside jobs. Accept what suits you, get paid per completed job.",
      },
    ],
  }),
  component: Dashboard,
});

type Job = {
  id: string;
  driver: string;
  vehicle: string;
  issueId: string;
  location: string;
  distanceKm: number;
  payout: number;
  postedMin: number;
};

const initialJobs: Job[] = [
  {
    id: "RQ-4821",
    driver: "H. Ahmed",
    vehicle: "2019 Toyota Corolla",
    issueId: "battery",
    location: "Bryant St & 7th, layby",
    distanceKm: 2.1,
    payout: 62,
    postedMin: 1,
  },
  {
    id: "RQ-4822",
    driver: "M. Torres",
    vehicle: "2016 Ford Transit",
    issueId: "tyre",
    location: "I-280 N, exit 43 hard shoulder",
    distanceKm: 4.7,
    payout: 88,
    postedMin: 3,
  },
  {
    id: "RQ-4823",
    driver: "J. Lin",
    vehicle: "2021 Kia Sportage",
    issueId: "electrical",
    location: "Mission Bay car park, level 2",
    distanceKm: 5.9,
    payout: 74,
    postedMin: 6,
  },
];

const activeStages = ["Accepted", "En route", "On site", "Completed"] as const;

function Dashboard() {
  const [online, setOnline] = useState(true);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [active, setActive] = useState<{ job: Job; stage: number } | null>(null);
  const [completed, setCompleted] = useState(0);

  const accept = (job: Job) => {
    if (active) {
      toast.error("Finish the active job first");
      return;
    }
    setJobs((j) => j.filter((x) => x.id !== job.id));
    setActive({ job, stage: 0 });
    toast.success(`Job ${job.id} accepted`, { description: `${job.distanceKm} km · $${job.payout}` });
  };

  const reject = (job: Job) => {
    setJobs((j) => j.filter((x) => x.id !== job.id));
    toast.success(`Job ${job.id} declined`);
  };

  const advance = () => {
    if (!active) return;
    const next = active.stage + 1;
    if (next >= activeStages.length - 1) {
      toast.success(`Job ${active.job.id} completed`, {
        description: `$${active.job.payout} added to today's earnings`,
      });
      setCompleted((c) => c + 1);
      setActive(null);
      return;
    }
    setActive({ ...active, stage: next });
    toast.success(activeStages[next]!);
  };

  const stats = [
    { icon: Wallet, value: `$${412 + completed * 70}`, label: "Earned this week" },
    { icon: TrendingUp, value: `${18 + completed}`, label: "Jobs completed" },
    { icon: Star, value: "4.9", label: "Rating (216 reviews)" },
    { icon: Clock, value: "11 min", label: "Median arrival" },
  ];

  return (
    <div className="min-h-screen">
      <SiteNav />

      <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Mechanic dashboard · demo
            </span>
            <h1 className="mt-3 truncate font-display text-3xl font-bold text-foreground sm:text-4xl">
              Apex Mobile Garage
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
            <span className="text-xs text-muted-foreground">{online ? "Online" : "Offline"}</span>
            <Switch
              checked={online}
              onCheckedChange={(v) => {
                setOnline(v);
                toast.success(v ? "You're online — receiving jobs" : "You're offline");
              }}
              aria-label="Availability"
            />
          </div>
        </header>

        <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="panel p-4">
              <s.icon className="h-4 w-4 text-primary" />
              <dt className="mt-3 font-display text-2xl font-bold text-foreground">{s.value}</dt>
              <dd className="mt-1 text-xs text-muted-foreground">{s.label}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Incoming requests
            </h2>
            <div className="mt-4 space-y-3">
              {!online ? (
                <div className="panel px-6 py-14 text-center">
                  <p className="font-display text-base font-semibold text-foreground">
                    You're offline
                  </p>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                    Go online to start receiving roadside requests within your radius.
                  </p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="panel px-6 py-14 text-center">
                  <p className="font-display text-base font-semibold text-foreground">
                    Queue is clear
                  </p>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                    New requests in your area will appear here instantly.
                  </p>
                  <Button variant="outline" className="mt-6" onClick={() => setJobs(initialJobs)}>
                    Reload demo queue
                  </Button>
                </div>
              ) : (
                jobs.map((job) => {
                  const issue = issueCategories.find((c) => c.id === job.issueId);
                  return (
                    <article key={job.id} className="panel rise p-5">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-display text-base font-semibold text-foreground">
                            {issue?.label ?? "Roadside assistance"}
                          </h3>
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {job.id} · {job.driver} · {job.vehicle}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs text-primary">
                          ${job.payout}
                        </span>
                      </div>

                      <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="truncate">{job.location}</span>
                      </p>
                      <p className="mt-1.5 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{job.distanceKm} km away</span>
                        <span>posted {job.postedMin} min ago</span>
                      </p>

                      <div className="mt-5 flex gap-2 border-t border-border pt-4">
                        <Button size="sm" onClick={() => accept(job)}>
                          <Check className="mr-1.5 h-3.5 w-3.5" /> Accept
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => reject(job)}>
                          <X className="mr-1.5 h-3.5 w-3.5" /> Decline
                        </Button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          <aside className="lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-semibold text-foreground">Active job</h2>
            <div className="panel mt-4 p-5">
              {!active ? (
                <div className="py-10 text-center">
                  <p className="font-display text-base font-semibold text-foreground">
                    No active job
                  </p>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                    Accept a request to see navigation, driver contact and status controls here.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-base font-semibold text-foreground">
                        {issueCategories.find((c) => c.id === active.job.issueId)?.label}
                      </h3>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {active.job.id} · {active.job.driver}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-success/40 bg-success/10 px-2.5 py-1 text-xs text-success">
                      {activeStages[active.stage]}
                    </span>
                  </div>

                  <ol className="mt-5 space-y-2">
                    {activeStages.map((s, i) => (
                      <li
                        key={s}
                        className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm ${
                          i <= active.stage
                            ? "border-primary/40 bg-primary/10 text-foreground"
                            : "border-border bg-background/40 text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            i <= active.stage ? "bg-primary" : "bg-border-strong"
                          }`}
                        />
                        {s}
                      </li>
                    ))}
                  </ol>

                  <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="truncate">{active.job.location}</span>
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-border pt-4">
                    <Button size="sm" onClick={advance}>
                      Update status
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setJobs((j) => [active.job, ...j]);
                        setActive(null);
                        toast.success("Job returned to the queue");
                      }}
                    >
                      Release job
                    </Button>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
