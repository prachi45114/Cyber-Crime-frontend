import React from "react";
import { Info, Zap, Star, Target, Layers, TrendingUp } from "lucide-react";
import Utils from "@/utils";

export const SectionHeader = ({ icon: Icon = Info, title = "Section Title", subtitle = "Description goes here", variant = "blue", titleClasses = "" }) => {
    const variants = {
        blue: {
            iconBg: "bg-blue-50 dark:bg-[#37373d]",
            iconColor: "text-blue-600 dark:text-[#569cd6]",
            gradient: "from-blue-600 to-indigo-600",
        },
        purple: {
            iconBg: "bg-purple-50 dark:bg-[#37373d]",
            iconColor: "text-purple-600 dark:text-[#569cd6]",
            gradient: "from-purple-600 to-pink-600",
        },
        orange: {
            iconBg: "bg-orange-50 dark:bg-[#37373d]",
            iconColor: "text-orange-600 dark:text-[#f48771]",
            gradient: "from-orange-600 to-red-600",
        },
        green: {
            iconBg: "bg-emerald-50 dark:bg-[#37373d]",
            iconColor: "text-emerald-600 dark:text-[#4ec9b0]",
            gradient: "from-emerald-600 to-teal-600",
        },
        cyan: {
            iconBg: "bg-cyan-50 dark:bg-[#37373d]",
            iconColor: "text-cyan-600 dark:text-[#569cd6]",
            gradient: "from-cyan-600 to-blue-600",
        },
        slate: {
            iconBg: "bg-slate-50 dark:bg-[#37373d]",
            iconColor: "text-slate-700 dark:text-[#cccccc]",
            gradient: "from-slate-600 to-slate-800",
        },
    };

    const colors = variants[variant] || variants.blue;

    return (
        <div className="flex items-center gap-2 group">
            <div className={`flex shadow-sm items-center justify-center w-10 h-10 ${colors.iconBg}  rounded-full transition-all duration-300`}>
                <Icon className={`w-5 h-5 ${colors.iconColor} transition-all duration-300`} />
            </div>

            <div className="flex-1">
                <h3 className={Utils.cn(`text-[1.05rem] font-semibold tracking-tight text-gray-800 dark:text-[#cccccc] leading-none mb-0.5`, titleClasses)}>{title}</h3>
                <p className="text-xs font-medium text-slate-500 dark:text-[#858585] leading-snug">{subtitle}</p>
            </div>
        </div>
    );
};
