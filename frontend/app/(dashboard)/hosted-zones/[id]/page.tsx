"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";
import Modal from "@/components/common/Modal";
import Tabs from "@/components/sections/Tabs";
import CollapsibleSection from "@/components/sections/CollapsibleSection";
import DNSRecordsTable from "@/components/tables/DNSRecordsTable";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import EditRecordForm from "@/components/forms/EditRecordForm";
import CreateRecordForm from "@/components/forms/CreateRecordForm";
import { useHostedZones } from "@/hooks/useHostedZones";
import { useDNSRecords } from "@/hooks/useDNSRecords";
import { useToast } from "@/hooks/useToast";
import { DNSRecord, RecordType } from "@/types";
import { useEffect, useState as useGetZone } from "react";

export default function HostedZoneDetailPage() {
  const params = useParams();
  const router = useRouter();
  const zoneId = params.id as string;

  const [zone, setZone] = useGetZone<HostedZoneData | null>(null);

  const { getZone, deleteZone } = useHostedZones();
  const {
    records, pagination, isLoading,
    sortBy, sortOrder, setSortBy, setSortOrder,
    refresh, createRecord, updateRecord, deleteRecord,
  } = useDNSRecords(zoneId);

  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("records");
  const [deleteRecordTarget, setDeleteRecordTarget] = useState<DNSRecord | null>(null);
  const [editRecordTarget, setEditRecordTarget] = useState<DNSRecord | null>(null);
  const [showCreateRecord, setShowCreateRecord] = useState(false);
  const [deleteZoneOpen, setDeleteZoneOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchZone() {
      try {
        const data = await getZone(zoneId);
        setZone(data as HostedZoneData);
      } catch {}
    }
    fetchZone();
  }, [zoneId, getZone]);

  type HostedZoneData = {
    id: string;
    domain_name: string;
    type: string;
    description?: string;
    record_count: number;
    created_by: string;
    created_at: string;
    updated_at: string;
  };

  function handleSort(key: string) {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  }

  async function handleDeleteRecord() {
    if (!deleteRecordTarget) return;
    try {
      await deleteRecord(deleteRecordTarget.id);
      showToast("Record deleted", "success");
      setDeleteRecordTarget(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  }

  async function handleEditRecord(data: { value: string; ttl: number }) {
    if (!editRecordTarget) return;
    setSaving(true);
    try {
      await updateRecord(editRecordTarget.id, data);
      showToast("Record updated", "success");
      setEditRecordTarget(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Update failed", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateRecord(data: {
    name: string;
    type: RecordType;
    value: string;
    ttl: number;
  }) {
    try {
      await createRecord(data);
      showToast("Record created", "success");
      setShowCreateRecord(false);
      if (zone) setZone({ ...zone, record_count: zone.record_count + 1 });
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Create failed", "error");
    }
  }

  async function handleDeleteZone() {
    setDeleting(true);
    try {
      await deleteZone(zoneId);
      showToast("Zone deleted", "success");
      router.push("/hosted-zones");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  }

  if (!zone) {
    return (
      <AppShell
        breadcrumbs={[
          { label: "Route 53", href: "/dashboard" },
          { label: "Hosted zones", href: "/hosted-zones" },
        ]}
      >
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      breadcrumbs={[
        { label: "Route 53", href: "/dashboard" },
        { label: "Hosted zones", href: "/hosted-zones" },
        { label: zone.domain_name },
      ]}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge text={zone.type} />
          <h1 className="text-[28px] font-bold text-gray-800">
            {zone.domain_name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setDeleteZoneOpen(true)}>
            Delete zone
          </Button>
          <Button variant="secondary" onClick={() => router.push(`/hosted-zones/${zoneId}/edit`)}>
            Edit zone
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <CollapsibleSection title="Hosted zone details">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Hosted zone ID</span>
              <span className="text-sm font-mono text-gray-700">{zone.id.substring(0, 14)}...</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</span>
              <span className="text-sm text-gray-700">{zone.type}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Record count</span>
              <span className="text-sm text-gray-700">{records.length}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Created</span>
              <span className="text-sm text-gray-700">
                {new Date(zone.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      <Tabs
        tabs={[
          { value: "records", label: "Records", count: records.length },
          { value: "dnssec", label: "DNSSEC signing" },
          { value: "tags", label: "Hosted zone tags", count: 0 },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      >
        {activeTab === "records" && (
          <div className="bg-white border-x border-b border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter records by property or value"
                  className="h-9 w-64 pl-3 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={refresh}>
                  Refresh
                </Button>
                <Button onClick={() => setShowCreateRecord(true)}>
                  Create record
                </Button>
              </div>
            </div>

            {isLoading && records.length === 0 ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm mb-4">No records found</p>
                <Button onClick={() => setShowCreateRecord(true)}>
                  Create record
                </Button>
              </div>
            ) : (
              <DNSRecordsTable
                records={records}
                zoneDomain={zone.domain_name}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                onEdit={setEditRecordTarget}
                onDelete={setDeleteRecordTarget}
              />
            )}
          </div>
        )}

        {activeTab === "dnssec" && (
          <div className="bg-white border-x border-b border-gray-200 p-6 text-sm text-gray-500">
            DNSSEC signing is not enabled for this hosted zone.
          </div>
        )}

        {activeTab === "tags" && (
          <div className="bg-white border-x border-b border-gray-200 p-6 text-sm text-gray-500">
            No tags associated with this hosted zone.
          </div>
        )}
      </Tabs>

      <DeleteConfirmModal
        open={deleteZoneOpen}
        onClose={() => setDeleteZoneOpen(false)}
        onConfirm={handleDeleteZone}
        title="Delete Hosted Zone"
        itemName={zone.domain_name}
        loading={deleting}
      />

      <DeleteConfirmModal
        open={deleteRecordTarget !== null}
        onClose={() => setDeleteRecordTarget(null)}
        onConfirm={handleDeleteRecord}
        title="Delete DNS Record"
        itemName={
          deleteRecordTarget
            ? `${deleteRecordTarget.name}.${zone.domain_name} (${deleteRecordTarget.type})`
            : ""
        }
      />

      <Modal
        open={editRecordTarget !== null}
        onClose={() => setEditRecordTarget(null)}
        title="Edit DNS Record"
      >
        {editRecordTarget && (
          <EditRecordForm
            record={editRecordTarget}
            zoneDomain={zone.domain_name}
            onSubmit={handleEditRecord}
            onCancel={() => setEditRecordTarget(null)}
            loading={saving}
          />
        )}
      </Modal>

      <Modal
        open={showCreateRecord}
        onClose={() => setShowCreateRecord(false)}
        title="Create Record"
      >
        <CreateRecordForm
          zoneDomain={zone.domain_name}
          onSubmit={handleCreateRecord}
          onCancel={() => setShowCreateRecord(false)}
        />
      </Modal>
    </AppShell>
  );
}