import { useEffect, useState } from "react";
import axios from "axios";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/BusinessProfile/UserMetaCard";
import UserInfoCard from "../components/BusinessProfile/UserInfoCard";
import UserAddressCard from "../components/BusinessProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";

export default function UserProfiles() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true); // 🔹 Etat pour loader

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const businessId = localStorage.getItem("businessId");
        if (!businessId) {
          console.warn("Aucun businessId trouvé dans localStorage");
          setLoading(false); // 🔹 Stop le loader même si pas de businessId
          return;
        }

        const response = await axios.get(
          `https://waw.com.tn/api/api/business/${businessId}`
        );
        setBusiness(response.data);
      } catch (error) {
        console.error("Erreur lors du fetch du business:", error);
      } finally {
        setLoading(false); // 🔹 Fin du chargement
      }
    };

    fetchBusiness();
  }, []);

  if (loading) {
    // 🔹 Affiche un loader pendant le fetch
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Chargement du profil...</p>
      </div>
    );
  }

  if (!business) {
    // 🔹 Si aucun business trouvé
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className="text-red-500">Aucun profil trouvé.</p>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Profile" description="Profile business" />
      <PageBreadcrumb pageTitle="Profile" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>

        <div className="space-y-6">
          <UserMetaCard business={business} />
          <UserInfoCard business={business} />
          <UserAddressCard business={business} />
        </div>
      </div>
    </>
  );
}
