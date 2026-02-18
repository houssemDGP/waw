import React, { useState } from "react";
import { Modal } from "../../ui/modal/index.tsx";

interface Activity {
  id: number;
  title: string;
}

const initialActivities: Activity[] = [
  { id: 1, title: "4 x 4" },
  { id: 2, title: "Accrobranches" },
  { id: 3, title: "Agritourisme" },
  { id: 4, title: "Alpinisme" },
];

export default function GestionActivites() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  // States modale édition
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // States modale ajout
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // Ouvrir modale édition
  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setEditTitle(activity.title);
  };

  // Sauvegarder édition
  const handleSaveEdit = () => {
    if (!editingActivity) return;
    setActivities((prev) =>
      prev.map((a) =>
        a.id === editingActivity.id ? { ...a, title: editTitle } : a
      )
    );
    setEditingActivity(null);
  };

  // Supprimer activité
  const handleDelete = (id: number) => {
    if (window.confirm("Supprimer cette activité ?")) {
      setActivities((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Ajouter activité
  const handleAdd = () => {
    if (newTitle.trim() === "") return;
    const newActivity = {
      id: activities.length > 0 ? Math.max(...activities.map((a) => a.id)) + 1 : 1,
      title: newTitle.trim(),
    };
    setActivities((prev) => [...prev, newActivity]);
    setNewTitle("");
    setShowAddModal(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des Activités</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Ajouter une activité
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm table-auto">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Titre</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-t hover:bg-gray-50 align-top">
                <td className="px-4 py-3">{activity.id}</td>
                <td className="px-4 py-3 font-medium">{activity.title}</td>
                <td className="px-4 py-3 flex gap-3">
                  <button
                    onClick={() => openEditModal(activity)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    onClick={() => handleDelete(activity.id)}
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
        isOpen={!!editingActivity}
        onClose={() => setEditingActivity(null)}
        className="max-w-2xl max-h-[90vh] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-2xl max-h-[60vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Modifier l'activité #{editingActivity?.id}
          </h2>

          <input
            type="text"
            className="border px-3 py-2 rounded w-full mb-4"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setEditingActivity(null)}
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
        <div className="no-scrollbar relative w-full max-w-2xl max-h-[60vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Ajouter une activité
          </h2>

          <input
            type="text"
            className="border px-3 py-2 rounded w-full mb-4"
            placeholder="Titre de l'activité"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

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
