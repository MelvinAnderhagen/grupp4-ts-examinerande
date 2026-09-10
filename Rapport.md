# Rapport: Bokningssystem för Grupprum i Bibliotek

**Examinerande gruppuppgift i React och TypeScript**

---

### Gruppmedlemmar

- Ameer Shameel (`amir0321`)
- Melvin Anderhagen (`MelvinAnderhagen`)
- Roger Björling (`roger-dotcom`)
- Kirey (`kirey661`)

**Länk till GitHub-repository:**  
[https://github.com/MelvinAnderhagen/grupp4-ts-examinerande](https://github.com/MelvinAnderhagen/grupp4-ts-examinerande)

---

## Del 1: Redogörelse för TypeScript som typsäkert lager samt för- och nackdelar (Mål 1)

### Vad gav TypeScript oss jämfört med vanlig JavaScript?

Under projektets gång märkte vi snabbt att TypeScript gav oss en helt annan trygghet än om vi hade byggt systemet i ren JavaScript. I ett bokningssystem där flera vyer hanterar samma information – som rumslistor, bokningsformulär och adminöversikt – minskade TypeScript risken för slarvfel avsevärt.

1. **Gemensamma kontrakt i teamet:** När vi tidigt definierade våra interfaces (`Rum`, `Bokning`, `NewBokning`) visste alla i gruppen exakt vilka fält som fanns och vilka datatyper som gällde. Vi slapp diskussioner och buggar kring om ett fält hette `roomName`, `roomId` eller `room_name`.
2. **Snabb återkoppling i editorn vid ändringar:** När vi under sprinten behövde uppdatera våra modeller (t.ex. lägga till union-typen för status `"confirmed" | "pending" | "cancelled"` eller utöka `Rum` med utrustningslistan `utrustning: string[]`) markerade editorn direkt de filer som påverkades. I vanlig JavaScript hade vi behövt klicka runt manuellt i webbläsaren för att upptäcka var koden kraschade.
3. **Autokomplettering och dokumentation:** Funktioner som vår dubbelbokningskontroll (`checkDoubleBooking`) och återanvändbara komponenter blev självdokumenterande. Vi behövde sällan fråga varandra vad en viss funktion tog emot för argument, eftersom TypeScript visade det direkt vid anrop.

### Vad kostade den extra syntaxen och arbetsinsatsen?

Samtidigt kom typsäkerheten med ett pris i form av extra arbete och viss friktion:

- **Längre startsträcka:** Det tog längre tid att komma igång med koden jämfört med ren JS. Vi behövde tänka igenom datastrukturer, generiska typer för API-klienten och komponenter som `List<T>` innan vi kunde bygga gränssnittet.
- **Komplexitet kring bibliotek och händelser:** Att typa formulärevent (`React.FormEvent<HTMLFormElement>`) och förstå hur man hanterar generics ihop med utility-typer (`Omit`, `Pick`) krävde mer felsökning och tankearbete än att bara skriva motsvarande funktioner i JavaScript.
- **Kompileringskrav:** Koden måste byggas och typkollas med `tsc` och Vite innan driftsättning, vilket lägger till ett extra steg i arbetsflödet.

Trots den extra tiden i början sparade vi in mycket tid i slutändan på att vi slapp felsöka klassiska JavaScript-buggar som beror på `undefined` eller felstavade egenskaper.

### Var går gränsen för vad typsäkerheten täcker?

En viktig insikt för oss i gruppen har varit att förstå skillnaden mellan kompileringstid (_compile-time_) och körtid (_runtime_).

> **TypeScript kontrollerar bara koden när den byggs. När appen körs i webbläsaren har all typinformation raderats, och koden körs som ren JavaScript.**

Det här innebär att TypeScript inte kan skydda oss mot felaktig data som kommer utifrån:

- När vi anropar `useFetch<Rum[]>("/rum")` eller `api.get<T>(url)` är typen `<T>` bara ett **löfte till kompilatorn** om hur vi tror att svaret ser ut – det är ingen garanti.
- Om datan i `db.json` ändras så att `capacity` plötsligt är en sträng istället för ett tal, eller om ett obligatoriskt fält saknas helt, har TypeScript ingen aning om det vid kompileringen. Appen kan då krascha i runtime när vi exempelvis försöker köra array-metoder eller räkna på platser.
- **Lösning i praktiken:** Om vi hade velat ha full garanti även vid runtime hade vi behövt kombinera TypeScript med ett valideringsbibliotek som **Zod**. Då hade vi kunnat parsa inkommande JSON-svar vid varje API-anrop och fångat felaktig data direkt vid nätverksgränsen innan den nådde våra React-komponenter.

---

## Del 2: Förklaring av type inference och när explicit typning behövs (Mål 2 & VG)

### Hur fungerar type inference och hur valde vi strategi?

Type inference (typhärledning) innebär att TypeScript själv räknar ut vilken typ en variabel, parameter eller returvärde har baserat på hur den tilldelas och används. Vår grundregel i projektet har varit:

- **Låt inference arbeta** när typen är självklar utifrån sammanhanget, för att hålla koden ren och slippa onödigt kodbrus.
- **Skriv explicita typer** när kompilatorn saknar kontext (t.ex. API-anrop och domänmodeller), när vi skapar återanvändbara komponenter med generics, eller när vi vill begränsa en variabel till en snävare union-typ.

---

### Två ställen där vi lät Type Inference göra jobbet

#### 1. Array-metoder och lokala variabler i `checkDoubleBooking.ts`

I vår hjälpfunktion för dubbelbokning ([src/utils/checkDoubleBooking.ts](file:///Users/amir/Desktop/School/Project/TypeScript/Examination/grupp4-ts-examinerande/src/utils/checkDoubleBooking.ts)) lät vi TypeScript härleda typerna automatiskt inuti callbacken:

```typescript
return existingBookings.some((booking) => {
  if (booking.status === "cancelled") return false;
  if (booking.roomId !== newBooking.roomId || booking.date !== newBooking.date)
    return false;

  const hasOverlap =
    booking.startTime < newBooking.endTime &&
    booking.endTime > newBooking.startTime;

  return hasOverlap;
});
```

- **Motivering:** Eftersom parametern `existingBookings` redan var explicit typad som `Bokning[]`, vet TypeScript automatiskt att `booking` inuti `.some()` är av typen `Bokning`. Att skriva `(booking: Bokning)` hade varit helt överflödigt. Likaså förstår kompilatorn direkt att `hasOverlap` är en `boolean` utifrån jämförelserna (`<`, `&&`), och funktionens returtyp härleds också automatiskt till `boolean`.

#### 2. React-state med enkla startvärden (`useState`)

I komponenter som [src/pages/RumDetaljSida.tsx](file:///Users/amir/Desktop/School/Project/TypeScript/Examination/grupp4-ts-examinerande/src/pages/RumDetaljSida.tsx) och [src/components/BokningsFormular.tsx](file:///Users/amir/Desktop/School/Project/TypeScript/Examination/grupp4-ts-examinerande/src/components/BokningsFormular.tsx) använder vi lokala booleans för att styra visning av formulär och laddningslägen:

```typescript
const [showBookingForm, setShowBookingForm] = useState(false);
```

- **Motivering:** Eftersom startvärdet är `false` härleder TypeScript omedelbart att statet är en `boolean` och att setter-funktionen tar emot en `boolean`. Att skriva `useState<boolean>(false)` tillför inget extra värde utan gör bara koden mer svårläst.

---

### Två ställen där vi typade explicit

#### 1. Domänmodeller och Utility Types i `src/types/`

I modellfilerna [src/types/bokning.ts](file:///Users/amir/Desktop/School/Project/TypeScript/Examination/grupp4-ts-examinerande/src/types/bokning.ts) och [src/types/newBokning.ts](file:///Users/amir/Desktop/School/Project/TypeScript/Examination/grupp4-ts-examinerande/src/types/newBokning.ts) definierade vi våra kärntyper explicit:

```typescript
export interface Bokning {
  id: string;
  roomId: string;
  bokningsEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "pending" | "cancelled";
}

export type NewBokning = Omit<Bokning, "id">;
```

- **Motivering:** Kompilatorn kan inte gissa vad en bokning ska innehålla utan att vi talar om det. Genom att explicit definiera status som en union-typ (`"confirmed" | "pending" | "cancelled"`) begränsar vi fältet så att inga ogiltiga strängar kan sparas. Vi använde även utility-typen `Omit<Bokning, "id">` för att explicit skapa typen `NewBokning` för data som skickas från formuläret innan servern har hunnit tilldela ett unikt `id`.

#### 2. Generiska props i komponenten `List<T>`

I komponenten [src/components/List.tsx](file:///Users/amir/Desktop/School/Project/TypeScript/Examination/grupp4-ts-examinerande/src/components/List.tsx) behövde vi en gemensam lista som kunde rendera både `Rum` och `Bokning`:

```typescript
export interface ListProps<T> {
  items?: T[];
  loading?: boolean;
  error?: string | null;
  getKey: (item: T) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function List<T>({ items, loading, error, getKey, renderItem, emptyMessage }: ListProps<T>) { ... }
```

- **Motivering:** En generisk komponent kan inte förlita sig på inference vid definitionen, eftersom den inte vet i förväg vilken typ som kommer skickas in. Genom att explicit binda `getKey` och `renderItem` till typ-parametern `T` säkerställer vi att komponenten fungerar helt typsäkert oavsett om vi anropar den med `<List<Rum> ...>` i [RumSida.tsx](file:///Users/amir/Desktop/School/Project/TypeScript/Examination/grupp4-ts-examinerande/src/pages/RumSida.tsx) eller `<List<Bokning> ...>` i [AdminBokningar.tsx](file:///Users/amir/Desktop/School/Project/TypeScript/Examination/grupp4-ts-examinerande/src/components/AdminBokningar.tsx).

---

## Del 3: Felsökning och typfel under utvecklingen (Mål 5)

Under sprinten stötte vi på flera typfel som krävde att vi undersökte hur TypeScript resonerade. Här är två konkreta exempel:

### Typfel 1: Kollision mellan `NewBokning` och `Bokning` vid POST-anrop

- **Felmeddelande:**
  ```
  Type 'Omit<Bokning, "id">' is not assignable to type 'Bokning'.
  Property 'id' is missing in type 'Omit<Bokning, "id">' but required in type 'Bokning'.
  ```
- **Vad felet betydde:** När vi byggde formuläret försökte vi skicka formulärdatat direkt till en API-funktion som förväntade sig ett komplett `Bokning`-objekt. Kompilatorn klagade eftersom det nya objektet saknade `id`, vilket är ett obligatoriskt fält i `Bokning`.
- **Hur vi löste det:** Vi insåg att vi behövde skilja på data före och efter att det sparats i backend. Vi skapade typen `NewBokning` via `Omit<Bokning, "id">` i [src/types/newBokning.ts](file:///Users/amir/Desktop/School/Project/TypeScript/Examination/grupp4-ts-examinerande/src/types/newBokning.ts) och anpassade API-klienten så att `api.post<Bokning>("/bokningar", newBooking)` tar emot en payload av typen `NewBokning` men returnerar en fullständig `Bokning` med det tilldelade id:t från `json-server`.

---

### Typfel 2: Implicit `any` och felaktig typ på formulärevent i React

- **Felmeddelande:**
  ```
  Property 'preventDefault' does not exist on type 'Event'.
  Parameter 'e' implicitly has an 'any' type.
  ```
- **Vad felet betydde:** Eftersom vi kör med `"strict": true` tillåter inte TypeScript outtalade `any`-typer på funktionsparametrar. När vi först skrev `const handleSubmit = (e) => ...` visste inte kompilatorn vad `e` var för typ. När vi testade att sätta typen till den vanliga DOM-typen `Event` saknades de React-specifika metoderna och kopplingarna till formulärelementet.
- **Hur vi löste det:** Vi importerade och använde Reacts specifika typ för formulärevent: `e: React.FormEvent<HTMLFormElement>`. Detta löste felet direkt, gjorde att `e.preventDefault()` godkändes och gav oss rätt typning för alla formulärfält.

---

## Del 4: Retrospektiv över teamarbetet under sprinten

### Hur vi arbetade i teamet

Under sprinten arbetade vi enligt agila principer med en gemensam backlog i GitHub Projects och delade upp applikationen i tydliga ansvarsområden (typer, API-klient, gränssnitt, generiska komponenter och valideringslogik). Vi använde Git och GitHub med separata feature-branches för respektive uppgift.

Innan någon kod mergades in i vår integrations-branch `develop` skapade vi Pull Requests där minst en annan gruppmedlem granskade koden och lämnade kommentarer kring typning och struktur. Vi körde regelbundna korta standups för att stämma av vad som var klart, vad som pågick och om någon stött på problem.

### Vad som fungerade bra

1. **Tidig överenskommelse om typer:** Att vi satte oss ner och definierade `Rum` och `Bokning` gemensamt innan vi började bygga sidorna underlättade enormt. Det gjorde att vi kunde arbeta parallellt i olika filer utan att krocka med varandras kod.
2. **Återanvändbarhet med Generics:** Den generiska komponenten `List<T>` och API-klienten gjorde att vi sparade mycket tid och slapp duplicera kod för listvisning av rum och bokningar.
3. **Dubbelbokningsskyddet:** Logiken i `checkDoubleBooking` för att kontrollera tidsintervall och ignorera avbokade pass fungerade stabilt och gav tydlig feedback i gränssnittet.

### Vad vi hade gjort annorlunda

1. **Tidigare integration mellan listor och formulär:** Vi byggde rumslistan och bokningsformuläret separat i början. Hade vi kopplat ihop hela bokningsflödet tidigare under sprinten hade vi kunnat testa helhetsupplevelsen i ett tidigare skede.
2. **Runtime-validering med Zod:** Som vi tog upp i Del 1 skyddar inte TypeScript mot avvikelser i data från `db.json` vid runtime. I ett större projekt hade vi lagt till Zod för att validera API-svaren direkt när de tas emot.
3. **Ännu mer kontinuerlig kodgranskning:** Vi hade kunnat boka in fler gemensamma avstämningar i helgrupp för att gå igenom svårare typkonstruktioner tillsammans under resans gång.

---

## Slutsats

Projektet har gett oss en praktisk och djupare förståelse för hur TypeScript används i ett riktigt React-projekt. Vi har lärt oss att typer inte bara handlar om att undvika fel, utan om att skapa en tydlig struktur och ett gemensamt språk för hela teamet, samtidigt som man måste vara medveten om var gränsen mellan kompilering och runtime går.
