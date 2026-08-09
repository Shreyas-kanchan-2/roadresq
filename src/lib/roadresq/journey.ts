import { statusSteps, statusMeta, type RequestStatus } from "./store";
import { howItWorks } from "./data";

export { howItWorks };

export const statusMetaList: { key: RequestStatus; label: string; note: string }[] =
  statusSteps.map((key) => ({ key, ...statusMeta[key] }));
