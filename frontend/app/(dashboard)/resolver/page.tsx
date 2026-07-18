"use client";

import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/sections/ComingSoon";

export default function ResolverPage() {
  return (
    <AppShell
      breadcrumbs={[
        { label: "Route 53", href: "/dashboard" },
        { label: "Resolver" },
      ]}
    >
      <ComingSoon featureName="Resolver" />
    </AppShell>
  );
}