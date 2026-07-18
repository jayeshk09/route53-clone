"use client";

import DataTable from "./DataTable";
import ActionMenu from "@/components/common/ActionMenu";
import { DNSRecord } from "@/types";

interface DNSRecordsTableProps {
  records: DNSRecord[];
  zoneDomain: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (key: string) => void;
  onEdit: (record: DNSRecord) => void;
  onDelete: (record: DNSRecord) => void;
}

export default function DNSRecordsTable({
  records,
  zoneDomain,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}: DNSRecordsTableProps) {
  const columns = [
    {
      key: "name",
      header: "Record name",
      sortable: true,
      render: (record: DNSRecord) => {
        const fullName =
          record.name === "@" ? zoneDomain : `${record.name}.${zoneDomain}`;
        return <span className="font-mono text-sm text-gray-800">{fullName}</span>;
      },
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (record: DNSRecord) => (
        <span className="font-mono text-sm font-medium text-gray-700">
          {record.type}
        </span>
      ),
    },
    {
      key: "routing_policy",
      header: "Routing",
      sortable: false,
      render: (record: DNSRecord) => (
        <span className="text-gray-500 text-sm">{record.routing_policy}</span>
      ),
    },
    {
      key: "value",
      header: "Value/Route traffic to",
      sortable: false,
      render: (record: DNSRecord) => {
        const isIpv4 = record.type === "A";
        const isIpv6 = record.type === "AAAA";
        return (
          <span className={`text-sm ${isIpv4 || isIpv6 ? "font-mono text-gray-800" : "text-gray-700"}`}>
            {record.value}
          </span>
        );
      },
    },
    {
      key: "ttl",
      header: "TTL",
      sortable: true,
      render: (record: DNSRecord) => (
        <span className="text-gray-500 text-sm">{record.ttl}</span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={records}
      keyExtractor={(r) => r.id}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      emptyMessage="No records found"
      rowActions={(record) => (
        <ActionMenu
          items={[
            { label: "Edit", onClick: () => onEdit(record) },
            { label: "Delete", onClick: () => onDelete(record), danger: true },
          ]}
        />
      )}
    />
  );
}