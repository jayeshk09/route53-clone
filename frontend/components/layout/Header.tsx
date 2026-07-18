"use client";

import Link from "next/link";
import { Bell, HelpCircle, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { logout } = useAuth();

  return (
    <header className="h-12 bg-[#232f3e] text-white flex items-center justify-between px-4 flex-shrink-0 z-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
            <rect width="40" height="24" rx="4" fill="#ff9900" />
            <text x="20" y="16" textAnchor="middle" fill="#232f3e" fontSize="12" fontWeight="bold" fontFamily="Arial">
              AWS
            </text>
          </svg>
        </Link>
        <span className="text-sm text-gray-400 border border-gray-600 rounded px-2 py-0.5">
          Route 53
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-1.5 text-gray-300 hover:text-white rounded hover:bg-[#34495e] transition-colors">
          <Bell className="h-4 w-4" />
        </button>
        <button className="p-1.5 text-gray-300 hover:text-white rounded hover:bg-[#34495e] transition-colors">
          <HelpCircle className="h-4 w-4" />
        </button>
        <span className="text-sm text-gray-300">Global</span>
        <button className="p-1.5 text-gray-300 hover:text-white rounded hover:bg-[#34495e] transition-colors">
          <User className="h-4 w-4" />
        </button>
        <button
          onClick={logout}
          className="p-1.5 text-gray-300 hover:text-white rounded hover:bg-[#34495e] transition-colors"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}