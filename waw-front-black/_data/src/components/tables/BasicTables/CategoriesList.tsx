import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal";
import InputField from "../../form/input/InputField";
import Button from "../../ui/button/Button";

interface SubCategory {
  id?: number;
  nom: string;
}

interface Category {
  id?: number;
  nom: string;
  subCategories: SubCategory[];
}

export default function GestionCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCatId, setCurrentCatId] = useState<number | null>(null);

  const [formData, setFormData] = useState<{ nom: string; subCategories: SubCategory[] }>({
    nom: "",
    subCategories: [],
  });

  const [newSubCatInput, setNewSubCatInput] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://waw.com.tn/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Erreur fetch catégories", err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ nom: "", subCategories: [] });
    setCurrentCatId(null);
    setOpenModal(true);
  };

  const openEditModal = (cat: Category) => {
    setIsEditMode(true);
    setFormData({ nom: cat.nom, subCategories: [...cat.subCategories] });
    setCurrentCatId(cat.id || null);
    setOpenModal(true);
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    try {
      await axios.delete(`https://waw.com.tn/api/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        nom: formData.nom,
        subCategories: formData.subCategories.map((sc) => ({ nom: sc.nom })),
      };

      if (isEditMode && currentCatId) {
        await axios.put(`https://waw.com.tn/api/categories/${currentCatId}`, payload);
      } else {
        await axios.post("https://waw.com.tn/api/categories", payload);
      }

      setOpenModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    }
  };

  const handleAddSubCat = () => {
    if (newSubCatInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        subCategories: [...prev.subCategories, { nom: newSubCatInput.trim() }],
      }));
      setNewSubCatInput("");
    }
  };

  const handleUpdateSubCat = (index: number, value: string) => {
    const updated = [...formData.subCategories];
    updated[index].nom = value;
    setFormData({ ...formData, subCategories: updated });
  };

  const handleRemoveSubCat = (index: number) => {
    const updated = formData.subCategories.filter((_, i) => i !== index);
    setFormData({ ...formData, subCategories: updated });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Gestion des Catégories</h2>
        <Button onClick={openAddModal}>Ajouter Catégorie</Button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{cat.nom}</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEditModal(cat)}>
                    Modifier
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(cat.id)}>
                    Supprimer
                  </Button>
                </div>
              </div>
              <ul className="mt-2 pl-4 list-disc text-sm text-gray-700">
                {cat.subCategories.map((sous) => (
                  <li key={sous.id || sous.nom}>{sous.nom}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} className="max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          {isEditMode ? "Modifier Catégorie" : "Nouvelle Catégorie"}
        </h2>

        <InputField
          placeholder="Nom de la catégorie"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          className="mb-4"
        />

        <div className="space-y-2 mb-4">
          <div className="flex gap-2">
            <InputField
              placeholder="Ajouter une sous-catégorie"
              value={newSubCatInput}
              onChange={(e) => setNewSubCatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSubCat()}
            />
            <Button onClick={handleAddSubCat}>Ajouter</Button>
          </div>

          {formData.subCategories.map((sub, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <InputField
                value={sub.nom}
                onChange={(e) => handleUpdateSubCat(idx, e.target.value)}
                placeholder={`Sous-catégorie ${idx + 1}`}
              />
              <Button size="sm" variant="outline" onClick={() => handleRemoveSubCat(idx)}>
                ❌
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={() => setOpenModal(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {isEditMode ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
