import { NotificationProvider } from "./notification";
import { LoadingProvider } from "./loading";
import { ThemeProvider } from "./ThemeContext";
import { DashboardProvider } from "./dashboard";
import { ProjectProvider } from "./project";
import { CdrProvider } from "./cdr";

const ContextProviders = ({ children }) => {
    return (
        <ThemeProvider>
            <LoadingProvider>
                <NotificationProvider>
                    <DashboardProvider>
                        <ProjectProvider>
                            <CdrProvider>
                               {children}
                            </CdrProvider>
                        </ProjectProvider>
                    </DashboardProvider>                            
                </NotificationProvider>
            </LoadingProvider>
        </ThemeProvider>
    );
};
export default ContextProviders;
