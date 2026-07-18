"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  ShieldCheck,
  TrafficCone,
  Network,
  Server,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hosted-zones", label: "Hosted zones", icon: Globe },
  { href: "/health-checks", label: "Health checks", icon: ShieldCheck },
  { href: "/traffic-policies", label: "Traffic policies", icon: TrafficCone },
  { href: "/resolver", label: "Resolver", icon: Network },
  { href: "/profiles", label: "Profiles", icon: Server },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const navContent = (
    <>
      <div className="px-4 py-3 border-b border-[#34495e] flex items-center justify-between">
        <span className="text-white font-bold text-sm">Route 53</span>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <ul className="py-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
                  active
                    ? "border-l-4 border-[#ff9900] bg-[#2c3e50] text-white font-medium"
                    : "border-l-4 border-transparent text-gray-400 hover:bg-[#2c3e50] hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 left-4 z-30 bg-[#232f3e] text-white p-3 rounded-full shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div
        className={`fixed inset-0 z-20 bg-black/50 lg:hidden transition-opacity ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <nav className="w-[220px] bg-[#232f3e] min-h-[calc(100vh-48px)] flex-shrink-0 overflow-y-auto hidden lg:block z-10">
        {navContent}
      </nav>

      <nav
        className={`fixed top-0 left-0 z-30 w-[220px] bg-[#232f3e] h-full overflow-y-auto lg:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </nav>
    </>
  );
}