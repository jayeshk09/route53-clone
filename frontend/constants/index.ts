export const DEFAULT_TTL = 300;
export const TTL_MIN = 60;
export const TTL_MAX = 86400;
export const PAGE_SIZE = 10;
export const PAGE_SIZE_MAX = 100;
export const DOMAIN_MIN_LENGTH = 5;
export const DOMAIN_MAX_LENGTH = 255;
export const DESCRIPTION_MAX_LENGTH = 500;

export const DOMAIN_REGEX = /^[a-z0-9]([a-z0-9-]*\.)*[a-z]{2,}$/;
export const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export { RECORD_TYPES } from "@/types";
export type { RecordType } from "@/types";