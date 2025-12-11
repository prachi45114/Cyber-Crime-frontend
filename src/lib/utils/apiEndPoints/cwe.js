import { env } from "@/lib/config/env";

const base = env.apiBase.cwe;

export const CWE_API = {
    LIST: `${base}`,
};