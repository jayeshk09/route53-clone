"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import CreateZoneForm from "@/components/forms/CreateZoneForm";
import { useHostedZones } from "@/hooks/useHostedZones";
import { useToast } from "@/hooks/useToast";

export default function CreateHostedZonePage() {
  const router = useRouter();
  const { createZone } = useHostedZones();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data: {
    domain_name: string;
    type: string;
    description: string;
  }) {
    setLoading(true);
    try {
      await createZone(data);
      showToast(`Hosted zone '${data.domain_name}' created`, "success");
      router.push("/hosted-zones");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to create zone", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      breadcrumbs={[
        { label: "Route 53", href: "/dashboard" },
        { label: "Hosted zones", href: "/hosted-zones" },
        { label: "Create" },
      ]}
    >
      <h1 className="text-[28px] font-bold text-gray-800 mb-6">
        Create hosted zone
      </h1>
      <CreateZoneForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/hosted-zones")}
        loading={loading}
      />
    </AppShell>
  );
}