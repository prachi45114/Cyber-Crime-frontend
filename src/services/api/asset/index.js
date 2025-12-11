import assetApiClient from "./config";

class AssetApiService {
    static async create(payload, signal) {
        const response = await assetApiClient.post("/", payload, {
            signal,
        });
        return response.data;
    }

    static async list(params, signal) {
        const response = await assetApiClient.get("/", {
            params,
            signal,
        });
        return response.data;
    }

    static async details(id, signal) {
        const response = await assetApiClient.get("/" + id, {
            signal,
        });
        return response.data;
    }

    static async getDropDownList(params, signal) {
        const response = await assetApiClient.get("/dropdown-list", {
            signal,
            params,
        });
        return response.data;
    }

    static async update(id, payload, signal) {
        const response = await assetApiClient.patch("/" + id, payload, {
            signal,
        });
        return response.data;
    }

    static async delete(id, signal) {
        const response = await assetApiClient.delete("/" + id, {
            signal,
        });
        return response.data;
    }

    static async requestForApproval(id, payload, signal) {
        const response = await assetApiClient.patch(`/${id}/approval`, payload, {
            signal,
        });
        return response.data;
    }

    static async requestForReview(id, payload, signal) {
        const response = await assetApiClient.patch(`/${id}/review`, payload, {
            signal,
        });
        return response.data;
    }

    static async createChecklistResult(payload, signal) {
        const response = await assetApiClient.post(`/checklist-results`, payload, {
            signal,
        });
        return response.data;
    }

    static async updateChecklistResult(id, payload, signal) {
        const response = await assetApiClient.patch(`/checklist-results/${id}`, payload, {
            signal,
        });
        return response.data;
    }

    static async deleteChecklistResult(id, signal) {
        const response = await assetApiClient.delete(`/checklist-results/${id}`, {
            signal,
        });
        return response.data;
    }

    static async uploadChecklistResultFile(payload, signal) {
        const response = await assetApiClient.post(`/checklist-results/upload-file`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            signal,
        });
        return response.data;
    }

    static async getChecklistWithResult(assetId, params, signal) {
        const response = await assetApiClient.get(`/checklist-results/asset/${assetId}`, {
            params,
            signal,
        });
        return response.data;
    }

    static async getChecklistWithResultPhases(assetId, signal) {
        const response = await assetApiClient.get(`/checklist-results/asset/${assetId}/phases`, {
            signal,
        });
        return response.data;
    }

    static async getChecklistItemsStatsCount(assetId, phaseId, signal) {
        const response = await assetApiClient.get(`/checklist-results/asset/${assetId}/phase/${phaseId}/status-counts`, {
            signal,
        });
        return response.data;
    }

    static async getChecklistItemDetail(assetId, phaseId, checklistId, signal) {
        const response = await assetApiClient.get(`/checklist-results/asset/${assetId}/phase/${phaseId}/checklist/${checklistId}`, {
            signal,
        });
        return response.data;
    }

    static async getAssetChecklistStats(assetId, params, signal) {
        const response = await assetApiClient.get(`/checklist-results/asset/${assetId}/stats`, {
            params,
            signal,
        });
        return response.data;
    }

    static async generateAssetChecklistReport(assetId, params, signal = undefined) {
        const response = await assetApiClient.get(`/checklist-results/report/asset/${assetId}`, {
            params,
            responseType: "blob",
            signal,
        });
        return response.data;
    }

    static async generateProjectReport(payload, signal = undefined) {
        // Extract responseType from payload if present and add as query param
        const { responseType, ...restPayload } = payload || {};
        const config = {
            responseType: "blob",
            signal,
        };
        
        // If responseType is provided, add it as a query parameter
        if (responseType) {
            config.params = { responseType };
        }
        
        const response = await assetApiClient.post(`/checklist-results/report/project`, restPayload, config);
        return response.data;
    }

    static async getStepsToReproduceImage(checklistId, fileKey, signal = undefined) {
        const response = await assetApiClient.get(`/checklist-results/${checklistId}/file/${fileKey}`, {
            responseType: "blob",
            signal,
        });
        return response.data;
    }

    static async getApprovalHistory(assetId, params, signal = undefined) {
        const response = await assetApiClient.get(`/${assetId}/approval/history`, {
            params,
        });
        return response.data;
    }

    static async getReviewHistory(assetId, params, signal = undefined) {
        const response = await assetApiClient.get(`/${assetId}/review/history`, {
            params,
        });
        return response.data;
    }

    static async uploadReport(id, payload, signal) {
        const response = await assetApiClient.post(`/${id}/upload-report`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            signal,
        });
        return response.data;
    }

    static async submitReport(id, payload, signal) {
        const response = await assetApiClient.patch(`/${id}/report`, payload, {
            signal,
        });
        return response.data;
    }

    static async createChecklistDuplicateResult(assetId, phaseNumber, payload, signal) {
        const response = await assetApiClient.post(`/checklist-results/asset/${assetId}/duplicate-phase?phase=${phaseNumber}`, payload, { signal });
        return response.data;
    }

    static async deleteChecklistResultPhase(assetId, phaseNumber, signal) {
        const response = await assetApiClient.delete(`/checklist-results/asset/${assetId}/phase/${phaseNumber}`, {
            signal,
        });
        return response.data;
    }
}

export default AssetApiService;
