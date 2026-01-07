import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal";

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "BLOCKED";
  imageUrl?: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BLOCKED">("ALL");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://waw.com.tn/api/api/users");
      const mapped = res.data.map((u: any) => ({
        id: u.id,
        nom: u.nom,
        prenom: u.prenom,
        email: u.mail,
        phone: u.phone,
        imageUrl: u.imageUrl,
        status: u.active ? "ACTIVE" : "BLOCKED",
      }));
      setUsers(mapped);
    } catch (error) {
      console.error("Erreur chargement utilisateurs", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

const filteredUsers = users.filter((user) => {
  const matchSearch =
    (user.nom?.toLowerCase().includes(search.toLowerCase()) || false) ||
    (user.prenom?.toLowerCase().includes(search.toLowerCase()) || false) ||
    (user.email?.toLowerCase().includes(search.toLowerCase()) || false);

  const matchStatus = statusFilter === "ALL" || user.status === statusFilter;
  return matchSearch && matchStatus;
});


  const toggleStatus = async (user: User) => {
    if (!window.confirm(`Confirmer ${user.status === "ACTIVE" ? "blocage" : "déblocage"} de ${user.nom}?`)) return;
    try {
      await axios.patch(`https://waw.com.tn/api/api/users/${user.id}/toggle-active`);
      fetchUsers();
    } catch (error) {
      console.error("Erreur changement statut", error);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
    setEditMode(true);
    setOpenModal(true);
  };

  const handleChange = (field: keyof User, value: string) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  const updateUser = async () => {
    if (!selectedUser) return;
    const formData = new FormData();
    formData.append("nom", editedUser.nom || "");
    formData.append("prenom", editedUser.prenom || "");
    formData.append("mail", editedUser.email || "");
    formData.append("phone", editedUser.phone || "");
    // Ajouter d'autres champs si nécessaire

    try {
      await axios.put(`https://waw.com.tn/api/api/users/update/${selectedUser.id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      fetchUsers();
      setOpenModal(false);
      setEditMode(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Erreur mise à jour utilisateur", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Liste des utilisateurs</h1>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex-1 min-w-[250px] relative">
          <input
            type="text"
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 select-none">🔍</span>
        </div>
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

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-left table-auto">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Prénom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{user.nom}</td>
                  <td className="px-4 py-2">{user.prenom}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2" style={{ color: user.status === "ACTIVE" ? "green" : "red" }}>
                    {user.status === "ACTIVE" ? "✅ Actif" : "❌ Bloqué"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-3">
                      <button
                        className="text-blue-600 hover:underline text-sm"
                        onClick={() => handleEditClick(user)}
                      >
                        ✏️       <span className="hidden md:inline">Modifier</span>

                      </button>
                      <button
                        className={`text-sm hover:underline ${user.status === "ACTIVE" ? "text-red-600" : "text-green-600"}`}
                        onClick={() => toggleStatus(user)}
                      >
                        {user.status === "ACTIVE" ? "❌" : "✅"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal détails / édition utilisateur */}
      <Modal isOpen={openModal} onClose={() => { setOpenModal(false); setEditMode(false); }}         className="max-w-md p-6">
        {selectedUser && (
          <div className="p-6 max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? "Modifier" : "Détails"} de {selectedUser.nom} {selectedUser.prenom}
            </h2>

            {selectedUser.imageUrl && (
              <img
                src={`https://waw.com.tn/api${selectedUser.imageUrl}`}
                alt="Profil"
                className="mb-4 w-32 h-32 object-cover rounded-full"
              />
            )}

            {editMode ? (
              <>
                <input
                  className="border w-full p-2 mb-2 rounded"
                  value={editedUser.nom || ""}
                  onChange={(e) => handleChange("nom", e.target.value)}
                  placeholder="Nom"
                />
                <input
                  className="border w-full p-2 mb-2 rounded"
                  value={editedUser.prenom || ""}
                  onChange={(e) => handleChange("prenom", e.target.value)}
                  placeholder="Prénom"
                />
                <input
                  className="border w-full p-2 mb-2 rounded"
                  value={editedUser.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Email"
                />
                <input
                  className="border w-full p-2 mb-2 rounded"
                  value={editedUser.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Téléphone"
                />
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={updateUser}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Mettre à jour
                  </button>
                  <button
                    onClick={() => { setOpenModal(false); setEditMode(false); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Fermer
                  </button>
                </div>
              </>
            ) : (
              <>
                <p><strong>Nom:</strong> {selectedUser.nom}</p>
                <p><strong>Prénom:</strong> {selectedUser.prenom}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Téléphone:</strong> {selectedUser.phone || "-"}</p>
                <p><strong>Statut:</strong> {selectedUser.status === "ACTIVE" ? "Actif" : "Bloqué"}</p>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => { setEditMode(true); setEditedUser({ ...selectedUser }); }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => setOpenModal(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Fermer
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
