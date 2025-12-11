import chartsApiClient from "./config";

class ChartsApiService {
    static async getChartsData(params, signal) {
        const response = await chartsApiClient.get(`/${params.module}`, {
            signal,
        });
        return response.data;
    }
}

export default ChartsApiService;
