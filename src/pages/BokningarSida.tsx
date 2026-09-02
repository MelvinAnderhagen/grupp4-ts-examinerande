import { useEffect, useState } from "react";
import type { Bokning } from "../types/bokning";
import type { Rum } from "../types/rum";

const BASE_URL = "http://localhost:3000";

export const navOrder = 3;
export const navTitle = "Bokningar";

export function BokningarSida() {
  const [bokningar, setBokningar] = useState<Bokning[]>([]);
  const [rumMap, setRumMap] = useState<Record<string, Rum>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [bokningarRes, rumRes] = await Promise.all([
        fetch(`${BASE_URL}/bokningar`),
        fetch(`${BASE_URL}/rum`),
      ]);

      if (!bokningarRes.ok || !rumRes.ok) {
        throw new Error("Kunde inte hämta data från servern");
      }

      const bokningarData: Bokning[] = await bokningarRes.json();
      const rumData: Rum[] = await rumRes.json();

      const mapping: Record<string, Rum> = {};
      rumData.forEach((rum) => {
        mapping[rum.id] = rum;
      });

      setBokningar(bokningarData);
      setRumMap(mapping);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm("Är du säker på att du vill avboka denna tid?")) {
      return;
    }

    setCancellingId(id);
    setActionMessage(null);

    try {
      const response = await fetch(`${BASE_URL}/bokningar/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!response.ok) {
        throw new Error("Kunde inte avboka. Försök igen senare.");
      }

      setBokningar((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
      );
      setActionMessage({ text: "Bokningen har avbokats!", type: "success" });
    } catch (err) {
      setActionMessage({ text: (err as Error).message, type: "error" });
    } finally {
      setCancellingId(null);
    }
  };

  const renderStatusBadge = (status: Bokning["status"]) => {
    const badges = {
      confirmed: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-rose-100 text-rose-800",
      pending: "bg-amber-100 text-amber-800",
    };

    const labels = {
      confirmed: "Bekräftad",
      cancelled: "Avbokad",
      pending: "Väntande",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status] || "bg-gray-100 text-gray-800"
          }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skapade bokningar</h1>
          <p className="text-sm text-gray-600 mt-1">
            Översikt över alla genomförda rumsbokningar samt möjlighet att avboka.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-xs text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-hidden transition-colors cursor-pointer w-fit"
        >
          Uppdatera lista
        </button>
      </header>

      {actionMessage && (
        <aside
          role="status"
          className={`p-4 rounded-md mb-6 ${actionMessage.type === "success"
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
            : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
        >
          {actionMessage.text}
        </aside>
      )}

      {error && (
        <aside
          role="alert"
          className="p-4 rounded-md bg-rose-50 text-rose-800 border border-rose-200 mb-6"
        >
          <p className="font-semibold">Ett fel uppstod:</p>
          <p>{error}</p>
        </aside>
      )}

      {loading ? (
        <section aria-live="polite" className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Laddar bokningar...</span>
        </section>
      ) : bokningar.length === 0 ? (
        <p className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          Inga bokningar hittades.
        </p>
      ) : (
        <section
          aria-label="Bokningslista"
          className="overflow-hidden bg-white shadow-xs rounded-lg border border-gray-200"
        >
          <ul className="divide-y divide-gray-200">
            {bokningar.map((bokning) => {
              const rum = rumMap[bokning.roomId];
              const isCancelled = bokning.status === "cancelled";

              return (
                <li
                  key={bokning.id}
                  className={`p-6 transition-colors ${isCancelled ? "bg-gray-50 opacity-75" : "hover:bg-gray-50"
                    }`}
                >
                  <article className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Bokningsinformation */}
                    <div className="space-y-1">
                      <header className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {rum ? rum.name : `Rum ${bokning.roomId}`}
                        </h3>
                        {renderStatusBadge(bokning.status)}
                      </header>

                      {rum && (
                        <p className="text-xs text-gray-500">
                          Plats: {rum.plats} • Kapacitet: {rum.capacity} pers
                        </p>
                      )}

                      <dl className="pt-2 text-sm text-gray-700 flex flex-wrap gap-x-6 gap-y-1">
                        <div className="flex gap-1">
                          <dt className="font-medium text-gray-900">Datum:</dt>
                          <dd>
                            <time dateTime={bokning.date}>{bokning.date}</time>
                          </dd>
                        </div>
                        <div className="flex gap-1">
                          <dt className="font-medium text-gray-900">Tid:</dt>
                          <dd>
                            <time>{bokning.startTime}</time> –{" "}
                            <time>{bokning.endTime}</time>
                          </dd>
                        </div>
                        <div className="flex gap-1">
                          <dt className="font-medium text-gray-900">Bokad av:</dt>
                          <dd className="text-gray-600">
                            {bokning.bokningsEmail || "Okänd"}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <footer className="flex items-center gap-2 self-end md:self-center">
                      {!isCancelled ? (
                        <button
                          onClick={() => handleCancelBooking(bokning.id)}
                          disabled={cancellingId === bokning.id}
                          className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-md hover:bg-rose-700 focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          {cancellingId === bokning.id ? "Avbokar..." : "Avboka"}
                        </button>
                      ) : (
                        <span className="text-sm font-medium text-gray-400 italic">
                          Avbokad
                        </span>
                      )}
                    </footer>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}

export default BokningarSida;
