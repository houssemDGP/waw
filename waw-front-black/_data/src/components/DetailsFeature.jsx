import {
  VerifiedOutlined,
} from "@mui/icons-material";
import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 15px;
  font-family: 'Roboto', sans-serif;
`;

const FeatureBoxContainer = styled.div``;

const TitleSection = styled.h5`
  color: #3c71c2;
  font-weight: 700;
  margin-bottom: 10px;
  margin-top: 30px;
`;

const TopFeatureBoxes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 10px;

  div {
    border: 1px solid #e0dede;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
    height: 58px;
    color: #262626;
    font-size: 15px;
    background: #fff;

    @media screen and (max-width: 675px) {
      height: 40px;
      font-size: 13px;
    }

    .feature-icon {
      margin-right: 8px;
      font-size: 25px;
      color: #4c71c2;

      @media screen and (max-width: 675px) {
        font-size: 22px;
      }
    }
  }
`;

const BottomFeatureBoxes = styled(TopFeatureBoxes)`
  margin-top: 10px;
  @media screen and (max-width: 675px) {
    margin-top: 5px;
  }
`;

const SidebarDescContainer = styled.div`
  margin-top: 30px;
  display: flex;
  gap: 20px;

  @media screen and (max-width: 675px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const DescTextContainer = styled.div`
  flex: 3;
  color: #262626;

  @media screen and (max-width: 675px) {
    flex: 1;
  }

  h2 {
    margin-bottom: 15px;
  }

  p {
    margin-bottom: 15px;
    font-size: 15px;
    line-height: 1.5;
  }
`;

const Aside = styled.aside`
  background-color: #ebf3ff;
  border-radius: 8px;
  flex: 1;
  min-width: 300px;
  height: fit-content;
  padding: 20px 25px;
  color: #262626;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media screen and (max-width: 675px) {
    width: 100%;
    min-width: unset;
    text-align: center;
  }

  h3 {
    color: #3c71c2;
    font-size: 22px;
    margin-bottom: 20px;
    font-weight: 700;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 15px;
  color: #393838;

  span {
    font-weight: 600;
  }
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;

  button {
    background-color: #d65113;
    color: white;
    font-size: 16px;
    font-weight: 700;
    width: 140px;
    padding: 12px 0;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #d65113;
    }
  }
`;

// Nouveau bloc réservation moderne
const ReservationCard = styled.div`
  background: #fff;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.3);
  border-radius: 12px;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 40px auto 0;

  @media screen and (max-width: 675px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const ReservationDetails = styled.div`
  flex: 1;
  color: #262626;
`;

const ReservationTitle = styled.h3`
  margin: 0 0 12px 0;
  font-weight: 700;
  font-size: 1.3rem;
  color: #3c71c2;
`;

const ReservationText = styled.p`
  margin: 4px 0;
  font-size: 1rem;
`;

const ReservationTotal = styled.p`
  margin-top: 8px;
  font-weight: 700;
  font-size: 1.1rem;
  color: #222;
`;

const ConfirmButton = styled.button`
  background-color: #d65113;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 32px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  min-width: 160px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d65113;
  }
  
  @media screen and (max-width: 675px) {
    min-width: 100%;
  }
`;

const Reservation = () => (

  <ReservationCard>
    <ReservationDetails>
      <ReservationTitle>Détails de la réservation :</ReservationTitle>
      <ReservationText>Date : 19 juin 2025</ReservationText>
      <ReservationText>Participants : 2 adultes, 2 enfants</ReservationText>
      <ReservationText>Heure : 08:00</ReservationText>
      <ReservationTotal>Total : 339,90 $US</ReservationTotal>
    </ReservationDetails>
    <ConfirmButton onClick={() => alert("Réservation confirmée !")}>
      Confirmer
    </ConfirmButton>
  </ReservationCard>
);

const HotelFeature = () => {
    const [showReservation, setShowReservation] = useState(false);

  return (
    <Container>
      <FeatureBoxContainer>
        <TitleSection>Ce qui est inclus</TitleSection>
        <TopFeatureBoxes>
          <div><VerifiedOutlined className="feature-icon" /> Taxe sur les produits et services</div>
          <div><VerifiedOutlined className="feature-icon" /> Guide touristique professionnel agréé</div>
          <div><VerifiedOutlined className="feature-icon" /> Véhicule climatisé</div>
          <div><VerifiedOutlined className="feature-icon" /> Entrée – Grande Mosquée de Kairouan</div>
          <div><VerifiedOutlined className="feature-icon" /> Entrée – Médina de Kairouan</div>
          <div><VerifiedOutlined className="feature-icon" /> Entrée – Amphithéâtre d'El Jem</div>
          <div><VerifiedOutlined className="feature-icon" /> Entrée – Forte El Ribat</div>
          <div><VerifiedOutlined className="feature-icon" /> Entrée – Les bassins des Aghlabides</div>
        </TopFeatureBoxes>

        <TitleSection>Ce qui est non inclus</TitleSection>
        <BottomFeatureBoxes>
          <div><VerifiedOutlined className="feature-icon" /> Déjeuner</div>
        </BottomFeatureBoxes>
      </FeatureBoxContainer>

      <SidebarDescContainer>
        <DescTextContainer>
          <h2>Vue d'ensemble</h2>
          <p>
            Depuis votre Hôtel vers la ville de Kairouan la quatrième ville sainte de l’Islam et capitale spirituelle de la Tunisie. Vous visiterez la grande mosquée qui est le plus ancien édifice religieux de l'Occident musulman. Par la suite vous aurez du temps libre dans la médina de Kairouan. Puis El Djem l'ancienne cité de Thysdrus, l'une des plus prospères de l'Afrique romaine pour la visite de son amphithéâtre et finir l’excursion par Monastir ancienne ville punique puis romaine de Ruspina.
          </p>
        </DescTextContainer>

        <Aside>
          <h3>À partir de 99 TND</h3>
          <InfoRow>
            <span>Lieu :</span>
            <span>Kairouan, Tunisie</span>
          </InfoRow>
          <InfoRow>
    <span style={{ fontWeight: 'bold' }}>Publié par :</span>
            <span>  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}
  >
    <img
      src="logo/waw.png" // remplace par le chemin réel de l'image
      alt="Avatar"
      style={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        objectFit: 'cover',
      }}
    />
    <span>WAW</span>
  </div></span>
          </InfoRow>

          <BtnContainer>
            <button type="button"               onClick={() => setShowReservation(prev => !prev)}
>Reserver</button>
          </BtnContainer>
        </Aside>
      </SidebarDescContainer>

      {showReservation && <Reservation />}
    </Container>
  );
};

export default HotelFeature;
