import { useRef, useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  showCloseButton = true,
  isFullscreen = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Détecter mobile au mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

useEffect(() => {
  if (isOpen && isMobile) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }

  return () => {
    document.body.style.overflow = "unset";
  };
}, [isOpen, isMobile]);


  // Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Dragging Desktop
  useEffect(() => {
    if (isMobile) return; // pas de drag sur mobile

    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      }
    };
    const handleMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset, isMobile]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? "w-full h-full bg-[#021732] dark:bg-gray-900"
    : isMobile
    ? "relative w-full max-w-lg sm:max-w-xl rounded-3xl bg-[#021732] dark:bg-gray-900"
    : "relative w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/3 aspect-square rounded-3xl bg-[#021732] dark:bg-gray-900 shadow-lg";

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    if ((e.target as HTMLElement).closest(".modal-drag-handle")) {
      setDragging(true);
      setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  return (
  <div
    className="fixed inset-0 z-[99999] flex items-center justify-center"
    style={{
      pointerEvents: isMobile ? "auto" : "none", // 🚀 important
    }}
  >
    {/* BACKDROP - uniquement mobile */}
    {isMobile && !isFullscreen ? (
      <div
        className="absolute inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
    ) : null}

    {/* MODAL CONTENT */}
    <div
      ref={modalRef}
      onMouseDown={handleMouseDown}
      className={`${contentClasses} ${className}`}
      style={{
        pointerEvents: "auto", // ✅ réactive le modal lui-même
        position: isMobile ? "relative" : "absolute",
        top: isMobile ? undefined : position.y || "50%",
        left: isMobile ? undefined : position.x || "50%",
        transform:
          isMobile || position.x || position.y
            ? "none"
            : "translate(-50%, -50%)",
        maxHeight: "90vh",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        cursor: dragging && !isMobile ? "grabbing" : "default",
        zIndex: 200,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {!isMobile && (
        <div className="modal-drag-handle w-full h-6 cursor-move absolute top-0 left-0"></div>
      )}

      {showCloseButton && (
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          ✕
        </button>
      )}
      <div className="p-4">{children}</div>
    </div>
  </div>
);
};
