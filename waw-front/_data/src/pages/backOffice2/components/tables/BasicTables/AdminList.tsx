import React, { useState } from "react";

type AdminStatus = "ACTIVE" | "BLOCKED";

interface AdminUser {
  name: string;
  email: string;
  role: string;
  status: AdminStatus;
}

const adminData: AdminUser[] = [
  { name: "string", email: "houssem.dgp@gmail.com", role: "", status: "BLOCKED" },
  { name: "string", email: "string", role: "", status: "ACTIVE" },
  { name: "string2", email: "string2", role: "", status: "ACTIVE" },
  { name: "test", email: "test2@gmail.com", role: "", status: "ACTIVE" },
  { name: "admin", email: "admin@gmail.com", role: "", status: "ACTIVE" },
];

export default function AdminList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | AdminStatus>("ALL");

  const filteredAdmins = adminData.filter((admin) => {
    const matchSearch =
      admin.name.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "ALL" || admin.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestion des Administrateurs</h1>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[250px]">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="border px-4 py-2 rounded-md focus:outline-none"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="ACTIVE">✅ Actif</option>
          <option value="BLOCKED">❌ Bloqué</option>
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
            {filteredAdmins.map((admin, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{admin.name}</td>
                <td className="px-4 py-2">{admin.email || "-"}</td>
                <td className="px-4 py-2">{admin.role || "-"}</td>
                <td className="px-4 py-2">
                  {admin.status === "ACTIVE" ? (
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
                      title={admin.status === "ACTIVE" ? "Bloquer" : "Débloquer"}
                      className={`text-sm ${
                        admin.status === "ACTIVE" ? "text-red-500" : "text-green-600"
                      } hover:underline`}
                    >
                      {admin.status === "ACTIVE" ? "❌ Bloquer" : "✅ Débloquer"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredAdmins.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Aucun administrateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
