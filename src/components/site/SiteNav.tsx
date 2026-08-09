import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/services", label: "Services" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/assistant", label: "AI assistant" },
  { to: "/mechanics", label: "For mechanics" },
] as const;

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Zap className="h-4.5 w-4.5" strokeWidth={2.6} />
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className="font-display text-[1.05rem] font-bold tracking-[0.14em] text-foreground">
          ROADRESQ
        </span>
        {!compact && (
          <span className="mt-1 text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">
            Roadside dispatch
          </span>
        )}
      </span>
    </Link>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? "glass border-border" : "border-transparent bg-background/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 lg:px-8">
        <Logo />

        <div className="flex items-center gap-1">
          <nav className="mr-2 hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/request">Get roadside help</Link>
          </Button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border text-foreground md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-surface px-5 pb-5 pt-2 md:hidden">
          <nav className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3.5 text-sm text-muted-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Button asChild className="mt-4 w-full" onClick={() => setOpen(false)}>
            <Link to="/request">Get roadside help</Link>
          </Button>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Every mechanic ID-checked and
            insured
          </p>
        </div>
      )}
    </header>
  );
}
