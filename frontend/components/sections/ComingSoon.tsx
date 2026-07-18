import React from "react";
import { Wrench, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Button from "@/components/common/Button";

interface ComingSoonProps {
  featureName: string;
}

export default function ComingSoon({ featureName }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Wrench className="h-16 w-16 text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h2>
      <p className="text-gray-600 text-sm mb-6 max-w-sm">
        {featureName} is coming to Route 53 Clone
      </p>
      <div className="flex gap-3">
        <Link href="/dashboard">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}