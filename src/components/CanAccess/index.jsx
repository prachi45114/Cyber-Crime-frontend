import React from "react";
import useHasPermission from "@/lib/hooks/useHasPermission";
import AccessDenied from "../AccessDenied";

const CanAccess = ({ children, resource, action, hideDenied = false, ...restProps }) => {
    const { hasPermission } = useHasPermission();
    const isAuthorized = hasPermission(resource, action);

    if (!isAuthorized && hideDenied) return null;

    return <div {...restProps}>{isAuthorized ? children : <AccessDenied />}</div>;
};

export default CanAccess;
