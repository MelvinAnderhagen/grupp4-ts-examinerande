type BookingTime = {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
};

export function checkDoubleBooking(
  newBooking: BookingTime,
  existingBookings: BookingTime[],
) {
  return existingBookings.some((booking) => {
    return (
      booking.roomId === newBooking.roomId &&
      booking.date === newBooking.date &&
      booking.startTime < newBooking.endTime &&
      booking.endTime > newBooking.startTime
    );
  });
}
