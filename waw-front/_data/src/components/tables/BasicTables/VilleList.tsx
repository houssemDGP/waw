import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal";
import InputField from "../../form/input/InputField";
import Button from "../../ui/button/Button";

interface Ville {
  id: number;
  nom: string;
  imageUrl?: string;
}

const BASE_URL = "https://waw.com.tn";

const VillePageCustom: React.FC = () => {
  const [villes, setVilles] = useState<Ville[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [current, setCurrent] = useState<Ville | null>(null);

  const [form, setForm] = useState({
    nom: "",
    imageFile: null as File | null,
    previewUrl: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchVilles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/api/villes`); // Adjust endpoint if different
      setVilles(res.data);
    } catch (err) {
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVilles();
  }, []);

  const openAdd = () => {
    setEditMode(false);
    setCurrent(null);
    setForm({ nom: "", imageFile: null, previewUrl: "" });
    setModalOpen(true);
  };

  const openEdit = (ville: Ville) => {
    setEditMode(true);
    setCurrent(ville);
    setForm({
      nom: ville.nom,
      imageFile: null,
      previewUrl: ville.imageUrl ? `${BASE_URL}${ville.imageUrl}` : "",
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
    if (!confirm("Supprimer cette ville ?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/villes/${id}`);
      fetchVilles();
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const handleSubmit = async () => {
    if (!form.nom.trim()) return alert("Nom requis");

    setSubmitting(true);
    const data = new FormData();
    data.append("nom", form.nom);
    if (form.imageFile) data.append("image", form.imageFile);

    try {
      if (editMode && current) {
        await axios.put(`${BASE_URL}/api/villes/${current.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${BASE_URL}/api/villes`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setModalOpen(false);
      fetchVilles();
    } catch (err) {
      alert("Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des Villes</h1>
        <Button onClick={openAdd} startIcon="+">
          Ajouter une ville
        </Button>
      </div>

      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {villes.map((v) => (
              <tr key={v.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  {v.imageUrl ? (
                    <img
                      src={`${BASE_URL}${v.imageUrl}`}
                      alt={v.nom}
                      className="h-16 rounded"
                    />
                  ) : (
                    <div className="text-gray-500">—</div>
                  )}
                </td>
                <td className="px-4 py-2">{v.nom}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button size="sm" onClick={() => openEdit(v)}>
                    ✏️       <span className="hidden md:inline">Modifier</span>

                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(v.id)}>
                    🗑  <span className="hidden md:inline">Supprimer</span>
                  </Button>
                </td>
              </tr>
            ))}
            {villes.length === 0 && !loading && (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-400">
                  Aucune ville
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal ajout / édition */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} className="max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{editMode ? "Modifier" : "Ajouter"} une ville</h2>

        <div className="space-y-4">
          <InputField
            label="Nom"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
          />
          <div>
            <label className="block mb-1 font-medium">Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {form.previewUrl && (
              <img src={form.previewUrl} alt="Preview" className="mt-2 h-24 rounded shadow" />
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
};

export default VillePageCustom;
