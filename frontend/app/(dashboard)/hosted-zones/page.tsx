"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, RefreshCw } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";
import HostedZonesTable from "@/components/tables/HostedZonesTable";
import EmptyState from "@/components/sections/EmptyState";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import { useHostedZones } from "@/hooks/useHostedZones";
import { useToast } from "@/hooks/useToast";
import { HostedZone } from "@/types";

export default function HostedZonesPage() {
  const router = useRouter();
  const {
    zones, pagination, isLoading, error,
    search, setSearch,
    sortBy, sortOrder, setSortBy, setSortOrder,
    page, setPage,
    refresh, deleteZone,
  } = useHostedZones();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<HostedZone | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [inputValue, setInputValue] = useState(search);
  const [typeFilter, setTypeFilter] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  function handleSearchChange(value: string) {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 300);
  }

  function handleSort(key: string) {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteZone(deleteTarget.id);
      showToast(`Deleted zone '${deleteTarget.domain_name}'`, "success");
      setDeleteTarget(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  }

  const filteredZones = typeFilter
    ? zones.filter((z) => z.type === typeFilter)
    : zones;

  return (
    <AppShell
      breadcrumbs={[
        { label: "Route 53", href: "/dashboard" },
        { label: "Hosted zones" },
      ]}
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[28px] font-bold text-gray-800">
          Hosted zones ({pagination?.total ?? zones.length})
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <Button onClick={() => router.push("/hosted-zones/create")}>
            Create hosted zone
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Filter hosted zones by property or value"
            value={inputValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-9 w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb]"
          />
          {inputValue && (
            <button
              onClick={() => {
                setInputValue("");
                setSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              x
            </button>
          )}
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-9 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:border-[#0073bb]"
        >
          <option value="">All types</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}

      {!isLoading && filteredZones.length === 0 && (
        <EmptyState
          title={inputValue || typeFilter ? "No matching zones" : "No hosted zones found"}
          description={
            inputValue || typeFilter
              ? "Try adjusting your search or filter criteria"
              : "Create your first hosted zone to get started"
          }
          actionLabel={inputValue || typeFilter ? undefined : "Create hosted zone"}
          onAction={inputValue || typeFilter ? undefined : () => router.push("/hosted-zones/create")}
        />
      )}

      {filteredZones.length > 0 && (
        <>
          <HostedZonesTable
            zones={filteredZones}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onDelete={setDeleteTarget}
          />

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>
                Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination.total)} of{" "}
                {pagination.total} hosted zones
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (pagination.pages <= 7) return true;
                    return p === 1 || p === pagination.pages || Math.abs(p - page) <= 1;
                  })
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="px-2 py-1 text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-1 border border-gray-300 rounded ${
                          p === page
                            ? "bg-[#ff9900] text-white border-[#ff9900]"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                  disabled={page >= pagination.pages}
                  className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <DeleteConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Hosted Zone"
        itemName={deleteTarget?.domain_name || ""}
        loading={deleting}
      />
    </AppShell>
  );
}