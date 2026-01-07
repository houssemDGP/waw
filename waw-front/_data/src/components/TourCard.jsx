import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  SvgIcon // Or specific icons like Bed, Bathtub, DirectionsCar
} from '@mui/material';

// Assuming you have icons, e.g., from @mui/icons-material
import KingBedIcon from '@mui/icons-material/KingBed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; // Or something representing "Near Mountain/Beach"

const Tour = ({ image, price, days, title, location, nearWhat }) => {
  return (
    <Card sx={{ maxWidth: 345, position: 'relative', m: 2 }}>
      {/* Price Chip */}
      <Chip
        label={`${price}/person`}
        color="error" // Or a custom color for the red background
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 1, // Ensure it's above the image
          fontWeight: 'bold',
          px: 1,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: '#FF5733', // Example red color
          color: 'white',
        }}
      />

      {/* Image */}
      <CardMedia
        component="img"
        height="190" // Adjust height as needed
        image={image}
        alt={title}
      />

      <CardContent>
        {/* Days Tour */}
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          {days} DAYS TOUR
        </Typography>

        {/* Title */}
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>

        {/* Location */}
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SvgIcon sx={{ mr: 0.5, fontSize: '1rem' }}>
            {/* Example: A simple pin icon, replace with a proper Material-UI icon if desired */}
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </SvgIcon>
          {location}
        </Typography>

        {/* Amenities/Features */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <KingBedIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
            <Typography variant="body2" color="text.secondary">
              2
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BathtubIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
            <Typography variant="body2" color="text.secondary">
              3
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* You'd choose an appropriate icon here based on 'nearWhat' */}
            {nearWhat === 'Near Mountain' && <DirectionsCarIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />} {/* Or a mountain icon */}
            {nearWhat === 'Near Beach' && <DirectionsCarIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />} {/* Or a beach icon */}
            <Typography variant="body2" color="text.secondary">
              {nearWhat}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Example Usage in your main component
const TourCard = () => {
  const tours = [
    {
      image: 'path/to/image1.jpg',
      price: '$55000',
      days: '8',
      title: 'Banaue Rice Terraces',
      location: 'Banaue, Ifugao, Philippines',
      nearWhat: 'Near Mountain',
    },
    {
      image: 'path/to/image2.jpg',
      price: '$550',
      days: '10',
      title: 'Banaue Rice Terraces', // Note: Title is the same in your example for different images
      location: 'Banaue, Ifugao, Philippines',
      nearWhat: 'Near Beach',
    },
    {
      image: 'path/to/image3.jpg',
      price: '$550',
      days: '7',
      title: 'Banaue Rice Terraces', // Note: Title is the same in your example for different images
      location: 'Banaue, Ifugao, Philippines',
      nearWhat: 'Near Beach', // Or whatever applies to the third image
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', p: 3 }}>
      {tours.map((tour, index) => (
        <Tour key={index} {...tour} />
      ))}
    </Box>
  );
};

export default TourCard;