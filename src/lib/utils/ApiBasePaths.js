export const BASE_CONFIG = {
    backend: process.env.REACT_APP_BACKEND_BASE_PATH,
};

export const API_BASE_PATHS = {
    production: {
        cdrList: `${BASE_CONFIG.backend}/api/cdr`,
        project: `${BASE_CONFIG.backend}/projects`,
        asset: `${BASE_CONFIG.backend}/assets`,
        checklist: `${BASE_CONFIG.backend}/checklist`,
        checklistResult: `${BASE_CONFIG.backend}/assets/checklist-results`,
        users: `${BASE_CONFIG.backend}/users`,
        permissions: `${BASE_CONFIG.backend}/rbac/permissions`,
        roles: `${BASE_CONFIG.backend}/rbac/roles`,
        utils: `${BASE_CONFIG.backend}/utils`,
        cwe: `${BASE_CONFIG.backend}/cwe`,
    },
    development: {
        cdrList: `${BASE_CONFIG.backend}/api/cdr`,
        project: `${BASE_CONFIG.backend}/projects`,
    },
};
