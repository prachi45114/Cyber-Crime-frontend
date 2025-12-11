import React from "react";
import AssetMap from "./components/asset-map";
import { ReactFlowProvider } from "@xyflow/react";

const AssetMapPage = () => {
    return (
        <div>
            <ReactFlowProvider>
                <AssetMap />
            </ReactFlowProvider>
        </div>
    );
};

export default AssetMapPage;
