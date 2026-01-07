import { BrowserRouter as Router, Routes, Route } from "react-router";
import React, { useEffect , useState  } from 'react';
import { Navigate,Outlet  } from 'react-router-dom';

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import AppLayoutAdmin from "./layout/AppLayoutAdmin";
import AppLayoutVendeur from "./layout/AppLayoutVendeur";

import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import DashboradVendeur from "./pages/Dashboard/DashboradVendeur";
import DashboradAdmin from "./pages/Dashboard/DashboradAdmin";

import ListReservationVendeur from "./pages/ListReservationVendeur";

import BackOfficeVendeurEvents from "./pages/Tables/BackOfficeVendeurEvents";
import BusnissList from "./pages/Tables/BusnissList";
import AdminList from "./pages/Tables/AdminList";
import ActivitesList from "./pages/Tables/ActivitesList";
import VilleList from "./pages/Tables/VilleList";

import CategoriesList from "./pages/Tables/CategoriesList";
import BannerList from "./pages/Tables/BannerList";
import LogsList from "./pages/Tables/LogsList";
import Reservation from "./pages/Reservation";
import AddActivityPage from "./pages/AddActivityPage";
import EventsList from "./pages/Tables/EventsList";

import PaymentPage from "./pages/PaymentPage";


import EventsPage from './pages/EventsPage';
import TravelLandingPage from './pages/TravelLandingPage';
import TinderCardPage from './pages/TinderCardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Details from './pages/Details';
import Wishlist from './pages/Wishlist';

import WaWInedxToday from './pages/WaWInedxToday';


import DetailsEvent from './pages/DetailsEvent';
import WawIndex from './pages/WawIndex';
import ProfileSeller from './pages/ProfileSeller';

import Events from './pages/BackOfficeVendeur/Events';
import AgendaDayView from './pages/BackOfficeVendeur/AgendaDayView';
import EditAccount from './pages/BackOfficeVendeur/EditAccount';
import RegisterPageUser from './pages/RegisterPageUser';
import AddReservation from './pages/BackOfficeVendeur/AddReservation';
import Dashboard from './pages/BackOfficeVendeur/Dashboard';
import DashboardAdmin from './pages/BackOfficeAdmin/Dashboard';
import BannerAdmin from './pages/BackOfficeAdmin/Banner';
import ActivitePage from './pages/BackOfficeAdmin/ActivitePage';
import CategoriePage from './pages/BackOfficeAdmin/CategoriePage';
import EventsAdmin from './pages/BackOfficeAdmin/Events';
import AdminManagement from './pages/BackOfficeAdmin/AdminManagement';
import Reservations from './pages/BackOfficeAdmin/Reservations';
import LoginAdmin from './pages/BackOfficeAdmin/Login';
import EditAdmin from './pages/BackOfficeAdmin/EditAdmin';
import BuisnessAdmin from './pages/BackOfficeAdmin/Buisness';
import LogsPage from './pages/BackOfficeAdmin/LogsPage';
import ResetPassword from './pages/ResetPassword';


import AssistancePage from './pages/AssistancePage';
import RewardsPage from "./pages/RewardsPage";
import ReviewsPage from "./pages/ReviewsPage";
import PlanningPage from "./pages/PlanningPage";
import ArticleIndex from "./pages/Tables/ArticleIndex";
import PDC from './pages/PDC';
import ContactPage from './pages/ContactPage';

import UserList from "./pages/Tables/UserList";

import UserProfile from "./pages/UserProfile";
import ReservationUser from "./pages/ReservationUser";
import BusinessProfiles from "./pages/BusinessProfiles";
import AdminProfiles from "./pages/AdminProfiles";
import ListCountReservation from "./pages/ListCountReservation";
import ListReservationAdmin from "./pages/ListReservationAdmin";

