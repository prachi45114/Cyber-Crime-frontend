import { env } from "@/lib/config/env";

const base = env.apiBase.cdrList;

export const CDRLIST_API = {
    LIST: `${base}`,
};