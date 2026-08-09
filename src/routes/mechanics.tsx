import { createFileRoute } from "@tanstack/react-router";
import { Check, Clock, MapPin, Star, TrendingUp, Wallet, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { issueCategories, statusLabelsForMechanic, incomingJobs } from "@/lib/roadresq/mechanic";

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
  component: Dashboard;
});

function Dashboard() {
  return null;
}
