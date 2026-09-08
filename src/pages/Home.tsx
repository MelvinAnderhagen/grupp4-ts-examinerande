import { Link } from "react-router";

export const navOrder = 1;
export const navTitle = "Hem";

export function Home() {
  return (
    <main className="flex flex-col gap-10 py-6 max-w-4xl mx-auto">
      <section className="text-center rounded-2xl border border-border bg-card p-8 md:p-12 shadow-xs">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Välkommen till Bibliotekets Grupprum
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Hitta en lugn studieplats för dig och din grupp. Boka snabbt och
          enkelt direkt via webben.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kort 1: Rum */}
        <article className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs hover:border-primary/50 transition-colors">
          <div>
            <h2 className="text-xl font-semibold mb-2">Lediga Grupprum</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Utforska våra tillgängliga rum, se sittplatser och utrustning som
              whiteboard, projektor och skärmar.
            </p>
          </div>
          <Link
            to="/rumsida"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Hitta och boka rum &rarr;
          </Link>
        </article>

        <article className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs hover:border-primary/50 transition-colors">
          <div>
            <h2 className="text-xl font-semibold mb-2">Aktuella Bokningar</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Kontrollera schemat, se aktiva pass i realtid och dubbelkolla dina
              bokade tider.
            </p>
          </div>
          <Link
            to="/bokningarsida"
            className="inline-flex items-center justify-center rounded-lg bg-secondary border border-border px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
          >
            Visa alla bokningar &rarr;
          </Link>
        </article>
      </section>

      <section className="rounded-xl border border-border bg-muted/40 p-6">
        <h3 className="text-base font-semibold mb-3">
          Bra att veta inför bokningen:
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Max studietid:</strong> Upp till
            2 sammanhängande timmar per pass.
          </li>
          <li>
            <strong className="text-foreground">Bekräftelse:</strong> Ange
            alltid din student-e-postadress.
          </li>
          <li>
            <strong className="text-foreground">Hänsyn:</strong> Lämna rummet
            städat och i tid för nästa grupp.
          </li>
        </ul>
      </section>
    </main>
  );
}

export default Home;
