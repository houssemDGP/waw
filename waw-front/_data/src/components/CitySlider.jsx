import React from 'react';
import Slider from 'react-slick';
import { Box, Typography } from '@mui/material';

const cities = [
  { id: 1, name: 'Tokyo', image: 'https://source.unsplash.com/400x300/?tokyo' },
  { id: 2, name: 'Kyoto', image: 'https://source.unsplash.com/400x300/?kyoto' },
  { id: 3, name: 'Osaka', image: 'https://source.unsplash.com/400x300/?osaka' },
  { id: 4, name: 'Sapporo', image: 'https://source.unsplash.com/400x300/?sapporo' },
  { id: 5, name: 'Nagoya', image: 'https://source.unsplash.com/400x300/?nagoya' },
  { id: 6, name: 'Yokohama', image: 'https://source.unsplash.com/400x300/?yokohama' },
];

const settings = {
  infinite: false,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 2,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 600, settings: { slidesToShow: 2 } },
  ],
};

export default function CitySlider() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Japan's must-visit cities
      </Typography>

      <Slider {...settings}>
        {cities.map((city, index) => (
          <Box
            key={city.id}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              mx: 1,
              position: 'relative',
              height: 250,
              backgroundImage: `url(${city.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'white',
              display: 'flex',
              alignItems: 'flex-end',
              p: 2,
              fontWeight: 'bold',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                bgcolor: index < 3 ? 'primary.main' : 'grey.700',
                color: 'white',
                borderRadius: 1,
                px: 1,
                fontSize: '0.8rem',
              }}
            >
              {index + 1}
            </Box>
            <Typography variant="subtitle1" sx={{ zIndex: 1 }}>
              {city.name}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
