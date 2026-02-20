  import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
  import {
    Typography
  } from '@mui/material';
const GalleryContainer = styled.div`
  width: 100%;
  margin-top : 50px;
`;

const GalleryImages = styled.div`
  position: relative;
  height: 600px;
  border-radius: 16px;
  overflow: hidden;
`;

const ImageItem = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${({ img }) => img});
  background-size: cover;
  background-position: center;
  opacity: ${({ active }) => (active ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

/* Buttons container full width inside slider */
const RowItems = styled.div`
  position: absolute;
  top: 1rem;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around; /* evenly spread */
  gap: 0.5rem;
  padding: 0 1rem;
  z-index: 2;
`;

const RowItem = styled.div`
  cursor: pointer;
  flex: 1; /* makes buttons stretch evenly */
  text-align: center;
  padding: 0.5rem 0.8rem;
  border: 2px solid #fff; /* border only */
  background: transparent; /* transparent background */
  color: ${({ active }) => (active ? "#fff" : "#ddd")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  font-size: 0.85rem;
  transition: 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.15); /* subtle hover effect */
    color: #fff;
  }
`;

const PortfolioGallery = () => {
  const items = [
    {
      title: "Nabeul",
      subtitle: "Visitez",
      link: "https://treknsea.com/expeditions-nabeul/",
      img: "https://treknsea.com/wp-content/uploads/2024/01/Bou-Argoub-Dar-Salma-2-scaled.jpeg",
    },
    {
      title: "Zaghouan",
      subtitle: "Visitez",
      link: "https://treknsea.com/expeditions-zaghouan/",
      img: "https://treknsea.com/wp-content/uploads/2024/01/PHOTO-2024-01-07-18-55-04.jpg",
    },
    {
      title: "Bizerte",
      subtitle: "Visitez",
      link: "https://treknsea.com/expeditions-bizerte/",
      img: "https://treknsea.com/wp-content/uploads/2024/01/IMG_0497-scaled.jpeg",
    },
    {
      title: "Béja",
      subtitle: "Visitez",
      link: "#",
      img: "https://treknsea.com/wp-content/uploads/2024/01/IMG_1814-1-scaled.jpg",
    },
    {
      title: "Jendouba",
      subtitle: "Visitez",
      link: "#",
      img: "https://treknsea.com/wp-content/uploads/2023/12/jendouba.jpg",
    },
    {
      title: "Le Sahara",
      subtitle: "Visitez",
      link: "#",
      img: "https://treknsea.com/wp-content/uploads/2023/12/sahara-1-scaled.jpg",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const BASE_URL = "https://waw.com.tn";

  const [villes, setVilles] = useState([]);
useEffect(() => {
  fetch('https://waw.com.tn/api/villes')
    .then((res) => res.json())
    .then((data) => {
        setVilles(data);
        console.log(data);
    })
    .catch((error) => {
      console.error('Erreur lors du chargement des villes :', error);
    });
}, []);
  return (
    <GalleryContainer>
        <Typography
          variant="h5"
          sx={{ color: "#181AD6", fontWeight: "bold", flexGrow: 1, textAlign: "center" ,marginTop:"50px",fontSize: "35px"}}
        >
          Nos meilleures destinations
        </Typography>     
         <GalleryImages>
        {/* Images */}
        {villes.map((item, index) => (
          <ImageItem key={index} img={`${BASE_URL}${item.imageUrl}`} active={index === activeIndex} />
        ))}

        {/* Full-width transparent buttons inside slider */}
        <RowItems>
          {villes.map((item, index) => (
            <RowItem
              key={index}
              active={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {item.nom}
            </RowItem>
          ))}
        </RowItems>
      </GalleryImages>
    </GalleryContainer>
  );
};

export default PortfolioGallery;
