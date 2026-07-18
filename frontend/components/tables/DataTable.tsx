"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  emptyMessage?: string;
  rowActions?: (item: T) => React.ReactNode;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  sortBy,
  sortOrder,
  onSort,
  emptyMessage = "No items found",
  rowActions,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="w-10 px-3 py-3">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wide select-none ${
                    col.sortable ? "cursor-pointer hover:text-gray-900" : ""
                  }`}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortBy === col.key && (
                      <span className="text-gray-400">
                        {sortOrder === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
              {rowActions && <th className="w-10 px-3 py-3"></th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick?.(item)}
              >
                <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-gray-700">
                    {col.render(item)}
                  </td>
                ))}
                {rowActions && (
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    {rowActions(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}