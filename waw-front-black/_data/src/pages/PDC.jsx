import React from "react";
import styled from "styled-components";
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

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
  max-width: 900px;
  width: 100%;
  text-align: left;
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(24, 26, 214, 0.15);

  h1 {
    font-size: 2.75rem;
    color: black;
    margin-bottom: 1.5rem;
    font-weight: 700;
    text-align: center;
  }

  h2 {
    margin-top: 2rem;
    color: black;
  }

  p {
    font-size: 1.1rem;
    color: #444;
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  ul {
    margin-left: 1.5rem;
    margin-bottom: 1rem;

    li {
      margin-bottom: 0.5rem;
    }
  }
  @media (max-width: 639px) {
  h1 {
    font-size: 1.875rem; 
  }
}
`;

export default function PrivacyPolicyPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <PageContainer>
        <Content>
          <h1>Politique de Confidentialité</h1>

          <h2>Collecte des informations</h2>
          <p>Nous collectons les informations que vous nous fournissez directement lors de votre utilisation de la plateforme WAW, telles que votre nom, adresse e-mail, numéro de téléphone et informations de paiement.</p>

          <h2>Utilisation des informations</h2>
          <p>Les informations collectées sont utilisées pour :</p>
          <ul>
            <li>Gérer vos réservations et commandes.</li>
            <li>Communiquer avec vous concernant votre compte ou vos réservations.</li>
            <li>Améliorer nos services et personnaliser votre expérience.</li>
            <li>Respecter nos obligations légales et réglementaires.</li>
          </ul>

          <h2>Partage des informations</h2>
          <p>WAW ne vend pas vos données personnelles. Elles peuvent être partagées uniquement avec :</p>
          <ul>
            <li>Les Vendeurs d’Expériences pour exécuter la réservation.</li>
            <li>Nos prestataires de services techniques (paiement, hébergement, analytics).</li>
            <li>Les autorités légales si la loi l’exige.</li>
          </ul>

          <h2>Sécurité des données</h2>
          <p>Nous mettons en place des mesures techniques et organisationnelles pour protéger vos données personnelles contre tout accès non autorisé, altération, divulgation ou destruction.</p>

          <h2>Vos droits</h2>
          <ul>
            <li>Droit d’accès à vos données personnelles.</li>
            <li>Droit de rectification des informations inexactes.</li>
            <li>Droit de suppression ou d’opposition au traitement de vos données.</li>
            <li>Droit de retirer votre consentement à tout moment.</li>
          </ul>

          <h2>Cookies</h2>
          <p>La plateforme utilise des cookies pour améliorer votre expérience utilisateur, analyser le trafic et vous proposer des contenus adaptés.</p>

          <h2>Modifications de la politique</h2>
          <p>WAW se réserve le droit de modifier cette Politique de Confidentialité à tout moment. Les changements seront publiés sur cette page avec la date de mise à jour.</p>


          <h2>Responsabilité des utilisateurs et vendeurs</h2>
          <p>Les utilisateurs et vendeurs d’expériences sont seuls responsables des contenus qu’ils publient sur la plateforme WAW, notamment les photos, vidéos, stories, descriptions, avis ou messages.</p>
          <p>En publiant du contenu sur WAW, vous déclarez :</p>
          <ul>
            <li>Être l’auteur ou détenir les droits nécessaires sur ce contenu ;</li>
            <li>Ne pas violer les droits d’autrui (droit à l’image, propriété intellectuelle, vie privée) ;</li>
            <li>Ne pas diffuser de contenu offensant, discriminatoire, diffamatoire ou contraire à la loi tunisienne.</li>
          </ul>
          <p>WAW ne saurait être tenue responsable du contenu diffusé par ses utilisateurs ou partenaires, ni des conséquences liées à leur publication, partage ou republication sur la plateforme.</p>

          <h2>Autorisation d’utilisation du contenu</h2>
          <p>En publiant un contenu sur WAW (story, photo, vidéo, description d’activité, etc.), vous accordez à WAW Hospitality Service une licence non exclusive, mondiale, gratuite et transférable pour :</p>
          <ul>
            <li>Héberger, afficher, reproduire et diffuser ce contenu sur la plateforme et ses canaux officiels (site, application, réseaux sociaux WAW) ;</li>
            <li>L’utiliser à des fins de promotion, communication ou valorisation de la plateforme, uniquement dans le respect de votre droit à l’image et de votre vie privée.</li>
          </ul>

          <h2>Suppression ou signalement</h2>
          <p>WAW se réserve le droit de supprimer, masquer ou suspendre tout contenu jugé contraire à ses conditions d’utilisation ou à la loi tunisienne, sans préavis ni indemnité.</p>
          <h2>Contact</h2>
          <p>Pour toute question relative à la protection de vos données personnelles, contactez-nous à : <strong>contact@waw.com</strong></p>

          <p><em>Date de dernière mise à jour : 23 octobre 2025</em></p>
        </Content>
      </PageContainer>
        <Footer />
    </>
  );
}
