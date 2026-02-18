import React from "react";
import styled from "styled-components";

// ===== STYLED COMPONENTS – "Pourquoi choisir WAW ?" faithful to image.png =====
const Section = styled.section`
  padding: 120px 20px;
  width: 100%;
  background: #ffffff;
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
  margin-bottom: 20px;
  letter-spacing: -0.02em;
  
  span {
    color: #b78c4a; /* WAW golden accent */
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SubHeadline = styled.p`
  font-size: 1.35rem;
  color: #4a5568;
  max-width: 750px;
  margin: 0 auto 70px auto;
  line-height: 1.6;
  font-weight: 400;
  border-bottom: 2px solid #f0e9db;
  padding-bottom: 30px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
  margin-top: 30px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const Card = styled.div`
  text-align: left;
  padding: 0 10px;
`;

const Label = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #b78c4a;
  margin-bottom: 20px;
  border-bottom: 3px solid #b78c4a;
  display: inline-block;
  padding-bottom: 8px;
`;

const CardTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #0f2b3c;
  margin-bottom: 20px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const CardText = styled.p`
  font-size: 1.1rem;
  color: #2d3e50;
  line-height: 1.7;
  opacity: 0.85;
  font-weight: 400;
`;

const TunisianNote = styled.div`
  margin-top: 80px;
  font-size: 1.1rem;
  color: #6f7a89;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  
  &::before {
    content: "✦";
    color: #b78c4a;
    font-size: 1.5rem;
  }
  
  &::after {
    content: "✦";
    color: #b78c4a;
    font-size: 1.5rem;
  }
`;

// ===== MAIN COMPONENT =====
const PourquoiChoisirWAW = () => {
    return (
        <Section>
            <Container>
                {/* Main title exactly as in image: "Pourquoi choisir WAW ?" */}
                <MainTitle>
                    Pourquoi choisir <span>WAW</span> ?
                </MainTitle>

                {/* Subline — When and Where simplifies discovery & booking */}
                <SubHeadline>
                    When and Where simplifie la découverte et la réservation d'expériences
                </SubHeadline>

                {/* Three columns: WHERE, WHEN, WHAT — faithful to image text */}
                <Grid>
                    {/* WHERE - Où */}
                    <Card>
                        <Label>WHERE — OÙ</Label>
                        <CardText>Découvrez les meilleurs lieux et hôtes
                            partout en Tunisie, sélectionnés avec soin
                        </CardText>
                    </Card>

                    {/* WHEN - Quand */}
                    <Card>
                        <Label>WHEN — QUAND</Label>
                        <CardText>Réservez en temps réel
                            selon vos disponibilités, avec une confirmation instantanée
                        </CardText>
                    </Card>

                    {/* WHAT - Quoi */}
                    <Card>
                        <Label>WHAT — QUOI</Label>
                        <CardText>Des expériences variées et authentiques

                            pour tous les goûts et tous les budgets
                        </CardText>
                    </Card>
                </Grid>
            </Container>
        </Section>
    );
};

export default PourquoiChoisirWAW;