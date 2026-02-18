// ExperiencesGrid.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Typography, Chip } from '@mui/material';

const HeroWrapper = styled.div`
  padding: 60px 80px;
  border-radius: 30px;
  margin: 20px;
  color: black;
  position: relative;
  overflow: hidden;
  display: flex;
  gap: 40px;
  align-items: center;

  @media (max-width: 992px) {
    flex-direction: column;
    padding: 40px 30px;
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
    margin: 10px;
    border-radius: 20px;
    gap: 30px;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 50%;

  @media (max-width: 992px) {
    max-width: 100%;
    text-align: center;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.2em;
  font-weight: 800;
  margin: 0 0 20px 0;
  line-height: 1.2;

  @media (max-width: 1200px) {
    font-size: 2.8em;
  }

  @media (max-width: 768px) {
    font-size: 2.2em;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.1em;
  margin-bottom: 20px;
  opacity: 0.85;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

const Description = styled.p`
  font-size: 1em;
  margin-bottom: 30px;
  opacity: 0.8;
  line-height: 1.6;
  color: #555;

  @media (max-width: 768px) {
    font-size: 0.95em;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;

  @media (max-width: 992px) {
    justify-content: center;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const ExploreButton = styled.button`
  background-color: black;
  color: white;
  border: none;
  padding: 15px 35px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  border-radius: 50px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #333;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }

  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 1em;
  }
`;

const ProposeButton = styled.button`
  background-color: transparent;
  color: black;
  border: 2px solid black;
  padding: 15px 35px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  border-radius: 50px;
  transition: all 0.3s ease;

  &:hover {
    background-color: black;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 1em;
  }
`;

const CardsContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 50%;

  @media (max-width: 992px) {
    max-width: 100%;
    width: 100%;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.12);
    border-color: rgba(0,0,0,0.1);
  }
`;

const CategoryIcon = styled.div`
  font-size: 3em;
  margin-bottom: 15px;
`;

const CategoryLabel = styled.h3`
  font-size: 1.2em;
  font-weight: 600;
  margin: 0;
  color: black;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 3rem 0;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
    margin: 2rem 0;
  }
`;

const SectionTitle = styled(Typography)`
  && {
    color: black;
    font-weight: bold;
    text-align: center;
    margin: 50px 0 30px 0;
    font-size: 35px;
    position: relative;

    &:after {
      content: '';
      display: block;
      width: 80px;
      height: 4px;
      background-color: #f8bf20;
      margin: 20px auto 0;
      border-radius: 2px;
    }

    @media (max-width: 768px) {
      font-size: 28px;
      margin: 40px 0 20px 0;
    }
  }
`;

const ActivitiesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const CardWrapper = styled.div`
  width: 100%;
`;

const ShowMoreWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 2rem;
`;

const ShowMoreButton = styled.button`
  background-color: black;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  border-radius: 50px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #333;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }

  @media (max-width: 768px) {
    padding: 12px 30px;
    font-size: 1em;
    width: 100%;
  }
`;

const ActivityCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  height: 280px;
  transition: all 0.4s ease;
  background-image: url(${({ bg }) => bg});
  background-size: cover;
  background-position: center;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2));
    transition: background 0.4s ease;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
    
    &::after {
      background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3));
    }
  }

  @media (max-width: 768px) {
    height: 250px;
  }
`;

const ActivityInfo = styled.div`
  position: relative;
  z-index: 1;
  padding: 25px 20px;
  color: #fff;
`;

const ActivityTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ActivityEvents = styled.span`
  font-size: 15px;
  color: #f8bf20;
  font-weight: 500;
  display: inline-block;
  padding: 5px 12px;
  background-color: rgba(0,0,0,0.4);
  border-radius: 50px;
  backdrop-filter: blur(5px);
`;

const TopActivity = ({ imgSrc, title, eventsCount, href }) => (
  <a href={href} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
    <ActivityCard bg={imgSrc}>
      <ActivityInfo>
        <ActivityTitle>{title}</ActivityTitle>
        <ActivityEvents>{eventsCount} événements</ActivityEvents>
      </ActivityInfo>
    </ActivityCard>
  </a>
);

const ExperiencesGrid = ({ 
  activities = [], 
  baseUrl = '', 
  showAll = false, 
  onShowMore = () => {},
  initialDisplayCount = 8,
  showHero = true
}) => {
  const [localShowAll, setLocalShowAll] = useState(showAll);
  const visibleActivites = localShowAll
    ? activities
    : activities.slice(0, initialDisplayCount);

  const handleShowMore = () => {
    setLocalShowAll(true);
    onShowMore();
  };

  const categories = [
    { label: 'Workshops', icon: '🎨' },
    { label: 'Gastronomie', icon: '🍽️' },
    { label: 'Aventures', icon: '🏔️' },
    { label: 'Culture', icon: '🏛️' }
  ];

  return (
    <>
      {showHero && (
        <HeroWrapper>
          <HeroContent>
            <HeroTitle>
              Trouvez quand et où vivre l'extraordinaire
            </HeroTitle>
            <HeroSubtitle>
              When and Where : la plateforme qui vous connecte aux meilleures expériences
            </HeroSubtitle>
            <Description>
              Ateliers créatifs, aventures outdoor, tables d'hôte authentiques, coaching personnalisé... 
              Réservez l'expérience parfaite au bon moment et au bon endroit.
            </Description>
            
            <ButtonGroup>
              <ExploreButton to="/decouvrir">
                Explorer les expériences
              </ExploreButton>
              <ProposeButton to="/decouvrir">
                Proposer mon expérience
              </ProposeButton>

                          {activities.length > initialDisplayCount && !localShowAll && (
                <ExploreButton onClick={handleShowMore}>
                  Voir toutes les catégories
                </ExploreButton>
            )}
            </ButtonGroup>
          </HeroContent>

          <CardsContainer>

              {visibleActivites.map((cat, index) => (
                <CardWrapper key={cat.id || index}>
                  <TopActivity
                    title={cat.titre}
                    eventsCount={cat.events?.length || 0}
                    imgSrc={`${baseUrl}${cat.imageUrl}`}
                    href={`/decouvrir?activite=${cat.titre}`}
                  />
                </CardWrapper>
              ))}
          </CardsContainer>
        </HeroWrapper>
      )}
    </>
  );
};

export default ExperiencesGrid;