import AddActivityPageFree from "./pages/AddActivityPageFree";
import EventEditPage from "./components/EventEditPage";
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("adminId");
  return isAuthenticated ? children : <Navigate to="/adminlogin" replace />;
};
const ProtectedRouteBackofficeVendeur = () => {
  const isAuthenticated = !!localStorage.getItem("businessId");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function App() {
    const [userIP, setUserIP] = useState(null);

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>


            {/* Others Page */}
            <Route path="/profilee" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />



            
            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />


            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Dashboard Layout */}
          <Route element={<AppLayoutAdmin />}>
                      <Route path="/admin/events" element={<EventsList />} />
            <Route path="/admin/bussiness" element={<BusnissList />} />
                        <Route path="/admin/admins" element={<AdminList />} />
                        <Route path="/admin/categories" element={<CategoriesList />} />
                        <Route path="/admin/activites" element={<ActivitesList />} />
                        <Route path="/admin/banners" element={<BannerList />} />
                        <Route path="/admin/logs" element={<LogsList />} />
                        <Route path="/admin/reservations" element={<ListReservationAdmin />} />
                        <Route path="/admin/DashboradAdmin" element={<DashboradAdmin />} />
                        <Route path="/admin/villes" element={<VilleList />} />
                        <Route path="/admin/articleIndex" element={<ArticleIndex />} />
                        <Route path="/admin/utilisateurs" element={<UserList />} />
                        <Route path="/admin/profile" element={<AdminProfiles />} />
<Route path="/admin/events/edit/:id" element={<EventEditPage />} />



          </Route>
          {/* Dashboard Layout */}
          <Route element={<AppLayoutVendeur />}>
            <Route index path="/vendeur/DashboradVendeur" element={<DashboradVendeur />} />
                      <Route path="/vendeur/events" element={<BackOfficeVendeurEvents />} />
                        <Route path="/vendeur/ListReservationVendeur" element={<ListReservationVendeur />} />
            <Route path="/vendeur/ajouter-evenement" element={<Blank />} />

<Route path="/vendeur/events/edit/:id" element={<EventEditPage />} />


            
                        <Route path="/vendeur/reservations" element={<Reservation />} />
    <Route path="/vendeur/ajouterevenement" element={<AddActivityPage />} />
        <Route path="/vendeur/ajouterevenementfree" element={<AddActivityPageFree />} />

                            <Route path="/vendeur/profile" element={<BusinessProfiles />} />
                            <Route path="/vendeur/CountReservation" element={<ListCountReservation />} />


          </Route>



          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />


 <Route path="/" element={<WaWInedxToday />} />
  <Route path="/contact" element={<ContactPage />} />

        <Route path="/a-propos" element={<Home />} />
        <Route path="/TravelLandingPage" element={<TravelLandingPage />} />  
        <Route path="/events" element={<EventsPage />} />
                <Route path="/TinderCardPage" element={<TinderCardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/inscrire" element={<RegisterPage />} />
                                <Route path="/inscrire2" element={<RegisterPageUser />} />

                <Route path="/details" element={<Details />} />
                <Route path="/decouvrir" element={<WawIndex />} />
                <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/today" element={<Home />} />
    <Route path="/detailsEvent" element={<DetailsEvent />} />
    <Route path="/profile" element={<ProfileSeller />} />
    <Route path="/mot-de-passe-oublie" element={<ResetPassword />} />
           <Route path="/adminlogin" element={<LoginAdmin />} />

           <Route path="/assistancePage" element={<AssistancePage />} />
           <Route path="/politique-de-confidentialite" element={<PDC />} />


           /politique-de-confidentialite
           <Route path="/rewardsPage" element={<RewardsPage  />} />
           <Route path="/reviewsPage" element={<ReviewsPage  />} />
           <Route path="/planningPage" element={<PlanningPage  />} />

            <Route path="/moncompte" element={<UserProfile />} />
            <Route path="/mesreservations" element={<ReservationUser />} />

            <Route path="/PaymentPage" element={<PaymentPage />} />


            

<Route
            path="/BackofficeAdmin/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="Dashboard" element={<DashboardAdmin />} />
                  <Route path="Banner" element={<BannerAdmin />} />
                  <Route path="Activites" element={<ActivitePage />} />
                  <Route path="Categories" element={<CategoriePage />} />
                  <Route path="Events" element={<EventsAdmin />} />
                  <Route path="Admins" element={<AdminManagement />} />
                  <Route path="Reservations" element={<Reservations />} />
                  <Route path="Edit" element={<EditAdmin />} />
                  <Route path="Business" element={<BuisnessAdmin />} />
                  <Route path="Logs" element={<LogsPage />} />




                </Routes>
              </ProtectedRoute>
            }
          />
  <Route element={<ProtectedRouteBackofficeVendeur />}>
    <Route path="/Backoffice/Dashboard" element={<Dashboard />} />
    <Route path="/Backoffice/AddActivityPage" element={<AddActivityPage />} />
    <Route path="/Backoffice/Events" element={<Events />} />
    <Route path="/Backoffice/AgendaDayView" element={<AgendaDayView />} />
    <Route path="/Backoffice/EditAccount" element={<EditAccount />} />
    <Route path="/backoffice/ajouter-reservation" element={<AddReservation />} />
  </Route>
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
