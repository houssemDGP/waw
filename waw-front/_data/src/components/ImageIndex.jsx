import React from "react";
import styled from "styled-components";

const Section = styled.section`
  width: 100%;
  padding: 80px 20px;
  position: relative;
  text-align: center;
  background-image: url("https://waw.com.tn/uploads/blog/hammamet.png"); /* change l’URL */
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* effet parallax léger */
  color: #fff;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5); /* assombrit l’image pour lisibilité */
`;

const Container = styled.div`
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  z-index: 2;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #fff;
`;

const Text = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 15px;
  color: #eee;
`;

const Button = styled.a`
  display: inline-block;
  padding: 12px 30px;
  margin-top: 25px;
  background: transparent;
  border: 2px solid #fff;
  color: #fff;
  font-weight: bold;
  border-radius: 25px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: #07c8b9;
    border-color: #07c8b9;
    transform: translateY(-2px);
  }
`;

const ImageIndex = () => {
  return (
    <Section>
      <Overlay />
      <Container>
        <Title>Vivez des expériences uniques</Title>
        <Text>
Explorez nos catégories d’activités et partez à la découverte de la Tunisie, du Sahara aux plages paradisiaques du Nord et de l’Est, en passant par les sommets du centre du pays. Chaque catégorie propose des expériences mémorables adaptées à tous les goûts.        </Text>
      </Container>
    </Section>
  );
};

export default ImageIndex;
