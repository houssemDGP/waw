import { useState, useEffect } from "react";
import axios from "axios";

import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfilewaw/UserMetaCard";
import UserInfoCard from "../components/UserProfilewaw/UserInfoCard";
import UserAddressCard from "../components/UserProfilewaw/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId"); // get userId from localStorage
    if (userId) {
      axios.get(`https://waw.com.tn/api/users/${userId}`)
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Erreur lors du fetch utilisateur:", err));
    }
  }, []);

  return (
    <>
          <TopBar />
      <Navbar />
      <PageMeta
        title="Mon profile"
        description="waw"
      />


      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          {user ? (
            <>
              <UserMetaCard user={user} />
              <UserInfoCard user={user} />
              <UserAddressCard user={user} />
            </>
          ) : (
            <p>Chargement du profil...</p>
          )}
        </div>
      </div>
    </>
  );
}
