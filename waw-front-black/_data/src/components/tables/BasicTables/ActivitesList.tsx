import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal";
import InputField from "../../form/input/InputField";
import Button from "../../ui/button/Button";

interface Activity {
  id: number;
  titre: string;
  imageUrl?: string;
    active: boolean;

}

const BASE_URL = "https://waw.com.tn";

export default function GestionActivites() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // États recherche + tri
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [current, setCurrent] = useState<Activity | null>(null);

  const [form, setForm] = useState({
    titre: "",
    imageFile: null as File | null,
    previewUrl: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/api/api/activites`);
      setActivities(res.data);
    } catch {
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Filtrer et trier la liste avant affichage
  const filteredActivities = activities
    .filter((a) => a.titre.toLowerCase().includes(search.toLowerCase().trim()))
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.titre.localeCompare(b.titre)
        : b.titre.localeCompare(a.titre)
    );

  const openAdd = () => {
    setEditMode(false);
    setCurrent(null);
    setForm({ titre: "", imageFile: null, previewUrl: "" });
    setModalOpen(true);
  };

  const openEdit = (activity: Activity) => {
    setEditMode(true);
    setCurrent(activity);
    setForm({
      titre: activity.titre,
      imageFile: null,
      previewUrl: activity.imageUrl ? `${BASE_URL}${activity.imageUrl}` : "",
    });
    setModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const preview = URL.createObjectURL(file);
      setForm((f) => ({ ...f, imageFile: file, previewUrl: preview }));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer cette activité ?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/api/activites/${id}`);
      fetchActivities();
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const handleSubmit = async () => {
    if (!form.titre.trim()) return alert("Titre requis");
    setSubmitting(true);

    const data = new FormData();
    data.append("titre", form.titre);
    if (form.imageFile) data.append("image", form.imageFile);

    try {
      if (editMode && current) {
        await axios.put(`${BASE_URL}/api/api/activites/${current.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${BASE_URL}/api/api/activites`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setModalOpen(false);
      fetchActivities();
    } catch {
      alert("Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
  };
const handleToggle = async (id: number) => {
  try {
    await axios.put(`${BASE_URL}/api/api/activites/${id}/status`);
    fetchActivities();
  } catch {
    alert("Erreur lors du changement de statut");
  }
};
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des Activités</h1>
        <Button onClick={openAdd} startIcon="+">
          Ajouter une activité
        </Button>
      </div>

      {/* Barre recherche + tri */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Rechercher une activité..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 select-none">
            🔍
          </span>
        </div>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="border px-4 py-2 rounded-md focus:outline-none"
        >
          <option value="asc">Titre A → Z</option>
          <option value="desc">Titre Z → A</option>
        </select>
      </div>

      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Titre</th>
              <th className="px-4 py-3 text-left">Titre</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.length === 0 && !loading ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-400">
                  Aucune activité trouvée.
                </td>
              </tr>
            ) : (
              filteredActivities.map((act) => (
                <tr key={act.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {act.imageUrl ? (
                      <img
                        src={`${BASE_URL}${act.imageUrl}`}
                        alt={act.titre}
                        className="h-16 rounded"
                      />
                    ) : (
                      <div className="text-gray-500">—</div>
                    )}
                  </td>
                  <td className="px-4 py-2">{act.titre}</td>
                  <td className="px-4 py-2">
  <span
    className={`px-2 py-1 text-xs rounded ${
      act.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}
  >
    {act.active ? "Active" : "Inactive"}
  </span>
</td>
<td className="px-4 py-2 flex gap-2 items-center">
  <Button
    size="sm"
    variant="outline"
    onClick={() => handleToggle(act.id)}
  >
                                {act.active ? "❌" : "✅"}


  </Button>
  <Button size="sm" onClick={() => openEdit(act)}>
    ✏️  <span className="hidden md:inline">Modifier</span>
  </Button>
  <Button
    size="sm"
    variant="outline"
    onClick={() => handleDelete(act.id)}
  >
    🗑       <span className="hidden md:inline">Supprimer</span>

  </Button>
</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal ajout / édition */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        className="max-w-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? "Modifier" : "Ajouter"} une activité
        </h2>

        <div className="space-y-4">
          <InputField
            label="Titre"
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
          />

          <div>
            <label className="block mb-1 font-medium">Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {form.previewUrl && (
              <img
                src={form.previewUrl}
                alt="Preview"
                className="mt-2 h-24 rounded shadow"
              />
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Envoi..." : editMode ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
