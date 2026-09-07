import type { NewRum } from "../types/newRum";

const RUM_URL = "http://localhost:3000/rum";

export async function postRum(rum: NewRum) {
    const response = await fetch(RUM_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(rum),
    });

    if (!response.ok) {
        throw new Error("Kunde inte skapa rummet.");
    }

    return response.json();
}
