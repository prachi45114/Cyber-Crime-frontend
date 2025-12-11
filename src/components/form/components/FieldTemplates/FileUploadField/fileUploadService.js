// fileUploadService.js
const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Upload failed");
        }

        const data = await response.json();
        return {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            fileLink: data.fileUrl,
            uploadedAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
};

export const fileUploadService = {
    uploadFile,
};
