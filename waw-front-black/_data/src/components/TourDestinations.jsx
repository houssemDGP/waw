import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BathtubIcon from '@mui/icons-material/Bathtub';
import KingBedIcon from '@mui/icons-material/KingBed';
import LandscapeIcon from '@mui/icons-material/Landscape';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Slider from 'react-slick';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const totalStars = 5;

  for (let i = 0; i < totalStars; i++) {
    if (i < fullStars) {
      stars.push(<StarIcon key={i} fontSize="small" sx={{ color: '#FFC107' }} />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<StarHalfIcon key={i} fontSize="small" sx={{ color: '#FFC107' }} />);
    } else {
      stars.push(<StarBorderIcon key={i} fontSize="small" sx={{ color: '#FFC107' }} />);
    }
  }
  return stars;
};
// Flèche précédente personnalisée
const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '40%',
        left: '-20px',
        zIndex: 1,
        backgroundColor: 'white',
        boxShadow: 1,
        '&:hover': {
          backgroundColor: '#fce205',
        },
      }}
    >
      <ArrowBackIosNewIcon fontSize="small" />
    </IconButton>
  );
};

// Flèche suivante personnalisée
const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '40%',
        right: '-20px',
        zIndex: 1,
        backgroundColor: 'white',
        boxShadow: 1,
        '&:hover': {
          backgroundColor: '#fce205',
        },
      }}
    >
      <ArrowForwardIosIcon fontSize="small" />
    </IconButton>
  );
};

function TourDestinations() {
  const destinations = [
    {
      image: 'imgs/caption.jpg',
      price: '350',
      days: '8 Days Tour',
      title: 'Visite d une journée à Ksar Ghuilaine',
      location: 'Djerba',
  rating: 4.5,
  ratingCount: 23,
      amenities: [
        { icon: <BathtubIcon fontSize="small" />, text: '2' },
        { icon: <KingBedIcon fontSize="small" />, text: '3' },
        { icon: <LandscapeIcon fontSize="small" />, text: 'Near Mountain' },
      ],
      authorName: 'John Doe',
      authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      image: 'imgs/caption1.jpg',
      price: '350',
      days: '10 Days Tour',
      title: 'Balade d une journée complète en bateau pirate.',
      location: 'Hammamet',
  rating: 4.5,
  ratingCount: 23,
      amenities: [
        { icon: <BathtubIcon fontSize="small" />, text: '2' },
        { icon: <KingBedIcon fontSize="small" />, text: '3' },
        { icon: <BeachAccessIcon fontSize="small" />, text: 'Near Beach' },
      ],
      authorName: 'Jane Smith',
      authorImage: 'https://randomuser.me/api/portraits/women/45.jpg',
    },
    {
      image: 'imgs/caption2.jpg',
      price: '350',
      days: '7 Days Tour',
      title: 'plongée sous marine ',
      location: 'Sousse',
  rating: 4.5,
  ratingCount: 23,
      amenities: [
        { icon: <BathtubIcon fontSize="small" />, text: '2' },
        { icon: <KingBedIcon fontSize="small" />, text: '3' },
        { icon: <BeachAccessIcon fontSize="small" />, text: 'Near Beach' },
      ],
      authorName: 'Michael Lee',
      authorImage: 'https://randomuser.me/api/portraits/men/65.jpg',
    },
    {
      image: 'imgs/lovina.jpg',
      price: '350',
      days: '8 Days Tour',
      title: 'Lovina',
      location: 'Bizerte',
      amenities: [
        { icon: <BathtubIcon fontSize="small" />, text: '2' },
        { icon: <KingBedIcon fontSize="small" />, text: '3' },
        { icon: <BeachAccessIcon fontSize="small" />, text: 'Near Beach' },
      ],
      authorName: 'Anna Lopez',
      authorImage: 'https://randomuser.me/api/portraits/women/21.jpg',
    }
  ];
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Box sx={{ px: 2, py: 4, position: 'relative' }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        On vous recommande ces aventures
      </Typography>
      <Slider {...settings}>
        {destinations.map((destination, index) => (
          <Box key={index} sx={{ px: 1 }}>
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                },
              }}
            >
              <Box
                component="a"
                href="#"
                sx={{
                  display: 'block',
                  position: 'relative',
                  height: 200,
                  backgroundImage: `url(${destination.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  textDecoration: 'none',
                  color: 'white',
                  '& .price': {
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    backgroundColor: '#fce205',
                    color: '#d62828',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                  },
                }}
              >
                <span className="price">Offre Spéciale</span>
              </Box>

              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
<LocationOnIcon
  fontSize="small"
  sx={{
    mr: 0.5,
    color: '#d62828',        // icon color for contrast
  }}
/>
                  {destination.location}
                </Typography>
<Box sx={{ display: 'flex', p: 0, textAlign: 'left' }}>
  <StarIcon fontSize="small" sx={{ color: '#fce205', mr: 0.5 }} />
  <Typography variant="body2" sx={{ mr: 0.5 }}>
    {destination.rating?.toFixed(1) ?? '0.0'}
  </Typography>
  <Typography variant="body2" color="text.secondary">
    ({destination.ratingCount ?? 0})
  </Typography>
</Box>
                <Typography variant="body2" component="h3" sx={{p:1,mb: 1, fontWeight: 'bold' ,     fontSize: '14px'}}>
                  {destination.title}
                </Typography>
                <Typography variant="body2" component="h5" sx={{ mb: 1  ,  fontSize: '12px'}}>
                A partir de 
<Typography component="span" sx={{ fontSize:"20px",color: '#d62828', mx: 1 ,fontWeight: 'bold'  }}>
  {destination.price}
</Typography> TND                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Box
                    component="img"
                    src={destination.authorImage}
                    alt={destination.authorName}
                    sx={{ width: 32, height: 32, borderRadius: '50%', mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Publié par {destination.authorName}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}

export default TourDestinations;
