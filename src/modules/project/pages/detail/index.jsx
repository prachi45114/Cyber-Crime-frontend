import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { Calendar, CheckCircle2, Clock, FileText, Plus, RefreshCcw, Tag, Circle, LayoutGrid, Package, Edit2, Save, X, AlertCircle, Info, Home, Folder, Trash } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Tabs from "@/components/Tab";
import Attachments from "./components/Attachments";
import Members from "./components/Members";
import ProjectDetailOverview from "./components/ProjectDetailOverview";
// import Assets from "@/modules/assets";
import { useProject } from "@/services/context/project";
import { Breadcrumb } from "@/components/Breadcrumb";
import useHasPermission from "@/lib/hooks/useHasPermission";
import DeleteConfirmModal from "@/components/DeleteConfirmationDialog";

const EditableTitle = ({ label, value, icon: Icon, onSave, placeholder = "Add...", multiline = false, canEdit = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const handleSave = () => {
        onSave(tempValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
    };

    // If user cannot edit, show static title only
    if (!canEdit) {
        return (
            <div className="mr-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:text-[#cccccc]">{value || placeholder}</h1>
            </div>
        );
    }

    return (
        <div className="mr-4">
            {isEditing ? (
                <div className="flex items-center gap-3">
                    <input
                        type={multiline ? "textarea" : "text"}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        placeholder={placeholder}
                        autoFocus
                        className="text-2xl font-bold text-gray-900 dark:text-[#cccccc] border-b-2 border-orange-500 dark:border-orange-500 focus:outline-none bg-transparent flex-1"
                    />
                    <Button
                        size="sm"
                        onClick={handleSave}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-lg shadow-orange-200"
                    >
                        <Save className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel} className="border-gray-300">
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setIsEditing(true)}>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:text-[#cccccc]">{tempValue || placeholder}</h1>
                    <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 hover:bg-orange-50 rounded-lg">
                        <Edit2 className="w-4 h-4 text-orange-500" />
                    </button>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

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
