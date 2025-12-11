

// const useHasPermission = () => {
//     const { getCurrentUser } = useAuth();
//     const roles = getCurrentUser?.data?.user?.roles || [];

//     const hasPermission = (resource, action) => {
//         const isAdmin = roles.some((role) => role.type === "admin");
//         if (isAdmin) return true; // Admin always allowed

//         // Normalize action string (trim and lowercase)
//         const actionStr = action?.toLowerCase().trim() || "";

//         // Helper function: checks if the user has permission for a specific action
//         const hasSingleActionPermission = (act) => {
//             for (const role of roles) {
//                 const permissions = role.permissions || [];

//                 // Grant full access if manage permission exists for the resource
//                 const hasManage = permissions.some((perm) => perm.resource === resource && perm.action === "manage" && perm.isActive);
//                 if (hasManage) return true;

//                 // Check specific action permission
//                 const hasAction = permissions.some((perm) => perm.resource === resource && perm.action === act && perm.isActive);
//                 if (hasAction) return true;
//             }
//             return false;
//         };

//         // Handle multiple actions using '|' (OR) or '&' (AND)
//         if (actionStr.includes("|")) {
//             const actions = actionStr.split("|").map((a) => a.trim());
//             return actions.some((a) => hasSingleActionPermission(a)); // OR condition
//         }

//         if (actionStr.includes("&")) {
//             const actions = actionStr.split("&").map((a) => a.trim());
//             return actions.every((a) => hasSingleActionPermission(a)); // AND condition
//         }

//         // Single action
//         return hasSingleActionPermission(actionStr);
//     };

//     return { hasPermission };
// };

// export default useHasPermission;
