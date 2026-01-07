import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckIcon from '@mui/icons-material/Check';
export default function TinderCard({ name, img, onSwipe, index, details = "Détails à afficher ici." }) {
  const controls = useAnimation();
  const [swiped, setSwiped] = useState(false);
  const [showModal, setShowModal] = useState(false); // état pour la modal

  const swipe = (direction) => {
    if (swiped) return;
    setSwiped(true);

    let animation = {};
    if (direction === "right") {
      animation = { x: 1000, rotate: 25 };
    } else if (direction === "left") {
      animation = { x: -1000, rotate: -25 };
    } else if (direction === "up") {
      animation = { y: -1000, rotate: 0 };
    }

    controls.start({
      ...animation,
      opacity: 0,
      transition: { duration: 0.5 },
    }).then(() => {
      onSwipe?.(direction);
    });
  };

  const cardStyle = {
    position: "absolute",
    width: 300,
    height: 400,
    background: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    zIndex: 100 - index,
    top: index * 5,
    transform: `scale(${1 - index * 0.02})`,
  };

  return (
    <>
      <motion.div animate={controls} style={cardStyle}>
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {/* Image */}
          <img
            src={img}
            alt={name}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              top: 0,
              left: 0,
              zIndex: 0,
              pointerEvents: "none",
            }}
          />
{/* Promo Badge */}
<div style={{
  position: "absolute",
  top: 10,
  left: 10,
  backgroundColor: "#d65113", // rouge promo
  color: "#fff",
  padding: "4px 8px",
  borderRadius: 4,
  fontSize: 12,
  fontWeight: "bold",
  zIndex: 2,
}}>
  Promo
</div>
{/* Price Tag */}
<div style={{
  position: "absolute",
  top: 10,
  right: 16,
  backgroundColor: "#d65113",
  color: "#fff",
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 14,
  fontWeight: "bold",
  zIndex: 2,
}}>
  39.99 €
</div>
          {/* Bottom gradient with name */}
          <div style={{
            position: "absolute",
            bottom: 100,
            width: "100%",
            padding: 16,
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
            zIndex: 2,
          }}>
            {name}
          </div>

<div style={{
  position: "absolute",
  bottom: 55,
  width: "100%",
  display: "flex",
  justifyContent: "space-around",
  zIndex: 2,
}}>
  <button
    onClick={() => swipe("left")}
    style={btnStyle("rgba(255, 82, 82, 0.9)")}
  >
    <ClearIcon sx={{ fontSize: 24, color: "#fff" }} />
  </button>

  <button
    onClick={() => swipe("up")}
    style={btnStyle("rgba(255, 202, 40, 0.9)")}
  >
    <FavoriteIcon sx={{ fontSize: 24, color: "#fff" }} />
  </button>

  <button
    onClick={() => swipe("right")}
    style={btnStyle("rgba(76, 175, 80, 0.9)")}
  >
    <CheckIcon sx={{ fontSize: 24, color: "#fff" }} />
  </button>
</div>

          {/* Détails Button */}
          <div style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            zIndex: 2,
          }}>
            <button onClick={() => setShowModal(true)} style={detailBtnStyle}>🛈 Détails</button>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>{name}</h3>
            <p>{details}</p>
            <button onClick={() => setShowModal(false)} style={closeBtnStyle}>Fermer</button>
          </div>
        </div>
      )}
    </>
  );
}

// Style for swipe buttons
const btnStyle = (bgColor) => ({
  border: "none",
  borderRadius: "50%",
  width: 50,
  height: 50,
  backgroundColor: bgColor,
  color: "#fff",
  fontSize: 20,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  transition: "transform 0.2s",
});

// Style bouton détails
const detailBtnStyle = {
  padding: "8px 100%",
  border: "none",
  borderRadius: 20,
  backgroundColor: "#1976d2",
  color: "#fff",
  fontSize: 14,
  cursor: "pointer",
};

// Style modal
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 10,
  width: "90%",
  maxWidth: 400,
  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
};

const closeBtnStyle = {
  marginTop: 20,
  padding: "6px 12px",
  backgroundColor: "#f44336",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
