import { useState, type FormEvent } from "react";
import type { Bokning } from "../types/bokning";
import type { NewBokning } from "../types/newBokning";
import { apiGet } from "../api/client";
import { postBokning } from "../api/postBokning";
import { checkDoubleBooking } from "../utils/checkDoubleBooking";

export interface BokningsFormularProps {
  roomId: string;
  roomName?: string;
  existingBookings: Bokning[];
  onBookingCreated: (booking: Bokning) => void;
  onCancel?: () => void;
}

export function BokningsFormular({
  roomId,
  roomName,
  existingBookings,
  onBookingCreated,
  onCancel,
}: BokningsFormularProps) {
  const today = new Date().toLocaleDateString("sv-SE");

  const [bokningsEmail, setBokningsEmail] = useState("");
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (startTime >= endTime) {
      setErrorMessage("Sluttiden måste vara senare än starttiden.");
      return;
    }

    const bookingStartDateTime = new Date(`${date}T${startTime}`);
    if (!isNaN(bookingStartDateTime.getTime()) && bookingStartDateTime < new Date()) {
      setErrorMessage("Du kan inte boka en tidpunkt som redan har passerat.");
      return;
    }

    const newBookingData: NewBokning = {
      roomId,
      bokningsEmail: bokningsEmail.trim(),
      date,
      startTime,
      endTime,
      status: "confirmed",
    };

    // Snabb lokal kontroll först
    const isDoubleBooked = checkDoubleBooking(newBookingData, existingBookings);

    if (isDoubleBooked) {
      setErrorMessage(
        "Den valda tiden är tyvärr redan bokad för detta rum. Vänligen välj en annan tidpunkt eller ett annat datum."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Hämta färska bokningar från servern för att kontrollera om någon annan bokat samma tid samtidigt
      const allaBokningar = await apiGet<Bokning[]>("/bokningar");
      const aktuellaRummetsBokningar = allaBokningar.filter(
        (b) => String(b.roomId) === String(roomId)
      );

      const isDoubleBookedOnServer = checkDoubleBooking(newBookingData, aktuellaRummetsBokningar);
      if (isDoubleBookedOnServer) {
        setErrorMessage(
          "Den valda tiden blev precis bokad av en annan användare. Vänligen välj en annan tidpunkt eller ett annat datum."
        );
        setIsSubmitting(false);
        return;
      }

      const createdBooking = await postBokning(newBookingData);
      onBookingCreated(createdBooking);
      setBokningsEmail("");
    } catch (err) {
      setErrorMessage((err as Error).message || "Kunde inte genomföra bokningen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          Boka {roomName ? roomName : "grupprum"}
        </h3>
        <p className="text-sm text-gray-600">
          Fyll i dina uppgifter och välj önskad tid.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="booking-email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Student e-post <span className="text-rose-500">*</span>
          </label>
          <input
            id="booking-email"
            type="email"
            required
            placeholder="namn@student.se"
            value={bokningsEmail}
            onChange={(e) => setBokningsEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-gray-900 focus:outline-hidden focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="booking-date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Datum <span className="text-rose-500">*</span>
          </label>
          <input
            id="booking-date"
            type="date"
            required
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-gray-900 focus:outline-hidden focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="booking-start"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Starttid <span className="text-rose-500">*</span>
            </label>
            <input
              id="booking-start"
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-gray-900 focus:outline-hidden focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="booking-end"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sluttid <span className="text-rose-500">*</span>
            </label>
            <input
              id="booking-end"
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-gray-900 focus:outline-hidden focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Avbryt
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isSubmitting ? "Bokar..." : "Bekräfta bokning"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BokningsFormular;
