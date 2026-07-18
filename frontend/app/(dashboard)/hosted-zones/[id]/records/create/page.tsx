"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import CreateRecordForm from "@/components/forms/CreateRecordForm";
import { useDNSRecords } from "@/hooks/useDNSRecords";
import { useHostedZones } from "@/hooks/useHostedZones";
import { useToast } from "@/hooks/useToast";
import { RecordType } from "@/types";
import Spinner from "@/components/common/Spinner";

export default function CreateDNSRecordPage() {
  const params = useParams();
  const router = useRouter();
  const zoneId = params.id as string;

  const [zoneDomain, setZoneDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const { createRecord } = useDNSRecords(zoneId);
  const { getZone } = useHostedZones();
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchZone() {
      try {
        const data = await getZone(zoneId);
        setZoneDomain(data.domain_name);
      } catch {}
      setLoading(false);
    }
    fetchZone();
  }, [zoneId]);

  async function handleSubmit(data: {
    name: string;
    type: RecordType;
    value: string;
    ttl: number;
  }) {
    try {
      await createRecord(data);
      showToast("Record created", "success");
      router.push(`/hosted-zones/${zoneId}`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Create failed", "error");
    }
  }

  if (loading) {
    return (
      <AppShell
        breadcrumbs={[
          { label: "Route 53", href: "/dashboard" },
          { label: "Hosted zones", href: "/hosted-zones" },
          { label: "Create Record" },
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
        { label: zoneDomain, href: `/hosted-zones/${zoneId}` },
        { label: "Create Record" },
      ]}
    >
      <h1 className="text-[28px] font-bold text-gray-800 mb-6">
        Create record
      </h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-xl">
        <CreateRecordForm
          zoneDomain={zoneDomain}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/hosted-zones/${zoneId}`)}
        />
      </div>
    </AppShell>
  );
}