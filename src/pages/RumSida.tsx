import { Link } from "react-router";
import { Users } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import type { Rum } from "../types/rum";
import List from "@/components/List";

export const navOrder = 2;
export const navTitle = "Rum";

export function RumSida() {
  const { data: rum, loading, error } = useFetch<Rum[]>("/rum");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12 px-6">
        <p className="mb-2 text-sm tracking-wide text-ink-muted">Biblioteket</p>
        <h2 className="font-serif text-4xl font-semibold text-ink">
          Tillgängliga grupprum
        </h2>
        <Separator className="mt-4 w-16 bg-brass" />
        <p className="mt-4 max-w-md text-ink-muted">
          Välj ett rum för att se lediga tider och boka.
        </p>
      </header>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-24 w-full rounded-none" />
          ))}
        </div>
      )}

      {error && (
        <Alert className="rounded-none border-rust/30 bg-rust/5">
          <AlertDescription className="text-rust">
            Kunde inte hämta rum just nu. Försök ladda om sidan.
            {import.meta.env.DEV && ` (${error})`}
          </AlertDescription>
        </Alert>
      )}

      {!loading && !error && (!rum || rum.length === 0) && (
        <p className="text-ink-muted">Inga grupprum hittades just nu.</p>
      )}

      {!loading && !error && rum && rum.length > 0 && (
        <List
          items={rum}
          loading={loading}
          error={error}
          getKey={(r) => r.id}
          emptyMessage="Inga grupprum hittades just nu."
          renderItem={(r, index) => (
            <Link to={`/rumdetaljsida/${r.id}`} className="group block">
              <Card className="gap-0 rounded-none border-[#DDD6C4] bg-white/60 py-5 shadow-none transition-colors group-hover:border-brass">
                <CardHeader>
                  <CardDescription className="font-serif text-brass">
                    {String(index + 1).padStart(2, "0")}
                  </CardDescription>
                  <CardTitle className="font-serif text-xl font-semibold text-ink">
                    {r.name}
                  </CardTitle>
                  <CardAction>
                    <Badge
                      variant="outline"
                      className="gap-1 rounded-none border-forest/30 bg-forest/10 text-forest"
                    >
                      <Users className="h-3.5 w-3.5" />
                      {r.capacity}
                    </Badge>
                  </CardAction>
                </CardHeader>
              </Card>
            </Link>
          )}
        />
      )}
    </div>
  );
}

export default RumSida;
