"use client";

import { useState, useEffect, useCallback } from "react";
import { DNSRecord, RecordType, SortOrder, Pagination } from "@/types";
import {
  fetchDNSRecords,
  createDNSRecord,
  updateDNSRecord,
  deleteDNSRecord,
} from "@/services/recordService";

interface UseDNSRecordsReturn {
  records: DNSRecord[];
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
  createRecord: (data: { name: string; type: RecordType; value: string; ttl: number }) => Promise<DNSRecord>;
  updateRecord: (recordId: string, data: { value: string; ttl: number }) => Promise<void>;
  deleteRecord: (recordId: string) => Promise<void>;
}

export function useDNSRecords(zoneId: string): UseDNSRecordsReturn {
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);

  const fetchRecords = useCallback(async () => {
    if (!zoneId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchDNSRecords(zoneId, { page, limit: 20, search, sort_by: sortBy, sort_order: sortOrder });
      setRecords(result.data);
      setPagination(result.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch records");
    } finally {
      setIsLoading(false);
    }
  }, [zoneId, page, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const createRecordFn = useCallback(async (formData: { name: string; type: RecordType; value: string; ttl: number }) => {
    const record = await createDNSRecord(zoneId, formData);
    setRecords((prev) => [...prev, record]);
    return record;
  }, [zoneId]);

  const updateRecordFn = useCallback(async (recordId: string, formData: { value: string; ttl: number }) => {
    const updated = await updateDNSRecord(zoneId, recordId, formData);
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? { ...r, value: updated.value, ttl: updated.ttl, updated_at: new Date().toISOString() }
          : r
      )
    );
  }, [zoneId]);

  const deleteRecordFn = useCallback(async (recordId: string) => {
    await deleteDNSRecord(zoneId, recordId);
    setRecords((prev) => prev.filter((r) => r.id !== recordId));
  }, [zoneId]);

  return {
    records, pagination, isLoading, error,
    search, setSearch,
    sortBy, sortOrder, setSortBy, setSortOrder,
    page, setPage,
    refresh: fetchRecords,
    createRecord: createRecordFn,
    updateRecord: updateRecordFn,
    deleteRecord: deleteRecordFn,
  };
}