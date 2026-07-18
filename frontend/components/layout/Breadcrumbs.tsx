import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BreadcrumbItem as BreadcrumbItemType } from "@/types";

interface BreadcrumbsProps {
  items: BreadcrumbItemType[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="bg-white px-4 py-2 border-b border-gray-200" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm flex-wrap">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
            )}
            {item.href && i < items.length - 1 ? (
              <Link
                href={item.href}
                className="text-[#0073bb] hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className={i === items.length - 1 ? "text-gray-700 font-medium" : "text-gray-500"}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}