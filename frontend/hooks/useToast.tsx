"use client";

import { useState, useCallback, createContext, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Toast, ToastType } from "@/types";

interface ToastState {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastState | null>(null);

let toastId = 0;

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

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = String(++toastId);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      {mounted &&
        createPortal(
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
                  <button onClick={() => dismiss(toast.id)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return { showToast: ctx.showToast };
}