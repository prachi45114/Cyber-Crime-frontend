import { useMemo } from "react";
import AddAssetsOptions from "../components/AddAssetsOption";
import BulkUploadForm from "@/components/builkUploadForm";

const useContent = (form, module, setForm) => {
    const content = useMemo(() => {
        switch (form) {
            case "manualForm":
                return module.form;
            case "bulkUploadForm":
                return <BulkUploadForm module={module} />;
            default:
                return <AddAssetsOptions module={module} setForm={setForm} />;
        }
    }, [form, module, setForm]);

    return { content };
};

export default useContent;
