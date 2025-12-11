import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams } from "react-router";
import {
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Plus,
    RefreshCcw,
    Tag,
    Circle,
    LayoutGrid,
    Package,
    Edit2,
    Save,
    X,
    AlertCircle,
    Info,
    User,
    Mail,
    Phone,
    Image,
    Upload,
    Trash2,
    Shield,
    Download,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Tabs from "@/components/Tab";
import { useProject } from "@/services/context/project";
import Attachments from "./Attachments";
import Members from "./Members";
import { SectionHeader } from "@/components/ui/heading";
import { useFormValidation, VALIDATION_SCHEMAS } from "@/hooks/useFormValidation";
import FormField, { ValidationSummary } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import ProjectApiService from "@/services/api/project";

// ============================================================================
// CONSTANTS & CONFIGURATIONS
// ============================================================================

const STATUS_CONFIG = {
    in_progress: {
        color: "text-blue-500 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-950/50",
        label: "In Progress",
        icon: RefreshCcw,
    },
    completed: {
        color: "text-green-500 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-950/50",
        label: "Completed",
        icon: CheckCircle2,
    },
    cancelled: {
        color: "text-red-500 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-950/50",
        label: "Cancelled",
        icon: AlertCircle,
    },
};

const PRIORITY_CONFIG = {
    high: {
        label: "High",
        class: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800",
    },
    medium: {
        label: "Medium",
        class: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800",
    },
    low: {
        label: "Low",
        class: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800",
    },
};

const STATUS_OPTIONS = [
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

const PRIORITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
};

// ============================================================================
// EDITABLE FIELD COMPONENTS
// ============================================================================

const EditableTextField = ({ label, value, icon: Icon, onSave, placeholder = "Add...", multiline = false, canEdit = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    useEffect(() => setTempValue(value), [value]);

    const handleSave = () => {
        onSave(tempValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
    };

    const InputComponent = multiline ? "textarea" : "input";
    const inputProps = multiline
        ? {
              className:
                  "min-h-[100px] resize-none rounded-lg border-2 border-gray-200 dark:border-[#3e3e42] dark:bg-[#1e1e1e] dark:text-[#cccccc] focus:border-orange-400 dark:focus:border-orange-500 transition-colors px-3 py-2 text-sm w-full",
              rows: 4,
          }
        : {
              className:
                  "h-10 rounded-lg border-2 border-gray-200 dark:border-[#3e3e42] dark:bg-[#1e1e1e] dark:text-[#cccccc] focus:border-orange-400 dark:focus:border-orange-500 transition-colors px-3 py-2 text-sm w-full",
              type: "text",
          };

    // View-only mode (no permission)
    if (!canEdit) {
        return (
            <div className="space-y-2">
                <div className="p-3 min-h-[44px] text-sm text-gray-700 dark:text-[#cccccc] whitespace-pre-wrap border-2 border-transparent">
                    {value || <span className="text-gray-400 dark:text-[#858585]">{placeholder}</span>}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {isEditing ? (
                <div className="space-y-2">
                    <InputComponent value={tempValue} onChange={(e) => setTempValue(e.target.value)} placeholder={placeholder} autoFocus {...inputProps} />
                    <div className="flex items-center justify-end gap-2">
                        <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                            <Save className="w-3.5 h-3.5 mr-1.5" /> Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel} className="border-gray-300 dark:border-[#3e3e42] hover:bg-gray-50 dark:hover:bg-[#2a2d2e] dark:text-[#cccccc]">
                            <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => setIsEditing(true)}
                    className="group cursor-pointer rounded-lg border-2 border-transparent hover:border-gray-200 dark:hover:border-[#3e3e42] transition-all p-3 min-h-[44px] flex items-start"
                >
                    {value ? (
                        <p className="text-sm text-gray-700 dark:text-[#cccccc] flex-1 whitespace-pre-wrap">{value}</p>
                    ) : (
                        <p className="text-sm text-gray-400 dark:text-[#858585] flex-1">{placeholder}</p>
                    )}
                    <Edit2 className="w-4 h-4 text-orange-500 dark:text-[#f48771] opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0 mt-0.5" />
                </div>
            )}
        </div>
    );
};

const EditableSelectField = ({ label, value, icon: Icon, onSave, options, renderValue, canEdit = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    useEffect(() => setTempValue(value), [value]);

    const handleSave = () => {
        onSave(tempValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
    };

    if (!canEdit) {
        return (
            <div className="flex items-center gap-3">
                {Icon && <Icon className="w-4 h-4 text-gray-400 dark:text-[#858585]" />}
                <span className="text-sm text-gray-500 dark:text-[#858585] min-w-[80px]">{label}</span>
                {renderValue(value)}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {Icon && <Icon className="w-[15px] h-[15px] text-gray-400 dark:text-[#858585]" />}
            <span className="text-sm text-gray-700 dark:text-[#cccccc] min-w-[80px]">{label}</span>

            {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                    <select
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="h-9 rounded-lg border-2 border-gray-200 dark:border-[#3e3e42] dark:bg-[#1e1e1e] dark:text-[#cccccc] focus:border-orange-400 dark:focus:border-orange-500 transition-colors px-2 text-sm flex-1 max-w-[200px]"
                        autoFocus
                    >
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white h-9 px-3">
                        <Save className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel} className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300 h-9 px-3">
                        <X className="w-3.5 h-3.5" />
                    </Button>
                </div>
            ) : (
                <div onClick={() => setIsEditing(true)} className="group cursor-pointer flex items-center gap-2 flex-1">
                    {renderValue(value)}
                    <Edit2 className="w-3.5 h-3.5 text-orange-500 dark:text-[#f48771] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}
        </div>
    );
};

const EditableDateField = ({ label, value, icon: Icon, onSave, canEdit = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(formatDateForInput(value));

    useEffect(() => setTempValue(formatDateForInput(value)), [value]);

    const handleSave = () => {
        onSave(tempValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(formatDateForInput(value));
        setIsEditing(false);
    };

    if (!canEdit) {
        return (
            <div className="flex items-center gap-3">
                {Icon && <Icon className="w-4 h-4 text-gray-400 dark:text-[#858585]" />}
                <span className="text-sm text-gray-500 dark:text-[#858585] min-w-[80px]">{label}</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{formatDate(value)}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {Icon && <Icon className="w-4 h-4 text-gray-400 dark:text-[#858585]" />}
            <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[80px]">{label}</span>

            {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                    <input
                        type="date"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="h-9 rounded-lg border-2 border-gray-200 dark:border-[#3e3e42] dark:bg-[#1e1e1e] dark:text-[#cccccc] focus:border-orange-400 dark:focus:border-orange-500 transition-colors px-2 text-sm max-w-[200px] dark:[color-scheme:dark]"
                        autoFocus
                    />
                    <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white h-9 px-3">
                        <Save className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel} className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300 h-9 px-3">
                        <X className="w-3.5 h-3.5" />
                    </Button>
                </div>
            ) : (
                <div onClick={() => setIsEditing(true)} className="group cursor-pointer flex items-center gap-2 flex-1">
                    <span className="text-sm text-gray-700 dark:text-[#cccccc]">{formatDate(value)}</span>
                    <Edit2 className="w-3.5 h-3.5 text-orange-500 dark:text-[#f48771] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}
        </div>
    );
};

const EditableProjectManagerField = ({ label, value, managerName, icon: Icon, onSave, options, canEdit = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    useEffect(() => setTempValue(value), [value]);

    const handleSave = () => {
        onSave(tempValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
    };

    if (!canEdit) {
        return (
            <div className="flex items-center gap-3">
                {Icon && <Icon className="w-4 h-4 text-gray-400 dark:text-[#858585]" />}
                <span className="text-sm text-gray-500 dark:text-[#858585] min-w-[80px]">{label}</span>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 flex items-center justify-center text-xs font-semibold">
                        {managerName ? managerName.charAt(0).toUpperCase() : "?"}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-[#cccccc]">{managerName || "Not assigned"}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {Icon && <Icon className="w-4 h-4 text-gray-400 dark:text-[#858585]" />}
            <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[80px]">{label}</span>

            {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                    <select
                        value={tempValue || ""}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="h-9 rounded-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-orange-400 dark:focus:border-orange-500 transition-colors px-2 text-sm flex-1 max-w-[250px]"
                        autoFocus
                    >
                        <option value="">No Manager</option>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white h-9 px-3">
                        <Save className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel} className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300 h-9 px-3">
                        <X className="w-3.5 h-3.5" />
                    </Button>
                </div>
            ) : (
                <div onClick={() => setIsEditing(true)} className="group cursor-pointer flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 flex items-center justify-center text-xs font-semibold">
                            {managerName ? managerName.charAt(0).toUpperCase() : "?"}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-[#cccccc]">{managerName || "Not assigned"}</span>
                    </div>
                    <Edit2 className="w-3.5 h-3.5 text-orange-500 dark:text-[#f48771] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}
        </div>
    );
};

// Logo Upload Component
const LogoUpload = ({ project, onLogoUpload, onLogoDelete, canEdit }) => {
    const [logoPreview, setLogoPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (project?.logo) {
            getLogoFileUrl();
        } else {
            setLogoPreview(null);
        }

        // Cleanup function to revoke blob URLs when component unmounts or logo changes
        return () => {
            if (logoPreview && logoPreview.startsWith("blob:")) {
                window.URL.revokeObjectURL(logoPreview);
            }
        };
    }, [project?.id, project?.logo]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                alert("Please select an image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File size should be less than 5MB");
                return;
            }

            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = "";
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("description", "project__logo");

            // Upload logo using the same API as attachments
            if (onLogoUpload) {
                await onLogoUpload(formData);
                // Clear the FileReader preview - will be replaced by blob from server after refetch
                if (logoPreview && logoPreview.startsWith("data:")) {
                    setLogoPreview(null);
                }
                setSelectedFile(null);
            }
        } catch (error) {
            console.error("Logo upload failed:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setLogoPreview(null);
        setSelectedFile(null);
        if (project?.logo && onLogoDelete) {
            onLogoDelete();
        }
    };

    const handleFileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleLogoDownload = async () => {
        if (!project?.logo) return;
        try {
            const fileBlob = await ProjectApiService.downloadFile(project.id, "logo");
            const url = window.URL.createObjectURL(fileBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = project.logo.originalName || "project-logo";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    const getLogoFileUrl = async () => {
        if (!project?.id) return;
        try {
            const fileBlob = await ProjectApiService.downloadFile(project.id, "logo");
            setLogoPreview(window.URL.createObjectURL(fileBlob));
        } catch (err) {
            console.error("Download failed", err);
            setLogoPreview(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Current Logo or Preview */}
            {(project?.logo || selectedFile) && (
                <div className="flex items-center justify-center w-full">
                    <div className="relative group">
                        <div className="w-[120px] h-[120px] rounded-xl border-2 border-gray-200 dark:border-[#3e3e42] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1e1e1e] dark:to-[#252526] overflow-hidden flex items-center justify-center shadow-lg">
                            {logoPreview ? <img src={logoPreview} alt="Project Logo" className="w-full h-full object-cover" /> : <Image className="w-12 h-12 text-gray-400 dark:text-[#858585]" />}
                        </div>
                        {canEdit && selectedFile && (
                            <div className="absolute inset-0 bg-black/60 dark:bg-black/70 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center gap-2 transition-opacity">
                                <Button size="sm" onClick={handleUpload} disabled={isUploading} className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
                                    {isUploading ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                </Button>
                                <Button size="sm" onClick={handleRemove} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white shadow-lg">
                                    <X className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
                {canEdit && (
                    <>
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                        <Button
                            variant="outline"
                            onClick={handleFileInputClick}
                            className="w-full border-dashed border-2 border-gray-300 dark:border-[#3e3e42] hover:border-orange-400 dark:hover:border-[#ff9f43] hover:bg-orange-50 dark:hover:bg-[#2a2d2e] transition-colors"
                        >
                            <Upload className="w-4 h-4 mr-2 text-orange-500 dark:text-[#ff9f43]" />
                            {selectedFile ? "Change Logo" : project?.logo ? "Replace Logo" : "Upload Logo"}
                        </Button>
                    </>
                )}

                {project?.logo && !selectedFile && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleLogoDownload}
                            className="flex-1 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/20"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                        {canEdit && (
                            <Button
                                variant="outline"
                                onClick={handleRemove}
                                className="flex-1 border-red-200 dark:border-red-800 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                            </Button>
                        )}
                    </div>
                )}

                {canEdit && <p className="text-xs text-center text-gray-500 dark:text-[#858585] px-2">Recommended: Square image (120x120px), max 5MB</p>}
            </div>
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProjectDetailOverview({ project }) {
    const { projectId } = useParams();
    const { hasPermission } = useHasPermission();
    const canEdit = hasPermission("projects", "update|manage");

    const { projectDetails, projectFileUpload, projectUpdation, projectFileDeletion } = useProject();
    const { usersDropdownList } = useUsers();
    const { getCurrentUser } = useAuth();

    // Check if current user is admin
    const isAdmin = getCurrentUser?.data?.user?.roles?.some((role) => role.type === "admin") ?? false;
    const isMember = getCurrentUser?.data?.user?.roles?.some((role) => role.type === "member") ?? false;

    useEffect(() => {
        if (!isMember) {
            usersDropdownList?.fetch({});
        }
    }, [isMember]);

    const handleOnSuccess = useCallback(() => {
        projectDetails?.fetch({ id: projectId });
    }, [projectId]);

    const handleFileUpload = useCallback(
        (files) => {
            projectFileUpload.execute({
                id: projectId,
                payload: files,
                onSuccess: handleOnSuccess,
            });
        },
        [projectId, projectFileUpload, handleOnSuccess]
    );

    const handleFileDelete = useCallback(
        (fileId) => {
            projectFileDeletion.execute({
                id: projectId,
                fileId,
                onSuccess: handleOnSuccess,
            });
        },
        [projectId, projectFileUpload, handleOnSuccess]
    );

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

    const handleOnInvite = useCallback(
        (newMembers) => {
            const existingMemberIds = project?.projectMembers?.map((m) => m.id) || [];
            const newMemberIds = newMembers.map((m) => m.id);
            projectUpdation.execute({
                id: projectId,
                payload: { memberIds: [...new Set([...existingMemberIds, ...newMemberIds])] },
                onSuccess: handleOnSuccess,
            });
        },
        [project, projectId, projectUpdation, handleOnSuccess]
    );

    const handleOnRemove = useCallback(
        (removedMember) => {
            const updatedIds = project?.projectMembers?.filter((m) => m.id !== removedMember.id)?.map((m) => m.id) || [];
            projectUpdation.execute({
                id: projectId,
                payload: { memberIds: updatedIds },
                onSuccess: handleOnSuccess,
            });
        },
        [project, projectId, projectUpdation, handleOnSuccess]
    );

    const handleLogoUpload = useCallback(
        async (formData) => {
            try {
                // Upload logo using the same API as attachments
                projectFileUpload.execute({
                    id: projectId,
                    payload: formData,
                    onSuccess: (uploadResponse) => {
                        // After upload, update the project with the logo URL
                        if (uploadResponse) {
                            const payload = {
                                fileName: uploadResponse.fileName,
                                originalName: uploadResponse.originalName,
                                filePath: uploadResponse.filePath,
                                mimeType: uploadResponse.mimeType,
                                fileSize: uploadResponse.fileSize,
                            };
                            projectUpdation.execute({
                                id: projectId,
                                payload: { logo: payload },
                                onSuccess: handleOnSuccess,
                            });
                        }
                    },
                });
            } catch (error) {
                console.error("Logo upload failed:", error);
            }
        },
        [projectId, projectFileUpload, projectUpdation, handleOnSuccess]
    );

    const handleLogoDelete = useCallback(() => {
        projectUpdation.execute({
            id: projectId,
            payload: { logo: null },
            onSuccess: handleOnSuccess,
        });
    }, [projectId, projectUpdation, handleOnSuccess]);

    // ---------------- Point of Contacts Handlers ----------------
    const pointOfContacts = project?.pointOfContacts || [];
    const [isAddingPoc, setIsAddingPoc] = useState(false);
    const [editingPocIndex, setEditingPocIndex] = useState(null);

    // Validation for new contact
    const newContactValidation = useFormValidation({ contactName: "", contactEmail: "", contactPhone: "", notes: "" }, VALIDATION_SCHEMAS.contact);

    // Validation for editing contact
    const editContactValidation = useFormValidation({ contactName: "", contactEmail: "", contactPhone: "", notes: "" }, VALIDATION_SCHEMAS.contact);

    const handlePocAdd = () => {
        setIsAddingPoc(true);
    };

    const handlePocRemove = (index) => {
        const next = pointOfContacts.filter((_, i) => i !== index);
        projectUpdation.execute({ id: projectId, payload: { pointOfContacts: next }, onSuccess: handleOnSuccess });
    };

    const handlePocChange = (index, field, value) => {
        const next = pointOfContacts.map((c, i) => (i === index ? { ...c, [field]: value } : c));
        projectUpdation.execute({ id: projectId, payload: { pointOfContacts: next }, onSuccess: handleOnSuccess });
    };

    const handleNewPocSave = () => {
        if (!newContactValidation.validateForm()) {
            return;
        }

        const trimmed = {
            contactName: newContactValidation.values.contactName.trim(),
            contactEmail: newContactValidation.values.contactEmail.trim(),
            contactPhone: newContactValidation.values.contactPhone.trim(),
            notes: newContactValidation.values.notes.trim(),
        };

        const next = [...pointOfContacts, trimmed];
        projectUpdation.execute({
            id: projectId,
            payload: { pointOfContacts: next },
            onSuccess: () => {
                newContactValidation.resetForm();
                setIsAddingPoc(false);
                handleOnSuccess();
            },
        });
    };

    const handleNewPocCancel = () => {
        newContactValidation.resetForm();
        setIsAddingPoc(false);
    };

    const handleEditStart = (index) => {
        setEditingPocIndex(index);
        const contact = pointOfContacts[index] || { contactName: "", contactEmail: "", contactPhone: "", notes: "" };
        editContactValidation.setValues(contact);
    };

    const handleEditCancel = () => {
        setEditingPocIndex(null);
        editContactValidation.resetForm();
    };

    const handleEditSave = () => {
        if (editingPocIndex === null) return;

        if (!editContactValidation.validateForm()) {
            return;
        }

        const trimmed = {
            contactName: editContactValidation.values.contactName.trim(),
            contactEmail: editContactValidation.values.contactEmail.trim(),
            contactPhone: editContactValidation.values.contactPhone.trim(),
            notes: editContactValidation.values.notes.trim(),
        };

        const next = pointOfContacts.map((c, i) => (i === editingPocIndex ? trimmed : c));
        projectUpdation.execute({
            id: projectId,
            payload: { pointOfContacts: next },
            onSuccess: () => {
                setEditingPocIndex(null);
                editContactValidation.resetForm();
                handleOnSuccess();
            },
        });
    };

    const getInitials = (name) => {
        if (!name) return "POC";
        const parts = String(name).trim().split(/\s+/);
        const first = parts[0]?.[0] || "";
        const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
        return (first + last).toUpperCase() || "POC";
    };

    if (!project) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <RefreshCcw className="w-8 h-8 text-orange-500 dark:text-orange-400 animate-spin mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-[#858585]">Loading project details...</p>
                </div>
            </div>
        );
    }

    const renderStatusValue = (status) => {
        const config = STATUS_CONFIG[status] || STATUS_CONFIG.in_progress;
        const IconComponent = config.icon;
        return (
            <div className={`flex shadow-sm dark:shadow-none items-center gap-2 px-3 py-1.5 rounded-lg ${config.bgColor}`}>
                <IconComponent className={`w-4 h-4 ${config.color}`} />
                <span className={`text-[13px] ${config.color}`}>{config.label}</span>
            </div>
        );
    };

    const renderPriorityValue = (priority) => {
        const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
        return (
            <Badge variant="secondary" className={`${config.class} border`}>
                {config.label}
            </Badge>
        );
    };

    return (
        <div className="max-w-full space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 space-y-4">
                    {/* Status & Priority Card */}
                    <Card className="p-5 border-0 shadow-sm rounded-lg bg-white dark:bg-[#252526] border dark:border-[#3e3e42]">
                        {/* Header with icon and subtitle */}
                        <SectionHeader icon={Info} title="Project Info" subtitle="Overview and key details" variant="orange" />
                        {/* Content */}
                        <div className="space-y-4">
                            <EditableSelectField
                                label="Status"
                                value={project.status}
                                icon={Clock}
                                onSave={(value) => handleFieldUpdate("status", value)}
                                options={STATUS_OPTIONS}
                                renderValue={renderStatusValue}
                                canEdit={canEdit}
                            />
                            <EditableSelectField
                                label="Priority"
                                value={project.priority}
                                icon={Tag}
                                onSave={(value) => handleFieldUpdate("priority", value)}
                                options={PRIORITY_OPTIONS}
                                renderValue={renderPriorityValue}
                                canEdit={canEdit}
                            />
                            <EditableDateField label="Due Date" value={project.endDate} icon={Calendar} onSave={(value) => handleFieldUpdate("endDate", value)} canEdit={canEdit} />
                            <EditableProjectManagerField
                                label="Project Manager"
                                value={project.projectManagerId}
                                managerName={project.projectManager?.name || usersDropdownList?.data?.find((u) => u.id === project.projectManagerId)?.name}
                                icon={Shield}
                                onSave={(value) => handleFieldUpdate("projectManagerId", value)}
                                options={usersDropdownList?.data?.filter((user) => user?.roles?.includes("management"))?.map((user) => ({ label: user.name, value: user.id })) || []}
                                canEdit={canEdit && isAdmin}
                            />
                        </div>
                    </Card>

                    {/* Description Card */}
                    <Card className="p-5 border-0 shadow-sm rounded-lg bg-white dark:bg-[#252526] border dark:border-[#3e3e42] gap-2">
                        <SectionHeader icon={FileText} title="Description" subtitle="Add a detailed project description" variant="orange" />
                        <EditableTextField
                            label="Description"
                            value={project.description || ""}
                            icon={FileText}
                            onSave={(value) => handleFieldUpdate("description", value)}
                            placeholder="Add a detailed description..."
                            multiline
                            canEdit={canEdit}
                        />
                    </Card>

                    {/* Notes Card */}
                    <Card className="p-5 border-0 shadow-sm rounded-lg bg-white dark:bg-[#252526] border dark:border-[#3e3e42] gap-2">
                        <SectionHeader icon={FileText} title="Notes" subtitle="Keep track of additional context" variant="orange" />
                        <EditableTextField
                            label="Notes"
                            value={project.notes || ""}
                            icon={FileText}
                            onSave={(value) => handleFieldUpdate("notes", value)}
                            placeholder="Add any additional notes..."
                            multiline
                            canEdit={canEdit}
                        />
                    </Card>
                    {/* Point of Contacts Card moved to left column */}
                    <Card className="p-5 border-0 shadow-sm rounded-lg bg-white dark:bg-[#252526] border dark:border-[#3e3e42]">
                        <SectionHeader icon={User} title="Point of Contacts" subtitle="Add primary and secondary contacts" variant="orange" />

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div />
                                {canEdit && pointOfContacts.length > 0 && !isAddingPoc && (
                                    <Button size="sm" onClick={handlePocAdd} variant="outline" className="border-dashed">
                                        <Plus className="w-4 h-4 mr-1" /> Add Contact
                                    </Button>
                                )}
                            </div>

                            {(pointOfContacts.length === 0 || isAddingPoc) && canEdit && (
                                <div className="p-3 border rounded-lg dark:border-[#3e3e42] bg-white dark:bg-[#252526]">
                                    <ValidationSummary errors={newContactValidation.errors} />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <FormField label="Name" icon={User} error={newContactValidation.getFieldError("contactName")} required>
                                            <Input
                                                value={newContactValidation.values.contactName}
                                                onChange={(e) => newContactValidation.setValue("contactName", e.target.value)}
                                                onBlur={() => newContactValidation.setFieldTouched("contactName")}
                                                placeholder="John Doe"
                                                className="h-9 text-sm"
                                            />
                                        </FormField>

                                        <FormField label="Email" icon={Mail} error={newContactValidation.getFieldError("contactEmail")} required>
                                            <Input
                                                type="email"
                                                value={newContactValidation.values.contactEmail}
                                                onChange={(e) => newContactValidation.setValue("contactEmail", e.target.value)}
                                                onBlur={() => newContactValidation.setFieldTouched("contactEmail")}
                                                placeholder="john.doe@acme.com"
                                                className="h-9 text-sm"
                                            />
                                        </FormField>

                                        <FormField label="Phone" icon={Phone} error={newContactValidation.getFieldError("contactPhone")}>
                                            <Input
                                                value={newContactValidation.values.contactPhone}
                                                onChange={(e) => newContactValidation.setValue("contactPhone", e.target.value)}
                                                onBlur={() => newContactValidation.setFieldTouched("contactPhone")}
                                                placeholder="+1234567890"
                                                className="h-9 text-sm"
                                            />
                                        </FormField>

                                        <FormField label="Notes" error={newContactValidation.getFieldError("notes")} className="md:col-span-2">
                                            <Textarea
                                                value={newContactValidation.values.notes}
                                                onChange={(e) => newContactValidation.setValue("notes", e.target.value)}
                                                onBlur={() => newContactValidation.setFieldTouched("notes")}
                                                placeholder="Primary contact"
                                                className="min-h-[70px] resize-none text-sm"
                                            />
                                        </FormField>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-3">
                                        <Button size="sm" variant="outline" onClick={handleNewPocCancel} className="border-gray-300 dark:border-[#3e3e42] dark:text-[#cccccc]">
                                            <X className="w-3.5 h-3.5 mr-1" /> Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleNewPocSave}
                                            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                                            disabled={newContactValidation.isValidating}
                                        >
                                            <Save className="w-3.5 h-3.5 mr-1" /> Save Contact
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {pointOfContacts.map((c, index) => (
                                <div key={index} className="p-3 border rounded-lg dark:border-[#3e3e42] bg-white dark:bg-[#252526]">
                                    {editingPocIndex === index ? (
                                        <div>
                                            <ValidationSummary errors={editContactValidation.errors} />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <FormField label="Name" icon={User} error={editContactValidation.getFieldError("contactName")} required>
                                                    <Input
                                                        value={editContactValidation.values.contactName}
                                                        onChange={(e) => editContactValidation.setValue("contactName", e.target.value)}
                                                        onBlur={() => editContactValidation.setFieldTouched("contactName")}
                                                        placeholder="John Doe"
                                                        className="h-9 text-sm"
                                                    />
                                                </FormField>

                                                <FormField label="Email" icon={Mail} error={editContactValidation.getFieldError("contactEmail")} required>
                                                    <Input
                                                        type="email"
                                                        value={editContactValidation.values.contactEmail}
                                                        onChange={(e) => editContactValidation.setValue("contactEmail", e.target.value)}
                                                        onBlur={() => editContactValidation.setFieldTouched("contactEmail")}
                                                        placeholder="john.doe@acme.com"
                                                        className="h-9 text-sm"
                                                    />
                                                </FormField>

                                                <FormField label="Phone" icon={Phone} error={editContactValidation.getFieldError("contactPhone")}>
                                                    <Input
                                                        value={editContactValidation.values.contactPhone}
                                                        onChange={(e) => editContactValidation.setValue("contactPhone", e.target.value)}
                                                        onBlur={() => editContactValidation.setFieldTouched("contactPhone")}
                                                        placeholder="+1234567890"
                                                        className="h-9 text-sm"
                                                    />
                                                </FormField>

                                                <FormField label="Notes" error={editContactValidation.getFieldError("notes")} className="md:col-span-2">
                                                    <Textarea
                                                        value={editContactValidation.values.notes}
                                                        onChange={(e) => editContactValidation.setValue("notes", e.target.value)}
                                                        onBlur={() => editContactValidation.setFieldTouched("notes")}
                                                        placeholder="Primary contact"
                                                        className="min-h-[70px] resize-none text-sm"
                                                    />
                                                </FormField>

                                                <div className="md:col-span-2 flex items-center justify-end gap-2">
                                                    <Button size="sm" variant="outline" onClick={handleEditCancel} className="border-gray-300 dark:border-[#3e3e42] dark:text-[#cccccc]">
                                                        <X className="w-3.5 h-3.5 mr-1" /> Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={handleEditSave}
                                                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                                                        disabled={editContactValidation.isValidating}
                                                    >
                                                        <Save className="w-3.5 h-3.5 mr-1" /> Save
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 flex items-center justify-center text-xs font-semibold">
                                                {getInitials(c.contactName)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-semibold text-gray-800 dark:text-[#cccccc] truncate">{c.contactName || "Unnamed"}</div>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                            {c.contactEmail && (
                                                                <a
                                                                    href={`mailto:${c.contactEmail}`}
                                                                    className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900 flex items-center gap-1"
                                                                >
                                                                    <Mail className="w-3.5 h-3.5" /> {c.contactEmail}
                                                                </a>
                                                            )}
                                                            {c.contactPhone && (
                                                                <a
                                                                    href={`tel:${c.contactPhone}`}
                                                                    className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900 flex items-center gap-1"
                                                                >
                                                                    <Phone className="w-3.5 h-3.5" /> {c.contactPhone}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {canEdit && (
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEditStart(index)}
                                                                className="border-gray-300 dark:border-[#3e3e42] dark:text-[#cccccc]"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handlePocRemove(index)}
                                                                className="border-destructive/40 text-destructive hover:bg-destructive/10"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                                {c.notes && (
                                                    <div className="mt-2 p-2 rounded-md bg-muted/30 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#3e3e42] text-xs text-gray-700 dark:text-[#cccccc] whitespace-pre-wrap">
                                                        {c.notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {canEdit && pointOfContacts.length > 0 && (
                                <div className="pt-1">
                                    <Button size="sm" onClick={handlePocAdd} variant="outline" className="border-dashed">
                                        <Plus className="w-4 h-4 mr-1" /> Add another contact
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-2 lg:self-start">
                    {/* Team Members Card */}
                    <Card className="p-5 border-0 shadow-sm rounded-lg bg-white dark:bg-[#252526] border dark:border-[#3e3e42]">
                        <SectionHeader icon={User} title="Team Members" subtitle="Manage and update project members" variant="orange" />
                        <Members project={project} allUsers={usersDropdownList?.data} onInvite={handleOnInvite} onRemove={handleOnRemove} canEdit={canEdit} />
                    </Card>

                    {/* Logo Upload Card */}
                    <Card className="p-5 border-0 shadow-sm rounded-lg bg-white dark:bg-[#252526] border dark:border-[#3e3e42]">
                        <SectionHeader icon={Image} title="Project Logo" subtitle="Upload or replace the project logo" variant="orange" />
                        <LogoUpload project={project} onLogoUpload={handleLogoUpload} onLogoDelete={handleLogoDelete} canEdit={canEdit} />
                    </Card>

                    {/* Attachments Card */}
                    <Card className="p-5 border-0 shadow-sm rounded-lg bg-white dark:bg-[#252526] border dark:border-[#3e3e42]">
                        <SectionHeader icon={FileText} title="Attachments" subtitle="Upload and manage project files" variant="orange" />
                        <Attachments project={project} onFileUpload={handleFileUpload} onFileDelete={handleFileDelete} canEdit={canEdit} />
                    </Card>
                </div>
            </div>
        </div>
    );
}
