import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

export default function UserMetaCard({ user }: any) {
  const { isOpen, openModal, closeModal } = useModal();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    user.imageUrl ? `https://waw.com.tn${user.imageUrl}` : null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : preview);
  };

const handleSave = async () => {
  if (!imageFile) return;
  if (!user?.id) {
    console.error("Erreur : user.id est null ou undefined");
    return;
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(
      `https://waw.com.tn/api/users/${user.id}/upload-image`,
      {
        method: "POST",
        body: formData,
      }
    );

    closeModal();
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};


  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img
                src={preview || "/default-avatar.png"}
                alt="user"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user.nom} {user.prenom}
              </h4>
            </div>
          </div>
          <Button
            onClick={openModal}
            size="sm"
            className="bg-gradient-to-r from-[#181AD6] to-[#FF7900] text-white"
          >
            Changer la photo
          </Button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
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
            <Button size="sm" variant="outline" onClick={closeModal}>
              Annuler
            </Button>
            <Button size="sm" onClick={handleSave}>
              Sauvegarder
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
