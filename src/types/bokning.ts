interface Bokning {
  id: string;
  roomId: string;
  bokningsEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "pending" | "cancelled";
}
