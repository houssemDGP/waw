import React from "react";
import styled from "styled-components";

const Section = styled.section`
  width: 100%;
  margin-top : 50px;
  padding: 80px 20px;
  position: relative;
  background-image: url("https://waw.com.tn/uploads/blog/hammamet.png"); /* modifie l’URL si besoin */
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* effet parallax */
  color: #fff;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
`;

const Container = styled.div`
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  z-index: 2;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2.4rem;
  font-weight: bold;
  margin-bottom: 25px;
  color: #fff;
`;

const IntroText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 50px;
  color: #eee;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;

  &:hover {
    background: #397581;
    border-color: #07c8b9;
    transform: translateY(-5px);
  }

  h3 {
    font-size: 1.4rem;
    margin-bottom: 15px;
    color: #fff;
  }

  p {
    font-size: 1rem;
    color: #ddd;
    line-height: 1.6;
  }
`;

const ExperiencesSection = () => {
  return (
    <Section>
      <Overlay />
      <Container>
        <IntroText>
          Explorez nos catégories d’activités et partez à la découverte de la
          Tunisie, du Sahara aux plages paradisiaques du Nord et de l’Est, en
          passant par les sommets du centre du pays. Chaque catégorie propose des
          expériences mémorables adaptées à tous les goûts.
        </IntroText>

        <Grid>
          <Card>
            <h3>Des aventures pour tous</h3>
            <p>
              Choisissez parmi nos catégories pour vivre des activités de plein
              air, sportives ou culturelles et découvrir la Tunisie authentique
              sous un nouveau jour.
            </p>
          </Card>

          <Card>
            <h3>Responsables et durables</h3>
            <p>
              Nos activités respectent la nature et la culture tunisienne. Nous
              encourageons un tourisme écologique et équitable, tout en
              valorisant le patrimoine naturel et culturel du pays.
            </p>
          </Card>

          <Card>
            <h3>Immersion totale</h3>
            <p>
              Chaque catégorie vous permet de plonger dans les traditions, la
              culture et la beauté naturelle de la Tunisie, pour des souvenirs
              inoubliables.
            </p>
          </Card>
        </Grid>
      </Container>
    </Section>
  );
};

export default ExperiencesSection;
