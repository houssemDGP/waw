import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

// Assume these icons are imported from an icon library
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
  permissionKey?: string; // Key that matches the Admin entity field
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const allNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Tableau de bord administrateur",
    path: "/admin/DashboradAdmin",
    permissionKey: "admins", // Default permission for dashboard
  },
  {
    icon: <UserCircleIcon />,
    name: "admins",
    path: "/admin/admins",
    permissionKey: "admins",
  },
  {
    icon: <UserCircleIcon />,
    name: "utilisateurs",
    path: "/admin/utilisateurs",
    permissionKey: "users",
  },
  {
    icon: <ListIcon />,
    name: "bussiness",
    path: "/admin/bussiness",
    permissionKey: "bussiness",
  },
  {
    icon: <TableIcon />,
    name: "events",
    path: "/admin/events",
    permissionKey: "events",
  },
  {
    icon: <CalenderIcon />,
    name: "reservations",
    path: "/admin/reservations",
    permissionKey: "reservations",
  },
  {
    icon: <CalenderIcon />,
    name: "categories",
    path: "/admin/categories",
    permissionKey: "categories",
  },
  {
    icon: <HorizontaLDots />,
    name: "activites",
    path: "/admin/activites",
    permissionKey: "activites",
  },
  {
    icon: <HorizontaLDots />,
    name: "banners",
    path: "/admin/banners",
    permissionKey: "banners",
  },
  {
    icon: <HorizontaLDots />,
    name: "villes",
    path: "/admin/villes",
    permissionKey: "villes",
  },
  {
    icon: <HorizontaLDots />,
    name: "articleIndex",
    path: "/admin/articleIndex",
    permissionKey: "articleIndex",
  },
  {
    icon: <GridIcon />,
    name: "logs",
    path: "/admin/logs",
    permissionKey: "logs",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    const fetchAdminAndFilterMenu = async () => {
      try {
        const adminId = localStorage.getItem("adminId");
        if (!adminId) {
          console.error("No admin ID found in localStorage");
          setNavItems([]);
          setLoading(false);
          return;
        }

        const { data: admin } = await axios.get(`https://waw.com.tn/api/admins/${adminId}`);
        
        console.log("Admin permissions:", admin);

        const filtered = allNavItems.filter((item) => {
          // Dashboard is always visible for logged-in admins
          if (item.name === "Tableau de bord administrateur") {
            return true;
          }

          // Check if this item has a permission key and if admin has access
          if (item.permissionKey && admin[item.permissionKey] === "YES") {
            return true;
          }

          // If no permission key or permission is NONE, hide the item
          return false;
        });

        console.log("Filtered menu items:", filtered);
        setNavItems(filtered);
      } catch (error) {
        console.error("Erreur de chargement des permissions:", error);
        // Fallback: show only dashboard if there's an error
        setNavItems(allNavItems.filter(item => item.name === "Tableau de bord administrateur"));
      } finally {
        setLoading(false);
      }
    };

    fetchAdminAndFilterMenu();
  }, []);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, navItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
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
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
                style={{ color: "white" }}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text" style={{ color: "white" }}>{nav.name}</span>
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
                className={`menu-item group hover:text-black hover:rounded-l-full w-full py-3 pl-4 ${
                  isActive(nav.path) ? "menu-item-active rounded-l-full bg-white " : "menu-item-inactive text-white"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                  style={{ color: isActive(nav.path) ? "#021732" : "white" }}
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
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  if (loading) {
    return (
      <aside className="fixed mt-16 flex flex-col lg:mt-0 top-0 pl-5 left-0 bg-[#021732] dark:bg-gray-900 text-gray-900 h-screen w-[90px] lg:w-[250px] transition-all duration-300 ease-in-out z-50">
        <div className="flex items-center justify-center h-20">
          <div className="text-white">Chargement...</div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 pl-5 left-0 bg-[#021732] dark:bg-gray-900 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50
        ${
          isExpanded || isMobileOpen
            ? "w-[250px]"
            : isHovered
            ? "w-[250px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
    >
      <div
        className={`py-8 ${
          !isExpanded && !isHovered ? "justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <center>
                <img
                  className="dark:hidden"
                  src="/logo/wawwhite.png"
                  alt="Logo"
                  width={150}
                  height={100}
                />
              </center>
              <img
                className="hidden dark:block"
                src="/logo/wawwhite.png"
                alt="Logo"
                width={150}
                height={100}
              />
            </>
          ) : (
            <img
              src="/images/logo/wawwhite.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu administrateur"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;