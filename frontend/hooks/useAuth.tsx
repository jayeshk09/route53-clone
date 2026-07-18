"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { loginUser, logoutUser, fetchSession } from "@/services/authService";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const router = useRouter();

  const checkSession = useCallback(async () => {
    try {
      const user = await fetchSession();
      if (user) {
        setState({ user, isLoading: false, isAuthenticated: true });
        return;
      }
    } catch {}
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await loginUser(email, password);
    setState({ user, isLoading: false, isAuthenticated: true });
    router.push("/dashboard");
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {}
    setState({ user: null, isLoading: false, isAuthenticated: false });
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}