import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

function TopBar() {
  return (
    <Box
      sx={{
        backgroundColor: '#003566',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 1, sm: 2 }, // smaller padding on mobile
        py: { xs: 0.5, sm: 1 },
        fontSize: '0.875rem',
        flexDirection: { xs: 'column', sm: 'row' }, // stack items vertically on mobile
        textAlign: { xs: 'center', sm: 'left' }, // center text on mobile
      }}
    >
      <Typography
        sx={{
          mb: { xs: 0.5, sm: 0 }, // add bottom margin only on mobile
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
        }}
      >
        Bienvenue sur la plate-forme de WHEN AND WHERE
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', sm: 'flex-end' },
        }}
      >
        <IconButton
          size="small"
          color="inherit"
          component="a"
          href="https://facebook.com"
          target="_blank"
          rel="noopener"
        >
          <FacebookIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="inherit"
          component="a"
          href="https://twitter.com"
          target="_blank"
          rel="noopener"
        >
          <TwitterIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="inherit"
          component="a"
          href="https://instagram.com"
          target="_blank"
          rel="noopener"
        >
          <InstagramIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="inherit"
          component="a"
          href="https://linkedin.com"
          target="_blank"
          rel="noopener"
        >
          <LinkedInIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default TopBar;
