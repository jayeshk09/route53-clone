import api from "@/lib/api";
import { DNSRecord, Pagination, RecordType } from "@/types";

export async function fetchDNSRecords(zoneId: string, params: {
  page: number;
  limit: number;
  search: string;
  sort_by: string;
  sort_order: string;
}): Promise<{ data: DNSRecord[]; pagination: Pagination }> {
  const result = await api.get<{ success: boolean; data: DNSRecord[]; pagination: Pagination }>(
    `/hosted-zones/${zoneId}/records`,
    params
  );
  return { data: result.data, pagination: result.pagination };
}

export async function createDNSRecord(zoneId: string, data: {
  name: string;
  type: RecordType;
  value: string;
  ttl: number;
}): Promise<DNSRecord> {
  const result = await api.post<{ success: boolean; data: DNSRecord }>(
    `/hosted-zones/${zoneId}/records`,
    { ...data, routing_policy: "Simple" }
  );
  return result.data;
}

export async function updateDNSRecord(zoneId: string, recordId: string, data: {
  value?: string;
  ttl?: number;
}): Promise<DNSRecord> {
  const result = await api.put<{ success: boolean; data: DNSRecord }>(
    `/hosted-zones/${zoneId}/records/${recordId}`,
    data
  );
  return result.data;
}

export async function deleteDNSRecord(zoneId: string, recordId: string): Promise<void> {
  await api.delete(`/hosted-zones/${zoneId}/records/${recordId}`);
}