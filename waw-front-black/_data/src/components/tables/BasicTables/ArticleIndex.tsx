import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal";
import InputField from "../../form/input/InputField";
import Button from "../../ui/button/Button";

interface Article {
  id: number;
  titre: string;
  description: string;
  link: string;
  imageUrls: string[];
}

const BASE_URL = "https://waw.com.tn";

const ArticleIndex: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [current, setCurrent] = useState<Article | null>(null);

  const [form, setForm] = useState({
    titre: "",
    description: "",
    link: "",
    existingUrls: [] as string[], // images déjà en base
    imageFiles: [] as File[],     // nouvelles images
    previewUrls: [] as string[],  // previews locales
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/api/articleindex`);
      setArticles(res.data);
    } catch {
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openAdd = () => {
    setEditMode(false);
    setCurrent(null);
    setForm({
      titre: "",
      description: "",
      link: "",
      existingUrls: [],
      imageFiles: [],
      previewUrls: [],
    });
    setModalOpen(true);
  };

  const openEdit = (article: Article) => {
    setEditMode(true);
    setCurrent(article);
    setForm({
      titre: article.titre,
      description: article.description,
      link: article.link,
      existingUrls: article.imageUrls.map((url) => `${BASE_URL}${url}`),
      imageFiles: [],
      previewUrls: [],
    });
    setModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setForm((f) => ({
        ...f,
        imageFiles: [...f.imageFiles, ...files],
        previewUrls: [
          ...f.previewUrls,
          ...files.map((file) => URL.createObjectURL(file)),
        ],
      }));
    }
  };

  const removeExistingImage = (url: string) => {
    setForm((f) => ({
      ...f,
      existingUrls: f.existingUrls.filter((u) => u !== url),
    }));
  };

  const removeNewImage = (index: number) => {
    setForm((f) => ({
      ...f,
      imageFiles: f.imageFiles.filter((_, i) => i !== index),
      previewUrls: f.previewUrls.filter((_, i) => i !== index),
    }));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet article ?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/articleindex/${id}`);
      fetchArticles();
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const handleSubmit = async () => {
    if (!form.titre.trim()) return alert("Titre requis");
    if (!form.description.trim()) return alert("Description requise");

    setSubmitting(true);
    const data = new FormData();
    data.append("titre", form.titre);
    data.append("description", form.description);
    data.append("link", form.link);

    // envoyer les anciennes images conservées
    form.existingUrls.forEach((url) => {
      data.append("existingUrls", url.replace(BASE_URL, "")); // on enlève le BASE_URL
    });

    // envoyer les nouvelles images
    form.imageFiles.forEach((file) => {
      data.append("images", file);
    });

    try {
      if (editMode && current) {
        await axios.put(`${BASE_URL}/api/articleindex/${current.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${BASE_URL}/api/articleindex`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setModalOpen(false);
      fetchArticles();
    } catch {
      alert("Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des Articles</h1>
        <Button onClick={openAdd} startIcon="+">
          Ajouter un article
        </Button>
      </div>

      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Images</th>
              <th className="px-4 py-3 text-left">Titre</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Lien</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 flex gap-2 flex-wrap">
                  {a.imageUrls && a.imageUrls.length > 0 ? (
                    a.imageUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={`${BASE_URL}${url}`}
                        alt={a.titre}
                        className="h-16 rounded"
                      />
                    ))
                  ) : (
                    <div className="text-gray-500">—</div>
                  )}
                </td>
                <td className="px-4 py-2 font-semibold">{a.titre}</td>
                <td className="px-4 py-2 whitespace-pre-wrap max-w-xs">
                  {a.description}
                </td>
                <td className="px-4 py-2">{a.link}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button size="sm" onClick={() => openEdit(a)}>
                    ✏️       <span className="hidden md:inline">Modifier</span>

                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(a.id)}
                  >
                    🗑   <span className="hidden md:inline">Supprimer</span>
                  </Button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-400"
                >
                  Aucun article
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        className="max-w-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? "Modifier" : "Ajouter"} un article
        </h2>

        <div className="space-y-4">
          <InputField
            label="Titre"
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
          />
          <InputField
            label="Description"
            multiline
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <InputField
            label="Lien"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />

          {/* Images existantes */}
          {form.existingUrls.length > 0 && (
            <div>
              <label className="block mb-1 font-medium">
                Images existantes
              </label>
              <div className="flex gap-2 flex-wrap">
                {form.existingUrls.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={url}
                      alt={`Image ${idx}`}
                      className="h-24 rounded shadow"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nouvelles images */}
          <div>
            <label className="block mb-1 font-medium">Ajouter des images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            {form.previewUrls.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {form.previewUrls.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${idx}`}
                      className="h-24 rounded shadow"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting
              ? "Envoi..."
              : editMode
              ? "Modifier"
              : "Ajouter"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ArticleIndex;
