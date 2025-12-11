import { createContext, useContext } from "react";
import {
    useCdrList,
    useProjectUpdate,
} from "../hooks/cdr";

const CdrContext = createContext(null);

export const CdrProvider = ({ children }) => {
    const cdrListState = useCdrList();

    return (
        <CdrContext.Provider value={cdrListState}>
            {children}
        </CdrContext.Provider>
    );
};


export const useCdr = () => {
    const context = useContext(CdrContext);
    if (context === null) {
        throw new Error("useCdr must be used within a CdrProvider");
    }
    return context;
};
