"use client";

import Link from "next/link";
import DataTable from "./DataTable";
import Badge from "@/components/common/Badge";
import ActionMenu from "@/components/common/ActionMenu";
import { HostedZone } from "@/types";

interface HostedZonesTableProps {
  zones: HostedZone[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (key: string) => void;
  onDelete: (zone: HostedZone) => void;
}

export default function HostedZonesTable({
  zones,
  sortBy,
  sortOrder,
  onSort,
  onDelete,
}: HostedZonesTableProps) {
  const columns = [
    {
      key: "domain_name",
      header: "Domain name",
      sortable: true,
      render: (zone: HostedZone) => (
        <Link
          href={`/hosted-zones/${zone.id}`}
          className="text-[#0073bb] hover:underline font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {zone.domain_name}
        </Link>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (zone: HostedZone) => (
        <Badge variant="info" text={zone.type} />
      ),
    },
    {
      key: "created_by",
      header: "Created by",
      sortable: false,
      render: (zone: HostedZone) => (
        <span className="text-gray-500">{zone.created_by}</span>
      ),
    },
    {
      key: "record_count",
      header: "Record count",
      sortable: true,
      render: (zone: HostedZone) => (
        <span className="text-gray-700">{zone.record_count}</span>
      ),
    },
    {
      key: "hosted_zone_id",
      header: "Hosted zone ID",
      sortable: false,
      render: (zone: HostedZone) => (
        <span className="text-gray-500 font-mono text-xs">{zone.id.substring(0, 12)}...</span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={zones}
      keyExtractor={(z) => z.id}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      emptyMessage="No hosted zones found"
      onRowClick={(zone) => {
        window.location.href = `/hosted-zones/${zone.id}`;
      }}
      rowActions={(zone) => (
        <ActionMenu
          items={[
            { label: "View details", href: `/hosted-zones/${zone.id}` },
            { label: "Edit", href: `/hosted-zones/${zone.id}/edit` },
            { label: "Delete", onClick: () => onDelete(zone), danger: true },
          ]}
        />
      )}
    />
  );
}