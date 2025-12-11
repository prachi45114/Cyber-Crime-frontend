import apiConstants from "./constants";

class ApiUtils {
    static getAuthToken() {
        return localStorage.getItem(apiConstants.AUTH_TOKEN_KEY) || undefined;
    }

    static async storeAuthToken(token) {
        await localStorage.setItem(apiConstants.AUTH_TOKEN_KEY, token);
        return true;
    }
    static getFormatedDate = (dateString) => {
        if (!dateString) {
            return "";
        }
        const dateObj = new Date(dateString);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let day = dateObj.getDate();
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();

        if (day < 10) {
            day = "0" + day;
        }
        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate;
    };

    static getFormatedDateTime = (dateString) => {
        if (!dateString) {
            return "";
        }
        const dateObj = new Date(dateString);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();

        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };
}
export default ApiUtils;
