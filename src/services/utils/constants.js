const apiConstants = {
    BACKEND_API_BASE_URL: `${process.env.REACT_APP_BACKEND_BASE_PATH}`,
    AUTH_TOKEN_KEY: "auth_token",
    cdrRecord: {
        BASE_ROUTE: "/api/cdr",
    },
    project: {
        BASE_ROUTE: "/projects",
    },
    dashboard: {
        BASE_ROUTE: "/dashboard",
    },
    charts: {
        BASE_ROUTE: "/charts",
    },
    route: {
        BASE_ROUTE: "/route",
    },
    loadingStateKeys: {
        GET_STATS_DASHBOARD: "getStatsDashboard",
        GET_LIST_CDR: "getListCdr",
        DELETE_BULK_SBOM: "deleteBulkSbom",
        BULK_FILE_UPLOAD: "bulkFileUpload",
        GET_DROPDOWN_LIST_PROJECT: "getDropdownListProject",
        GET_PROJECT_MEMBERS: "getProjectMembers",
        GET_LIST_PROJECT: "getListProject",
        CREATE_PROJECT: "createProject",
        DETAILS_PROJECT: "detailsProject",
        UPDATE_PROJECT: "updateProject",
    },
};
export default apiConstants;
