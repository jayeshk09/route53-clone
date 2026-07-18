import api from "@/lib/api";
import { HostedZone, Pagination } from "@/types";

export async function fetchHostedZones(params: {
  page: number;
  limit: number;
  search: string;
  sort_by: string;
  sort_order: string;
}): Promise<{ data: HostedZone[]; pagination: Pagination }> {
  const result = await api.get<{ success: boolean; data: HostedZone[]; pagination: Pagination }>(
    "/hosted-zones",
    params
  );
  return { data: result.data, pagination: result.pagination };
}

export async function fetchHostedZone(zoneId: string): Promise<HostedZone> {
  const result = await api.get<{ success: boolean; data: HostedZone }>(`/hosted-zones/${zoneId}`);
  return result.data;
}

export async function createHostedZone(data: {
  domain_name: string;
  type: string;
  description: string;
}): Promise<HostedZone> {
  const result = await api.post<{ success: boolean; data: HostedZone }>("/hosted-zones", data);
  return result.data;
}

export async function updateHostedZone(zoneId: string, data: {
  domain_name?: string;
  description?: string;
}): Promise<HostedZone> {
  const result = await api.put<{ success: boolean; data: HostedZone }>(`/hosted-zones/${zoneId}`, data);
  return result.data;
}

export async function deleteHostedZone(zoneId: string): Promise<void> {
  await api.delete(`/hosted-zones/${zoneId}`);
}