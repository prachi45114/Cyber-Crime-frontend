import DataNotFound from "@/components/DataNotFound";
import GlobalICONS from "@/lib/utils/icons";

export const sampleFormatData = [
    {
        heading: {
            label: "VM Details",
            icon: GlobalICONS.DESKTOP,
            description: "Configure the basic details of your virtual machine",
        },
        body: {
            vmName: "Ubuntu",
            vmStatus: "Running",
            osVersion: "V.19.01",
            environment: "Development",
            evmAssetId: "ASSET123",
            hypervisorPlatform: "VMware",
            businessImpact: "Affect User",
        },
        grid: 3,
    },
    {
        heading: {
            label: "Host Details",
            icon: GlobalICONS.WEBSITE,
            description: "Configure the host machine details",
        },
        body: {
            vmName: "CentOS",
            osVersion: { label: "OS VERSION ABC", value: "V.11.05" },
            environment: "Production",
            evmAssetId: "ASSET456",
            hypervisorPlatform: "VMware",
            businessImpact: "High Priority",
        },
        grid: 3,
    },
    {
        heading: {
            label: "Resource Allocation",
            icon: GlobalICONS.DATA_CENTER,
            description: "Configure resource allocation for your virtual machine",
        },
        body: {
            vmName: "Windows",
            vmStatus: "Stopped",
            osVersion: "V.10.02",
            environment: "Testing",
            evmAssetId: "ASSET789",
            hypervisorPlatform: "Hyper-V",
            businessImpact: "Low Priority",
        },
        grid: 3,
    },
    {
        heading: {
            label: "VM Details",
            icon: GlobalICONS.DESKTOP,
            description: "Configure the basic details of your virtual machine",
        },
        body: {
            vmName: "RedHat",
            vmStatus: "Running",
            osVersion: "V.8.03",
            environment: "Staging",
            evmAssetId: "ASSET101",
            hypervisorPlatform: "KVM",
            businessImpact: "Affect User",
        },
        grid: 3,
    },
    {
        heading: {
            label: "VM Details",
            icon: GlobalICONS.DESKTOP,
            description: "Configure the basic details of your virtual machine",
        },
        body: {
            vmName: "Debian",
            vmStatus: "Running",
            osVersion: "V.11.05",
            environment: "Development",
            evmAssetId: "ASSET112",
            hypervisorPlatform: "VirtualBox",
            businessImpact: "Medium Priority",
        },
        grid: 3,
    },
    {
        heading: {
            label: "VM Details",
            icon: GlobalICONS.DESKTOP,
            description: "Configure the basic details of your virtual machine",
        },
        body: {
            vmName: "Fedora",
            vmStatus: "Running",
            osVersion: "V.37.01",
            environment: "Production",
            evmAssetId: "ASSET131",
            hypervisorPlatform: "VMware",
            businessImpact: "Critical",
        },
        grid: 3,
    },
    {
        heading: {
            label: "VM Details",
            icon: GlobalICONS.DESKTOP,
            description: "Configure the basic details of your virtual machine",
        },
        body: {
            vmName: "Ubuntu",
            vmStatus: "Running",
            osVersion: "V.19.01",
            environment: "Development",
            evmAssetId: "ASSET123",
            hypervisorPlatform: "VMware",
            businessImpact: "Affect User",
        },
        customBody: <DataNotFound />,
        grid: 1,
    },
];
