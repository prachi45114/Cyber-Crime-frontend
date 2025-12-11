import { API_BASE_PATHS, BASE_CONFIG } from "@/lib/utils/ApiBasePaths";

const allowedEnvs = ["production", "development"];
const rawEnv = process.env.NODE_ENV?.toLowerCase();
const NODE_ENV = allowedEnvs.includes(rawEnv) ? rawEnv : "development";

if (!allowedEnvs.includes(NODE_ENV)) {
    throw new Error(`Invalid NODE_ENV "${rawEnv}". Allowed values are: ${allowedEnvs.join(", ")}`);
}

const isProduction = NODE_ENV === "production" || localStorage.getItem("accessToken");
const isDevelopment = NODE_ENV === "development" && !localStorage.getItem("accessToken");

const apiBase = API_BASE_PATHS[isProduction ? "production" : "development"];

const env = {
    NODE_ENV,
    isProduction,
    isDevelopment,
    apiBase: {
        ...apiBase,
        backend: BASE_CONFIG.backend,
    },
};

export { env };
