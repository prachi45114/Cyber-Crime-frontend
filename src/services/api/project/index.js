import projectApiClient from "./config";

class ProjectApiService {
    static async create(payload, signal) {
        const response = await projectApiClient.post("/", payload, {
            signal,
        });
        return response.data;
    }

    static async details(id, signal) {
        const response = await projectApiClient.get("/" + id, {
            signal,
        });
        return response.data;
    }

    static async getList(params, signal) {
        const response = await projectApiClient.get("/", {
            signal,
            params,
        });
        return response.data;
    }

    static async getDropDownList(params, signal) {
        const response = await projectApiClient.get("/dropdown-list", {
            signal,
            params,
        });
        return response.data;
    }

    static async getProjectMembers(id, signal) {
        const response = await projectApiClient.get(`/${id}/project-members`, {
            signal,
        });
        return response.data;
    }

    static async update(id, payload, signal) {
        const response = await projectApiClient.patch("/" + id, payload, {
            signal,
        });
        return response.data;
    }

    static async uploadFile(id, payload, signal) {
        const response = await projectApiClient.post(`/${id}/files`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            signal,
        });
        return response.data;
    }

    static async downloadFile(id, fileId, signal = null) {
        const response = await projectApiClient.get(`/${id}/files/${fileId}/download`, {
            signal,
            responseType: "blob",
        });
        return response.data;
    }

    static async deleteFile(id, fileId, signal = null) {
        const response = await projectApiClient.delete(`/${id}/files/${fileId}`, {
            signal,
        });
        return response.data;
    }

    static async delete(id, signal) {
        const response = await projectApiClient.delete("/" + id, {
            signal,
        });
        return response.data;
    }
}

export default ProjectApiService;
