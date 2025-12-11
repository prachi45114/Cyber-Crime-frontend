const sampleAssetsClassificationData = {
    data: {
        totalAssets: 415,
        hardware: {
            count: 353,
            itAssets: {
                totalCount: 353,
                data: [
                    {
                        name: "Desktop",
                        count: 214,
                        adIntegrationPending: 94,
                        agentInstallationPending: 94,
                        complianceFail: 193,
                    },
                    {
                        name: "Laptop",
                        count: 61,
                        adIntegrationPending: 61,
                        agentInstallationPending: 44,
                        complianceFail: 56,
                    },
                    {
                        name: "Server",
                        count: 29,
                        agentInstallationPending: 24,
                        complianceFail: 6,
                    },
                    {
                        name: "Networking Device",
                        count: 49,
                        firewall: 6,
                        switches: 35,
                        complianceFail: 27,
                    },
                ],
            },
            otAssets: {
                totalCount: 0,
                data: [
                    {
                        name: "PLC/RTU",
                        count: 214,
                        adIntegrationPending: 0,
                        agentInstallationPending: 0,
                        complianceFail: 0,
                    },
                    {
                        name: "HMI",
                        count: 214,
                        adIntegrationPending: 0,
                        agentInstallationPending: 0,
                        complianceFail: 0,
                    },
                ],
            },
        },
        softwareAssets: {
            license: {
                totalCount: 110,
                usedLicences: 2,
                expiredLicenecs: 0,
                expiryInLessThan15Days: 0,
            },
            sbom: {
                totalCount: 2203,
                Unauthorized: 0,
                Anthorized: 0,
                AuthorizationPending: 2203,
            },
            webApplications: {
                totalCount: 14,
                backendFace: 2,
                onPrimFace: 3,
                publicFace: 9,
            },
        },
        vmAssets: {
            totalCount: 44,
            vmProd: 22,
            vmDevelopment: 22,
            vmStaging: 0,
        },
    },
    statusCode: 200,
    message: "Success",
};

//

export default sampleAssetsClassificationData;
