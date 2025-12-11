import { env } from "@/lib/config/env";

const base = env.apiBase.project;

export const PROJECT_API = {
    LIST: `${base}`,
};
