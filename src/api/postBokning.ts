import type { NewBokning } from "../types/newBokning";
const BOKNINGAR_URL = "http://localhost:3000/bokningar";

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
