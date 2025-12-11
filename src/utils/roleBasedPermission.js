import { constants } from "./constants";

const ROLES = constants.ROLES;
const permission = {
    VULNERABILITY: {
        VIEW: [ROLES.CASE_ANALYST, ROLES.ADMINISTRATOR],
        CREATE: [ROLES.CASE_ANALYST, ROLES.ADMINISTRATOR],
        EDIT: [ROLES.CASE_ANALYST, ROLES.ADMINISTRATOR],
        DELETE: [ROLES.CASE_ANALYST, ROLES.ADMINISTRATOR],
    },
};

export default permission;
