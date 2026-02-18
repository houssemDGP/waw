import React from "react";
import styled from "styled-components";
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import PageMeta from "../components/common/PageMeta";

// ===== STYLED COMPONENTS – CGV & mentions légales, fidèle à l’image =====
const PageWrapper = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: #fbf9f5;
  color: #1e2a41;
  line-height: 1.7;
  padding: 60px 24px;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  background: white;
  border-radius: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.02);
  padding: 56px 64px;
  border: 1px solid rgba(183, 140, 74, 0.15);

  @media (max-width: 768px) {
    padding: 40px 28px;
  }
`;

const MainTitle = styled.h1`
  font-size: 2.6rem;
  font-weight: 700;
  color: #0a2c3d;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
  border-bottom: 3px solid #b78c4a;
  display: inline-block;
  padding-bottom: 12px;
`;

const SubBrand = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #b78c4a;
  text-transform: uppercase;
  letter-spacing: 4px;
  margin-top: 12px;
  margin-bottom: 48px;
`;

const Section = styled.section`
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #0f2b3c;
  margin-bottom: 24px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0e5d8;
`;

const ArticleTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: #1e3a4d;
  margin-top: 32px;
  margin-bottom: 16px;
`;

const Paragraph = styled.p`
  font-size: 1.05rem;
  color: #2d3e50;
  margin-bottom: 16px;
  font-weight: 400;
`;

const List = styled.ul`
  margin: 16px 0 24px 24px;
  list-style-type: none;
`;

const ListItem = styled.li`
  font-size: 1.05rem;
  color: #2d3e50;
  margin-bottom: 10px;
  padding-left: 28px;
  position: relative;

  &::before {
    content: "•";
    color: #b78c4a;
    font-weight: 700;
    font-size: 1.4rem;
    position: absolute;
    left: 4px;
    top: -6px;
  }
`;

const DoubleList = styled.ul`
  margin: 8px 0 16px 40px;
  list-style-type: none;
`;

const DoubleListItem = styled.li`
  font-size: 1.05rem;
  color: #2d3e50;
  margin-bottom: 6px;
  padding-left: 24px;
  position: relative;

  &::before {
    content: "–";
    color: #b78c4a;
    font-weight: 600;
    position: absolute;
    left: 4px;
  }
`;

const Highlight = styled.span`
  font-weight: 600;
  color: #0a2c3d;
`;

const CardLegal = styled.div`
  background: #f8f5f0;
  border-radius: 20px;
  padding: 32px 36px;
  margin-top: 40px;
  border-left: 6px solid #b78c4a;
`;

const FooterNote = styled.div`
  margin-top: 64px;
  font-size: 0.95rem;
  color: #6f7a89;
  text-align: center;
  border-top: 1px solid #e2dcd2;
  padding-top: 32px;
  font-style: italic;
