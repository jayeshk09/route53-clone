"use client";

import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/sections/ComingSoon";

export default function TrafficPoliciesPage() {
  return (
    <AppShell
      breadcrumbs={[
        { label: "Route 53", href: "/dashboard" },
        { label: "Traffic policies" },
      ]}
    >
      <ComingSoon featureName="Traffic policies" />
    </AppShell>
  );
}