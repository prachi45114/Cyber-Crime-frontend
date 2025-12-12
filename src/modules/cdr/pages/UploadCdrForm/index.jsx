import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Upload } from "lucide-react";

const UploadCdrForm = ({ onSuccess, onCancel }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please upload a CSV file");

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);

            const response = await axios.post(
                "http://192.168.22.143:5000/api/cdr/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            console.log("Upload Response:", response.data);
            onSuccess(); // closes modal + refresh table
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Failed to upload CSV");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Upload CDR CSV</label>

                <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-3">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full cursor-pointer"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white flex items-center gap-2"
                >
                    <Upload className="w-4 h-4" />
                    {loading ? "Uploading..." : "Upload"}
                </Button>
            </div>
        </form>
    );
};

export default UploadCdrForm;
