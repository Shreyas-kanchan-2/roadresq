import { issueCategories } from "./data";

export type Urgency = "low" | "moderate" | "high";

export type Diagnosis = {
  likelyIssueId: string;
  likelyIssue: string;
  confidence: "low" | "moderate" | "strong";
  urgency: Urgency;
  summary: string;
  steps: string[];
  recommendedService: string;
  nearbyServiceType: string;
  matchedSignals: string[];
};

type Rule = {
  issueId: string;
  keywords: string[];
  urgency: Urgency;
  summary: string;
  steps: string[];
  nearbyServiceType: string;
};

const rules: Rule[] = [
  {
    issueId: "overheat",
    keywords: [
      "overheat",
      "steam",
      "smoke",
      "temperature",
      "temp gauge",
      "coolant",
      "boiling",
      "hot smell",
    ],
    urgency: "high",
    summary:
      "The signals point to a possible cooling system problem. Continuing to drive with a hot engine risks serious damage.",
    steps: [
      "Stop somewhere safe and switch the engine off; let it cool at least 30 minutes.",
      "Do not open the radiator or expansion cap while hot — pressurised coolant can scald.",
      "Look for visible drips or a sweet smell under the front of the vehicle, without touching anything.",
      "Avoid driving further, even a short distance, until a mechanic has checked it.",
    ],
    nearbyServiceType: "Mobile mechanic with cooling system tools",
  },
  {
    issueId: "battery",
    keywords: [
      "won't start",
      "wont start",
      "no crank",
      "clicking",
      "dim light",
      "dead battery",
      "battery",
      "turns over slowly",
      "silent",
      "no power",
    ],
    urgency: "moderate",
    summary:
      "This most likely reflects a starting or charging fault — commonly a flat battery, a loose terminal, or a failing starter.",
    steps: [
      "Switch off lights, climate and audio, then try one more short start attempt.",
      "Check the battery terminals look clean and tight — never touch both terminals with one tool.",
      "If the vehicle is in a traffic lane, put hazards on and stay outside the vehicle in a safe spot.",
      "Avoid repeated cranking; it can overheat the starter.",
    ],
    nearbyServiceType: "Mobile garage with jump pack and battery tester",
  },
  {
    issueId: "tyre",
    keywords: [
      "flat",
      "tyre",
      "tire",
      "puncture",
      "blowout",
      "rim",
      "wheel",
      "vibration",
      "pulling to one side",
      "nail",
    ],
    urgency: "moderate",
    summary:
      "The description is consistent with tyre or wheel damage. Driving on a deflated tyre can damage the rim and reduce control.",
    steps: [
      "Slow gradually, avoid hard braking, and move fully off the road before stopping.",
      "Turn the wheels away from traffic and apply the parking brake.",
      "Place a warning triangle behind the vehicle if you have one and it is safe to do so.",
      "Do not attempt a roadside change on a motorway hard shoulder or an unlit bend.",
    ],
    nearbyServiceType: "Mobile tyre fitter",
  },
  {
    issueId: "fuel",
    keywords: [
      "out of fuel",
      "no fuel",
      "empty tank",
      "petrol",
      "diesel",
      "gas",
      "misfuel",
      "wrong fuel",
      "sputter",
    ],
    urgency: "low",
    summary:
      "This looks like a fuel supply issue — either an empty tank or, if the wrong fuel was added, contamination that needs draining.",
    steps: [
      "If you suspect the wrong fuel, do not start the engine at all.",
      "Park safely, hazards on, and note your nearest road marker or junction number.",
      "Never carry loose fuel in unsealed containers.",
      "Stay away from the roadside edge while you wait.",
    ],
    nearbyServiceType: "Roadside fuel delivery unit",
  },
  {
    issueId: "electrical",
    keywords: [
      "warning light",
      "check engine",
      "dashboard",
      "alternator",
      "fuse",
      "electrical",
      "battery light",
      "flicker",
      "abs light",
      "burning smell",
    ],
    urgency: "moderate",
    summary:
      "The pattern suggests a possible electrical or charging fault. A dashboard alert can range from a sensor glitch to a live safety issue.",
    steps: [
      "If you smell burning or see smoke, stop, switch off and get everyone away from the vehicle.",
      "Note exactly which symbols are lit — colour and shape matter for diagnosis.",
      "Reduce electrical load: lights, heater and screens off.",
      "Avoid clearing warning lights yourself; the stored fault code helps the mechanic.",
    ],
    nearbyServiceType: "Auto electrician with OBD diagnostics",
  },
  {
    issueId: "lockout",
    keywords: [
      "locked",
      "keys inside",
      "lost key",
      "key fob",
      "immobiliser",
      "immobilizer",
      "can't open",
      "cant open",
    ],
    urgency: "low",
    summary:
      "This appears to be an access problem rather than a mechanical fault — usually solved without damage by a trained technician.",
    steps: [
      "If a child or pet is locked inside, call emergency services immediately.",
      "Check every door and the boot before assuming a full lockout.",
      "Wait in a well-lit, populated spot rather than beside moving traffic.",
      "Avoid DIY entry attempts; modern seals and sensors damage easily.",
    ],
    nearbyServiceType: "Vehicle lockout specialist",
  },
  {
    issueId: "mechanical",
    keywords: [
      "grinding",
      "knocking",
      "clunk",
      "brake",
      "clutch",
      "gearbox",
      "transmission",
      "steering",
      "leak",
      "noise",
      "won't move",
      "tow",
    ],
    urgency: "high",
    summary:
      "The symptoms could indicate a mechanical fault affecting drivability. Braking, steering and driveline issues should be treated as unsafe to drive.",
    steps: [
      "Stop as soon as it is safe; do not test the fault by driving further.",
      "Leave the vehicle in gear or park with the handbrake applied on any incline.",
      "Note when the noise appears — braking, turning, or accelerating — for the mechanic.",
      "Assume recovery may be needed rather than a roadside fix.",
    ],
    nearbyServiceType: "Mobile mechanic or recovery flatbed",
  },
];

