"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Toast, ToastType } from "@/types";

const toastIcons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastBorders: Record<ToastType, string> = {
  success: "border-l-green-500",
  error: "border-l-red-500",
  info: "border-l-blue-500",
  warning: "border-l-orange-500",
};

const toastTexts: Record<ToastType, string> = {
  success: "text-green-700",
  error: "text-red-700",
  info: "text-blue-700",
  warning: "text-orange-700",
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 bg-white border-l-4 ${toastBorders[toast.type]} rounded-lg shadow-lg p-4 max-w-xs animate-[slideUp_300ms_ease-out]`}
          >
            <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${toastTexts[toast.type]}`} />
            <p className={`text-sm flex-1 ${toastTexts[toast.type]}`}>{toast.message}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}