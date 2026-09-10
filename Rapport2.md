# Kodgranskning: Bokningssystem (BALLERS)

**Granskad grupp:** BALLERS  
**Granskare:** [Ameer, Roger, Kire, Melvin]  
**Datum:** 2026-09-09  
**Moment:** Kodgranskning mellan grupper (Mål 6)

---

### 1. Datamodellering och typning
- **Modellering & typer:** Resurserna är tydligt definierade (`Booking` och `Hall`). Union-typen `Sport` (`football | handball | floorball`) är bra uppsatt men hårdkodas till `"football"` i kalendern istället för att låta användaren välja sport i UI:t. Ett förslag är även att lägga till ett valfritt fält `description?: string` på `Hall` för mer detaljerad information.
- **Generics & duplicering:** Det saknas en återanvändbar generisk komponent (krav för VG, t.ex. `List<T>`). I `src/components/HallCard.tsx` dupliceras `interface Hall` istället för att importera från `types/hall.ts`.

---

### 2. Identifierade styrkor
- **BookingCalendar:** Lösningen för bokningskalendern (`BookingCalendar.tsx`) är väldigt snygg, logisk och överskådlig för användaren.
- **Dubbelbokningsskydd:** Matematiken och logiken i `isTimeAvailable` för att kontrollera överlappande tider är väl genomförd och typad.

---

### 3. Konkreta förbättringsförslag

#### A. Kod, Routing och Struktur
1. **Implementera dynamiska routes:** Routes är inte dynamiska – sidorna `HallsPage.tsx` och `HallDetailsPage.tsx` finns i projektet men används/renderas inte i `router.tsx`. Lägg till en dynamisk route (t.ex. `/halls/:id`) enligt G-kravet.
2. **Koppla in avbokning & `BookingCard`:** `BookingCard.tsx` är en bra men oanvänd komponent. Eftersom den inte renderas finns det idag inget sätt för användaren att se eller avboka sina tider.
3. **Städa projektet & förbättra felhantering:** Ta bort den tomma filen `Input.tsx`. Förbättra felhanteringen när servern är nere – just nu försvinner hallarna på kalendersidan medan kalendern ligger kvar med pris 0 kr. Komponenter som `ErrorMessage` och `Loading` bör användas aktivt här.

#### B. UX och Funktionalitet
1. **Validering av datum:** Det går att boka tider bakåt i tiden. Historiska datum/tider bör inaktiveras (disabled) så att de inte går att klicka på.
2. **Tydligare kalendervy (Månad/År):** I kalendervyn syns bara veckodag och siffra. Lägg till aktuell månad/år i rubriken så man vet vilken månad man bokar när man bläddrar framåt/bakåt.
3. **Navigering, Header/Footer & Startsida:** `HomePage` består just nu enbart av en länk till kalendern. Utöka startsidan med presentation av hallarna, och ge `Header` samt `Footer` bättre styling och navigeringslänkar.
4. **README-instruktioner:** `README.md` är inte komplett och saknar nödvändiga instruktioner för hur man startar projektet och json-servern (`npm run server`).

---

### 4. Sammanfattande omdöme
Projektet har en mycket fin kalenderlösning och bra typningsgrund. Genom att aktivera de dynamiska routerna, koppla in avbokningsflödet och finslipa UX-detaljerna (månadsvisning, historiska datum och felhantering) blir applikationen både robust och användarvänlig.
