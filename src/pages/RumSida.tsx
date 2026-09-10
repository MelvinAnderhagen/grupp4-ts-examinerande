import { Link } from "react-router";
import { Users, MapPin, Monitor, ArrowRight } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Rum } from "../types/rum";
import { List } from "@/components/List";

export const navOrder = 2;
export const navTitle = "Rum";

export function RumSida() {
  const { data: rum, loading, error } = useFetch<Rum[]>("/rum");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10 text-center sm:text-left">
        <p className="mb-1 text-sm font-medium tracking-wide text-gray-500 uppercase">
          Bibliotekets Grupprum
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
          Tillgängliga grupprum
        </h1>
        <Separator className="mt-3 w-16 bg-gray-900 mx-auto sm:mx-0" />
        <p className="mt-3 max-w-lg text-gray-600">
          Välj ett rum nedan för att se tillgängliga tider, se schemat och göra en bokning.
        </p>
      </header>

      <List<Rum>
        items={rum}
        loading={loading}
        error={error}
        getKey={(r) => r.id}
        emptyMessage="Inga grupprum hittades just nu."
        renderItem={(r, index) => (
          <Link
            to={`/rumdetaljsida/${r.id}`}
            className="group block rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gray-900"
          >
            <Card className="rounded-xl border border-gray-200 bg-white shadow-xs group-hover:border-gray-900 group-hover:shadow-md transition-all p-5 cursor-pointer">
              <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardDescription className="font-mono text-sm text-gray-400 font-semibold group-hover:text-gray-600 transition-colors">
                    #{String(index + 1).padStart(2, "0")}
                  </CardDescription>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors">
                    {r.name}
                  </CardTitle>
                </div>

                <CardAction className="m-0">
                  <Badge
                    variant="outline"
                    className="gap-1.5 rounded-full border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                  >
                    <Users className="h-3.5 w-3.5 text-gray-500" />
                    {r.capacity} platser
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardContent className="p-0 pt-2 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{r.plats}</span>
                  </div>

                  {r.utrustning && r.utrustning.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Monitor className="h-3.5 w-3.5 text-gray-400" />
                      {r.utrustning.map((item, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full">
                    Tillgänglig för bokning
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-xs group-hover:bg-gray-800 transition-colors">
                    Visa detaljer & boka
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      />
    </div>
  );
}

export default RumSida;
