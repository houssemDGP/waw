import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const sections = [
  {
    title: "Vue d'ensemble",
    content:
      "Partez pour une journée inoubliable à bord d’un bateau pirate sur les eaux turquoise de Djerba. Idéal pour toute la famille !"
  },
  {
    title: "Ce qui est inclus",
    content:
      "Transport aller-retour, déjeuner, boissons, animation, équipements de snorkeling."
  },
  {
    title: "À quoi s’attendre",
    content:
      "Navigation matinale, arrêt baignade, spectacle pirate, repas local, musique et danse."
  },
  {
    title: "Informations supplémentaires",
    content:
      "Non accessible en fauteuil roulant. Enfants accompagnés. Apportez crème solaire, serviette, lunettes."
  },
  {
    title: "Politique d'annulation",
    content:
      "Annulation gratuite jusqu’à 24h à l’avance. Aucun remboursement au-delà."
  }
];

const AccordionSections = () => {
  return (
    <Box mt={4}>
      {sections.map((section, index) => (
        <Accordion key={index} defaultExpanded={index === 0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">{section.content}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default AccordionSections;
