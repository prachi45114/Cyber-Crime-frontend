import { useEffect, useMemo } from "react";
import { CheckCircle2, Activity, Users, FileText, Database, ArrowUpRight, Info } from "lucide-react";
import { useNavigate } from "react-router";
import { SectionHeader } from "@/components/ui/heading";

const AnalyticsDashboard = () => {
    const { statsCount, recentProjects } = useStats();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([statsCount?.fetch?.({}), recentProjects?.fetch?.({})]);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, []);

    const counts = statsCount?.data;

    const stats = useMemo(
        () => [
            {
                title: "Total Projects",
                value: counts?.totalProject ?? 0,
                icon: FileText,
                color: "from-purple-500 to-blue-500",
            },
            {
                title: "Total Assets",
                value: counts?.totalAsset ?? 0,
                icon: Database,
                color: "from-blue-500 to-cyan-500",
            },
            {
                title: "Total Checklists",
                value: counts?.totalChecklist ?? 0,
                icon: CheckCircle2,
                color: "from-emerald-500 to-teal-500",
            },
            {
                title: "Total Users",
                value: counts?.totalUsers ?? 0,
                icon: Users,
                color: "from-orange-500 to-pink-500",
            },
        ],
        [counts]
    );

    const getStatusClasses = (status) => {
        const statusLower = status?.toLowerCase();
        if (statusLower === "completed") {
            return "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30";
        }
        return "bg-orange-500/10 text-orange-500 border border-orange-500/30";
    };

    const getPriorityClasses = (priority) => {
        const priorityLower = priority?.toLowerCase();
        switch (priorityLower) {
            case "high":
                return "bg-red-500/20 text-red-500 border border-red-500/30";
            case "medium":
                return "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30";
            case "low":
                return "bg-blue-500/20 text-blue-500 border border-blue-500/30";
            default:
                return "bg-gray-500/10 text-gray-500 border border-gray-500/30";
        }
    };

    const formatPriority = (priority) => {
        if (!priority) return "N/A";
        return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
    };

    const formatStatus = (status) => {
        if (!status) return "N/A";
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    const projects = recentProjects?.data || [];

    return (
        <div className="min-h-screen">
            <main className="">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 text-balance dark:text-[#cccccc]">Dashboard</h1>
                    <p className="text-muted-foreground dark:text-[#858585]">Welcome back! Here's your project overview.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={`stat-${stat.title}-${idx}`}
                                className="group relative overflow-hidden rounded-xl bg-card dark:bg-[#252526] border border-border dark:border-[#3e3e42] p-6 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm text-muted-foreground font-medium mb-2">{stat.title}</h3>
                                        <p className="text-3xl font-bold dark:text-[#cccccc]">{stat.value}</p>
                                    </div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Projects Section */}
                <div className="bg-card dark:bg-[#252526] border border-border dark:border-[#3e3e42] rounded-xl p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <SectionHeader icon={Info} title="Recent Projects" subtitle="Track your active projects and their status" variant="orange" titleClasses="text-lg" />
                    </div>

                    {recentProjects?.isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block">
                                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            </div>
                            <p className="text-muted-foreground mt-3">Loading projects...</p>
                        </div>
                    ) : projects?.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">No active projects found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {projects?.length > 0 &&
                                projects?.map((project, idx) => (
                                    <div
                                        key={project.id || `project-${idx}`}
                                        className="group p-4 rounded-lg border border-border dark:border-[#3e3e42] bg-background/50 dark:bg-[#1e1e1e] hover:bg-background dark:hover:bg-[#2a2d2e] hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h3
                                                    onClick={() => navigate(`/project/${project.id}`)}
                                                    className="font-semibold cursor-pointer text-foreground dark:text-[#cccccc] mb-1 truncate group-hover:text-primary dark:group-hover:text-[#569cd6] transition-colors"
                                                >
                                                    {project.name || "Unnamed Project"}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#858585]">
                                                    <Database className="w-4 h-4" />
                                                    <span>{project.totalAssets || 0} Assets</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <span className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${getStatusClasses(project.status)}`}>
                                                    {formatStatus(project.status)}
                                                </span>
                                                <span className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${getPriorityClasses(project.priority)}`}>
                                                    {formatPriority(project.priority)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AnalyticsDashboard;
