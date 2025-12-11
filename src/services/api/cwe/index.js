import cweApiClient from "./config";

class CweApiService {
    static async create(payload, signal) {
        const response = await cweApiClient.post("/", payload, {
            signal,
        });
        return response.data;
    }

    static async upload(payload, signal) {
        const response = await cweApiClient.post("/upload", payload, {
            signal,
        });
        return response.data;
    }

    static async getStats(params, signal) {
        const response = await cweApiClient.get("/stats", {
            signal,
            params,
        });
        return response.data;
    }

    static async list(params, signal) {
        const response = await cweApiClient.get("/", {
            params,
            signal,
        });
        return response.data;
    }

    static async details(id, signal) {
        const response = await cweApiClient.get("/" + id, {
            signal,
        });
        return response.data;
    }

    static async getDropDownList(params, signal) {
        const response = await cweApiClient.get("/dropdown", {
            signal,
            params,
        });
        return response.data;
    }

    static async update(id, payload, signal) {
        const response = await cweApiClient.patch("/" + id, payload, {
            signal,
        });
        return response.data;
    }

    static async delete(id, signal) {
        const response = await cweApiClient.delete("/" + id, {
            signal,
        });
        return response.data;
    }
}

export default CweApiService;
