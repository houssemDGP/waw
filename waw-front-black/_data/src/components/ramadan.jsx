import React from "react";
import styled from "styled-components";

// ===== STYLED COMPONENTS – pixel perfect to match image.png =====
const Section = styled.section`
  padding: 160px 20px;
  width: 100%;
  position: relative;
  background: url("https://waw.com.tn/ramadan.jpg") center / cover fixed;
  color: white;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1;
  transition: background-color 0.3s ease;

  ${Section}:hover & {
    background: rgba(0, 0, 0, 0.45);
  }
`;

const Container = styled.div`
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  z-index: 2;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2.8rem;
  font-weight: 800;
  color: white;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
  letter-spacing: -0.01em;

  ${Section}:hover & {
    transform: scale(1.05);
  }
`;

// ----- additional components from the image content -----
const HeroHeadline = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  line-height: 1.1;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.25rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.92);
  max-width: 700px;
  margin: 0 auto 40px auto;
  line-height: 1.6;
`;

const Button = styled.a`
  display: inline-block;
  background: linear-gradient(145deg, #c89a4c, #b8863b);
  color: white;
  font-weight: 700;
  font-size: 1.3rem;
  padding: 16px 48px;
  border-radius: 60px;
  text-decoration: none;
  letter-spacing: 1px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  margin-bottom: 70px;
  transition: all 0.25s ease;

  &:hover {
    background: #dba959;
    transform: scale(1.05);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
    color: white;
  }

  /* 📱 Tablets & small screens */
  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 14px 36px;
    margin-bottom: 40px;
  }

  /* 📱 Phones */
  @media (max-width: 480px) {
    width: 90%;
    max-width: 320px;
    font-size: 1rem;
    padding: 14px 20px;
    text-align: center;
    border-radius: 40px;
    margin-bottom: 30px;
  }
`;


const Divider = styled.hr`
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, #eac175, #b5894b);
  border: none;
  margin: 30px auto 40px auto;
  border-radius: 2px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 30px 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  text-align: center;
  color: white;

  &:hover {
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(16px);
    transform: translateY(-8px);
    border-color: rgba(255, 215, 0, 0.4);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #ffefcf;
  letter-spacing: -0.01em;
`;

const CardText = styled.p`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
`;

const FooterNote = styled.div`
  margin-top: 60px;
  font-size: 1.1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 40px;

  strong {
    color: #ffd966;
  }
`;

// ===== MAIN COMPONENT =====
const Ramadan = () => {
  const handleSectionClick = () => {
    window.location.href = "/restaurants";
  };

  // Prevent button click from triggering section redirect
  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  return (
    <Section>
      <Overlay />
      <Container>
        {/* "Spécial Ramadan" – exact Title from React code with hover scale */}
        <Title>Spécial Ramadan</Title>

        {/* Full content from image.png */}
        <HeroHeadline>
          Réservez votre Table de Ramadan et expérience
        </HeroHeadline>

        <Description>
          Partagez des moments précieux autour de tables authentiques. Découvrez
          où et quand vivre l'esprit du mois sacré dans toute la Tunisie.
        </Description>

        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
          }}>
          <Button href="/restaurants" onClick={handleButtonClick}>
            Réserver ma table
          </Button>
          <Button href="/decouvrir" onClick={handleButtonClick}>
            Réserver mon expérience
          </Button>
        </div>

        <Divider />

        {/* Three features exactly as written in the image */}
        <Grid>
          <Card>
            <CardTitle>Tables d'hôte familiales</CardTitle>
            <CardText>
              L'hospitalité tunisienne authentique dans des maisons chaleureuses
            </CardText>
          </Card>

          <Card>
            <CardTitle>Iftars collectifs</CardTitle>
            <CardText>
              Partagez la rupture du jeûne avec votre communauté
            </CardText>
          </Card>

          <Card>
            <CardTitle>Expériences premium</CardTitle>
            <CardText>Tables d'exception pour des soirées mémorables</CardText>
          </Card>
        </Grid>
      </Container>
    </Section>
  );
};

export default Ramadan;
