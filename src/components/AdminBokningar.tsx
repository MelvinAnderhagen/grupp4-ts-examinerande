import { useEffect, useState, useCallback } from "react";
import type { Bokning } from "../types/bokning";
import type { Rum } from "../types/rum";
import { apiGet, apiPatch } from "../api/client";
import { List } from "./List";

export function AdminBokningar() {
  const [bokningar, setBokningar] = useState<Bokning[]>([]);
  const [rumMap, setRumMap] = useState<Record<string, Rum>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [actionMessage, setActionMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      const [bokningarData, rumData] = await Promise.all([
        apiGet<Bokning[]>("/bokningar"),
        apiGet<Rum[]>("/rum"),
      ]);

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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm("Är du säker på att du vill avboka denna tid?")) {
      return;
    }

    setCancellingId(id);
    setActionMessage(null);

    try {
      await apiPatch<Bokning>(`/bokningar/${id}`, { status: "cancelled" });

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

  const isBookingPast = (date: string, endTime: string): boolean => {
    const bookingEndTime = new Date(`${date}T${endTime}`);
    return !isNaN(bookingEndTime.getTime()) && bookingEndTime < new Date();
  };

  const renderStatusBadge = (status: Bokning["status"], isPast: boolean) => {
    if (status === "cancelled") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
          Avbokad
        </span>
      );
    }

    if (isPast) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          Avslutad
        </span>
      );
    }

    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            Bekräftad
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            Väntande
          </span>
        );
      default: {
        const _exhaustiveCheck: never = status;
        return _exhaustiveCheck;
      }
    }
  };

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bokningar</h2>
          <p className="text-sm text-gray-600 mt-0.5">
            Översikt över alla genomförda rumsbokningar samt möjlighet att avboka aktiva tider.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-xs text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-hidden transition-colors cursor-pointer w-fit"
        >
          Uppdatera lista
        </button>
      </div>

      {actionMessage && (
        <aside
          role="status"
          className={`p-4 rounded-md mb-6 border ${
            actionMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {actionMessage.text}
        </aside>
      )}

      <List<Bokning>
        items={bokningar}
        loading={loading}
        error={error}
        getKey={(b) => b.id}
        emptyMessage="Inga bokningar hittades i systemet."
        renderItem={(bokning) => {
          const rum = rumMap[bokning.roomId];
          const isCancelled = bokning.status === "cancelled";
          const isPast = isBookingPast(bokning.date, bokning.endTime);

          return (
            <article
              className={`p-6 rounded-xl border border-gray-200 bg-white transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                isCancelled || isPast ? "bg-gray-50 opacity-75" : "hover:border-gray-300"
              }`}
            >
              <div className="space-y-1">
                <header className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {rum ? rum.name : `Rum ${bokning.roomId}`}
                  </h3>
                  {renderStatusBadge(bokning.status, isPast)}
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
                      <time>{bokning.startTime}</time> – <time>{bokning.endTime}</time>
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
                {isCancelled ? (
                  <span className="text-sm font-medium text-rose-500 italic">
                    Avbokad
                  </span>
                ) : isPast ? (
                  <span className="text-sm font-medium text-gray-400 italic">
                    Passerad tid (kan ej avbokas)
                  </span>
                ) : (
                  <button
                    onClick={() => handleCancelBooking(bokning.id)}
                    disabled={cancellingId === bokning.id}
                    className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-md hover:bg-rose-700 focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {cancellingId === bokning.id ? "Avbokar..." : "Avboka"}
                  </button>
                )}
              </footer>
            </article>
          );
        }}
      />
    </section>
  );
}

export default AdminBokningar;
