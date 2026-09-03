import { Link } from "react-router";
import { useFetch } from "../hooks/useFetch";
import type { Rum } from "../types/rum";

export const navOrder = 2;
export const navTitle = "Rum";

export function RumSida() {
  const { data: rum, loading, error } = useFetch<Rum[]>("/rum");

  if (loading) {
    return (
      <div>
        <h2>Tillgängliga Grupprum</h2>
        <p>Laddar rum...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Tillgängliga Grupprum</h2>
        <p role="alert">
          Kunde inte hämta rum just nu. Försök ladda om sidan.
          {import.meta.env.DEV && ` (${error})`}
        </p>
      </div>
    );
  }

  if (!rum || rum.length === 0) {
    return (
      <div>
        <h2>Tillgängliga Grupprum</h2>
        <p>Inga grupprum hittades.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Tillgängliga Grupprum</h2>
      <p>Här visas listan över alla grupprum i biblioteket.</p>

      <ul>
        {rum.map((r) => (
          <li key={r.id}>
            <Link to={`/rumdetaljsida/${r.id}`}>
              <strong>{r.name}</strong> — Kapacitet: {r.capacity}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RumSida;
