import { useState } from "react";
import { AdminBokningar } from "../components/AdminBokningar";
import { SkapaRum } from "../components/SkapaRum";

export const hideFromNav = true;
export const navTitle = "Admin";

type AdminTab = "bokningar" | "skapa-rum";

export function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>("bokningar");

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin</h1>
        <p className="text-sm text-gray-600 mt-1">
          Hantera bokningar och administrera rum.
        </p>

        <nav className="flex gap-2 mt-6">
          <button
            onClick={() => setActiveTab("bokningar")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === "bokningar"
                ? "bg-gray-900 text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Bokningar
          </button>
          <button
            onClick={() => setActiveTab("skapa-rum")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === "skapa-rum"
                ? "bg-gray-900 text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Skapa rum
          </button>
        </nav>
      </header>

      {activeTab === "bokningar" ? <AdminBokningar /> : <SkapaRum />}
    </main>
  );
}

export default Admin;
