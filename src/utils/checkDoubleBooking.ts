import type { Bokning } from "../types/bokning";
import type { NewBokning } from "../types/newBokning";

export type BookingTimeCheck = Pick<NewBokning | Bokning, "roomId" | "date" | "startTime" | "endTime">;

/**
 * Kontrollerar om en ny bokning krockar med befintliga aktiva bokningar för samma rum och datum.
 * Bokningar med status "cancelled" ignoreras.
 */
export function checkDoubleBooking(
  newBooking: BookingTimeCheck,
  existingBookings: Bokning[] | undefined,
): boolean {
  if (!existingBookings || existingBookings.length === 0) {
    return false;
  }

  return existingBookings.some((booking) => {
    // Ignorera avbokade tider
    if (booking.status === "cancelled") {
      return false;
    }

    // Måste gälla samma rum och datum
    if (booking.roomId !== newBooking.roomId || booking.date !== newBooking.date) {
      return false;
    }

    // Överlappningskontroll: Start före annans slut OCH Slut efter annans start
    const hasOverlap =
      booking.startTime < newBooking.endTime &&
      booking.endTime > newBooking.startTime;

    return hasOverlap;
  });
}
