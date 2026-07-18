"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = "Invalid email format";

    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <svg width="60" height="36" viewBox="0 0 60 36" className="mx-auto mb-4">
            <rect width="60" height="36" rx="6" fill="#ff9900" />
            <text x="30" y="24" textAnchor="middle" fill="#232f3e" fontSize="16" fontWeight="bold" fontFamily="Arial">
              AWS
            </text>
          </svg>
          <h1 className="text-2xl font-bold text-gray-800">Route 53 Login</h1>
          <p className="text-sm text-gray-500 mt-1">DNS management console</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-2 mb-4">
              {serverError}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email"
              required
              type="text"
              placeholder="demo@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              error={errors.email}
            />

            <div className="relative">
              <Input
                label="Password"
                required
                type={showPassword ? "text" : "password"}
                placeholder="password123"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                }}
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full mt-6" loading={loading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}