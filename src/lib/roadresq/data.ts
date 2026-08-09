import type { LucideIcon } from "lucide-react";
import {
  BatteryWarning,
  CircleDot,
  Fuel,
  KeyRound,
  Thermometer,
  Wrench,
  Zap,
  Car,
  Truck,
  Bike,
  Bus,
} from "lucide-react";

export type VehicleType = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const vehicleTypes: VehicleType[] = [
  { id: "car", label: "Car / SUV", icon: Car },
  { id: "bike", label: "Motorbike", icon: Bike },
  { id: "van", label: "Van / Pickup", icon: Truck },
  { id: "heavy", label: "Truck / Bus", icon: Bus },
];

export type IssueCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  blurb: string;
  service: string;
};

export const issueCategories: IssueCategory[] = [
  {
    id: "battery",
    label: "Battery / won't start",
    icon: BatteryWarning,
    blurb: "No crank, dim lights, clicking",
    service: "Jump start & battery test",
  },
  {
    id: "tyre",
    label: "Flat or damaged tyre",
    icon: CircleDot,
    blurb: "Puncture, blowout, no spare",
    service: "Tyre change & repair",
  },
  {
    id: "fuel",
    label: "Out of fuel",
    icon: Fuel,
    blurb: "Empty tank or wrong fuel",
    service: "Fuel delivery",
  },
  {
    id: "overheat",
    label: "Overheating / coolant",
    icon: Thermometer,
    blurb: "Steam, temp warning, leak",
    service: "Cooling system check",
  },
  {
    id: "electrical",
    label: "Electrical / warning lights",
    icon: Zap,
    blurb: "Alternator, fuses, dashboard alerts",
    service: "Mobile diagnostics",
  },
  {
    id: "lockout",
    label: "Locked out / key lost",
    icon: KeyRound,
    blurb: "Keys inside, immobiliser fault",
    service: "Lockout assistance",
  },
  {
    id: "mechanical",
    label: "Mechanical / other",
    icon: Wrench,
    blurb: "Noise, brakes, clutch, tow needed",
    service: "On-site inspection or tow",
  },
];

export type Mechanic = {
  id: string;
  name: string;
  garage: string;
  rating: number;
  jobs: number;
  distanceKm: number;
  etaMin: number;
  available: boolean;
  verified: boolean;
  specialties: string[];
  services: string[];
  vehicles: string[];
  priceFrom: number;
  phone: string;
  /** Map panel position, percentages */
  x: number;
  y: number;
};

export const mechanics: Mechanic[] = [
  {
    id: "m1",
    name: "Daniel Okoro",
    garage: "Apex Mobile Garage",
    rating: 4.9,
    jobs: 1284,
    distanceKm: 1.8,
    etaMin: 9,
    available: true,
    verified: true,
    specialties: ["battery", "electrical", "mechanical"],
    services: ["Jump start", "Battery test", "Mobile diagnostics"],
    vehicles: ["car", "van"],
    priceFrom: 38,
    phone: "+1 415 555 0142",
    x: 32,
    y: 38,
  },
  {
    id: "m2",
    name: "Amara Bello",
    garage: "Northline Roadside",
    rating: 4.8,
    jobs: 842,
    distanceKm: 2.6,
    etaMin: 13,
    available: true,
    verified: true,
    specialties: ["tyre", "mechanical", "fuel"],
    services: ["Tyre change", "Puncture repair", "Fuel delivery"],
    vehicles: ["car", "bike", "van"],
    priceFrom: 32,
    phone: "+1 415 555 0198",
    x: 62,
    y: 26,
  },
  {
    id: "m3",
    name: "Kwame Mensah",
    garage: "Torque Works 24/7",
    rating: 4.7,
    jobs: 2109,
    distanceKm: 3.4,
    etaMin: 16,
    available: true,
    verified: true,
    specialties: ["overheat", "mechanical", "electrical"],
    services: ["Cooling system", "On-site inspection", "Recovery tow"],
    vehicles: ["car", "van", "heavy"],
    priceFrom: 45,
    phone: "+1 415 555 0233",
    x: 46,
    y: 62,
  },
  {
    id: "m4",
    name: "Lena Fischer",
    garage: "Pitline Rapid Response",
    rating: 5.0,
    jobs: 517,
    distanceKm: 4.1,
    etaMin: 19,
    available: true,
    verified: true,
    specialties: ["lockout", "battery", "tyre"],
    services: ["Lockout assistance", "Jump start", "Tyre change"],
    vehicles: ["car", "bike"],
    priceFrom: 40,
    phone: "+1 415 555 0271",
    x: 74,
    y: 58,
  },
  {
    id: "m5",
    name: "Marco Silva",
    garage: "Silva Heavy Recovery",
    rating: 4.6,
    jobs: 1660,
    distanceKm: 6.2,
    etaMin: 27,
    available: false,
    verified: true,
    specialties: ["mechanical", "overheat"],
    services: ["Heavy recovery", "Flatbed tow", "Air system repair"],
    vehicles: ["heavy", "van"],
    priceFrom: 120,
    phone: "+1 415 555 0310",
    x: 18,
    y: 72,
  },
  {
    id: "m6",
    name: "Priya Nair",
    garage: "Voltcare Auto Electric",
    rating: 4.9,
    jobs: 934,
    distanceKm: 5.0,
    etaMin: 22,
    available: true,
    verified: true,
    specialties: ["electrical", "battery"],
    services: ["Alternator repair", "EV assist", "Mobile diagnostics"],
    vehicles: ["car", "van"],
    priceFrom: 52,
    phone: "+1 415 555 0388",
    x: 86,
    y: 40,
  },
];

