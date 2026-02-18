import React from "react";
import styled from "styled-components";

const Section = styled.section`
  width: 100%;
  padding: 80px 20px;
  position: relative;
  text-align: center;
  background-image: url("https://waw.com.tn/uploads/blog/hammamet.png"); /* change l’URL si besoin */
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* effet parallax */
  color: #fff;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55); /* assombrissement */
`;

const Container = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 2;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 40px;
  color: #fff;
`;

const BenefitsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const BenefitCard = styled.a`
  flex: 1 1 220px;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  color: #fff;
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;

  &:hover {
    background: #397581;
    border-color: #07c8b9;
    transform: translateY(-5px);
  }

  img {
    width: 50px;
    height: 50px;
    margin-bottom: 15px;
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 0.95rem;
    color: #ddd;
  }
`;

const benefits = [
  {
    icon: "icons/24-hours-support.png",
    title: "Assistance 24 h/24, 7 j/7",
    description: "Quel que soit le fuseau horaire, nous sommes là pour vous aider.",
    lien: "/assistancePage",
  },
  {
    icon: "icons/trophy.png",
    title: "Gagnez des récompenses",
    description: "Explorez, gagnez des récompenses, utilisez-les avec notre programme de fidélité, et recommencez.",
    lien: "/rewardsPage",
  },
  {
    icon: "icons/rating.png",
    title: "Des millions d'avis",
    description: "Planifiez et réservez en toute confiance grâce aux avis des autres voyageurs.",
    lien: "/reviewsPage",
  },
  {
    icon: "icons/date.png",
    title: "Planifiez selon vos envies",
    description: "Restez flexible avec l'annulation gratuite et l'option Réservez maintenant et payez plus tard.",
    lien: "/planningPage",
  },
];

export default function ViatorBenefits() {
  return (
    <Section>
      <Overlay />
      <Container>
        <Title>
          Pourquoi réserver sur la plateforme WAW ?
        </Title>
        <BenefitsWrapper>
          {benefits.map(({ icon, title, description, lien }, idx) => (
            <BenefitCard key={idx} href={lien}>
             <center> <img src={icon} alt={title} /></center>
              <h3>{title}</h3>
              <p>{description}</p>
            </BenefitCard>
          ))}
        </BenefitsWrapper>
      </Container>
    </Section>
  );
}
