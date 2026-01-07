import React, { useState } from "react";
import { Modal } from "../../ui/modal";

interface Banner {
  id: number;
  image: string;
  title: string;
  description: string;
  active: boolean;
}

const initialBanners: Banner[] = [
  { id: 1, image: "test", title: "desc", description: "desc", active: false },
  { id: 2, image: "waw", title: "waw", description: "waw", active: true },
];

export default function BannerList() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);

  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editData, setEditData] = useState({
    image: "",
    title: "",
    description: "",
    active: false,
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newData, setNewData] = useState({
    image: "",
    title: "",
    description: "",
    active: false,
  });

  // Ouvrir modal édition
  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setEditData({
      image: banner.image,
      title: banner.title,
      description: banner.description,
      active: banner.active,
    });
  };

  // Sauvegarder édition
  const handleSaveEdit = () => {
    if (!editingBanner) return;
    setBanners((prev) =>
      prev.map((b) =>
        b.id === editingBanner.id ? { ...b, ...editData } : b
      )
    );
    setEditingBanner(null);
  };

  // Supprimer bannière
  const handleDelete = (id: number) => {
    if (window.confirm("Supprimer cette bannière ?")) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // Ajouter bannière
  const handleAdd = () => {
    if (!newData.title.trim()) return;
    const newBanner = {
      id: banners.length > 0 ? Math.max(...banners.map((b) => b.id)) + 1 : 1,
      ...newData,
    };
    setBanners((prev) => [...prev, newBanner]);
    setNewData({ image: "", title: "", description: "", active: false });
    setShowAddModal(false);
  };
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);
};
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des Bannières</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Ajouter une bannière
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm table-auto">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Titre</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Active</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id} className="border-t hover:bg-gray-50 align-top">
<td className="px-4 py-3">
  <img
    src={b.image}
    alt={b.title}
    className="h-12 w-auto rounded shadow"
  />
</td>                <td className="px-4 py-3 font-medium">{b.title}</td>
                <td className="px-4 py-3 whitespace-pre-line">{b.description}</td>
                <td className="px-4 py-3">
                  {b.active ? (
                    <span className="text-green-600 font-semibold">Oui</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Non</span>
                  )}
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <button
                    onClick={() => openEditModal(b)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Edition */}
      <Modal
        isOpen={!!editingBanner}
        onClose={() => setEditingBanner(null)}
        className="max-w-2xl max-h-[90vh] m-4"
      >
        <div className="relative w-full max-w-2xl max-h-[60vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Modifier la bannière #{editingBanner?.id}
          </h2>

          <label className="block mb-2 font-medium">Image (URL)</label>
<input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  className="mb-3"
/>
{newData.image && (
  <img src={newData.image} alt="preview" className="h-20 rounded" />
)}

          <label className="block mb-2 font-medium">Titre</label>
          <input
            type="text"
            className="border px-3 py-2 rounded w-full mb-4"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          />

          <label className="block mb-2 font-medium">Description</label>
          <textarea
            className="border px-3 py-2 rounded w-full mb-4"
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
          />

          <label className="inline-flex items-center mb-4">
            <input
              type="checkbox"
              checked={editData.active}
              onChange={(e) =>
                setEditData({ ...editData, active: e.target.checked })
              }
              className="mr-2"
            />
            Active
          </label>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setEditingBanner(null)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Enregistrer ✅
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Ajout */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        className="max-w-2xl max-h-[90vh] m-4"
      >
        <div className="relative w-full max-w-2xl max-h-[60vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Ajouter une bannière
          </h2>

          <label className="block mb-2 font-medium">Image (URL)</label>
          <input
            type="text"
            className="border px-3 py-2 rounded w-full mb-4"
            placeholder="URL de l'image"
            value={newData.image}
            onChange={(e) => setNewData({ ...newData, image: e.target.value })}
          />

          <label className="block mb-2 font-medium">Titre</label>
          <input
            type="text"
            className="border px-3 py-2 rounded w-full mb-4"
            placeholder="Titre"
            value={newData.title}
            onChange={(e) => setNewData({ ...newData, title: e.target.value })}
          />

          <label className="block mb-2 font-medium">Description</label>
          <textarea
            className="border px-3 py-2 rounded w-full mb-4"
            placeholder="Description"
            value={newData.description}
            onChange={(e) => setNewData({ ...newData, description: e.target.value })}
          />

          <label className="inline-flex items-center mb-4">
            <input
              type="checkbox"
              checked={newData.active}
              onChange={(e) => setNewData({ ...newData, active: e.target.checked })}
              className="mr-2"
            />
            Active
          </label>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
