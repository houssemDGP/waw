import React from "react";
import styled from "styled-components";
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f9ff;
  padding: 3rem 2rem;
  font-family: 'Arial', sans-serif;
`;

const Content = styled.div`
  max-width: 700px;
  text-align: center;
  background: white;
  padding: 3rem 3rem 4rem 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(24, 26, 214, 0.15);
`;

const Title = styled.h1`
  font-size: 2.75rem;
  color: #181ad6;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  color: #444;
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const Highlight = styled.span`
  color: #181ad6;
  font-weight: 700;
`;

export default function ReviewsPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <PageContainer>
        <Content>
          <Title>Des millions d'avis</Title>

          <Paragraph>
            <Highlight>Planifiez et réservez en toute confiance</Highlight> grâce aux avis détaillés et authentiques des voyageurs.
            Découvrez les expériences des autres avant de choisir votre activité.
          </Paragraph>

          <Paragraph>
            Nos avis sont vérifiés et continuellement mis à jour pour vous garantir une information fiable et transparente.
          </Paragraph>

          <Paragraph>
            Partagez vous aussi vos expériences pour aider la communauté à faire les meilleurs choix.
          </Paragraph>
        </Content>
      </PageContainer>
    </>
  );
}