`;

// ===== MAIN COMPONENT =====
const ConditionsGenerales = () => {
  return (
<>
              <PageMeta title="waw" description="waw" />

              <TopBar />
        <Navbar />
    <PageWrapper>
      <Container>
        {/* Titre principal */}
        <MainTitle>CONDITIONS GÉNÉRALES DE VENTE</MainTitle>
        <SubBrand>WAW – When And Where · WAW Hospitality Service</SubBrand>

        {/* 1. OBJET */}
        <Section>
          <SectionTitle>1. Objet</SectionTitle>
          <Paragraph>
            Les présentes Conditions Générales de Vente (CGV) ont pour objet de définir les modalités et conditions dans lesquelles la société <strong>WAW Hospitality Service</strong>, ci-après dénommée "WAW", exploite la plateforme digitale accessible via le site <strong>www.waw.com.tn</strong> et l’application mobile WAW.
          </Paragraph>
          <Paragraph>
            WAW est une plateforme de mise en relation entre des utilisateurs et des prestataires proposant des activités, expériences, événements, services de loisirs, restauration, hébergement ou toute autre activité référencée sur la plateforme.
          </Paragraph>
        </Section>

        {/* 2. RÔLE DE WAW */}
        <Section>
          <SectionTitle>2. Rôle de WAW</SectionTitle>
          <Paragraph>
            <strong>WAW agit exclusivement en qualité d’intermédiaire technique.</strong>
          </Paragraph>
          <Paragraph>WAW :</Paragraph>
          <List>
            <ListItem>Met à disposition une interface de présentation et de réservation</ListItem>
            <ListItem>Fournit un outil de gestion (back-office) aux prestataires</ListItem>
            <ListItem>Peut encaisser les paiements pour le compte des prestataires selon les modalités prévues</ListItem>
          </List>
          <Paragraph>
            WAW n’est pas l’organisateur des activités proposées.<br />
            Chaque prestataire est seul responsable :
          </Paragraph>
          <DoubleList>
            <DoubleListItem>Du contenu de son offre</DoubleListItem>
            <DoubleListItem>De la conformité légale de son activité</DoubleListItem>
            <DoubleListItem>De l’exécution de la prestation</DoubleListItem>
            <DoubleListItem>De la sécurité des participants</DoubleListItem>
            <DoubleListItem>Des assurances obligatoires</DoubleListItem>
            <DoubleListItem>De la qualité du service fourni</DoubleListItem>
          </DoubleList>
        </Section>

        {/* 3. ACCEPTATION DES CGV */}
        <Section>
          <SectionTitle>3. Acceptation des CGV</SectionTitle>
          <Paragraph>
            Toute réservation effectuée via la plateforme implique l’acceptation pleine et entière des présentes CGV par l’utilisateur.
          </Paragraph>
          <Paragraph>
            L’utilisateur reconnaît également accepter les conditions spécifiques du prestataire sélectionné.
          </Paragraph>
        </Section>

        {/* 4. CONDITIONS SPÉCIFIQUES DES PRESTATAIRES */}
        <Section>
          <SectionTitle>4. Conditions spécifiques des prestataires</SectionTitle>
          <Paragraph>Chaque prestataire définit :</Paragraph>
          <List>
            <ListItem>Ses conditions d’annulation</ListItem>
            <ListItem>Sa politique de remboursement</ListItem>
            <ListItem>Ses règles de participation</ListItem>
            <ListItem>Ses horaires et modalités</ListItem>
          </List>
          <Paragraph>
            WAW s’engage à afficher les informations communiquées par le prestataire mais ne saurait être tenue responsable en cas d’erreur, omission ou modification effectuée par le prestataire.
          </Paragraph>
          <Paragraph>
            En cas de litige concernant l’exécution d’une prestation, l’utilisateur devra s’adresser directement au prestataire concerné.
          </Paragraph>
        </Section>

        {/* 5. MODALITÉS DE PAIEMENT */}
        <Section>
          <SectionTitle>5. Modalités de paiement</SectionTitle>
          <Paragraph>Trois types de paiements peuvent être proposés :</Paragraph>
          <List>
            <ListItem>Paiement en ligne via la plateforme</ListItem>
            <ListItem>Paiement d’un acompte via la plateforme</ListItem>
            <ListItem>Réservation sans paiement (paiement sur place)</ListItem>
          </List>
          <Paragraph>Lorsque WAW encaisse un paiement :</Paragraph>
          <DoubleList>
            <DoubleListItem>WAW agit comme intermédiaire de collecte</DoubleListItem>
            <DoubleListItem>Une commission d’environ 10% peut être prélevée</DoubleListItem>
            <DoubleListItem>Le solde est reversé au prestataire selon les modalités convenues</DoubleListItem>
            <DoubleListItem>
              Les frais bancaires et frais de transaction peuvent être appliqués selon les conditions du prestataire de paiement.
            </DoubleListItem>
          </DoubleList>
        </Section>

        {/* 6. POLITIQUE DE REMBOURSEMENT */}
        <Section>
          <SectionTitle>6. Politique de remboursement</SectionTitle>
          <Paragraph>
            Les remboursements sont régis par les conditions spécifiques de chaque prestataire.
          </Paragraph>
          <Paragraph>WAW :</Paragraph>
          <List>
            <ListItem>N’impose pas une politique unique</ListItem>
            <ListItem>Ne garantit pas un remboursement automatique</ListItem>
            <ListItem>Intervient uniquement en médiation si nécessaire</ListItem>
          </List>
          <Paragraph>
            Tout remboursement validé par le prestataire sera traité dans un délai raisonnable via le moyen de paiement utilisé.
          </Paragraph>
        </Section>

        {/* 7. RESPONSABILITÉ */}
        <Section>
          <SectionTitle>7. Responsabilité</SectionTitle>
          <Paragraph>WAW ne saurait être tenue responsable :</Paragraph>
          <List>
            <ListItem>De l’annulation d’une activité par un prestataire</ListItem>
            <ListItem>D’un accident survenu lors d’une activité</ListItem>
            <ListItem>De dommages corporels ou matériels</ListItem>
            <ListItem>De litiges entre utilisateur et prestataire</ListItem>
            <ListItem>De la non-conformité d’une prestation</ListItem>
          </List>
          <Paragraph>
            La responsabilité de WAW est strictement limitée à son rôle d’intermédiaire technique.
          </Paragraph>
        </Section>

        {/* 8. OBLIGATIONS DES UTILISATEURS */}
        <Section>
          <SectionTitle>8. Obligations des utilisateurs</SectionTitle>
          <Paragraph>L’utilisateur s’engage à :</Paragraph>
          <List>
            <ListItem>Fournir des informations exactes</ListItem>
            <ListItem>Respecter les règles du prestataire</ListItem>
            <ListItem>Se présenter à l’heure</ListItem>
            <ListItem>Adopter un comportement respectueux</ListItem>
          </List>
          <Paragraph>
            Tout comportement abusif pourra entraîner la suspension du compte.
          </Paragraph>
        </Section>

        {/* 9. DONNÉES PERSONNELLES */}
        <Section>
          <SectionTitle>9. Données personnelles</SectionTitle>
          <Paragraph>
            Les données personnelles sont collectées dans le respect de la législation tunisienne en vigueur.
          </Paragraph>
          <Paragraph>WAW s’engage à :</Paragraph>
          <List>
            <ListItem>Ne pas vendre les données des utilisateurs</ListItem>
            <ListItem>Utiliser les données uniquement pour le fonctionnement de la plateforme</ListItem>
            <ListItem>Permettre à l’utilisateur d’exercer ses droits d’accès et de rectification</ListItem>
          </List>
        </Section>

        {/* 10. FORCE MAJEURE */}
        <Section>
          <SectionTitle>10. Force majeure</SectionTitle>
          <Paragraph>
            WAW ne pourra être tenue responsable en cas d’événement imprévisible ou indépendant de sa volonté empêchant le bon fonctionnement de la plateforme ou l’exécution d’une activité.
          </Paragraph>
        </Section>

        {/* 11. MODIFICATION DES CGV */}
        <Section>
          <SectionTitle>11. Modification des CGV</SectionTitle>
          <Paragraph>
            WAW se réserve le droit de modifier les présentes CGV à tout moment.
          </Paragraph>
          <Paragraph>
            La version applicable est celle en vigueur à la date de la réservation.
          </Paragraph>
        </Section>

        {/* 12. DROIT APPLICABLE */}
        <Section>
          <SectionTitle>12. Droit applicable</SectionTitle>
          <Paragraph>
            Les présentes CGV sont soumises au droit tunisien.
          </Paragraph>
          <Paragraph>
            Tout litige sera soumis aux tribunaux compétents de Tunis.
          </Paragraph>
        </Section>

        {/* ===== MENTIONS LÉGALES ===== */}
        <Section>
          <SectionTitle style={{ marginTop: '64px' }}>MENTIONS LÉGALES</SectionTitle>
          
          <CardLegal>
            <ArticleTitle>Éditeur</ArticleTitle>
            <Paragraph>
              <strong>WAW Hospitality Service</strong><br />
              Société : SARL<br />
              Capital social : 5000 dinars<br />
              Siège social : 35, Rue Hedi Karray, Chez karma & Cie, 3eme étage, 1082 Centre Urbain Nord<br />
              Matricule fiscal : 1932257R<br />
              Email : <a href="mailto:contact@waw.com.tn" style={{ color: '#b78c4a', textDecoration: 'none', fontWeight: 600 }}>contact@waw.com.tn</a><br />
              Téléphone : +216 26 50 40 50
            </Paragraph>

            <ArticleTitle style={{ marginTop: '36px' }}>Hébergement</ArticleTitle>
            <Paragraph>
              Le site est hébergé par : OXAHOST
            </Paragraph>

            <ArticleTitle style={{ marginTop: '36px' }}>Propriété intellectuelle</ArticleTitle>
            <Paragraph>
              Le nom When And Where WAW, le logo, le design, la structure et le contenu de la plateforme sont protégés par les lois relatives à la propriété intellectuelle.<br />
              Toute reproduction ou utilisation sans autorisation est interdite.
            </Paragraph>
          </CardLegal>
        </Section>

        <FooterNote>
          © 2026 WAW - When and Where. Tous droits réservés.
        </FooterNote>
      </Container>
    </PageWrapper>

                <Footer /></>

  );
};

export default ConditionsGenerales;