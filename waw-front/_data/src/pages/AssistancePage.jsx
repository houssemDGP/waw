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

export default function AssistancePage() {
  return (
    <>
                  <TopBar />
        <Navbar />
    <PageContainer>
      <Content>
        <Title>Assistance 24 h/24, 7 j/7</Title>

        <Paragraph>
          <Highlight>Quel que soit le fuseau horaire,</Highlight> notre équipe est disponible pour vous aider à tout moment, jour et nuit.
          Nous comprenons que les imprévus peuvent survenir à tout moment, et nous sommes prêts à intervenir rapidement.
        </Paragraph>

        <Paragraph>
          Notre service d’assistance couvre un large éventail de besoins : questions techniques, réservations, modifications de commandes, ou toute autre demande.
          Vous pouvez compter sur une réponse rapide et efficace.
        </Paragraph>

        <Paragraph>
          Pour une prise en charge optimale, notre équipe est formée pour comprendre vos besoins spécifiques et vous offrir des solutions personnalisées.
          Votre satisfaction est notre priorité absolue.
        </Paragraph>

        <Paragraph>
          N’hésitez pas à nous contacter via notre chat en ligne, par téléphone, ou par email.  
          Nous sommes là pour vous accompagner à chaque étape.
        </Paragraph>

      </Content>
    </PageContainer>
    </>
  );
}
