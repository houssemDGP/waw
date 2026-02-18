import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Slider from 'react-slick';
import StarIcon from '@mui/icons-material/Star';

function Testimonials() {
  const testimonialsData = [
    {
      stars: 5,
      quote: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.',
      image: 'images/person_1.jpg',
      name: 'Roger Scott',
      position: 'Marketing Manager',
    },
    {
      stars: 5,
      quote: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.',
      image: 'images/person_2.jpg',
      name: 'Roger Scott',
      position: 'Marketing Manager',
    },
    {
      stars: 5,
      quote: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.',
      image: 'images/person_3.jpg',
      name: 'Roger Scott',
      position: 'Marketing Manager',
    },
    {
      stars: 5,
      quote: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.',
      image: 'images/person_1.jpg',
      name: 'Roger Scott',
      position: 'Marketing Manager',
    },
    {
      stars: 5,
      quote: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.',
      image: 'images/person_2.jpg',
      name: 'Roger Scott',
      position: 'Marketing Manager',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 900, // md
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600, // sm
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <Box
      sx={{
        py: 8,
        backgroundImage: 'url(images/bg_1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': { // Overlay
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1,
        },
      }}
    >
      <Container sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="subtitle1" component="span" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Testimonial
          </Typography>
          <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
            Tourist Feedback
          </Typography>
        </Box>
        <Box sx={{
          '.slick-slide': { px: 1 }, // Add padding between slides
          '.slick-dots li button:before': { // Style dots
            color: 'white',
            fontSize: '10px',
          },
          '.slick-dots li.slick-active button:before': {
            color: 'primary.main',
          },
        }}>
          <Slider {...settings}>
            {testimonialsData.map((testimonial, index) => (
              <Box key={index} sx={{ p: 1 }}>
                <Box
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 1,
                    p: 4,
                    boxShadow: 3,
                    textAlign: 'left',
                  }}
                >
                  <Box sx={{ display: 'flex', mb: 2, color: '#f8d227' }}> {/* Star color */}
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <StarIcon key={i} fontSize="small" sx={{ mr: 0.5 }} />
                    ))}
                  </Box>
                  <Typography variant="body1" paragraph>
                    {testimonial.quote}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundImage: `url(${testimonial.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        mr: 2,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.position}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
    </Box>
  );
}

export default Testimonials;