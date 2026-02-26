import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import axios from "axios";

export default function UserInfoCard({ user, onUserUpdate, onUserDelete }: any) {
  const { isOpen: infoOpen, openModal: openInfo, closeModal: closeInfo } = useModal();
  const { isOpen: passOpen, openModal: openPass, closeModal: closePass } = useModal();
  const { isOpen: deleteOpen, openModal: openDelete, closeModal: closeDelete } = useModal();
  const { isOpen: toggleActiveOpen, openModal: openToggleActive, closeModal: closeToggleActive } = useModal();

  const [formData, setFormData] = useState({
    nom: user.nom || "",
    prenom: user.prenom || "",
    phone: user.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveInfo = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key as keyof typeof formData]);
      });

      const response = await axios.put(
        `https://waw.com.tn/api/users/update/${user.id}`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Utilisateur mis à jour :", response.data);
      if (onUserUpdate) onUserUpdate(response.data);
      closeInfo();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la mise à jour des informations");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("password", passwordData.newPassword);

      const response = await axios.put(
        `https://waw.com.tn/api/users/update/${user.id}`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Mot de passe mis à jour :", response.data);
      closePass();
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      alert("Mot de passe mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe :", error);
      alert("Erreur lors de la mise à jour du mot de passe");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `https://waw.com.tn/api/users/${user.id}/toggle-active`
      );

      console.log("Statut utilisateur modifié :", response.data);
      if (onUserUpdate) onUserUpdate(response.data);
      closeToggleActive();
      alert(`Utilisateur ${response.data.active ? "activé" : "désactivé"} avec succès`);
    } catch (error) {
      console.error("Erreur lors du changement de statut :", error);
      alert("Erreur lors du changement de statut");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      await axios.delete(`https://waw.com.tn/api/users/${user.id}`);
      
      console.log("Utilisateur supprimé");
      if (onUserDelete) onUserDelete(user.id);
      closeDelete();
      alert("Utilisateur supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression de l'utilisateur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Informations personnelles
            </h4>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              user.active 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            }`}>
              {user.active ? "Actif" : "Inactif"}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Prénom
              </p>
              <p className="text-sm font-medium">{user.prenom}</p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nom
              </p>
              <p className="text-sm font-medium">{user.nom}</p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium">{user.mail}</p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Téléphone
              </p>
              <p className="text-sm font-medium">{user.phone}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={openInfo}
            size="sm"
            className="bg-gradient-to-r from-[#181AD6] to-[#FF7900] text-white"
            disabled={loading}
          >
            Modifier les informations
          </Button>
          <Button
            onClick={openPass}
            size="sm"
            className="bg-gradient-to-r from-[#181AD6] to-[#FF7900] text-white"
            disabled={loading}
          >
            Changer le mot de passe
          </Button>
          <Button
            onClick={openToggleActive}
            size="sm"
            variant="outline"
            className={user.active ? "text-red-600 border-red-600" : "text-green-600 border-green-600"}
            disabled={loading}
          >
            {user.active ? "Désactiver" : "Activer"}
          </Button>
          <Button
            onClick={openDelete}
            size="sm"
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
            disabled={loading}
          >
            Supprimer
          </Button>
        </div>
      </div>

      {/* Personal Info Modal */}
      <Modal isOpen={infoOpen} onClose={closeInfo} className="max-w-[700px] m-4">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-3xl">
          <h4 className="text-2xl font-semibold mb-4">Modifier les informations personnelles</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label>Prénom</Label>
              <Input name="prenom" value={formData.prenom} onChange={handleChange} />
            </div>
            <div>
              <Label>Nom</Label>
              <Input name="nom" value={formData.nom} onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <Label>Téléphone</Label>
              <Input name="phone" value={formData.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={closeInfo} disabled={loading}>
              Fermer
            </Button>
            <Button onClick={handleSaveInfo} disabled={loading}>
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Password Modal */}
      <Modal isOpen={passOpen} onClose={closePass} className="max-w-[700px] m-4">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-3xl">
          <h4 className="text-2xl font-semibold mb-4">Changer le mot de passe</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Nouveau mot de passe</Label>
              <Input 
                type="password" 
                name="newPassword" 
                value={passwordData.newPassword} 
                onChange={handlePasswordChange} 
                placeholder="Au moins 6 caractères"
              />
            </div>
            <div>
              <Label>Confirmez le mot de passe</Label>
              <Input 
                type="password" 
                name="confirmPassword" 
                value={passwordData.confirmPassword} 
                onChange={handlePasswordChange} 
                placeholder="Confirmez le mot de passe"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={closePass} disabled={loading}>
              Fermer
            </Button>
            <Button onClick={handleSavePassword} disabled={loading}>
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toggle Active Confirmation Modal */}
      <Modal isOpen={toggleActiveOpen} onClose={closeToggleActive} className="max-w-[500px] m-4">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl">
          <h4 className={`text-2xl font-semibold mb-2 ${
            user.active ? "text-red-600" : "text-green-600"
          }`}>
            {user.active ? "Désactiver l'utilisateur" : "Activer l'utilisateur"}
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {user.active 
              ? `Êtes-vous sûr de vouloir désactiver l'utilisateur ${user.prenom} ${user.nom} ? L'utilisateur ne pourra plus se connecter.`
              : `Êtes-vous sûr de vouloir activer l'utilisateur ${user.prenom} ${user.nom} ? L'utilisateur pourra à nouveau se connecter.`
            }
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeToggleActive} disabled={loading}>
              Annuler
            </Button>
            <Button 
              onClick={handleToggleActive} 
              className={user.active 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
              }
              disabled={loading}
            >
              {loading ? "Chargement..." : user.active ? "Désactiver" : "Activer"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteOpen} onClose={closeDelete} className="max-w-[500px] m-4">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl">
          <h4 className="text-2xl font-semibold mb-2 text-red-600">Supprimer l'utilisateur</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur <strong>{user.prenom} {user.nom}</strong> ? 
            Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeDelete} disabled={loading}>
              Annuler
            </Button>
            <Button 
              onClick={handleDeleteUser} 
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={loading}
            >
              {loading ? "Suppression..." : "Supprimer définitivement"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}