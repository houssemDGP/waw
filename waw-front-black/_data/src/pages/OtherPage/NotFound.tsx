import GridShape from "../../components/common/GridShape";
import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="Page non trouvée - WAW"
        description="La page que vous recherchez n'existe pas ou a été déplacée"
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
        <GridShape />
        <div className="mx-auto w-full max-w-[400px] text-center">
          {/* Numéro d'erreur stylisé */}
          <div className="mb-8">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-[#181AD6] to-[#FF7900] bg-clip-text text-transparent">
              404
            </h1>
          </div>

          {/* Illustration */}
          <div className="mb-8">
            <img 
              src="/images/error/404.svg" 
              alt="Page non trouvée" 
              className="dark:hidden max-w-[280px] mx-auto"
            />
            <img
              src="/images/error/404-dark.svg"
              alt="Page non trouvée"
              className="hidden dark:block max-w-[280px] mx-auto"
            />
          </div>

          {/* Message */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white/90">
              Oups ! Page non trouvée
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée. 
              Revenez à l'accueil et explorez nos activités.
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#181AD6] to-[#FF7900] px-6 py-3 text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Retour à l'accueil
            </Link>
            <Link
              to="/decouvrir"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-300"
            >
              Découvrir les activités
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            &copy; {new Date().getFullYear()} WAW - Tous droits réservés
          </p>
        </div>
      </div>
    </>
  );
}