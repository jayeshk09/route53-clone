"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import Button from "@/components/common/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4">
      <svg width="60" height="36" viewBox="0 0 60 36" className="mb-6">
        <rect width="60" height="36" rx="6" fill="#ff9900" />
        <text x="30" y="24" textAnchor="middle" fill="#232f3e" fontSize="16" fontWeight="bold" fontFamily="Arial">
          AWS
        </text>
      </svg>

      <AlertTriangle className="h-16 w-16 text-[#ff9900] mb-4" />

      <h1 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h1>
      <p className="text-gray-600 text-sm mb-8 text-center max-w-sm">
        The page you are looking for does not exist or may have been moved.
        Please check the URL or navigate back to the dashboard.
      </p>

      <div className="flex gap-3">
        <Link href="/hosted-zones">
          <Button variant="secondary">Back to Hosted Zones</Button>
        </Link>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}