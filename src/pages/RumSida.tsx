import { useFetch } from "../hooks/useFetch";
import type { Rum } from "../types/rum";

export function RumSida() {
  const { data: rum, loading, error } = useFetch<Rum[]>("/rum");
  return (
    <div>
      <h2>Tillgängliga Grupprum</h2>
      <p>Här visas listan över alla grupprum i biblioteket.</p>

      {!loading ? (
        rum?.map((r) => (
          <ul>
            <li key={r.id}>Namn: {r.name}</li>
            <li>Kapacitet: {r.capacity}</li>
          </ul>
        ))
      ) : (
        <p>Laddar...</p>
      )}
    </div>
  );
}

export default RumSida;
