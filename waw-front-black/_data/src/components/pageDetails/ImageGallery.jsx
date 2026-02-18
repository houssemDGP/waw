import React, { useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const ImageGallery = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Box>
      {/* Image principale */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box
          component="img"
          src={images[selectedIndex]}
          alt="image principale"
          sx={{ width: "100%", height: 400, objectFit: "cover" }}
        />
      </Paper>

      {/* Miniatures */}
      <Swiper
        spaceBetween={10}
        slidesPerView={4}
        style={{ marginTop: 10 }}
        breakpoints={{
          640: { slidesPerView: 5 },
          960: { slidesPerView: 6 },
        }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <Box
              component="img"
              src={img}
              alt={`thumb-${index}`}
              onClick={() => setSelectedIndex(index)}
              sx={{
                width: "100%",
                height: 80,
                objectFit: "cover",
                cursor: "pointer",
                borderRadius: 1,
                border:
                  selectedIndex === index ? "2px solid #1976d2" : "2px solid transparent",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default ImageGallery;
