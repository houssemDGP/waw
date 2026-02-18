import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import axios from "axios";

export default function UserMetaCard({ admin }) {
  const { isOpen: emailOpen, openModal: openEmailModal, closeModal: closeEmailModal } = useModal();
  const { isOpen: passwordOpen, openModal: openPasswordModal, closeModal: closePasswordModal } = useModal();

  const [email, setEmail] = useState(admin.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ----------- Email update -----------
  const handleUpdateEmail = async () => {
    if (!email) return;
    try {
      const response = await axios.put(
        `http://102.211.209.131:3011/api/admin/${admin.id}`,
        { email }
      );
      alert("Email mis à jour avec succès !");
      closeEmailModal();
      window.location.reload();
    } catch (err: any) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.message?.includes("Email déjà utilisé")
      ) {
        setError("Cet email est déjà utilisé !");
      } else {
        setError("Erreur lors de la mise à jour de l'email.");
      }
      console.error(err);
    }
  };

  // ----------- Password update -----------
  const handleUpdatePassword = async () => {
    if (!password) return;
    try {
      const response = await axios.put(
        `http://102.211.209.131:3011/api/admin/${admin.id}`,
        { password }
      );
      alert("Mot de passe mis à jour !");
      closePasswordModal();
      setPassword("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour du mot de passe.");
    }
  };
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {admin.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</p>
              </div>
            </div>

          <div className="flex flex-col gap-2">
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#181AD6] to-[#FF7900] text-white"
                onClick={openEmailModal}
              >
                Modifier Email
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#181AD6] to-[#FF7900] text-white"
                onClick={openPasswordModal}
              >
                Changer mot de passe
              </Button>
            </div>
        </div>
      </div>

      {/* Modal Email */}
      <Modal isOpen={emailOpen} onClose={closeEmailModal} className="max-w-[500px] m-4">
        <div className="relative w-full p-4 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Modifier Email
          </h4>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeEmailModal}>
              Annuler
            </Button>
            <Button size="sm" onClick={handleUpdateEmail}>
              Sauvegarder
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Password */}
      <Modal isOpen={passwordOpen} onClose={closePasswordModal} className="max-w-[500px] m-4">
        <div className="relative w-full p-4 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Changer mot de passe
          </h4>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closePasswordModal}>
              Annuler
            </Button>
            <Button size="sm" onClick={handleUpdatePassword}>
              Sauvegarder
            </Button>
          </div>
        </div>
      </Modal>

    </>
  );
}
