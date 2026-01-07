import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Box, Button } from "@mui/material"; // Pour styles internes
import { Modal } from "../..//ui/modal"; // Ton Modal custom

type BusinessUser = {
  id: number;
  nom: string;
  email: string;
  phone?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  description?: string;
  rne?: string;
  rs?: string;
  latitude?: number;
  longitude?: number;
  type?: string;
  creationDate?: string;
  role?: string;
  active: boolean;
};

export default function BusinessList() {
  const [users, setUsers] = useState<BusinessUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Modal state with your modal
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<BusinessUser | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://waw.com.tn/api/api/business");
      setUsers(res.data.reverse());
    } catch (err) {
      console.error("Erreur chargement users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (user: BusinessUser) => {
    try {
      await axios.put(`https://waw.com.tn/api/api/business/${user.id}/active`, {
        active: !user.active,
      });
      fetchUsers();
    } catch (err) {
      console.error("Erreur changement de statut", err);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nom?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === "active") return matchesSearch && user.active === true;
    if (statusFilter === "inactive") return matchesSearch && user.active === false;

    return matchesSearch;
  });

  const openModal = (user: BusinessUser) => {
    setSelectedDetails(user);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedDetails(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestion des business</h1>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Rechercher un compte..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[250px] pl-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="border px-4 py-2 rounded-md focus:outline-none"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">✅ Actif</option>
          <option value="inactive">❌ Bloqué</option>
        </select>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-left table-auto">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              
              <th className="px-4 py-3">Dete de creation</th>              
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="text-center p-6">
                  Chargement...
                </td>
              </tr>
            )}
            {!loading && filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  Aucun résultat.
                </td>
              </tr>
            )}
            {!loading &&
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  
                  <td className="px-4 py-2">{user.creationDate || "-"}</td>

                  <td className="px-4 py-2">{user.rs || "-"}</td>
                  <td className="px-4 py-2">{user.email || "-"}</td>
                  <td className="px-4 py-2">{user.role || "-"}</td>
                  <td className="px-4 py-2">
                    {user.active ? (
                      <span className="text-green-600 font-medium inline-flex items-center gap-1">
                        ✅ Actif
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium inline-flex items-center gap-1">
                        ❌ Bloqué
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className={`text-sm ${
                        user.active ? "text-red-500" : "text-green-600"
                      } hover:underline`}
                      onClick={() => toggleStatus(user)}
                      title={user.active ? "❌" : "✅"}
                    >
                      {user.active ? "❌" : "✅"}
                    </button>
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => openModal(user)}
                      title="Voir détails"
                    >
                      👁      <span className="hidden md:inline">Voir</span>

                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal personnalisé */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
        {selectedDetails ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Détails du compte: {selectedDetails.nom}</h2>
            <img
  src={
    selectedDetails.imageUrl
      ? `https://waw.com.tn/api${selectedDetails.imageUrl}`
      : '/logo/waw.png'
  }              alt="waw"
  width="30%"
            />
            <br/>
            <p><strong>Email:</strong> {selectedDetails.email || "-"}</p>
            <p><strong>Téléphone:</strong> {selectedDetails.phone || "-"}</p>
            <p><strong>Adresse:</strong> {selectedDetails.adresse || "-"}</p>
            <p><strong>Ville:</strong> {selectedDetails.ville || "-"}</p>
            <p><strong>Pays:</strong> {selectedDetails.pays || "-"}</p>
            <p><strong>Description:</strong> {selectedDetails.description || "-"}</p>
            <p><strong>RNE:</strong> {selectedDetails.rne || "-"}</p>
            <p><strong>Raison Sociale:</strong> {selectedDetails.rs || "-"}</p>
            <p><strong>Latitude:</strong> {selectedDetails.latitude ?? "-"}</p>
            <p><strong>Longitude:</strong> {selectedDetails.longitude ?? "-"}</p>
            <p><strong>Type:</strong> {selectedDetails.type || "-"}</p>
            <p><strong>Créé le:</strong> {selectedDetails.creationDate ? new Date(selectedDetails.creationDate).toLocaleString() : "-"}</p>

            <div className="mt-6 flex justify-end">
              <Button variant="contained" onClick={closeModal}>Fermer</Button>
            </div>
          </div>
        ) : (
          <p>Aucune donnée disponible</p>
        )}
      </Modal>
    </div>
  );
}
