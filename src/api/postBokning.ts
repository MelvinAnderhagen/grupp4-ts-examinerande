const BOKNINGAR_URL = "http://localhost:3000/bokningar";

type NewBokning = {
  roomId: string;
  bokningsEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "cancelled";
};

export async function postBokning(bokning: NewBokning) {
  const response = await fetch(BOKNINGAR_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bokning),
  });

  if (!response.ok) {
    throw new Error("Kunde inte skapa bokningen.");
  }

  return response.json();
}
