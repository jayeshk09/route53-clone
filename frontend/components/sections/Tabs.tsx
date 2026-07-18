"use client";

import React, { useState } from "react";

interface Tab {
  value: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

export default function Tabs({ tabs, activeTab, onChange, children }: TabsProps) {
  return (
    <div>
      <div className="flex border-b border-gray-200 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`px-4 py-3 text-sm font-medium border-b-[3px] transition-colors duration-200 ${
              activeTab === tab.value
                ? "border-[#ff9900] text-gray-800"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="text-gray-500 text-sm ml-1">({tab.count})</span>
            )}
          </button>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
}