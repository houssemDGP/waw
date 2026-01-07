import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  IconButton,
  useTheme,
} from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

function Footer() {
  const theme = useTheme();

  return (
<Box
  component="footer"
  sx={{
    py: 0,
    backgroundImage: 'url(images/bg_3.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    color: 'rgba(255,255,255,0.7)',
    zIndex: 1, // contenu au-dessus du pseudo-element mais toujours < modal
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#003566',
      zIndex: 0, // pseudo-element derrière le contenu footer
    },
  }}
>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          position: 'relative',
          width: '100%',
        }}
      >
        {/* Column 1 */}
<Box
  sx={{
    width: { xs: '100%', sm: '50%', md: '25%' },
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // centers horizontally
    textAlign: 'center', // centers text
  }}
>
  <img
    src="logo/wawwhite.png"
    alt="Avatar"
    style={{
      width: 200,
    }}
  />

  <List disablePadding sx={{ mt: 1 }}>
    {["Politique de Confidentialité"].map((item) => (
      <ListItem disablePadding key={item} sx={{ py: 0.5, justifyContent: 'center' }}>
        <Link
          href="/politique-de-confidentialite"
          color="inherit"
          underline="none"
          sx={{ '&:hover': { color: '#00212d' } }}
        >
          <ListItemText
            primary={item}
            primaryTypographyProps={{
              variant: 'body2',
              sx: { fontWeight: 'bold', textAlign: 'center' },
            }}
          />
        </Link>
      </ListItem>
    ))}
          <ListItem disablePadding sx={{ py: 0.5, justifyContent: 'center' }}>
        <Link
          href="/contact"
          color="inherit"
          underline="none"
          sx={{ '&:hover': { color: '#00212d' } }}
        >
          <ListItemText
            primary="contact"
            primaryTypographyProps={{
              variant: 'body2',
              sx: { fontWeight: 'bold', textAlign: 'center' },
            }}
          />
        </Link>
      </ListItem>
  </List>
</Box>


        {/*          <List disablePadding>
            {[
              'Demande en ligne',
              'Demandes générales',
              'Conditions de réservation',
              'Politique de confidentialité',
              'Politique de remboursement',
              'Appelez-nous',
            ].map((item) => (
              <ListItem disablePadding key={item} sx={{ py: 0.5 }}>
                <Link href="#" color="inherit" underline="none" sx={{ '&:hover': { color: '#00212d' } }}>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 'bold' } }}
                  />
                </Link>
              </ListItem>
            ))}
          </List>*/}
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 2 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
            Liens Rapides
          </Typography>
          <List disablePadding>
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <Link href="/decouvrir" color="inherit" underline="none" sx={{ '&:hover': { color: '#00212d' } }}>
                  <ListItemText
                    primary="Decouvrir"
                    primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 'bold' } }}
                  />
                </Link>
              </ListItem>

                                          <ListItem disablePadding sx={{ py: 0.5 }}>
                                <Link href="/wishlist" color="inherit" underline="none" sx={{ '&:hover': { color: '#00212d' } }}>
                  <ListItemText
                    primary="Wishlist"
                    primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 'bold' } }}
                  />
                </Link>
              </ListItem>
                                                        <ListItem disablePadding sx={{ py: 0.5 }}>
                                <Link href="/moncompte" color="inherit" underline="none" sx={{ '&:hover': { color: '#00212d' } }}>
                  <ListItemText
                    primary="Profile"
                    primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 'bold' } }}
                  />
                </Link>
              </ListItem>
          </List>
        </Box>
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 2 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
            Liens utiles
          </Typography>
          <List disablePadding>
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <Link href="/assistancePage" color="inherit" underline="none" sx={{ '&:hover': { color: '#00212d' } }}>
                  <ListItemText
                    primary="Assistance 24 h/24, 7 j/7"
                    primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 'bold' } }}
                  />
                </Link>
              </ListItem>

               <ListItem disablePadding sx={{ py: 0.5 }}>
                <Link href="/rewardsPage" color="inherit" underline="none" sx={{ '&:hover': { color: '#00212d' } }}>
                  <ListItemText
                    primary="Gagnez des récompenses"
                    primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 'bold' } }}
                  />
                </Link>
              </ListItem>
              <ListItem disablePadding sx={{ py: 0.5 }}>
                                <Link href="/reviewsPage" color="inherit" underline="none" sx={{ '&:hover': { color: '#00212d' } }}>
                  <ListItemText
                    primary="Des millions d'avis"
                    primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 'bold' } }}
                  />
                </Link>
              </ListItem>
                            <ListItem disablePadding sx={{ py: 0.5 }}>
                                <Link href="/planningPage" color="inherit" underline="none" sx={{ '&:hover': { color: '#00212d' } }}>
                  <ListItemText
                    primary="Planifiez selon vos envies"
                    primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 'bold' } }}
                  />
                </Link>
              </ListItem>
          </List>
        </Box>
                <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 2 }}>

    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
      <IconButton sx={{ color: 'white', '&:hover': { color: '#00212d' } }}><TwitterIcon /></IconButton>
      <IconButton sx={{ color: 'white', '&:hover': { color: '#00212d' } }}><FacebookIcon /></IconButton>
      <IconButton sx={{ color: 'white', '&:hover': { color: '#00212d' } }}><InstagramIcon /></IconButton>
    </Box>
        </Box>
      </Box>

      {/* Footer Bottom */}
<Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    pt: 2,
    pb: 1,
        px: 2,  
    borderTop: '1px solid rgba(255,255,255,0.1)',
    position: 'relative',
  }}
>
<Typography 
  variant="body2" 
  color="text.secondary" 
  sx={{ 
    color: "white", 
    fontWeight: 'bold',
    fontSize: {
      xs: '0.75rem', // mobile
      sm: '0.875rem', // tablette
      md: '0.875rem'  // desktop
    }
  }}
>
  Copyright 2025. WHEN AND WHERE – Powered by <a href="https://digitalgrouperformance.com.tn/">Digital Group Performance</a>
</Typography>

<Typography 
  variant="body2" 
  color="text.secondary" 
  sx={{ 
    fontWeight: 'bold',
    fontSize: {
      xs: '0.75rem', // mobile
      sm: '0.875rem', // tablette
      md: '0.875rem'  // desktop
    }
  }}
>
  Tous droits réservés
</Typography>
</Box>
    </Box>
  );
}

export default Footer;
