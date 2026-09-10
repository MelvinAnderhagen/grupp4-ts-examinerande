import { useState, type FormEvent } from "react";
import { postRum } from "../api/postRum";

export function SkapaRum() {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState<number>(1);
  const [plats, setPlats] = useState("");
  const [utrustning, setUtrustning] = useState("");
  const [rumMessage, setRumMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateRum = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRumMessage(null);

    try {
      const utrustningArray = utrustning
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      await postRum({
        name,
        capacity,
        plats,
        utrustning: utrustningArray,
      });

      setRumMessage({ text: "Rum skapat!", type: "success" });

      setName("");
      setCapacity(1);
      setPlats("");
      setUtrustning("");
    } catch (err) {
      setRumMessage({ text: (err as Error).message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Skapa rum</h2>
        <p className="text-sm text-gray-600 mt-0.5">
          Här kan du skapa och lägga till nya grupprum i systemet.
        </p>
      </div>

      {rumMessage && (
        <aside
          role="status"
          className={`p-4 rounded-md mb-6 border ${rumMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
        >
          {rumMessage.text}
        </aside>
      )}

      <form
        onSubmit={handleCreateRum}
        className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div>
          <label
            htmlFor="rum-name"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Rumsnamn <span className="text-rose-500">*</span>
          </label>
          <input
            id="rum-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="t.ex. Grupprum Jupiter"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="rum-capacity"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Kapacitet (antal personer) <span className="text-rose-500">*</span>
            </label>
            <input
              id="rum-capacity"
              type="number"
              required
              min={1}
              max={100}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="rum-plats"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Plats / Våning <span className="text-rose-500">*</span>
            </label>
            <input
              id="rum-plats"
              type="text"
              required
              value={plats}
              onChange={(e) => setPlats(e.target.value)}
              placeholder="t.ex. Plan 2, Biblioteket"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="rum-utrustning"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Utrustning
          </label>
          <input
            id="rum-utrustning"
            type="text"
            value={utrustning}
            onChange={(e) => setUtrustning(e.target.value)}
            placeholder="t.ex. Whiteboard, TV, Projektor"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separera flera utrustningsdelar med kommatecken (,).
          </p>
        </div>

        <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              setName("");
              setCapacity(1);
              setPlats("");
              setUtrustning("");
              setRumMessage(null);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-hidden transition-colors cursor-pointer"
          >
            Rensa
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isSubmitting ? "Skapar rum..." : "Skapa rum"}
          </button>
        </div>
      </form>
    </section>
  );
}
