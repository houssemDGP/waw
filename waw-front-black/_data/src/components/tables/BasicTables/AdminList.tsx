import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal";
import { Box, Select, MenuItem, Typography, FormControl, InputLabel } from '@mui/material';

type AdminStatus = "ACTIVE" | "BLOCKED";
type EditorView = "YES" | "NONE";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  password: string;
  status: AdminStatus;
  events: EditorView;
  users: EditorView;
  categories: EditorView;
  reservations: EditorView;
  activites: EditorView;
  admins: EditorView;
  banners: EditorView;
  logs: EditorView;
  bussiness: EditorView;
  villes: EditorView;
  articleIndex: EditorView;
  resetCode?: string;
  resetCodeExpiry?: string;
}

export default function AdminList() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | AdminStatus>("ALL");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState<AdminUser | null>(null);
  
  const defaultPermissions = {
    events: "NONE" as EditorView,
    users: "NONE" as EditorView,
    categories: "NONE" as EditorView,
    reservations: "NONE" as EditorView,
    activites: "NONE" as EditorView,
    admins: "NONE" as EditorView,
    banners: "NONE" as EditorView,
    logs: "NONE" as EditorView,
    bussiness: "NONE" as EditorView,
    villes: "NONE" as EditorView,
    articleIndex: "NONE" as EditorView,
  };

  const [newPermissions, setNewPermissions] = useState(defaultPermissions);
  
  const MODULES = [
    'events', 'users', 'categories', 'reservations', 'activites', 
    'admins', 'banners', 'logs', 'bussiness', 'villes', 'articleIndex'
  ];

  const PERMISSION_OPTIONS = [
    { value: "YES", label: "Accès" },
    { value: "NONE", label: "Aucun accès" },
  ];

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [adding, setAdding] = useState(false);
  const [errorAdd, setErrorAdd] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://waw.com.tn/api/api/admins");
      setAdmins(res.data);
    } catch (error) {
      console.error("Erreur chargement admins", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter((admin) => {
    const matchSearch =
      admin.name.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || admin.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleStatus = async (admin: AdminUser) => {
    if (!window.confirm(`Confirmer ${admin.status === "ACTIVE" ? "blocage" : "déblocage"} de ${admin.name} ?`)) {
      return;
    }
    try {
      await axios.put(`https://waw.com.tn/api/api/admins/${admin.id}`, {
        ...admin,
        status: admin.status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
      });
      fetchAdmins();
    } catch (error) {
      console.error("Erreur changement statut", error);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      setErrorAdd("Nom, email et mot de passe sont obligatoires.");
      return;
    }
    setAdding(true);
    setErrorAdd(null);
    try {
      await axios.post("https://waw.com.tn/api/api/admins", {
        name: newAdmin.name,
        email: newAdmin.email,
        password: newAdmin.password,
        status: "ACTIVE" as AdminStatus,
        ...newPermissions,
      });
      setOpenAddModal(false);
      setNewAdmin({ name: "", email: "", password: "" });
      setNewPermissions(defaultPermissions);
      fetchAdmins();
    } catch (error) {
      setErrorAdd("Erreur lors de l'ajout de l'administrateur.");
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateAdmin = async () => {
    if (!editAdmin) return;
    
    try {
      await axios.put(`https://waw.com.tn/api/api/admins/${editAdmin.id}`, editAdmin);
      fetchAdmins();
      setOpenEditModal(false);
      setEditAdmin(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
    }
  };

  const renderPermissionField = (module: keyof AdminUser, label: string, value: EditorView, onChange: (value: EditorView) => void) => (
    <FormControl fullWidth margin="normal" key={module}>
      <strong>{label}</strong><br />
      <select
        value={value || "NONE"}
        onChange={(e) => onChange(e.target.value as EditorView)}
        className="w-full border rounded px-3 py-2 mt-1"
      >
        {PERMISSION_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </FormControl>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestion des collaborateurs</h1>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex-1 min-w-[250px] relative">
          <input
            type="text"
            placeholder="Rechercher un collaborateur..."
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

        <button
          onClick={() => setOpenAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Ajouter un collaborateur
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-left table-auto">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center">Chargement...</td>
              </tr>
            ) : filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 odd:bg-gray-50 even:bg-white">
                  <td className="px-4 py-2">{admin.name}</td>
                  <td className="px-4 py-2">{admin.email}</td>
                  <td className="px-4 py-2 text-sm font-medium" style={{ color: admin.status === "ACTIVE" ? "green" : "red" }}>
                    {admin.status === "ACTIVE" ? "✅ Actif" : "❌ Bloqué"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-3">
                      <button
                        className="text-blue-600 hover:underline text-sm"
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setOpenModal(true);
                        }}
                      >
                        👁️ <span className="hidden md:inline">Voir</span>
                      </button>
                      <button
                        className="text-yellow-600 hover:underline text-sm"
                        onClick={() => {
                          setEditAdmin(admin);
                          setOpenEditModal(true);
                        }}
                      >
                        ✏️ <span className="hidden md:inline">Modifier</span>
                      </button>
                      <button
                        className={`text-sm hover:underline ${admin.status === "ACTIVE" ? "text-red-600" : "text-green-600"}`}
                        onClick={() => toggleStatus(admin)}
                      >
                        {admin.status === "ACTIVE" ? "❌" : "✅"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Aucun collaborateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal détails admin */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} className="max-w-md p-6">
        {selectedAdmin && (
          <>
            <h2 className="text-xl font-bold mb-4">Détails de {selectedAdmin.name}</h2>
            <p><strong>Nom:</strong> {selectedAdmin.name}</p>
            <p><strong>Email:</strong> {selectedAdmin.email}</p>
            <p><strong>Statut:</strong> {selectedAdmin.status === "ACTIVE" ? "Actif" : "Bloqué"}</p>
            
            <div className="mt-4">
              <strong>Permissions:</strong>
              {MODULES.map(module => (
                <p key={module}><strong>{module}:</strong> {selectedAdmin[module as keyof AdminUser] === "YES" ? "✅ Accès" : "❌ Aucun accès"}</p>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Fermer
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Modal modification admin */}
      <Modal isOpen={openEditModal} onClose={() => setOpenEditModal(false)} className="max-w-lg p-6">
        {editAdmin && (
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateAdmin(); }}>
            <h2 className="text-xl font-bold mb-4">Modifier collaborateur</h2>

            

            <div className="border-t pt-4 mt-4">
              <strong className="text-lg">Permissions:</strong>
              
              {renderPermissionField("events", "Événements", editAdmin.events, 
                (value) => setEditAdmin({ ...editAdmin, events: value }))}
              
              {renderPermissionField("users", "Utilisateurs", editAdmin.users, 
                (value) => setEditAdmin({ ...editAdmin, users: value }))}
              
              {renderPermissionField("categories", "Catégories", editAdmin.categories, 
                (value) => setEditAdmin({ ...editAdmin, categories: value }))}
              
              {renderPermissionField("reservations", "Réservations", editAdmin.reservations, 
                (value) => setEditAdmin({ ...editAdmin, reservations: value }))}
              
              {renderPermissionField("activites", "Activités", editAdmin.activites, 
                (value) => setEditAdmin({ ...editAdmin, activites: value }))}
              
              {renderPermissionField("admins", "Administrateurs", editAdmin.admins, 
                (value) => setEditAdmin({ ...editAdmin, admins: value }))}
              
              {renderPermissionField("banners", "Bannières", editAdmin.banners, 
                (value) => setEditAdmin({ ...editAdmin, banners: value }))}

              {renderPermissionField("bussiness", "Business", editAdmin.bussiness, 
                (value) => setEditAdmin({ ...editAdmin, bussiness: value }))}

              {renderPermissionField("villes", "Villes", editAdmin.villes, 
                (value) => setEditAdmin({ ...editAdmin, villes: value }))}

              {renderPermissionField("articleIndex", "Articles Index", editAdmin.articleIndex, 
                (value) => setEditAdmin({ ...editAdmin, articleIndex: value }))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setOpenEditModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal ajout admin */}
      <Modal isOpen={openAddModal} onClose={() => setOpenAddModal(false)} className="max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">Ajouter un administrateur</h2>

        <form onSubmit={(e) => { e.preventDefault(); handleAddAdmin(); }}>
          <label className="block mb-2">
            Nom *
            <input
              type="text"
              value={newAdmin.name}
              onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </label>

          <label className="block mb-2">
            Email *
            <input
              type="email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </label>

          <label className="block mb-4">
            Mot de passe *
            <input
              type="password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </label>

          <div className="border-t pt-4 mt-4">
            <strong className="text-lg">Permissions:</strong>
            
            {MODULES.map(module => (
              <FormControl fullWidth margin="normal" key={module}>
                <strong>{module.charAt(0).toUpperCase() + module.slice(1)}</strong><br />
                <select
                  value={newPermissions[module as keyof typeof newPermissions] || "NONE"}
                  onChange={(e) => setNewPermissions({ 
                    ...newPermissions, 
                    [module]: e.target.value as EditorView 
                  })}
                  className="w-full border rounded px-3 py-2 mt-1"
                >
                  {PERMISSION_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </FormControl>
            ))}
          </div>

          {errorAdd && <p className="text-red-600 mb-4 mt-4">{errorAdd}</p>}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setOpenAddModal(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
              disabled={adding}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={adding}
            >
              {adding ? "Ajout en cours..." : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}