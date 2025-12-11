import React, { useRef, useState } from "react";
import { Paperclip, Download, Plus, Trash2, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import GlobalUtils from "@/lib/utils/GlobalUtils";
import { useProject } from "@/services/context/project";
import ProjectApiService from "@/services/api/project";
import DataNotFound from "@/components/DataNotFound";

const Attachments = ({ project, onFileUpload, onFileDelete, canEdit = false }) => {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);
    const [open, setOpen] = useState(false);

    const { projectFileDownload } = useProject();

    const handleFileDownload = async (fileId, fileName) => {
        try {
            const fileBlob = await ProjectApiService.downloadFile(project.id, fileId);
            const url = window.URL.createObjectURL(fileBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName || "file";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    const handleFileDelete = async (fileId) => {
        if (!onFileDelete) return;
        const confirmDelete = window.confirm("Are you sure you want to delete this file?");
        if (confirmDelete) {
            await onFileDelete(fileId); // parent handles API call
        }
    };

    const handleAddFileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setOpen(true);
        }
        e.target.value = "";
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);
        if (description) formData.append("description", description);

        if (onFileUpload) {
            await onFileUpload(formData);
        }

        setSelectedFile(null);
        setDescription("");
        setPreviewUrl(null);
        setOpen(false);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* File List */}
            <div className="grid grid-cols-1 gap-3">
                {project.files?.length > 0 ? (
                    project.files?.map((file) => {
                        const Icon = GlobalUtils.getFileIcon(file.mimeType);
                        return (
                            <div
                                key={file.id}
                                className="group flex items-center gap-3 py-3 px-4 border border-gray-200 dark:border-[#3e3e42] rounded-xl hover:border-orange-300 dark:hover:border-[#464647] hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 transition-all bg-white dark:bg-[#252526]"
                                title={file.description}
                            >
                                {/* File Icon */}
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-[#37373d] dark:to-[#2a2d2e] rounded-lg flex items-center justify-center shrink-0 border border-orange-100 dark:border-[#3e3e42] shadow-sm">
                                    {Icon && <Icon className="w-6 h-6 text-orange-500 dark:text-[#ff9f43]" />}
                                </div>

                                {/* File Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-[#cccccc] truncate">{file.originalName}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-gray-500 dark:text-[#858585]">{GlobalUtils.formatFileSize(file.fileSize)}</p>
                                        {file.description && (
                                            <span className="text-xs text-gray-400 dark:text-[#858585]">•</span>
                                        )}
                                        {file.description && (
                                            <p className="text-xs text-gray-400 dark:text-[#858585] italic truncate max-w-[200px]" title={file.description}>
                                                {file.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleFileDownload(file?.id, file.originalName)}
                                        className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-[#2a2d2e] rounded-lg"
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4 text-blue-500 dark:text-[#569cd6]" />
                                    </Button>

                                    {canEdit && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => handleFileDelete(file.id)} 
                                            className="h-8 w-8 hover:bg-red-50 dark:hover:bg-[#2a2d2e] rounded-lg"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500 dark:text-[#f48771]" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-8 border border-dashed border-gray-300 dark:border-[#3e3e42] rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-[#1e1e1e] dark:to-[#252526] text-center">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-[#37373d] dark:to-[#2a2d2e] flex items-center justify-center shadow-lg border border-orange-200 dark:border-[#3e3e42]">
                            <Paperclip className="w-8 h-8 text-orange-600 dark:text-[#ff9f43]" />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-[#cccccc]">No attachments yet</h3>
                        <p className="mt-1.5 text-xs text-gray-500 dark:text-[#858585] max-w-sm mx-auto">
                            Add relevant documents, images, or reports to keep everything in one place.
                        </p>
                        {canEdit && (
                            <div className="mt-5">
                                <Button 
                                    onClick={handleAddFileClick} 
                                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/20"
                                >
                                    <Plus className="w-4 h-4 mr-1.5" /> Add Attachment
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Hidden File Input */}
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
            </div>

            {/* Add Button - Show when files exist */}
            {canEdit && project.files?.length > 0 && (
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddFileClick} 
                    className="w-full border-dashed border-2 border-gray-300 dark:border-[#3e3e42] hover:border-orange-400 dark:hover:border-[#ff9f43] hover:bg-orange-50 dark:hover:bg-[#2a2d2e] transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2 text-orange-500 dark:text-[#ff9f43]" />
                    <span className="text-sm">Add More Files</span>
                </Button>
            )}

            {/* Upload Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-white dark:bg-[#252526] dark:border-[#3e3e42] max-w-md">
                    <DialogHeader>
                        <DialogTitle className="dark:text-[#cccccc] flex items-center gap-2">
                            <Paperclip className="w-5 h-5 text-orange-500 dark:text-[#ff9f43]" />
                            Upload File
                        </DialogTitle>
                    </DialogHeader>

                    {selectedFile && (
                        <div className="space-y-4">
                            {/* Preview */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-[#1e1e1e] rounded-lg border border-gray-200 dark:border-[#3e3e42]">
                                {selectedFile.type.startsWith("image/") ? (
                                    <img src={previewUrl} alt="preview" className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 dark:border-[#3e3e42] shadow-sm" />
                                ) : (
                                    <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-[#37373d] dark:to-[#2a2d2e] rounded-lg border-2 border-orange-200 dark:border-[#3e3e42]">
                                        <File className="w-8 h-8 text-orange-500 dark:text-[#ff9f43]" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-[#cccccc] truncate">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-[#858585] mt-1">{GlobalUtils.formatFileSize(selectedFile.size)}</p>
                                </div>
                            </div>

                            {/* Description input */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-700 dark:text-[#858585]">Description (optional)</label>
                                <Input
                                    placeholder="Add a description for this file..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="dark:bg-[#1e1e1e] dark:border-[#3e3e42] dark:text-[#cccccc] dark:placeholder:text-[#858585] focus:border-orange-400 dark:focus:border-[#ff9f43]"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)} className="dark:border-[#3e3e42] dark:text-[#cccccc] dark:hover:bg-[#2a2d2e]">
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleUpload} 
                            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Attachments;
