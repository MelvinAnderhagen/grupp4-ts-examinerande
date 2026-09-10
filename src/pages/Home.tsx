import { Link } from "react-router";
import { ArrowRight, Calendar, DoorOpen } from "lucide-react";

export const navOrder = 1;
export const navTitle = "Hem";

export function Home() {
  return (
    <main className="flex flex-col gap-10 py-6 max-w-4xl mx-auto px-4">
      <section className="text-center rounded-2xl border border-gray-200 bg-white p-8 md:p-12 shadow-xs">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-gray-900">
          Välkommen till Bibliotekets Grupprum
        </h1>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Hitta en lugn studieplats för dig och din grupp. Boka snabbt och
          enkelt direkt via webben.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-xs hover:border-gray-400 transition-colors">
          <div>
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4 text-gray-900">
              <DoorOpen className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Lediga Grupprum</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Utforska våra tillgängliga rum, se sittplatser och utrustning som
              whiteboard, projektor och skärmar.
            </p>
          </div>
          <Link
            to="/rumsida"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Hitta och boka rum
            <ArrowRight className="h-4 w-4" />
          </Link>
        </article>

        <article className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-xs hover:border-gray-400 transition-colors">
          <div>
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4 text-gray-900">
              <Calendar className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Hantera Bokningar</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Administrera schemat, se aktiva bokningar i realtid eller avboka tidigare genomförda reservationer.
            </p>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Admin & Schema
            <ArrowRight className="h-4 w-4" />
          </Link>
        </article>
      </section>

      <section className="rounded-xl border border-gray-200 bg-gray-50/80 p-6">
        <h3 className="text-base font-semibold mb-3 text-gray-900">
          Bra att veta inför bokningen:
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
          <li>
            <strong className="text-gray-900">Dubbelbokningsskydd:</strong> Systemet kontrollerar automatiskt att ingen annan har bokat samma tid.
          </li>
          <li>
            <strong className="text-gray-900">Bekräftelse:</strong> Ange alltid din student-e-postadress vid bokning.
          </li>
          <li>
            <strong className="text-gray-900">Hänsyn:</strong> Lämna rummet städat och i tid för nästa grupp.
          </li>
        </ul>
      </section>
    </main>
  );
}

export default Home;
