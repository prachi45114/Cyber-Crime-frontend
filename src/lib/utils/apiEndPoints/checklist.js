import { env } from "@/lib/config/env";

const base = env.apiBase.checklist;

export const CHECKLIST_API = {
    LIST: `${base}`,
};
