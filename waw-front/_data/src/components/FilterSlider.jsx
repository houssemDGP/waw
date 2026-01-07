import React from 'react';
import Slider from 'react-slick';
import { Box, Button } from '@mui/material';

const filters = [
  { icon: '🎫', label: 'Metro passes & cards' },
  { icon: '🎢', label: 'Theme parks' },
  { icon: '🚗', label: 'Car rentals' },
  { icon: '🏨', label: 'Hotels' },
  { icon: '🎟️', label: 'Attraction tickets' },
  { icon: '🚩', label: 'Tours' },
  { icon: '🪄', label: 'Cultural experiences' },
  { icon: '✈️', label: 'Flights' },
  { icon: '📶', label: 'WiFi & SIM cards' },
];

const settings = {
  infinite: false,
  speed: 300,
  slidesToShow: 5,
  slidesToScroll: 2,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 4 } },
    { breakpoint: 600, settings: { slidesToShow: 3 } },
  ],
};

export default function FilterSlider() {
  return (
    <Box sx={{ my: 2 }}>
      <Slider {...settings}>
        {filters.map((item, index) => (
          <Button
            key={index}
            variant="outlined"
            sx={{ m: 1, minWidth: 150, textTransform: 'none', borderRadius: 2 }}
          >
            <span style={{ marginRight: 8 }}>{item.icon}</span>
            {item.label}
          </Button>
        ))}
      </Slider>
    </Box>
  );
}