const escalators = ["smoke", "fire", "brake", "steering", "motorway", "highway", "flames"];

export function diagnose(input: string): Diagnosis | null {
  const text = input.toLowerCase().trim();
  if (text.length < 6) return null;

  let best: { rule: Rule; hits: string[] } | null = null;
  for (const rule of rules) {
    const hits = rule.keywords.filter((k) => text.includes(k));
    if (!best || hits.length > best.hits.length) {
      if (hits.length > 0) best = { rule, hits };
    }
  }

  const fallback: Rule = rules[rules.length - 1];
  const chosen = best?.rule ?? fallback;
  const hits = best?.hits ?? [];

  const escalated = escalators.some((e) => text.includes(e));
  const order: Urgency[] = ["low", "moderate", "high"];
  const urgency: Urgency = escalated
    ? "high"
    : order[Math.min(order.indexOf(chosen.urgency) + (text.length > 160 ? 0 : 0), 2)];

  const confidence: Diagnosis["confidence"] =
    hits.length >= 3 ? "strong" : hits.length >= 1 ? "moderate" : "low";

  const category = issueCategories.find((c) => c.id === chosen.issueId)!;

  return {
    likelyIssueId: chosen.issueId,
    likelyIssue: category.label,
    confidence,
    urgency,
    summary:
      hits.length === 0
        ? "There isn't enough of a pattern to narrow this down confidently. Treat it as a possible mechanical fault until a professional inspects it."
        : chosen.summary,
    steps: chosen.steps,
    recommendedService: category.service,
    nearbyServiceType: chosen.nearbyServiceType,
    matchedSignals: hits,
  };
}

export const urgencyCopy: Record<Urgency, { label: string; hint: string }> = {
  low: { label: "Low urgency", hint: "Likely safe to wait where you are." },
  moderate: { label: "Moderate urgency", hint: "Get assistance soon; avoid driving on." },
  high: { label: "High urgency", hint: "Do not drive. Wait in a safe place for help." },
};
