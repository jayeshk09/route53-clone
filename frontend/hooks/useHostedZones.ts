"use client";

import { useState, useEffect, useCallback } from "react";
import { HostedZone, SortOrder, Pagination } from "@/types";
import {
  fetchHostedZones,
  fetchHostedZone,
  createHostedZone,
  updateHostedZone,
  deleteHostedZone,
} from "@/services/hostedZoneService";

interface UseHostedZonesReturn {
  zones: HostedZone[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  search: string;
  setSearch: (s: string) => void;
  sortBy: string;
  sortOrder: SortOrder;
  setSortBy: (s: string) => void;
  setSortOrder: (o: SortOrder) => void;
  page: number;
  setPage: (p: number) => void;
  refresh: () => void;
  createZone: (data: { domain_name: string; type: string; description: string }) => Promise<HostedZone>;
  updateZone: (zoneId: string, data: { domain_name?: string; description?: string }) => Promise<void>;
  deleteZone: (zoneId: string) => Promise<void>;
  getZone: (zoneId: string) => Promise<HostedZone>;
}

export function useHostedZones(): UseHostedZonesReturn {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);

  const fetchZones = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchHostedZones({ page, limit: 10, search, sort_by: sortBy, sort_order: sortOrder });
      setZones(result.data);
      setPagination(result.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch zones");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const createZone = useCallback(async (formData: { domain_name: string; type: string; description: string }) => {
    const zone = await createHostedZone(formData);
    setZones((prev) => [zone, ...prev]);
    return zone;
  }, []);

  const updateZone = useCallback(async (zoneId: string, formData: { domain_name?: string; description?: string }) => {
    const updated = await updateHostedZone(zoneId, formData);
    setZones((prev) =>
      prev.map((z) =>
        z.id === zoneId
          ? { ...z, domain_name: updated.domain_name, description: updated.description }
          : z
      )
    );
  }, []);

  const deleteZone = useCallback(async (zoneId: string) => {
    await deleteHostedZone(zoneId);
    setZones((prev) => prev.filter((z) => z.id !== zoneId));
  }, []);

  const getZone = useCallback(async (zoneId: string) => {
    return await fetchHostedZone(zoneId);
  }, []);

  return {
    zones, pagination, isLoading, error,
    search, setSearch,
    sortBy, sortOrder, setSortBy, setSortOrder,
    page, setPage,
    refresh: fetchZones,
    createZone, updateZone, deleteZone, getZone,
  };
}