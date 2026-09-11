import type { Bokning } from "../types/bokning";
import type { NewBokning } from "../types/newBokning";

export type BookingTimeCheck = Pick<NewBokning | Bokning, "roomId" | "date" | "startTime" | "endTime">;

export function checkDoubleBooking(
  newBooking: BookingTimeCheck,
  existingBookings: Bokning[] | undefined,
): boolean {
  if (!existingBookings || existingBookings.length === 0) {
    return false;
  }

  return existingBookings.some((booking) => {
    if (booking.status === "cancelled") {
      return false;
    }

    if (String(booking.roomId) !== String(newBooking.roomId) || booking.date !== newBooking.date) {
      return false;
    }

    const hasOverlap =
      booking.startTime < newBooking.endTime &&
      booking.endTime > newBooking.startTime;

    return hasOverlap;
  });
}
