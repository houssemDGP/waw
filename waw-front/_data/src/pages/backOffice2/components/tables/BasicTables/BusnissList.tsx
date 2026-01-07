import React, { useState } from "react";

type UserStatus = "Actif" | "Bloqué";
type UserRole = "ENTREPRISE" | "VENDEUR" | "";

interface BusinessUser {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

const mockData: BusinessUser[] = [
  { name: "admin admin", email: "admin@admin.admin", role: "ENTREPRISE", status: "Actif" },
  { name: "Houssem dakhli", email: "test2@gmail.com", role: "ENTREPRISE", status: "Actif" },
  { name: "test@gmail.com", email: "", role: "", status: "Actif" },
  { name: "Okc", email: "Omar.kchouk@gmail.com", role: "VENDEUR", status: "Actif" },
  { name: "Test", email: "test.a@gmail.com", role: "ENTREPRISE", status: "Actif" },
  { name: "tt", email: "ww", role: "VENDEUR", status: "Bloqué" },
];

export default function BusnissList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | UserStatus>("ALL");

  const filteredUsers = mockData.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestion des business</h1>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[250px]">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un compte..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="border px-4 py-2 rounded-md focus:outline-none"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="Actif">✅ Actif</option>
          <option value="Bloqué">❌ Bloqué</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-left table-auto">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email || "-"}</td>
                <td className="px-4 py-2">{user.role || "-"}</td>
                <td className="px-4 py-2">
                  {user.status === "Actif" ? (
                    <span className="text-green-600 font-medium inline-flex items-center gap-1">
                      ✅ Actif
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium inline-flex items-center gap-1">
                      ❌ Bloqué
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      title="Voir"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      👁️ Voir
                    </button>
                    <button
                      title={user.status === "Actif" ? "Bloquer" : "Débloquer"}
                      className={`text-sm ${
                        user.status === "Actif" ? "text-red-500" : "text-green-600"
                      } hover:underline`}
                    >
                      {user.status === "Actif" ? "❌ Bloquer" : "✅ Débloquer"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Aucun résultat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
