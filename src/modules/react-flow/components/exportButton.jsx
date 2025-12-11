import { useState } from "react";
import { getNodesBounds, getViewportForBounds, useReactFlow } from "@xyflow/react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";

export default function DownloadFlow({ name }) {
    const { getNodes } = useReactFlow();
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const nodes = getNodes();
            if (!nodes.length) return;

            // bounds for nodes
            const nodesBounds = getNodesBounds(nodes);
            const imageWidth = nodesBounds.width + 200;
            const imageHeight = nodesBounds.height + 200;

            const transform = getViewportForBounds(
                nodesBounds,
                imageWidth,
                imageHeight,
                0.5, // padding
                1 // keep zoom=1 to preserve edges
            );

            const flowElement = document.querySelector(".react-flow");
            if (!flowElement) return;

            // ✅ create wrapper to export everything (nodes + edges)
            const wrapper = document.createElement("div");
            wrapper.style.width = `${imageWidth}px`;
            wrapper.style.height = `${imageHeight}px`;
            wrapper.style.background = "#ffffff";
            wrapper.style.overflow = "hidden";

            // clone flow content
            const clone = flowElement.cloneNode(true);
            clone.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`;
            clone.style.transformOrigin = "0 0";

            wrapper.appendChild(clone);
            document.body.appendChild(wrapper);

            // export wrapper
            const dataUrl = await toPng(wrapper, {
                width: imageWidth,
                height: imageHeight,
                backgroundColor: "#ffffff",
                pixelRatio: 2, // sharper export
                cacheBust: true,
            });

            document.body.removeChild(wrapper);

            downloadImage(dataUrl, name);
        } catch (err) {
            console.error("Failed to export React Flow:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isDownloading ? "Exporting..." : "Export Flow as PNG"}
        >
            {isDownloading ? "..." : <Download className="h-5 w-5" />}
        </button>
    );
}

function downloadImage(dataUrl, name) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const timeStr = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
    const fileNamePrefix = name ? `${name}_` : "reactflow_";
    const fileName = `${fileNamePrefix}${dateStr}_${timeStr}.png`;

    const a = document.createElement("a");
    a.setAttribute("download", fileName);
    a.setAttribute("href", dataUrl);
    a.click();
}
