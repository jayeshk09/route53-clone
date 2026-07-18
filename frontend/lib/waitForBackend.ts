const API = process.env.NEXT_PUBLIC_API_URL;

export async function waitForBackend(): Promise<void> {
  const healthUrl = API ? `${API.replace(/\/api$/, "")}/api/health` : "/api/health";

  while (true) {
    try {
      const res = await fetch(healthUrl, { cache: "no-store" });
      if (res.ok) return;
    } catch {}

    await new Promise((r) => setTimeout(r, 3000));
  }
}