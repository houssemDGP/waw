import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

export default function TinderCard({ name, img, onSwipe, index }) {
  const controls = useAnimation();
  const [swiped, setSwiped] = useState(false);
  const [xDir, setXDir] = useState(0);

  const handleDrag = (event, info) => {
    setXDir(info.offset.x);
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 150) {
      swipe("right");
    } else if (info.offset.x < -150) {
      swipe("left");
    } else {
      setXDir(0);
      controls.start({ x: 0, rotate: 0 });
    }
  };

  const swipe = (direction) => {
    if (swiped) return;
    setSwiped(true);

    const x = direction === "right" ? 1000 : -1000;

    controls.start({
      x,
      opacity: 0,
      rotate: direction === "right" ? 25 : -25,
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
  cursor: "grab",
  zIndex: 100 - index,
  top: index * 5,
  transform: `scale(${1 - index * 0.02})`,
  };

  return (
    <motion.div
      drag="x"
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      dragConstraints={false}
      animate={controls}
      whileTap={{ scale: 1.05 }}
      style={cardStyle}
    >
      <div style={{ pointerEvents: 'auto' }}>

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
          pointerEvents: "none" // disable pointer events on img

    }} 
/>
  </div>

      {/* Bottom Gradient with Name */}
      <div style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 16,
        background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
      }}>
        {name}
      </div>

      {/* Left Label */}
      <motion.div
        style={{
          position: "absolute",
          top: 40,
          left: 20,
          transform: "rotate(-20deg)",
          backgroundColor: "rgba(33, 150, 243, 0.9)",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: 8,
          fontWeight: "bold",
          fontSize: 18,
          opacity: xDir < -50 ? 1 : 0,
          scale: xDir < -50 ? 1 : 0.5,
          transition: "opacity 0.2s, transform 0.2s",
        }}
      >
        💔 Nope
      </motion.div>

      {/* Right Label */}
      <motion.div
        style={{
          position: "absolute",
          top: 40,
          right: 20,
          transform: "rotate(20deg)",
          backgroundColor: "rgba(233, 30, 99, 0.9)",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: 8,
          fontWeight: "bold",
          fontSize: 18,
          opacity: xDir > 50 ? 1 : 0,
          scale: xDir > 50 ? 1 : 0.5,
          transition: "opacity 0.2s, transform 0.2s",
        }}
      >
        💖 Like
      </motion.div>
    </motion.div>
  );
}
