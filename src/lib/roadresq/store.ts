import { z } from "zod";

export const STORAGE_KEY = "roadresq.request.v1";

export const requestSchema = z.object({
  vehicleType: z.string().min(1, "Select your vehicle type"),
  issueId: z.string().min(1, "Select what's happening"),
  symptoms: z
    .string()
    .trim()
    .min(10, "Add a little more detail (10 characters minimum)")
    .max(600, "Keep it under 600 characters"),
  location: z
    .string()
    .trim()
    .min(4, "Enter a road, landmark or pinned location")
    .max(160, "Keep it under 160 characters"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a reachable phone number")
    .max(20, "Phone number looks too long")
    .regex(/^[+0-9][0-9\s()-]+$/, "Use digits, spaces, + ( ) or - only"),
  photoName: z.string().max(120).optional(),
});

export type RequestInput = z.infer<typeof requestSchema>;

export const statusSteps = [
  "received",
  "assigned",
  "en_route",
  "arrived",
  "completed",
] as const;
export type RequestStatus = (typeof statusSteps)[number];

export const statusMeta: Record<RequestStatus, { label: string; note: string }> = {
  received: {
    label: "Request received",
    note: "Dispatch has your details and is confirming the nearest fit.",
  },
  assigned: {
    label: "Mechanic assigned",
    note: "Your mechanic accepted the job and is preparing tools and parts.",
  },
  en_route: { label: "En route", note: "On the move to your location. ETA updates live." },
  arrived: { label: "Arrived", note: "Your mechanic is on site and starting the assessment." },
  completed: { label: "Completed", note: "Job closed. A receipt and notes were sent to you." },
};

export type StoredRequest = RequestInput & {
  id: string;
  mechanicId: string;
  status: RequestStatus;
  createdAt: number;
  estimateLow: number;
  estimateHigh: number;
  etaMin: number;
};

export function loadRequest(): StoredRequest | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredRequest;
  } catch {
    return null;
  }
}

export function saveRequest(req: StoredRequest) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(req));
  window.dispatchEvent(new Event("roadresq:change"));
}

export function clearRequest() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("roadresq:change"));
}

export function newRequestId() {
  return "RQ-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

export function nextStatus(status: RequestStatus): RequestStatus {
  const i = statusSteps.indexOf(status);
  return statusSteps[Math.min(i + 1, statusSteps.length - 1)]!;
}
