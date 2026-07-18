import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export default function Input({
  label,
  error,
  required,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-800 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`h-9 w-full px-3 py-2 text-sm border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb] disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${
          error ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}