import React from "react";
import { Download, Trash2, Eye, FileText, Image } from "lucide-react";
import apiConstants from "@/services/utils/constants";

const FileDisplay = ({ files = [], onDelete, onPreview }) => {
    const baseUrl = apiConstants.BACKEND_API_BASE_URL;

    // Helper function to format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Helper function to get file icon based on mimetype
    const getFileIcon = (mimeType) => {
        if (mimeType.startsWith("image/")) {
            return <Image className="text-blue-500" size={24} />;
        }
        return <FileText className="text-gray-500" size={24} />;
    };

    // Helper function to trim long filenames
    const trimFileName = (fileName) => {
        if (fileName.length > 20) {
            return fileName.substring(0, 17) + "...";
        }
        return fileName;
    };

    return (
        <div className="w-full ">
            {/* <h2 className="text-2xl font-bold mb-4 text-gray-800">Files</h2> */}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {files?.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No files uploaded yet</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">File</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Size</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {files &&
                                    files.map((file) => {
                                        const fileUrl = `${baseUrl}/files/file/${file._id}`;
                                        const isImage = file.mimeType.startsWith("image/");

                                        return (
                                            <tr key={file._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center">
                                                        {getFileIcon(file.mimeType)}
                                                        <div className="ml-3">
                                                            <a href={fileUrl} target="_blank" className="text-sm font-medium text-gray-900" title={file.fileName}>
                                                                {trimFileName(file.fileName)}
                                                            </a>
                                                            <p className="text-xs text-gray-500">{file.mimeType}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">{formatFileSize(file.size)}</td>
                                                <td className="px-4 py-4 text-sm text-gray-600">{formatDate(file.createdAt)}</td>
                                                <td className="px-4 py-4">
                                                    <div className="flex space-x-2">
                                                        <a href={fileUrl} target="_blank" className="p-1 rounded-full hover:bg-blue-100 transition-colors" title="Preview">
                                                            <Eye size={18} className="text-blue-600" />
                                                        </a>

                                                        {/* <a href={fileUrl} download={file.fileName} className="p-1 rounded-full hover:bg-green-100 transition-colors" title="Download">
                                                        <Download size={18} className="text-green-600" />
                                                    </a> */}
                                                        {/* <button onClick={() => onDelete(file._id)} className="p-1 rounded-full hover:bg-red-100 transition-colors" title="Delete">
                                                        <Trash2 size={18} className="text-red-600" />
                                                    </button> */}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileDisplay;
