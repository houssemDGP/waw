import { useState } from "react";
import TinderCard from "../components/TinderCard";

const data = [
  { name: "Tunis", img: "/imgs/img11.png" },
  { name: "Tunis", img: "/imgs/img12.png" },
    { name: "Sahara", img: "/imgs/img13.png" },

  { name: "Tokyo", img: "/imgs/tokyo.jpg" },
  { name: "Marrakech", img: "/imgs/marrakech.jpg" },
];

export default function TinderCardPage() {
  const [cards, setCards] = useState(data);

  const handleSwipe = (direction) => {
    setCards((prev) => prev.slice(1));
  };

  return (
<>
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: "20px",
      padding: "20px",
      background: "#f0f0f0",
      minHeight: "100vh",
    }}
  >
    {[0, 1, 2, 3].map((groupIndex) => (
      <div
        key={groupIndex}
        style={{
          flex: "1 1 300px", // grows and shrinks responsively
          maxWidth: "90vw",  // limits size on small screens
          height: "500px",
          position: "relative",
        }}
      >
        {cards.map((card, index) => (
          <TinderCard
            key={card.name + groupIndex}
            name={card.name}
            img={card.img}
            onSwipe={handleSwipe}
            index={index}
          />
        )).reverse()}
      </div>
    ))}
  </div>
</>


  );
}
