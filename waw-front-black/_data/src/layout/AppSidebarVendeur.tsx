import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  color?: string;
  pro?: boolean;
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashborad Vendeur",
    path: "/vendeur/DashboradVendeur",
    color: "white",
  },
];

const evenementItems: NavItem[] = [
  {
    icon: <HorizontaLDots />,
    name: "Ajouter une activité",
    path: "/vendeur/ajouterevenement",
    color: "white",
  },
    {
    icon: <HorizontaLDots />,
    name: "Ajouter un Restaurant",
    path: "/vendeur/ajouterestaurant",
    color: "white",
  },
  {
    icon: <ListIcon />,
    name: "Liste des activités",
    path: "/vendeur/events",
    color: "white",
  },
    {
    icon: <ListIcon />,
    name: "Liste des Restaurants",
    path: "/vendeur/restaurants",
    color: "white",
  },
];

const reservationItems: NavItem[] = [
  {
    icon: <HorizontaLDots />,
    name: "Ajouter une reservation",
    path: "/vendeur/reservations",
    color: "white",
  },
  {
    icon: <CalenderIcon />,
    name: "calendrier des reservations",
    path: "/vendeur/ListReservationVendeur",
    color: "white",
  },
  {
    icon: <CalenderIcon />,
    name: "calendrier des reservations Ramadan",
    path: "/vendeur/RestaurantReservation",
    color: "white",
  },


    {
    icon: <CalenderIcon />,
    name: "calendrier des nombres de reservations",
    path: "/vendeur/CountReservation",
    color: "white",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart" },
      { name: "Bar Chart", path: "/bar-chart" },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts" },
      { name: "Avatar", path: "/avatars" },
      { name: "Badge", path: "/badge" },
      { name: "Buttons", path: "/buttons" },
      { name: "Images", path: "/images" },
      { name: "Videos", path: "/videos" },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin" },
      { name: "Sign Up", path: "/signup" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleSidebar,
    toggleMobileSidebar,
  } = useSidebar();

  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const activeItemRef = useRef<HTMLAnchorElement | null>(null);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // 🔸 Scroll vers l'élément actif au changement de route
  useEffect(() => {
    if (activeItemRef.current && isMobileOpen) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [location.pathname, isMobileOpen]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) return null;
      return { type: menuType, index };
    });
  };

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
                style={{ color: nav.color }}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                ref={isActive(nav.path) ? activeItemRef : null} // ⬅️ ref sur l'actif
                className={`relative menu-item group hover:text-black hover:rounded-l-full w-full py-3 pl-4 ${
                  isActive(nav.path)
                    ? "menu-item-active rounded-l-full bg-white"
                    : "menu-item-inactive text-white"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                  style={{ color: isActive(nav.path) ? "black" : nav.color }}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {isActive(nav.path) && (
                  <div className="absolute right-4 lg:right-[-7px] z-50">
                    <button
                      type="button"
                      onClick={handleToggle}
                      className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      {isExpanded || isMobileOpen ? (
                        <ChevronLeftIcon className="w-5 h-5" />
                      ) : (
                        <ChevronRightIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      ref={sidebarRef}
      className={`fixed mt-16 lg:mt-0 top-0 left-0 bg-[#021732] dark:bg-gray-900 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50
        ${
          isExpanded || isMobileOpen
            ? "w-[250px]"
            : isHovered
            ? "w-[250px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 overflow-y-auto pb-20`}
    >
      <div
        className={`py-8 ${
          !isExpanded && !isHovered ? "justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <center>
              <img
                src="/logo/wawwhite.png"
                alt="Logo"
                width={150}
                height={100}
              />
            </center>
          ) : (
            <img src="/logo/wawwhite.png" alt="Logo" width={100} height={100} />
          )}
        </Link>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <h2 className="mb-4 text-xs uppercase text-gray-400">
              Tableau de bord
            </h2>
            {renderMenuItems(navItems, "main")}

            <h2 className="mb-4 text-xs uppercase text-gray-400">
              Gestion des activités
            </h2>
            {renderMenuItems(evenementItems, "main")}

            <h2 className="mb-4 text-xs uppercase text-gray-400">
              Gestion des réservations
            </h2>
            {renderMenuItems(reservationItems, "main")}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
