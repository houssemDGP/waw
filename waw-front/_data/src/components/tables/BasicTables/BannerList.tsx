import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal";
import InputField from "../../form/input/InputField";
import Button from "../../ui/button/Button";

interface Banner {
  id: number;
  title: string;
  subTitle: string;
  description: string;
  active: boolean;
  imageUrl?: string;
}

const BASE_URL = "https://waw.com.tn";

const BannerPageCustom: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [current, setCurrent] = useState<Banner | null>(null);

  const [form, setForm] = useState({
    title: "",
    subTitle: "",
    description: "",
    active: true,
    imageFile: null as File | null,
    previewUrl: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/api/api/banners`);
      setBanners(res.data);
    } catch (err) {
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAdd = () => {
    setEditMode(false);
    setCurrent(null);
    setForm({ title: "", subTitle: "", description: "", active: true, imageFile: null, previewUrl: "" });
    setModalOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditMode(true);
    setCurrent(banner);
    setForm({
      title: banner.title,
      subTitle: banner.subTitle,
      description: banner.description,
      active: banner.active,
      imageFile: null,
      previewUrl: banner.imageUrl ? `${BASE_URL}${banner.imageUrl}` : "",
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
    if (!confirm("Supprimer cette bannière ?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/api/banners/${id}`);
      fetchBanners();
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return alert("Titre requis");

    setSubmitting(true);
    const data = new FormData();
    data.append("title", form.title);
    data.append("subTitle", form.subTitle);
    data.append("description", form.description);
    data.append("active", String(form.active));
    if (form.imageFile) data.append("image", form.imageFile);

    try {
      if (editMode && current) {
        await axios.put(`${BASE_URL}/api/api/banners/${current.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${BASE_URL}/api/api/banners`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setModalOpen(false);
      fetchBanners();
    } catch (err) {
      alert("Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des Bannières</h1>
        <Button onClick={openAdd} startIcon="+">Ajouter une bannière</Button>
      </div>

      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Image ou Video</th>
              <th className="px-4 py-3 text-left">Titre</th>
              <th className="px-4 py-3 text-left">Sous-titre</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Active</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  {b.imageUrl ? (
                    <img
                      src={`${BASE_URL}${b.imageUrl}`}
                      alt={b.title}
                      className="h-16 rounded"
                    />
                  ) : (
                    <div className="text-gray-500">—</div>
                  )}
                </td>
                <td className="px-4 py-2">{b.title}</td>
                <td className="px-4 py-2">{b.subTitle}</td>
                <td className="px-4 py-2 whitespace-pre-wrap">{b.description}</td>
                <td className="px-4 py-2">
                  {b.active ? (
                    <span className="text-green-600">Oui</span>
                  ) : (
                    <span className="text-red-600">Non</span>
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <Button size="sm" onClick={() => openEdit(b)}>✏️ Modifier</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(b.id)}>🗑 Supprimer</Button>
                </td>
              </tr>
            ))}
            {banners.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">Aucune bannière</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal ajout / édition */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} className="max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{editMode ? "Modifier" : "Ajouter"} une bannière</h2>

        <div className="space-y-4">
          <InputField
            label="Titre"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <InputField
            label="Sous-titre"
            value={form.subTitle}
            onChange={(e) => setForm({ ...form, subTitle: e.target.value })}
          />
          <InputField
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active
          </label>
          <div>
            <label className="block mb-1 font-medium">Image ou Video</label>
            <input 
              type="file" 
              accept="image/*,video/*" 
              onChange={handleImageChange} 
            />
            {form.previewUrl && (
              <img src={form.previewUrl} alt="Preview" className="mt-2 h-24 rounded shadow" />
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Envoi..." : editMode ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BannerPageCustom;
