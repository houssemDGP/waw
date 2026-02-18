import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import axios from "axios";

export default function UserMetaCard({ business }) {
  const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: imgOpen, openModal: openimg, closeModal: closeimg } = useModal();
      const [imageFile, setImageFile] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(
    business.imageUrl ? `https://waw.com.tn${business.imageUrl}` : null
  );
  // 🔹 State pour édition
  const [formData, setFormData] = useState({
    facebook: "",
    instagram: "",
    tiktok: "",
  });

  // Remplir le formulaire à l’ouverture
  useEffect(() => {
    if (business) {
      setFormData({
        facebook: business.facebook || "",
        instagram: business.instagram || "",
        tiktok: business.tiktok || "",
      });
    }
  }, [business, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      console.log("Saving changes...", formData);

      await axios.put(
        `https://waw.com.tn/api/api/business/${business.id}`,
        { ...business, ...formData },
        { headers: { "Content-Type": "application/json" } }
      );
      

      closeModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  if (!business) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl">
        <p>Chargement...</p>
      </div>
    );
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : preview);
  };
   const handleSaveImg = async () => {
  if (!imageFile) return;

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(
      `https://waw.com.tn/api/api/business/${business.id}/upload-image`,
      {
        method: "POST",
        body: formData,
      }
    );

    // Vérifie si le serveur renvoie JSON
    const contentType = response.headers.get("content-type");
    let data: any;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
      console.log("JSON response:", data);
    } else {
      data = await response.text();
      console.log("Text response:", data);
    }

    // Si ton backend renvoie l'URL de l'image, tu peux l'utiliser pour mettre à jour le preview
    if (typeof data === "object" && data.url) {
      setPreview(data.url);
    }

    closeimg();
    window.location.reload()
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};
  return (
    <>
      {/* Carte business */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img
                src={
                  business.imageUrl
                    ? `https://waw.com.tn${business.imageUrl}`
                    : "/images/user/owner.jpg"
                }
                alt={business.nom}
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {business.rs}
              </h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs text-gray-500">Responsable</p>
              <p className="text-sm font-medium text-gray-800">{business.nom} {business.prenom}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500">Téléphone</p>
              <p className="text-sm font-medium text-gray-800">{business.phone}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-800">{business.email}</p>
            </div>
          </div>
            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              {business.facebook && (
                <a
                  href={business.facebook}
                  target="_blank"
                  rel="noopener"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50"
                >
                  FB
                </a>
              )}
              {business.instagram && (
                <a
                  href={business.instagram}
                  target="_blank"
                  rel="noopener"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50"
                >
                  IG
                </a>
              )}
              {business.tiktok && (
                <a
                  href={business.tiktok}
                  target="_blank"
                  rel="noopener"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50"
                >
                  TT
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">

          <Button
  onClick={openModal}
  size="sm"
  className="bg-gradient-to-r from-[#181AD6] to-[#FF7900] text-white"
>
 Facebook , Instagram , TikTok
</Button>
          <Button
            onClick={openimg}
            size="sm"
            className="bg-gradient-to-r from-[#181AD6] to-[#FF7900] text-white"
          >
            Changer la photo
          </Button>
</div>
        </div>
      </div>

      {/* Modal Edition */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="p-6 bg-white rounded-3xl">
          <h4 className="mb-4 text-xl font-semibold">Editer Facebook , Instagram , TikTok</h4>
          <form className="flex flex-col gap-4" onSubmit={handleSave}>
            <div>
              <Label>Facebook</Label>
              <Input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>TikTok</Label>
              <Input
                type="text"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" type="button" onClick={closeModal}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal isOpen={imgOpen} onClose={closeimg} className="max-w-[500px] m-4">
        <div className="relative w-full p-4 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Changer la photo
          </h4>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-4 w-32 h-32 object-cover rounded-full border border-gray-300"
            />
          )}
          <div className="flex justify-end gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeimg}>
              Annuler
            </Button>
            <Button size="sm" onClick={handleSaveImg}>
              Sauvegarder
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
