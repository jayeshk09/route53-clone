import api from "@/lib/api";
import { User } from "@/types";

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  const result = await api.post<{
    success: boolean;
    data: { user_id: number; email: string; username: string; token: string };
  }>("/auth/login", { email, password });

  return {
    user: { id: result.data.user_id, email: result.data.email, username: result.data.username },
    token: result.data.token,
  };
}

export async function logoutUser(): Promise<void> {
  await api.post("/auth/logout");
}

export async function fetchSession(): Promise<User | null> {
  const result = await api.get<{
    success: boolean;
    data: { user_id: number; email: string; username: string; is_authenticated: boolean };
  }>("/auth/session");

  if (result.success && result.data.is_authenticated) {
    return { id: result.data.user_id, email: result.data.email, username: result.data.username };
  }
  return null;
}