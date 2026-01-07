import React, { useState } from "react";
import { Box, Typography, Card, CardActionArea } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const destinations = [
  {
    name: "Tunis",
    img: "/imgs/img12.png",
    regions: [
      { name: "Région 1", img: "/imgs/img12.png" },
      { name: "Région 2", img: "/imgs/img12.png" },
      { name: "Région 3", img: "/imgs/img12.png" },
      { name: "Région 4", img: "/imgs/img12.png" },
      { name: "Région 5", img: "/imgs/img12.png" },
      { name: "Région 6", img: "/imgs/img12.png" },
      { name: "Région 7", img: "/imgs/img12.png" }
    ]
  },
  {
    name: "Djerba",
    img: "/imgs/djerba.png",
    regions: [
      { name: "Région A", img: "/imgs/djerba.png" },
      { name: "Région B", img: "/imgs/djerba.png" },
      { name: "Région C", img: "/imgs/djerba.png" }
    ]
  },
  {
    name: "Sousse",
    img: "/imgs/sousse.png",
    regions: [
      { name: "Région A", img: "/imgs/sousse.png" },
      { name: "Région B", img: "/imgs/sousse.png" },
      { name: "Région C", img: "/imgs/sousse.png" }
    ]
  }
];

export default function DestinationSlider() {
  const [selected, setSelected] = useState(destinations[0]);

  return (
    <Box p={{ xs: 1, sm: 2 }} sx={{ backgroundColor: "#f5f5f5" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Destinations favorites
      </Typography>

      {/* Destination Swiper */}
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={10}
        breakpoints={{
          0: { slidesPerView: 1.5 },
          600: { slidesPerView: 2.5 },
          900: { slidesPerView: 3.5 },
          1200: { slidesPerView: 4 }
        }}
      >
        {destinations.map((dest, index) => (
          <SwiperSlide key={index}>
            <Card
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow:
                  selected.name === dest.name ? "0 0 0 3px #f76b1c inset" : "none"
              }}
            >
              <CardActionArea onClick={() => setSelected(dest)}>
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: 140, sm: 160 },
                    backgroundImage: `url(${dest.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer",
                    "&:hover .hover-overlay": {
                      opacity: 1
                    }
                  }}
                >
                  <Box
                    className="hover-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      zIndex: 1
                    }}
                  />
                </Box>

                {/* Nom sous l'image */}
                <Typography
                  variant="subtitle1"
                  align="center"
                  sx={{
                    mt: 1,
                    mb: 1,
                    fontWeight: "bold",
                    color: selected.name === dest.name ? "#f76b1c" : "inherit"
                  }}
                >
                  {dest.name}
                </Typography>
              </CardActionArea>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {selected && (
        <>
          <Typography variant="h6" mt={4} mb={2} align="center">
            Régions de {selected.name}
          </Typography>

          {/* Region Swiper */}
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={10}
            breakpoints={{
              0: { slidesPerView: 2 },
              600: { slidesPerView: 3 },
              900: { slidesPerView: 4 },
              1200: { slidesPerView: 6 }
            }}
          >
            {selected.regions.map((region, idx) => (
              <SwiperSlide key={idx}>
                <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <Box
                    sx={{
                      position: "relative",
                      height: { xs: 80, sm: 100 },
                      backgroundImage: `url(${region.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      cursor: "pointer",
                      "&:hover .hover-overlay": {
                        opacity: 1
                      }
                    }}
                  >
                    <Box
                      className="hover-overlay"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0, 0, 0, 0.4)",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        zIndex: 1
                      }}
                    />
                  </Box>

                  {/* Nom sous l'image */}
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{
                      mt: 0.5,
                      mb: 1,
                      fontWeight: "bold",
                      color: "inherit"
                    }}
                  >
                    {region.name}
                  </Typography>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </Box>
  );
}
