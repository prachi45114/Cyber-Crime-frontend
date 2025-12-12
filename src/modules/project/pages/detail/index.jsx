import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { Calendar, CheckCircle2, Clock, FileText, Plus, RefreshCcw, Tag, Circle, LayoutGrid, Package, Edit2, Save, X, AlertCircle, Info, Home, Folder, Trash } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Tabs from "@/components/Tab";



export default function ProjectDetail() {
    const { projectId } = useParams();
    const { projectDetails, projectUpdation, projectDeletion } = useProject();
    const { getCurrentUser } = useAuth();
    const { hasPermission } = useHasPermission();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // Check permission for editing
    const canEditProject = hasPermission("projects", "update|manage");

    const isAdmin = getCurrentUser?.data?.user?.roles?.some((role) => role.type === "admin") ?? false;

    // Fetch project details on mount
    useEffect(() => {
        projectDetails?.fetch({ id: projectId });
    }, [projectId]);

    const project = projectDetails?.data;

    const handleOnSuccess = useCallback(() => {
        projectDetails?.fetch({ id: projectId });
    }, [projectId]);

    const handleFieldUpdate = useCallback(
        (field, value) => {
            projectUpdation.execute({
                id: projectId,
                payload: { [field]: value },
                onSuccess: handleOnSuccess,
            });
        },
        [projectId, projectUpdation, handleOnSuccess]
    );

    const handleDelete = async () => {
        await projectDeletion.execute({ id: projectId });
        navigate("/project");
    };

    // ============================================================================
    // TABS CONFIGURATION
    // ============================================================================

    const tabsConfig = useMemo(
        () => [
            {
                id: 1,
                label: "Overview",
                icon: <LayoutGrid className="w-5 h-5" />,
                content: <ProjectDetailOverview project={project} />,
            },
            {
                id: 2,
                label: "Assets",
                icon: <Package className="w-5 h-5" />,
                // content: <Assets project={project} />,
            },
        ],
        [project]
    );

    const breadcrumbItems = [
        {
            label: "Home",
            href: "/",
            icon: <Home className="h-4 w-4" />,
        },
        {
            label: "Projects",
            href: "/project",
            icon: <Folder className="h-4 w-4" />,
        },
    ];

    return (
        <div className="max-w-full space-y-3">
            <Breadcrumb items={breadcrumbItems} currentPage={project.name} />
            {/* Header Section */}
            <div className="flex items-start justify-between pt-3">
                <div className="flex-1">
                    <EditableTitle label="" value={project.name} onSave={(value) => handleFieldUpdate("name", value)} placeholder="Project Name" canEdit={canEditProject} />
                    <p className="text-sm text-gray-500 mt-2 ml-0 dark:text-[#858585]">Manage and track your project progress and deliverables</p>
                </div>
                {isAdmin && (
                    <div>
                        <Button onClick={() => setOpen(true)} className="bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700">
                            <Trash className="w-2 h-2" /> Delete Project
                        </Button>

                        <DeleteConfirmModal isOpen={open} onClose={() => setOpen(false)} onConfirm={handleDelete} resourceName={project?.name} />
                    </div>
                )}
            </div>

            {/* Tabs */}
            <Tabs tabs={tabsConfig} variant="underline" persistTabInUrl={true} />
        </div>
    );
}
