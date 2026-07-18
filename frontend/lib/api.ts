const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string | number>
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const options: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);

    if (!res.ok) {
      let errorMessage = "An error occurred";
      try {
        const errorData = await res.json();
        errorMessage = errorData.detail || errorData.error?.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    if (res.status === 204) {
      return undefined as T;
    }

    const data = await res.json();
    return data as T;
  }

  get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
    return this.request<T>("GET", path, undefined, params);
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }
}

const api = new ApiClient(API_URL);
export default api;