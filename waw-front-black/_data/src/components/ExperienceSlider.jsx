import React from "react";
import Slider from "react-slick";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Stack,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const ExperienceSlider = ({ experiences }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Box sx={{ my: 4 }}>
      <Slider {...settings}>
        {experiences.map((exp, idx) => (
          <Box key={idx} px={1}>
<Card sx={{ maxWidth: 345, position: "relative" }}>
      {exp.featured && (
        <Chip
          label="En vedette"
          color="secondary"
          sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}
        />
      )}
      <Box sx={{ position: "relative" }}>
        <CardMedia component="img" height="200" image={image} alt={title} />
        <Button
          href={bookingLink}
          target="_blank"
          variant="contained"
          sx={{ position: "absolute", bottom: 16, left: 16 }}
        >
          Réserver maintenant
        </Button>
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          data-id={wishlistId}
          data-type="tour"
        >
          <FavoriteIcon color="error" />
        </IconButton>
      </Box>
      <CardContent>
        <Chip label={category} size="small" sx={{ mb: 1, backgroundColor: "#005494", color: "white" }} />
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="body2">{duration}</Typography>
          <Typography variant="body2">- {location}</Typography>
          {confirmationInstant && <FlashOnIcon fontSize="small" color="warning" titleAccess="Confirmation instantanée" />}
        </Stack>
        <Typography variant="body1">
          <strong>de {price}</strong>
        </Typography>
      </CardContent>
    </Card>          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default ExperienceSlider;

// Example usage:
// <ExperienceSlider experiences={[{ featured: true, image: '...', title: '...', ... }]} />
