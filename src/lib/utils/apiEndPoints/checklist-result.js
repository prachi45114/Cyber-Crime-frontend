import { env } from "@/lib/config/env";

const base = env.apiBase.checklistResult;

export const CHECLIST_RESULT_API = {
    LIST: (assetId, params = "") => `${base}/asset/${assetId}${params}`,
    GET: (assetId, phaseId, id) => `${base}/asset/${assetId}/phase/${phaseId}/checklist/${id}`,
    GET_FILE: (checklistId, key) => `${base}/${checklistId}/file/${key}`,
};
