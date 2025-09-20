// lib/fetcher.ts
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000" // fallback dev

export async function fetcher<T>(
  url: string,
  options?: RequestInit & { revalidate?: number; internal?: boolean }
): Promise<T> {
  // Kalau internal = true, otomatis tambahkan BASE_URL
  const finalUrl = options?.internal
    ? `${BASE_URL}${url.startsWith("/") ? url : "/" + url}`
    : url

  const res = await fetch(finalUrl, {
    ...(options?.revalidate
      ? { next: { revalidate: options.revalidate } }
      : { cache: "no-store" }),
    ...options,
  })

  if (!res.ok) {
    throw new Error(`Fetch error ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

// services/crud.ts
// import { fetcher } from "@/lib/fetcher"

export function resources<T>(baseUrl: string, internal = false) {
  return {
    GET: {
      all: (revalidate?: number) =>
        fetcher<T[]>(baseUrl, { revalidate, internal }),
      byId: (id: string | number, revalidate?: number) =>
        fetcher<T>(`${baseUrl}/${id}`, { revalidate, internal }),
    },
    POST: {
      create: (data: Partial<T>) =>
        fetcher<T>(baseUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          internal,
        }),
    },
    PUT: {
      update: (id: string | number, data: Partial<T>) =>
        fetcher<T>(`${baseUrl}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          internal,
        }),
    },
    DELETE: {
      remove: (id: string | number) =>
        fetcher<{ success: boolean }>(`${baseUrl}/${id}`, {
          method: "DELETE",
          internal,
        }),
    },
  }
}

