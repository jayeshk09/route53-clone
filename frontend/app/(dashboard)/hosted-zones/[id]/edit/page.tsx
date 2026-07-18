"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Spinner from "@/components/common/Spinner";
import EditZoneForm from "@/components/forms/EditZoneForm";
import { useHostedZones } from "@/hooks/useHostedZones";
import { useToast } from "@/hooks/useToast";
import { HostedZone } from "@/types";

export default function EditHostedZonePage() {
  const params = useParams();
  const router = useRouter();
  const zoneId = params.id as string;

  const { updateZone, getZone } = useHostedZones();
  const { showToast } = useToast();
  const [zone, setZone] = useState<HostedZone | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchZone() {
      try {
        const data = await getZone(zoneId);
        setZone(data);
      } catch {}
      setLoading(false);
    }
    fetchZone();
  }, [zoneId]);

  async function handleSubmit(formData: { domain_name?: string; description?: string }) {
    setSaving(true);
    try {
      await updateZone(zoneId, formData);
      showToast("Hosted zone updated", "success");
      router.push(`/hosted-zones/${zoneId}`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Update failed", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppShell
        breadcrumbs={[
          { label: "Route 53", href: "/dashboard" },
          { label: "Hosted zones", href: "/hosted-zones" },
          { label: "Edit" },
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
        { label: zone?.domain_name || "", href: `/hosted-zones/${zoneId}` },
        { label: "Edit" },
      ]}
    >
      <h1 className="text-[28px] font-bold text-gray-800 mb-6">
        Edit hosted zone
      </h1>
      {zone && (
        <EditZoneForm
          zone={zone}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/hosted-zones/${zoneId}`)}
          loading={saving}
        />
      )}
    </AppShell>
  );
}