export function matchMechanics(issueId: string, vehicleId: string): Mechanic[] {
  const scored = mechanics.map((m) => {
    let score = 0;
    if (m.specialties.includes(issueId)) score += 40;
    if (m.vehicles.includes(vehicleId)) score += 25;
    if (m.available) score += 20;
    score += (5 - m.rating) * -6;
    score -= m.distanceKm * 2.2;
    return { m, score };
  });
  return scored.sort((a, b) => b.score - a.score).map((s) => s.m);
}

export const trustMetrics = [
  { value: "8 min", label: "Median response in metro areas" },
  { value: "2,400+", label: "Verified mechanics on the network" },
  { value: "97.6%", label: "Jobs resolved on first visit" },
  { value: "24/7", label: "Dispatch, every day of the year" },
];

export const howItWorks = [
  {
    step: "01",
    title: "Tell us what happened",
    body: "Vehicle, symptom, location. Thirty seconds, no account required.",
  },
  {
    step: "02",
    title: "We match the right hands",
    body: "Dispatch ranks verified mechanics by skill fit, distance and live availability.",
  },
  {
    step: "03",
    title: "Track until you're moving",
    body: "Live status, ETA, upfront estimate and a direct line to your mechanic.",
  },
];

export const serviceCatalog = [
  {
    title: "Jump start & battery",
    body: "Load test, terminal repair, replacement battery fitted on site.",
    icon: BatteryWarning,
  },
  {
    title: "Tyre change & repair",
    body: "Spare fitting, plug repair, or wheel removal to the nearest fitter.",
    icon: CircleDot,
  },
  {
    title: "Fuel delivery",
    body: "Petrol, diesel or drainage after a misfuel. Sealed containers only.",
    icon: Fuel,
  },
  {
    title: "Mobile diagnostics",
    body: "OBD scan and fault tracing so you know the cost before the workshop.",
    icon: Zap,
  },
  {
    title: "Cooling & overheating",
    body: "Coolant top-up, hose and thermostat checks, leak containment.",
    icon: Thermometer,
  },
  {
    title: "Recovery & towing",
    body: "Flatbed and heavy recovery when the safest fix is off the road.",
    icon: Wrench,
  },
];

export const safetyTips = [
  "Pull fully off the carriageway and switch on your hazard lights.",
  "Exit on the side away from traffic; wait behind a barrier where possible.",
  "Stay visible: reflective triangle 45m behind you on open roads.",
  "Keep doors locked if you stay inside, and share your live location.",
];
