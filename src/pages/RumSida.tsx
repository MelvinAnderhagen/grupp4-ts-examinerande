import { useFetch } from "../hooks/useFetch";
import type { rum } from "../types/rum";

export function RumSida() {
  const { data: rum, loading, error } = useFetch<rum[]>("/rum");
  return (
    <div>
      <h2>Tillgängliga Grupprum</h2>
      <p>Här visas listan över alla grupprum i biblioteket.</p>

      {!loading ? (
        rum?.map((r) => (
          <ul>
            <li key={r.id}>Namn: {r.name}</li>
            <li>Kapacitet: {r.capacity}</li>
            <li>Våning: {r.location}</li>
          </ul>
        ))
      ) : (
        <p>Laddar...</p>
      )}
    </div>
  );
}

export default RumSida;
