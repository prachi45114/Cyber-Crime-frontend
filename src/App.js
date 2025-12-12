import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "./layout";
import Dashboard from "./modules/dashboard";
import CDR from "./modules/cdr/";
import CDRFlowTree from "./modules/cdr/components/CDRFlow/CDRFlowTree";
import CDRDetail from "./modules/cdr/pages/CDRDetailPage";
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
                                        path="/cdr/:cdrId"
                                        element={
                                            <React.Suspense fallback="">
                                                <CDRDetail />
                                            </React.Suspense>
                                        }
                                    />
                                    <Route
                                        path="/cdr-flow"
                                        element={
                                            <React.Suspense fallback={""}>
                                                <CDRFlowTree/>
                                            </React.Suspense>
                                        }
                                    />
                                </Routes>
                            </Layout>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
