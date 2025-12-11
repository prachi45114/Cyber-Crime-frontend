import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Breadcrumb({ items, currentPage }) {
    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-[13px]">
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center gap-2">
                        <Link to={item.href} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground dark:text-[#cccccc] dark:hover:text-gray-300 transition-colors group">
                            {item.icon && <span className="group-hover:scale-110 transition-transform">{item.icon}</span>}
                            <span className="font-medium">{item.label}</span>
                        </Link>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                    </li>
                ))}
                <li className="flex items-center gap-1.5 text-foreground font-medium dark:text-white">
                    <span>{currentPage}</span>
                </li>
            </ol>
        </nav>
    );
}
