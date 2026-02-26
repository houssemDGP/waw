import { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link, useNavigate } from "react-router";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

dayjs.extend(relativeTime);

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState({});
  const [reservations, setReservations] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [expandedNotifications, setExpandedNotifications] = useState(new Set());
  const navigate = useNavigate();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  const toggleNotificationExpand = (id) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleNotificationClick = async (notif) => {
    await markNotificationAsViewed(notif.id);
    closeDropdown();
    
    console.log("Notification clicked:", notif);
    console.log("Reservations state:", reservations);
    console.log("Looking for reservation ID:", notif.reservation);
    
    console.log("Found reservation:", notif.reservation);
    
    if (notif.reservation) {
      console.log("Navigating with reservation ID:", notif.reservation);
      navigate('/vendeur/ListReservationVendeur?reservationId=' + notif.reservation);
    } else {
      console.log("Reservation not found, navigating without ID");
      navigate('/vendeur/ListReservationVendeur');
    }
  };

  // Nouvelle fonction pour afficher toutes les réservations
  const handleShowAllReservations = () => {
    closeDropdown();
    navigate('/vendeur/ListReservationVendeur');
  };

  useEffect(() => {
    const businessId = localStorage.getItem("businessId");
    if (!businessId) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`https://waw.com.tn/api/notifications/business/${businessId}`);
        const data = await res.json();
        setNotifications(data);

        // Fetch unique users
        const userIds = [...new Set(data.map(n => n.user))];
        const userData = await Promise.all(
          userIds.map(id => fetch(`https://waw.com.tn/api/users/${id}`).then(r => r.json()))
        );
        setUsers(Object.fromEntries(userData.map(u => [u.id, u])));

        // Fetch unique reservations
        const reservationIds = [...new Set(data.map(n => n.reservation))];
        const reservationData = await Promise.all(
          reservationIds.map(id => fetch(`https://waw.com.tn/api/reservations/${id}`).then(r => r.json()))
        );
        setReservations(Object.fromEntries(reservationData.map(r => [r.id, r])));
      } catch (error) {
        console.error("Erreur fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const displayedNotifications = showAll 
    ? [...notifications].sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))
    : [...notifications].sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate)).slice(0, 5);

  const markNotificationAsViewed = async (id) => {
    try {
      const res = await fetch(`https://waw.com.tn/api/notifications/${id}/view`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, view: true } : n)
        );
      } else {
        console.error("Erreur lors du marquage comme vue");
      }
    } catch (err) {
      console.error("Erreur fetch:", err);
    }
  };

  const formatReservationDate = (reservation) => {
    if (!reservation?.date) return "Non définie";
    
    const date = dayjs(reservation.date);
    return date.format("DD/MM/YYYY");
  };

  const formatReservationPeriod = (reservation) => {
    if (!reservation?.startDate || !reservation?.endDate) {
      return "Dates non définies";
    }
    
    const startDate = dayjs(reservation.startDate);
    const endDate = dayjs(reservation.endDate);
    
    return `du ${startDate.format("DD/MM/YYYY")} au ${endDate.format("DD/MM/YYYY")}`;
  };

  // Compter les notifications non vues
  const unreadNotificationsCount = notifications.filter(n => !n.view).length;

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Notifications
            </h5>
            {unreadNotificationsCount > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadNotificationsCount}
              </span>
            )}
          </div>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4 text-gray-500 dark:text-gray-400">
            <NotificationsIcon className="text-gray-300 mb-2" />
            <p>Aucune notification</p>
          </div>
        ) : (
          <>
            <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
              {displayedNotifications.map(notif => {
                const reservation = reservations[notif.reservation];
                const isExpanded = expandedNotifications.has(notif.id);
                
                return (
                  <li
                    key={notif.id}
                    className={`rounded-lg border p-3 px-4.5 py-3 transition mb-2 cursor-pointer
                      ${notif.view ? "bg-white border-gray-200" : "bg-orange-50 border-orange-200"} 
                      hover:bg-gray-50 dark:hover:bg-white/5`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {!notif.view && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                            <span className="font-medium text-gray-800 dark:text-white/90">
                              <EventIcon fontSize="small" className="inline mr-1" />
                              {notif.texte}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNotificationExpand(notif.id);
                            }}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                          </button>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1 mb-1">
                            <PersonIcon fontSize="small" />
                            <span>Client : {reservation?.email || "N/A"}</span>
                          </div>
                          
                          {isExpanded ? (
                            <>
                              <div className="flex items-center gap-1 mb-1">
                                <EventIcon fontSize="small" />
                                <span>Activité : {reservation?.event?.nom || "Chargement..."}</span>
                              </div>
                              <div className="flex items-center gap-1 mb-1">
                                <EventIcon fontSize="small" />
                                <span>Date : {reservations[notif.reservation]?.date? dayjs(reservations[notif.reservation].date).format("DD/MM/YYYY") : "Non définie"}</span>
                              </div>
                              <div className="flex items-center gap-1 mb-1">
                                <MonetizationOnIcon fontSize="small" />
                                <span>Total : {reservation?.total != null ? `${reservation.total} TND` : "-"}</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-1 mb-1">
                              {/* Empty for collapsed state */}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{dayjs(notif.creationDate).fromNow()}</span>
                            {!notif.view && (
                              <span className="text-orange-500 font-medium">Nouveau</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Boutons d'action en bas */}
            <div className="mt-3 space-y-2 border-t border-gray-100 dark:border-gray-700 pt-3">
              {/* Bouton pour afficher toutes les notifications */}
              {!showAll && notifications.length > 5 && (
                <button
                  onClick={() => setShowAll(true)}
                  className="w-full px-4 py-2 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                >
                  Afficher toutes les notifications ({notifications.length})
                </button>
              )}

              {/* Bouton pour afficher toutes les réservations */}
              <button
                onClick={handleShowAllReservations}
                className="w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 border border-blue-700 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:border-blue-800 dark:hover:bg-blue-600 transition-colors"
              >
                Afficher tous les réservations
              </button>

              {/* Bouton pour réduire la liste si on affiche tout */}
              {showAll && (
                <button
                  onClick={() => setShowAll(false)}
                  className="w-full px-4 py-2 text-sm font-medium text-center text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Réduire la liste
                </button>
              )}
            </div>
          </>
        )}
      </Dropdown>
    </div>
  );
}