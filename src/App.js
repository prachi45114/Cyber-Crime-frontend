import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "./layout";
import Dashboard from "./modules/dashboard";
import AccessDenied from "./components/CanAccess";
import Projects from "./modules/project";
import ProjectDetail from "./modules/project/pages/detail";
import CreateProject from "./modules/project/pages/add/CreateProject";
import CDR from "./modules/cdr/";
function App() {
    return (
        <>
            <ToastContainer />
            <Routes>
                {/* Auth Module with its own layout */}
                {/* <Route path="/auth/*" element={<Auth />} /> */}

                {/* Main App Layout */}
                <Route
                    path="/*"
                    element={
                            <Layout>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <React.Suspense fallback={""}>
                                                <Dashboard />
                                            </React.Suspense>
                                        }
                                    />
                                    <Route
                                        path="/cdr-records"
                                        element={
                                            <React.Suspense fallback={""}>
                                                <CDR/>
                                            </React.Suspense>
                                        }
                                    />
                                    <Route
                                        path="/project/create"
                                        element={
                                            <React.Suspense fallback={""}>
                                                <CreateProject />
                                            </React.Suspense>
                                        }
                                    />
                                    <Route
                                        path="/project/:projectId"
                                        element={
                                            <React.Suspense fallback={""}>
                                                <ProjectDetail />
                                            </React.Suspense>
                                        }
                                    />
                                    {/* <Route
                                        path="/project/:projectId/assets"
                                        element={
                                            <React.Suspense fallback={""}>
                                                <Asset />
                                            </React.Suspense>
                                        }
                                    /> */}
                                </Routes>
                            </Layout>
                    }
                />

                <Route
                    path="/access-denied"
                    element={
                        <AccessDenied />
                    }
                />
            </Routes>
        </>
    );
}

export default App;
