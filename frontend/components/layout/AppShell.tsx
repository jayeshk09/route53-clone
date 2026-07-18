"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import BreadcrumbsComponent from "./Breadcrumbs";
import { BreadcrumbItem } from "@/types";
import React from "react";

interface AppShellProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AppShell({ children, breadcrumbs = [] }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {breadcrumbs.length > 0 && <BreadcrumbsComponent items={breadcrumbs} />}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}