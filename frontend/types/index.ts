export interface User {
  id: number;
  email: string;
  username: string;
}

export interface HostedZone {
  id: string;
  domain_name: string;
  type: "Public" | "Private";
  description?: string;
  record_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type RecordType = "A" | "AAAA" | "CNAME" | "TXT" | "MX" | "NS" | "PTR" | "SRV" | "CAA";

export const RECORD_TYPES: RecordType[] = ["A", "AAAA", "CNAME", "TXT", "MX", "NS", "PTR", "SRV", "CAA"];

export interface DNSRecord {
  id: string;
  hosted_zone_id: string;
  name: string;
  type: RecordType;
  value: string;
  ttl: number;
  routing_policy: string;
  weight?: number;
  region?: string;
  is_alias?: boolean;
  set_identifier?: string;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type SortOrder = "asc" | "desc";