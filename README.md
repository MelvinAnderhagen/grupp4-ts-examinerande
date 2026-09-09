# Grupprumsbokning - Bibliotek - Grupp 4

Ett bokningssystem för studie- och grupprum på ett bibliotek, byggt som en Single Page Application (SPA) med React, TypeScript och json-server.

Projektet är en examinationsuppgift inom kursen _TypeScript_ (FE25 Frontendutvecklare).

## Gruppmedlemmar

- Roger Björling
- Ameer Shameel
- Melvin Anderhagen
- Kirey Pérez

---

## Domänbeskrivning

Systemet hanterar bokningar av bibliotekets studie- och grupprum. Det finns två huvudsakliga resurser i datamodellen:

1. **Grupprum (`Rum`)**: Innehåller rumsnamn, kapacitet (antal personer), placering/våning samt tillgänglig utrustning (t.ex. whiteboard, skärm, projektor).
2. **Bokningar (`Bokning`)**: Refererar till ett grupprum via `roomId`, bokarens e-post (`bokningsEmail`), bokningsdatum (`date`), start- och sluttid (`startTime`, `endTime`), samt en union-typ för status (`"confirmed" | "pending" | "cancelled"`).

### Dubbelbokningskontroll
Applikationen har en inbyggd dubbelbokningskontroll (`src/utils/checkDoubleBooking.ts`) som i frontend säkerställer att ingen kan boka samma rum på överlappande tider samma datum. Avbokade reservationer (`status: "cancelled"`) ignoreras så att tiderna åter blir tillgängliga för bokning.

---

## Val av styling

Vi har valt att använda **Tailwind CSS (v4)** tillsammans med ett urval av anpassade UI-komponenter och ikoner från **Lucide React**. 

**Motivering:**
- **Effektiv responsivitet:** Tailwind underlättar utveckling av responsiva layouter för mobil, surfplatta och desktop genom enkla utility-klasser (t.ex. `sm:`, `md:`).
- **Enhetligt designspråk:** Skapar en modern, konsekvent och ren användarupplevelse utan att kräva stora separata CSS-filer.
- **Prestanda och flexibilitet:** Tailwind v4 kompilerar blixtsnabbt tillsammans med Vite och ger full kontroll över stylingen direkt i komponenterna.

---

## TypeScript-struktur & Arkitektur

- **Generisk API-modul (`src/api/client.ts`):** All kommunikation med `json-server` sker via typade, generiska funktioner (`apiGet<T>`, `apiPost<T, B>`, `apiPatch<T, B>`, `apiDelete<T>`).
- **Generisk List-komponent (`src/components/List.tsx`):** En återanvändbar generisk komponent (`List<T>`) som hanterar laddningsskelett, felmeddelanden, tomt resultat samt render-props för både `Rum` och `Bokning`.
- **Utility Types:** `Omit<Bokning, "id">` (`NewBokning`) och `Omit<Rum, "id">` (`NewRum`) används för att härleda nya objekt innan servern genererar unika ID:n.
- **Typade props och callbacks:** Formulär och komponenter använder strikt typade props, inklusive callback-props (`onBookingCreated`, `getKey`, `renderItem`).

---

## Kom igång

### 1. Klona repot och installera beroenden

```bash
git clone https://github.com/MelvinAnderhagen/grupp4-ts-examinerande.git
cd grupp4-ts-examinerande
npm install
```

### 2. Starta json-server

Startar mock-backend på port 3000 mot `db.json`:

```bash
npm run json-server
```

### 3. Starta klienten

Startar Vite-utvecklingsservern:

```bash
npm run dev
```

### 4. Typkontroll och bygge

För att verifiera att alla TypeScript-typer kompilerar felfritt och bygga applikationen:

```bash
npm run build
```
