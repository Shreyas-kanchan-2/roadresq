import { Link } from "@tanstack/react-router";
import { Logo } from "./SiteNav";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Emergency roadside dispatch connecting stranded drivers to verified mechanics and
              mobile garages, around the clock.
            </p>
          </div>

          <FooterCol
            title="Product"
            items={[
              { label: "Request help", to: "/request" },
              { label: "Track a job", to: "/track" },
              { label: "AI assistant", to: "/assistant" },
            ]}
          />
          <FooterCol
            title="Company"
            items={[
              { label: "Services", to: "/services" },
              { label: "How it works", to: "/how-it-works" },
              { label: "For mechanics", to: "/mechanics" },
            ]}
          />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Dispatch
            </h3>
            <p className="mt-4 font-display text-lg text-foreground">+1 415 555 0100</p>
            <p className="mt-1 text-sm text-muted-foreground">
              24/7 · Average pickup under 20 seconds
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ROADRESQ. Demo build with simulated dispatch data.</p>
          <p>
            In a life-threatening emergency, call your local emergency number before requesting
            roadside help.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; to: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i.to}>
            <Link
              to={i.to}
              className="text-sm text-foreground/80 transition-colors hover:text-primary"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
