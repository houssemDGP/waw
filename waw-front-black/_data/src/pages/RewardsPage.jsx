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

const ContactButton = styled.a`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background-color: #181ad6;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0f1390;
  }
`;

export default function RewardsPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <PageContainer>
        <Content>
          <Title>Gagnez des récompenses</Title>

          <Paragraph>
            <Highlight>Explorez et gagnez des récompenses</Highlight> en utilisant notre programme de fidélité.
            Cumulez des points à chaque réservation et échangez-les contre des offres exclusives.
          </Paragraph>

          <Paragraph>
            Notre système est simple, transparent et conçu pour vous faire bénéficier au maximum de votre fidélité.
            Profitez d'avantages exceptionnels et recommencez à chaque nouvelle activité.
          </Paragraph>

          <Paragraph>
            Rejoignez une communauté grandissante d'utilisateurs satisfaits et découvrez toutes les possibilités qui s'offrent à vous.
          </Paragraph>
        </Content>
      </PageContainer>
    </>
  );
}
