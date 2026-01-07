import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import axios from "axios";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: passOpen, openModal: openPass, closeModal: closePass } = useModal();

  // 🔹 État pour stocker les infos du business
  const [business, setBusiness] = useState(null);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };
    const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    try {
      const data = new FormData();
      data.append("password", passwordData.newPassword);

      const response = await axios.put(
        `http://102.211.209.131:3011/api/business/${business.id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Mot de passe mis à jour :", response.data);
      closePass();
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe :", error);
    }
  };
  useEffect(() => {
    const businessId = localStorage.getItem("businessId");
    if (businessId) {
      axios
        .get(`http://102.211.209.131:3011/api/business/${businessId}`)
        .then((res) => {
          setBusiness(res.data);
          setFormData(res.data); // Pré-remplir le formulaire
        })
        .catch((err) => console.error("Erreur API:", err));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    const businessId = localStorage.getItem("businessId");
    axios
      .put(`http://102.211.209.131:3011/api/business/${businessId}`, formData)
      .then(() => {
        setBusiness(formData);
        closeModal();
      })
      .catch((err) => console.error("Erreur update:", err));
  };

  if (!business) return <p>Chargement...</p>;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informations personnelles
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs text-gray-500">Nom</p>
              <p className="text-sm font-medium text-gray-800">{business.nom}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500">Téléphone</p>
              <p className="text-sm font-medium text-gray-800">{business.phone}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-800">{business.email}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500">rne</p>
              <p className="text-sm font-medium text-gray-800">{business.rne}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500">Raison sociale</p>
              <p className="text-sm font-medium text-gray-800">{business.rs}</p>
            </div>
                        <div>
              <p className="mb-2 text-xs text-gray-500">CIN</p>
              <p className="text-sm font-medium text-gray-800">{business.cin}</p>
            </div>
          </div>
        </div>
          <Button
  onClick={openModal}
  size="sm"
  className="bg-gradient-to-r from-[#181AD6] to-[#FF7900] text-white"
>
 Modifier les informations personnelles
</Button>
<Button
  onClick={openPass}
  size="sm"
  className="bg-gradient-to-r from-[#181AD6] to-[#FF7900] text-white"
>
  Changer le mot de passe
</Button>
      </div>

      {/* 🔹 MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px]">
        <form className="p-4" onSubmit={(e) => e.preventDefault()}>
          <h4 className="mb-4 text-2xl font-semibold">Modifier les informations personnelles</h4>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <div className="col-span-2">
              <Label>Nom</Label>
              <Input
                type="text"
                name="firstName"
                value={formData.nom || ""}
                onChange={handleChange}
              />
            </div>
                        <div className="col-span-2">
              <Label>Email</Label>
              <Input
                type="text"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
              />
            </div>
                        <div className="col-span-2">
              <Label>Phone</Label>
              <Input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <Label>cin</Label>
              <Input
                type="text"
                name="cin"
                value={formData.cin || ""}
                onChange={handleChange}
              />
            </div>
                        <div className="col-span-2">
              <Label>rs</Label>
              <Input
                type="text"
                name="rs"
                value={formData.rs || ""}
                onChange={handleChange}
              />
            </div>
                        <div className="col-span-2">
              <Label>rne</Label>
              <Input
                type="text"
                name="rne"
                value={formData.rne || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
       {/* Password Modal */}
      <Modal isOpen={passOpen} onClose={closePass} className="max-w-[700px] m-4">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-3xl">
          <h4 className="text-2xl font-semibold mb-4">Changer le mot de passe</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Nouveau mot de passe</Label>
              <Input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />
            </div>
            <div>
              <Label>Confirmez le mot de passe</Label>
              <Input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={closePass}>Fermer</Button>
            <Button onClick={handleSavePassword}>Sauvegarder</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
