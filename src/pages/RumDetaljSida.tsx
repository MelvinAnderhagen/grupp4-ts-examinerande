import { useParams, Link } from "react-router";
import { useState, useEffect, useCallback } from "react";
import { Users, MapPin, Monitor, ArrowLeft, CalendarPlus, CheckCircle2 } from "lucide-react";
import type { Rum } from "../types/rum";
import type { Bokning } from "../types/bokning";
import { apiGet } from "../api/client";
import { List } from "../components/List";
import { BokningsFormular } from "../components/BokningsFormular";
import { Badge } from "@/components/ui/badge";

export const hideFromNav = true;

export function RumDetaljSida() {
  const { id } = useParams<{ id: string }>();
  const [rum, setRum] = useState<Rum | null>(null);
  const [bokningar, setBokningar] = useState<Bokning[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [showBookingForm, setShowBookingForm] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(undefined);

    try {
      const [rumData, allaBokningar] = await Promise.all([
        apiGet<Rum>(`/rum/${id}`),
        apiGet<Bokning[]>("/bokningar"),
      ]);

      setRum(rumData);
      const rummetsBokningar = allaBokningar.filter(
        (b) => String(b.roomId) === String(id)
      );
      setBokningar(rummetsBokningar);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBookingCreated = (newBooking: Bokning) => {
    setBokningar((prev) => [...prev, newBooking]);
    setShowBookingForm(false);
    setSuccessNotice(`Bokningen för ${newBooking.date} kl ${newBooking.startTime}–${newBooking.endTime} är bekräftad!`);
    setTimeout(() => {
      setSuccessNotice(null);
    }, 6000);
  };

  const renderStatusBadge = (status: Bokning["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            Bekräftad
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
            Avbokad
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            Väntande
          </span>
        );
      default: {
        const _exhaustiveCheck: never = status;
        return _exhaustiveCheck;
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
        <p>Laddar rummets detaljer...</p>
      </div>
    );
  }

  if (error || !rum) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/rumsida"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Tillbaka till alla rum
        </Link>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
          <h2 className="font-semibold text-lg mb-1">Kunde inte hitta rummet</h2>
          <p className="text-sm">{error || "Det begärda rummet existerar inte."}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <Link
          to="/rumsida"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Tillbaka till alla rum
        </Link>

        {successNotice && (
          <div
            role="status"
            className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <p className="font-medium">{successNotice}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">{rum.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gray-500" />
                {rum.plats}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-gray-500" />
                Kapacitet: {rum.capacity} personer
              </span>
            </div>

            {rum.utrustning && rum.utrustning.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-gray-500 mr-1">
                  <Monitor className="h-3.5 w-3.5" /> Utrustning:
                </span>
                {rum.utrustning.map((item, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-gray-50 border-gray-200 text-gray-700 text-xs"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowBookingForm((prev) => !prev)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-xs hover:bg-gray-800 transition-colors cursor-pointer self-start md:self-center"
          >
            <CalendarPlus className="h-4 w-4" />
            {showBookingForm ? "Dölj formulär" : "Boka detta rum"}
          </button>
        </div>
      </div>

      {showBookingForm && (
        <section aria-label="Bokningsformulär">
          <BokningsFormular
            roomId={rum.id}
            roomName={rum.name}
            existingBookings={bokningar}
            onBookingCreated={handleBookingCreated}
            onCancel={() => setShowBookingForm(false)}
          />
        </section>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Schemalagda bokningar</h2>
          <p className="text-sm text-gray-600">
            Befintliga och tidigare pass för detta rum.
          </p>
        </div>

        {/* Generisk List<T>-komponent återanvänd för Bokning */}
        <List<Bokning>
          items={bokningar}
          loading={loading}
          error={error}
          getKey={(b) => b.id}
          emptyMessage="Inga tidigare eller kommande bokningar finns för detta rum. Rummet är helt ledigt!"
          renderItem={(b) => {
            const isCancelled = b.status === "cancelled";

            return (
              <div
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-gray-200 bg-white transition-colors ${
                  isCancelled ? "opacity-60 bg-gray-50" : "hover:border-gray-300"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">
                      {b.date} • {b.startTime}–{b.endTime}
                    </span>
                    {renderStatusBadge(b.status)}
                  </div>
                  <p className="text-xs text-gray-600">
                    Bokad av: <span className="font-medium text-gray-800">{b.bokningsEmail}</span>
                  </p>
                </div>

                {isCancelled && (
                  <span className="text-xs text-rose-600 font-medium self-start sm:self-center">
                    Tiden är avbokad och kan bokas igen
                  </span>
                )}
              </div>
            );
          }}
        />
      </section>
    </main>
  );
}

export default RumDetaljSida;
