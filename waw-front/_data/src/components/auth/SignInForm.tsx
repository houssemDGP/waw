import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import axios from "axios";

export default function SignInForm({ isAdmin = false }: { isAdmin?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccessMessage(null);
  setLoading(true);

  try {
    // 🔐 Tenter en tant qu'admin
    const resAdmin = await axios.post("https://waw.com.tn/api/admins/login", {
      email,
      password,
    });

    const admin = resAdmin.data;
    localStorage.setItem("adminId", admin.id);
    localStorage.setItem("adminemailId", admin.email);
    localStorage.setItem("activites", JSON.stringify(admin.activites || []));
    localStorage.setItem("banners", JSON.stringify(admin.banners || []));
    localStorage.setItem("categories", JSON.stringify(admin.categories || []));
    localStorage.setItem("events", JSON.stringify(admin.events || []));
    localStorage.setItem("reservations", JSON.stringify(admin.reservations || []));
    localStorage.setItem("role", admin.role);

    setSuccessMessage("Connexion admin réussie !");
    setTimeout(() => navigate("/admin/events"), 1000);
    return;
  } catch (adminErr) {
    // Échec admin : on essaie business
  }

  try {
    const resBusiness = await axios.post("https://waw.com.tn/api/business/login", {
      email,
      password,
    });

    const business = resBusiness.data;
    localStorage.setItem("businessId", business.id);

    setSuccessMessage("Connexion vendeur réussie !");
    setTimeout(() => navigate("/vendeur/DashboradVendeur"), 1000);
  } catch (businessErr) {
    setError("Erreur de connexion. Identifiants incorrects.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            {isAdmin ? "Connexion Admin" : "Se connecter"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Entrez votre email et votre mot de passe pour vous connecter !
          </p>
        </div>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        {successMessage && <div className="mb-4 text-sm text-green-600">{successMessage}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label>Email <span className="text-error-500">*</span></Label>
            <Input
              type="email"
              value={email}
              placeholder="info@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Mot de passe <span className="text-error-500">*</span></Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="votre mot de passe"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                Rester connecté ?
              </span>
            </div>
            <a
              href="/mot-de-passe-oublie"
              className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <Button
            className="w-full"
            size="sm"
            type="submit"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <div className="mt-5 text-center">
          {!isAdmin && (
            <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
              Vous n'avez pas de compte ?{" "}
              <a
                href="/"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Créer un compte
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
