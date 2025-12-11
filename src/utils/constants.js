//  To see the constant file in soc.

export const constants = {
    API_BASE_URL: process.env.REACT_APP_BACKEND_API_BASE_URL,
    // ASSET_DEV_API_BASE_URL: process.env.NODE_ENV === "production" ? "/api/v1" : process.env.REACT_APP_ASSET_BACKEND_API_BASE_URL + "/api/v1",
    DEV_API_BASE_URL: "http://172.26.234.71:30764",
    LOG_DEV_API_BASE_URL: "http://172.26.234.71:30764",

    THEME: {
        LIGHT: "light",
        DARK: "dark",
    },

    API_URLS: {
        // USER_LIST: `${process.env.REACT_APP_BACKEND_API_BASE_URL}/api/users/analystList`,
        USER_LIST: `${process.env.REACT_APP_BACKEND_API_BASE_URL}/api/soc/getUsers`,
        CURRENT_USER: `${process.env.REACT_APP_BACKEND_API_BASE_URL}/api/soc/get-current-user`,
    },
    // VULNERABILITY: {
    //     BASE_URL: process.env.NODE_ENV != "production" ? `${process.env.REACT_APP_BACKEND_API_BASE_URL}/api/vuln` : `${process.env.REACT_APP_BACKEND_API_BASE_URL}/api/vuln`,
    //     LIST: "/vulnerabilities",
    //     DETAILS: "/vulnerability/",
    //     DASHBOARD: "/vulnerabilities/dashboard",
    //     TRENDS: "/vulnerabilities/trend",
    //     UPDATE: "/vulnerabilities/status/",
    //     AGENT_VULNERABILITY_LIST: "/agentvulnerabilities",
    //     AGENT_VULNERABILITY_DETAILS: "/agentvulnerability/",
    //     UPDATE_IN_BULK: "/vulnerabilities/status/bulk",
    //     // Manual Assessments API endpoints relative to BASE_URL:
    //     GET_MANUAL_ASSESSMENTS_STATS: "/manual-assessments/stats",
    //     GET_MANUAL_ASSESSMENTS: "/manual-assessments",
    //     GET_MANUAL_ASSESSMENT_DETAILS: (id) => `/manual-assessments/${id}`,
    //     ADD_MANUAL_ASSESSMENT: "/manual-assessments",
    //     UPDATE_MANUAL_ASSESSMENT: (id) => `/manual-assessments/${id}`,
    //     DELETE_MANUAL_ASSESSMENT: (id) => `/manual-assessments/${id}`,
    //     UPLOAD_FILE: "/files/upload",
    //     GET_FILE: (fileName) => `/files/download/${fileName}`,
    //     DELETE_FILE: (fileName) => `/files/${fileName}`,
    // },
    app: {
        configParameters: {
            rotate: { min: -90, max: 90 },
            align: { options: { left: "left", center: "center", right: "right" } },
            verticalAlign: { options: { top: "top", middle: "middle", bottom: "bottom" } },
            position: {
                options: [
                    "left",
                    "right",
                    "top",
                    "bottom",
                    "inside",
                    "insideTop",
                    "insideLeft",
                    "insideRight",
                    "insideBottom",
                    "insideTopLeft",
                    "insideTopRight",
                    "insideBottomLeft",
                    "insideBottomRight",
                ],
            },
            distance: { min: 0, max: 100 },
        },
        config: {
            rotate: 90,
            align: "left",
            verticalAlign: "middle",
            position: "insideBottom",
            distance: 15,
            onChange: null,
        },
    },

    HTTP_STATUS_CODES: {
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
    },
    MODULES: {
        VULNERABILITY: "VULNERABILITY",
        USER_MANAGEMENT: "USER_MANAGEMENT",
        ROLE_MANAGEMENT: "ROLE_MANAGEMENT",
        PERMISSION_MANAGEMENT: "PERMISSION_MANAGEMENT",
    },
    ROLES: {
        MEMBER: "member",
        ADMIN: "admin",
        MANAGEMEMT: "management",
    },

    ASSET_STATUS: {
        active: "Active",
        inactive: "Inactive",
        under_testing: "Under Testing",
        completed: "Completed",
    },

    ASSET_PRIORITY: {
        low: "Low",
        medium: "Medium",
        high: "High",
        critical: "Critical",
    },

    APPROVAL_STATUS: {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
    },
};
