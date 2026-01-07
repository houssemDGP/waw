import React, { useState } from "react";
import { Modal } from "../../ui/modal";

interface Category {
  id: number;
  name: string;
  subcategories: string[];
}

const initialCategories: Category[] = [
  {
    id: 3,
    name: "Activités Outdoor",
    subcategories: [
      "Randonnée (mer, montagne, forêt)",
      "Vélo / VTT / Trottinette",
      "Escalade",
      "Parcs d’accrobranche",
      "Plage & jeux extérieurs",
      "Activités nautiques (jet ski, kayak, paddle, snorkeling)",
      "Quad / buggy / 4x4",
      "Balade à cheval / dromadaire",
      "Tir à l’arc / paintball / airsoft",
      "Yoga ou sport en plein air",
      "Cinéma ou théâtre en plein air",
      "Croisière / promenade en mer",
      "Camping / bivouac",
      "Observation de la faune / coucher de soleil",
    ],
  },
  {
    id: 5,
    name: "Excursions / Tours",
    subcategories: [
      "Visite guidée",
      "Guides",
      "Circuit culturel (ex. Carthage, Dougga, Kairouan)",
      "Food tour / street food tour",
      "Safari désert / montagne",
      "Croisière ou balade en mer",
      "Journée chez l’habitant",
      "Circuit nature",
      "Dégustations itinérantes (vin, huile, fromage..)",
      "Tour de street art",
      "Tour en tuk-tuk / calèche / bus touristique",
    ],
  },
];

export default function GestionCategories() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newSub, setNewSub] = useState("");

  const handleUpdateSub = (index: number, value: string) => {
    if (!editingCategory) return;
    const updated = [...editingCategory.subcategories];
    updated[index] = value;
    setEditingCategory({ ...editingCategory, subcategories: updated });
  };

  const handleRemoveSub = (index: number) => {
    if (!editingCategory) return;
    const updated = editingCategory.subcategories.filter((_, i) => i !== index);
    setEditingCategory({ ...editingCategory, subcategories: updated });
  };

  const handleAddSub = () => {
    if (!editingCategory || !newSub.trim()) return;
    setEditingCategory({
      ...editingCategory,
      subcategories: [...editingCategory.subcategories, newSub.trim()],
    });
    setNewSub("");
  };

  const handleSave = () => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === editingCategory?.id ? editingCategory : cat
      )
    );
    setEditingCategory(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestion des Catégories</h1>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm table-auto">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Sous-catégories</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t hover:bg-gray-50 align-top">
                <td className="px-4 py-3">{cat.id}</td>
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 whitespace-pre-line">
                  {cat.subcategories.map((sub, idx) => (
                    <div key={idx} className="text-gray-700">• {sub}</div>
                  ))}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    ✏️ Modifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     <Modal
  isOpen={!!editingCategory} // true si editingCategory défini
  onClose={() => setEditingCategory(null)}
  className="max-w-2xl max-h-[90vh] m-4"
>
  <div className="no-scrollbar relative w-full max-w-2xl max-h-[60vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
      Modifier: {editingCategory?.name}
    </h2>

    <div className="space-y-3 overflow-y-auto pr-2">
      {editingCategory?.subcategories.map((sub, index) => (
        <div key={index} className="flex gap-2 items-center">
          <input
            type="text"
            className="border px-3 py-1 rounded flex-1"
            value={sub}
            onChange={(e) => handleUpdateSub(index, e.target.value)}
          />
          <button
            className="text-red-600 hover:underline text-sm"
            onClick={() => handleRemoveSub(index)}
          >
            ❌ Supprimer
          </button>
        </div>
      ))}

      <div className="flex gap-2 items-center pt-2 border-t mt-3">
        <input
          type="text"
          className="border px-3 py-1 rounded flex-1"
          placeholder="Nouvelle sous-catégorie"
          value={newSub}
          onChange={(e) => setNewSub(e.target.value)}
        />
        <button
          onClick={handleAddSub}
          className="text-green-600 hover:underline text-sm"
        >
          ➕ Ajouter
        </button>
      </div>
    </div>

    <div className="mt-6 flex justify-end gap-3">
      <button
        onClick={() => setEditingCategory(null)}
        className="px-4 py-2 border rounded hover:bg-gray-100"
      >
        Annuler
      </button>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Enregistrer ✅
      </button>
    </div>
  </div>
</Modal>

    </div>
  );
}
