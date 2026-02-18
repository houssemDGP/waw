import React from "react";
import styled from "styled-components";

// ===== STYLED COMPONENTS – "Comment ça marche ?" 3 steps, faithful to image.png =====
const Section = styled.section`
  padding: 100px 20px;
  width: 100%;
  background: linear-gradient(to bottom, #faf8f3, #ffffff);
  position: relative;
  color: #1e2a41;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const MainTitle = styled.h2`
  font-size: 3.2rem;
  font-weight: 800;
  color: #0a2c3d;
  margin-bottom: 16px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SubHeadline = styled.p`
  font-size: 1.4rem;
  color: #5a6b7a;
  max-width: 600px;
  margin: 0 auto 70px auto;
  line-height: 1.4;
  font-weight: 400;
  border-bottom: 2px solid #e9d9c0;
  padding-bottom: 25px;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 50px;
  }
`;

const StepCard = styled.div`
  text-align: center;
  padding: 30px 25px;
  background: white;
  border-radius: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(183, 140, 74, 0.1);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
    border-color: rgba(183, 140, 74, 0.3);
  }
`;

const StepNumber = styled.div`
  font-size: 3.8rem;
  font-weight: 800;
  color: #b78c4a;
  line-height: 1;
  margin-bottom: 15px;
  text-shadow: 2px 2px 0 rgba(183, 140, 74, 0.1);
`;

const StepTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #0f2b3c;
  margin-bottom: 20px;
  letter-spacing: -0.01em;
`;

const StepDescription = styled.p`
  font-size: 1.1rem;
  color: #2d3e50;
  line-height: 1.7;
  opacity: 0.9;
  font-weight: 400;
  max-width: 280px;
  margin: 0 auto;
`;

const DecorativeLine = styled.div`
  display: none;
  
  @media (min-width: 901px) {
    display: block;
    position: relative;
    &::after {
      content: "•••";
      position: absolute;
      top: 50%;
      right: -30px;
      transform: translateY(-50%);
      color: #d4b48c;
      font-size: 2rem;
      letter-spacing: 8px;
    }
  }
`;

// Helper to add decorative dots between steps (except last)
const StepWithSeparator = ({ number, title, description, showSeparator }) => (
  <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
    <StepCard>
      <StepNumber>{number}</StepNumber>
      <StepTitle>{title}</StepTitle>
      <StepDescription>{description}</StepDescription>
    </StepCard>
    {showSeparator && <DecorativeLine />}
  </div>
);

// ===== MAIN COMPONENT =====
const CommentCaMarche = () => {
  const steps = [
    {
      number: "1",
      title: "Découvrez",
      description: "Parcourez nos expériences et trouvez QUOI faire, OÙ et QUAND selon vos envies"
    },
    {
      number: "2",
      title: "Réservez",
      description: "Choisissez votre créneau et confirmez en quelques clics de manière sécurisée"
    },
    {
      number: "3",
      title: "Vivez",
      description: "Présentez-vous au bon endroit, au bon moment, et profitez pleinement"
    }
  ];

  return (
    <Section>
      <Container>
        {/* Main title exactly as in image: "Comment ça marche ?" */}
        <MainTitle>Comment ça marche ?</MainTitle>

        {/* Subline: "Réservez en 3 étapes simples" */}
        <SubHeadline>Réservez en 3 étapes simples</SubHeadline>

        {/* Three steps grid — exact copy from image */}
        <StepsGrid>
          {steps.map((step, index) => (
            <StepCard key={index}>
              <StepNumber>{step.number}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepCard>
          ))}
        </StepsGrid>

      </Container>
    </Section>
  );
};

export default CommentCaMarche;