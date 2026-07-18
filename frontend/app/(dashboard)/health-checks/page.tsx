"use client";

import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/sections/ComingSoon";

export default function HealthChecksPage() {
  return (
    <AppShell
      breadcrumbs={[
        { label: "Route 53", href: "/dashboard" },
        { label: "Health checks" },
      ]}
    >
      <ComingSoon featureName="Health checks" />
    </AppShell>
  );
}