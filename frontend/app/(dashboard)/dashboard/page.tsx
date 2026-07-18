"use client";

import { useRouter } from "next/navigation";
import {
  Globe,
  TrafficCone,
  ShieldCheck,
  Database,
  Search,
  Network,
} from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import AppShell from "@/components/layout/AppShell";
import { useHostedZones } from "@/hooks/useHostedZones";

const dashboardCards = [
  { title: "DNS management", stat: "1", label: "Hosted zone", icon: Globe, href: "/hosted-zones" },
  { title: "Traffic management", stat: "Route traffic", label: "globally", icon: TrafficCone, href: "/traffic-policies" },
  { title: "Availability monitoring", stat: "Monitor", label: "endpoints", icon: ShieldCheck, href: "/health-checks" },
  { title: "Domain registration", stat: "1", label: "Domain", icon: Database, href: "/hosted-zones" },
  { title: "Resolver", stat: "DNS", label: "resolution", icon: Network, href: "/resolver" },
  { title: "Profiles", stat: "Route 53", label: "profiles", icon: Search, href: "/profiles" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { pagination } = useHostedZones();

  const totalZones = pagination?.total ?? 0;

  return (
    <AppShell
      breadcrumbs={[
        { label: "Route 53", href: "/dashboard" },
        { label: "Dashboard" },
      ]}
    >
      <h1 className="text-[28px] font-bold text-gray-800 mb-6">
        Route 53 Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          const stat = card.title === "DNS management" ? String(totalZones) : card.stat;
          return (
            <Card key={card.title}>
              <h3 className="text-base font-bold text-gray-800 mb-3">{card.title}</h3>
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-5 w-5 text-gray-400" />
                <span className="text-2xl font-bold text-[#0073bb]">{stat}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{card.label}</p>
              <Button variant="secondary" size="sm" onClick={() => router.push(card.href)}>
                View
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-base font-bold text-gray-800 mb-4">Notifications</h3>
        <p className="text-sm text-gray-500">
          No recent notifications. Create a hosted zone to get started.
        </p>
      </div>
    </AppShell>
  );
}