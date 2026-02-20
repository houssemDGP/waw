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
        `https://waw.com.tn/api/business/${business.id}`,
        data,
        { headers: { "Content-Type": "application/json" } }
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
        .get(`https://waw.com.tn/api/business/${businessId}`)
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
  const payload = {
    nom: formData.nom,
    email: formData.email,
    phone: formData.phone,
    cin: formData.cin,
    rs: formData.rs,
    rne: formData.rne,
  };

  console.log("Payload envoyé :", payload);    
  axios.put(`https://waw.com.tn/api/business/${businessId}`, payload)
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
            Plus d'informations
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs text-gray-500">description</p>
              <p className="text-sm font-medium text-gray-800">{business.description || "sans description"}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500">rne</p>
              <p className="text-sm font-medium text-gray-800">{business.rne}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500">CIN</p>
              <p className="text-sm font-medium text-gray-800">{business.cin}</p>
            </div>
          </div>
        </div>
                  <div className="flex flex-col gap-2">

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
                name="nom"
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
              <Label>telephone</Label>
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
              <Label>raison social </Label>
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
