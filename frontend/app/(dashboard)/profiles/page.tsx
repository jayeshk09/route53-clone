"use client";

import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/sections/ComingSoon";

export default function ProfilesPage() {
  return (
    <AppShell
      breadcrumbs={[
        { label: "Route 53", href: "/dashboard" },
        { label: "Profiles" },
      ]}
    >
      <ComingSoon featureName="Profiles" />
    </AppShell>
  );
}