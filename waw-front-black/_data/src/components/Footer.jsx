import React from 'react';
import {
  Box,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        background: 'black', // fond uni bleu profond, comme sur l'image
        color: 'rgba(255,255,255,0.8)',
        py: 6,
        px: { xs: 2, md: 6 },
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* CONTENU CENTRAL – aligné avec l'image */}
      <Box
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* ----- MARQUE : WAW / WHEN AND WHERE (exactement comme dans l'image) ----- */}
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2.8rem', md: '3.5rem' },
            letterSpacing: '2px',
            color: 'white',
            lineHeight: 1.1,
            mb: 0.5,
          }}
        >
          WAW
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 400,
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            letterSpacing: '6px',
            color: '#d4b48c', // or doux – rappelle l'authentique
            textTransform: 'uppercase',
            mb: 2,
          }}
        >
          WHEN AND WHERE
        </Typography>

        {/* ----- PHRASE D'ACCROCHE : exacte depuis l'image ----- */}
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '750px',
            mx: 'auto',
            mb: 5,
            fontWeight: 400,
            lineHeight: 1.6,
            borderBottom: '1px solid rgba(212, 180, 140, 0.4)',
            pb: 3,
          }}
        >
          La plateforme tunisienne qui répond à vos questions : quand et où vivre l'extraordinaire
        </Typography>

        {/* ----- LIENS DE NAVIGATION (exactement : À propos, Devenir hôte, Blog, Aide, Conditions, Confidentialité, Contact) ----- */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: { xs: 3, md: 5 },
            mb: 4,
            px: 2,
          }}
        >
          <Link
            key="Politique de Confidentialité"
            href="/politique-de-confidentialite"
            underline="none"
            sx={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '1rem',
              fontWeight: 500,
              transition: 'color 0.2s',
              '&:hover': {
                color: '#d4b48c',
              },
            }}
          >
            Politique de Confidentialité
          </Link>
          <Link
            key="CONDITIONS GÉNÉRALES DE VENTE"
            href="/conditions-generales"
            underline="none"
            sx={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '1rem',
              fontWeight: 500,
              transition: 'color 0.2s',
              '&:hover': {
                color: '#d4b48c',
              },
            }}
          >
            CONDITIONS GÉNÉRALES DE VENTE
          </Link>


          <Link
            key="contact"
            href="/contact"
            underline="none"
            sx={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '1rem',
              fontWeight: 500,
              transition: 'color 0.2s',
              '&:hover': {
                color: '#d4b48c',
              },
            }}
          >
            Contact
          </Link>
          <Link
            key="Decouvrir"
            href="/decouvrir"
            underline="none"
            sx={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '1rem',
              fontWeight: 500,
              transition: 'color 0.2s',
              '&:hover': {
                color: '#d4b48c',
              },
            }}
          >
            Decouvrir
          </Link>
        </Box>

        {/* ----- ICÔNES RÉSEAUX SOCIAUX (élégant, centré) ----- */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2.5,
            mb: 4,
          }}
        >
          <IconButton
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.08)',
              p: 1.5,
              '&:hover': {
                bgcolor: '#d4b48c',
                color: '#0f1e2f',
              },
            }}
          >
            <TwitterIcon fontSize="medium" />
          </IconButton>
          <IconButton
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.08)',
              p: 1.5,
              '&:hover': {
                bgcolor: '#d4b48c',
                color: '#0f1e2f',
              },
            }}
          >
            <FacebookIcon fontSize="medium" />
          </IconButton>
          <IconButton
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.08)',
              p: 1.5,
              '&:hover': {
                bgcolor: '#d4b48c',
                color: '#0f1e2f',
              },
            }}
          >
            <InstagramIcon fontSize="medium" />
          </IconButton>
        </Box>

        {/* ----- COPYRIGHT / TUNISIE – exact : © 2026 WAW - When and Where. Tous droits réservés. ----- */}
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.95rem',
            borderTop: '1px solid rgba(212, 180, 140, 0.3)',
            pt: 3,
            mt: 2,
            width: '100%',
            maxWidth: '800px',
            mx: 'auto',
            letterSpacing: '0.5px',
          }}
        >
          © 2026 WAW - When and Where. Powered by <a href="https://digitalgrouperformance.com.tn/">Digital Group Performance</a> Tous droits réservés.
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;