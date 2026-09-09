const BASE_URL = "http://localhost:3000";

export async function apiGet<T>(endpoint: string): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Kunde inte hämta data från ${endpoint} (Status: ${response.status})`);
  }

  return (await response.json()) as T;
}

export async function apiPost<T, B = unknown>(endpoint: string, body: B): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Kunde inte skapa resurs på ${endpoint} (Status: ${response.status})`);
  }

  return (await response.json()) as T;
}


export async function apiPatch<T, B = Partial<T>>(endpoint: string, body: B): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Kunde inte uppdatera resurs på ${endpoint} (Status: ${response.status})`);
  }

  return (await response.json()) as T;
}

export async function apiDelete<T = void>(endpoint: string): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Kunde inte ta bort resurs på ${endpoint} (Status: ${response.status})`);
  }

  return (await response.json()) as T;
}
