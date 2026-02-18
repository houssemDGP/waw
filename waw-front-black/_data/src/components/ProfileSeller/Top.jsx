import {
  ArrowBackIos,
  ArrowForwardIos,
  Close,
  EnergySavingsLeafOutlined,
  LocationOn,
  Star,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import { Box, Typography } from '@mui/material';
const Container = styled.div`
  /* border: 1px solid red; */
  margin: 15px 0px 15px 8px;

  @media screen and (max-width: 865px) {
    margin: 20px 0px;
  }
`;

const DetailsContainer = styled.div`
  /* border: 1px solid blue; */
`;

const BoxBtnContainer = styled.div`
  /* border: 1px solid black; */
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 426px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const BoxesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const Box1 = styled.div`
  background-color: #7f7f7f;
  text-align: center;
  width: 90px;
  color: white;
  padding: 5px 8px;
  margin: 0px 5px 5px 0px;
  font-size: 12px;
  border-radius: 2px;
`;

const Box2 = styled(Box1)`
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 128px;
  padding: 2.5px;

  .star-icon {
    font-size: 20px;
    color: #fdbd0c;
  }
`;

const Box3 = styled(Box1)`
  background-color: #d65113;
  color: white;
  width: 145px;
`;

const Box4 = styled(Box3)`
  width: 100px;
`;

const Box5 = styled(Box1)`
  background-color: #e7fde9;
  color: #509b62;
  width: 182px;
  display: flex;
  align-items: center;
  justify-content: center;

  .leaf-icon {
    font-size: 16px;
    margin-right: 3px;
  }
`;

const BtnContainer = styled.div`
  /* border: 1px solid red; */

  button {
    background-color: #d65113;
    color: white;
    font-size: 15px;
    font-weight: 600;
    width: 130px;
    padding: 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      background-color: #d65113 ;
    }
  }
`;

const AddressContainer = styled.div`
  /* border: 1px solid red; */
  margin: 15px 0px;

  @media screen and (max-width: 426px) {
    text-align: center;
  }

  h2 {
    color: #333;
    margin-left: 5px;

    @media screen and (max-width: 426px) {
      margin: 0px;
    }
  }

  p {
    display: flex;
    align-items: center;
    font-size: 15px;
    color: #262626;
    margin: 3px 0px;

    @media screen and (max-width: 426px) {
      align-items: flex-start;
      justify-content: center;
    }

    .location-icon {
      color: #0368c1;
    }
  }
`;

const ImagesContainer = styled.div`
  /* border: 1px solid blue; */
`;

const BigMedImgContainer = styled.div`
  display: flex;
`;

const MedImgContainer = styled.div`
  /* border: 1px solid black; */
  flex: 1;

  div {
    height: 175px;
    width: 100%;
    margin-bottom: 10px;
    overflow: hidden;

    @media screen and (max-width: 426px) {
      height: 132px;
      margin-bottom: 5px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: scale(1.05);
      }
    }
  }
`;

const BigImgContainer = styled.div`
  height: 360px;
  flex: 2;
  margin: 0px 0px 10px 10px;
  overflow: hidden;

  @media screen and (max-width: 426px) {
    height: 270px;
    margin: 0px 0px 5px 5px;
  }

  img {
    width: 100%;
    height: 100%;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const SamllImgContainer = styled.div`
  /* border: 1px solid blue; */
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    flex: 1;
    height: 110px;
    margin-right: 10px;
    overflow: hidden;

    @media screen and (max-width: 426px) {
      height: 70px;
      margin-right: 5px;
    }

    &:last-of-type {
      margin-right: 0px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: scale(1.05);
      }
    }
  }
`;

// CSS For Slider

const Slider = styled.div`
  /* border: 1px solid red; */
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 9999; // Don't delete it.
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Slides = styled.div`
  /* border: 1px solid yellow; */
  box-shadow: 0px 0px 15px 12px rgb(0 0 0 / 45%);
  width: 82%;
  height: 85vh;
  position: relative;

  @media screen and (max-width: 770px) {
    width: 99vw;
    height: 99vh;
  }

  @media screen and (max-width: 426px) {
    width: 98vw;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .arrow-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    font-size: 40px;
    cursor: pointer;

    &:hover {
      color: #2874f0;
    }
  }

  .left {
    left: -60px;

    @media screen and (max-width: 770px) {
      left: 20px;
    }
  }

  .right {
    right: -60px;

    @media screen and (max-width: 770px) {
      right: 20px;
    }
  }

  .close-icon {
    box-shadow: 0px 0px 5px 4px rgb(0 0 0 / 25%);
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: -25px;
    right: -25px;
    font-size: 44px;
    padding: 5px;
    cursor: pointer;

    @media screen and (max-width: 770px) {
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
    }

    &:hover {
      background-color: #2874f0;
      color: white;
    }
  }
`;

const HotelDetails = ({ profile }) => {
  const [openSlider, setOpenSlider] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);

  const hotelId = useLocation().pathname.split("/")[2];
  // console.log(typeof hotelId);

  // Got Array of single object
  const hotel = [
  {
    id: 1,
    img: [
      "/imgs/offers/VisitePrivéeàKairouan/1.jpg",
      "/imgs/offers/VisitePrivéeàKairouan/2.jpg",
      "/imgs/offers/VisitePrivéeàKairouan/3.jpg",
      "/imgs/offers/VisitePrivéeàKairouan/4.jpg",
      "/imgs/offers/VisitePrivéeàKairouan/5.jpg",
      "/imgs/offers/VisitePrivéeàKairouan/6.jpg",


    ],
    name: "DGP",
    place: "Tunisie",
    location: { lat: 28.6048, lng: 77.2234 },
    distance: 6.7,
    address: "Tunis, Tunisie",
    offer: "Breakfast Included",
    roomDetails: "Luxury Room with Bath Tub",
    bedDetails: "1 king size single bed",
    roomLeft: 5,
    rating: 5,
    reviews: 312,
    night: 1,
    adult: 2,
    children: 1,
    price: "18,000",
    otherCharges: "3,240",
  }
];


  const hotelRating = hotel[0].rating;

  const handleImgClickForSlider = (indexNumber) => {
    setSlideNumber(indexNumber);
    setOpenSlider(true);
  };

  // console.log(slideNumber);

  const handleSlide = (direction) => {
    if (direction === "right") {
      setSlideNumber(slideNumber === 0 ? 7 : slideNumber - 1);
    } else {
      setSlideNumber(slideNumber === 7 ? 0 : slideNumber + 1);
    }
  };

  return (
    <Container>
      <DetailsContainer>
        <BoxBtnContainer>
          <BoxesContainer>
             {/* Adresse <Box1>Agence</Box1>
            <Box2>
              {(hotelRating === 1 && <Star className="star-icon" />) ||
                (hotelRating === 2 && (
                  <>
                    <Star className="star-icon" />
                    <Star className="star-icon" />
                  </>
                )) ||
                (hotelRating === 3 && (
                  <>
                    <Star className="star-icon" />
                    <Star className="star-icon" />
                    <Star className="star-icon" />
                  </>
                )) ||
                (hotelRating === 4 && (
                  <>
                    <Star className="star-icon" />
                    <Star className="star-icon" />
                    <Star className="star-icon" />
                    <Star className="star-icon" />
                  </>
                )) ||
                (hotelRating === 5 && (
                  <>
                    <Star className="star-icon" />
                    <Star className="star-icon" />
                    <Star className="star-icon" />
                    <Star className="star-icon" />
                    <Star className="star-icon" />
                  </>
                ))}
            </Box2>               <Box3>Verifie</Box3>
  */}

          </BoxesContainer>
        </BoxBtnContainer>
        <AddressContainer>

<div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
  <img
  src={
    profile.imageUrl
      ? `https://waw.com.tn${profile.imageUrl}`
      : '/logo/waw.png'
  }
    alt="Profil DGP"
    style={{
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      objectFit: "cover",
    }}
  />
  <h2 style={{ margin: 0 }}>{profile.rs}</h2>
<div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
  {profile.facebook && (
    <a
      href={profile.facebook}
      target="_blank"
      rel="noopener"
      className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white shadow-theme-xs hover:bg-gray-50"
    >
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
</svg>
    </a>
  )}

  {profile.instagram && (
    <a
      href={profile.instagram}
      target="_blank"
      rel="noopener"
      className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white shadow-theme-xs hover:bg-gray-50"
    >
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
</svg>
    </a>
  )}

  {profile.tiktok && (
    <a
      href={profile.tiktok}
      target="_blank"
      rel="noopener"
      className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white shadow-theme-xs hover:bg-gray-50"
    >
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tiktok" viewBox="0 0 16 16">
  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
</svg>
    </a>
  )}
</div>

</div>

<div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  }}
><Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      
      {/* Adresse */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocationOnIcon sx={{ color: '#f44336' }} />
        <Typography variant="body2" color="text.secondary">
          {profile.adresse}
        </Typography>
      </Box>

      {/* Note + Avis */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <StarIcon sx={{ color: '#fbc02d' }} />
        <Typography variant="body2" fontWeight="bold">
          {hotel[0].rating}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ({hotel[0].reviews} avis)
        </Typography>
      </Box>
    </Box>
</div>

        </AddressContainer>
      </DetailsContainer>

      <ImagesContainer>


          <BigImgContainer>
            <img
  src={
    profile.imageUrl
      ? `https://waw.com.tn${profile.imageUrl}`
      : '/logo/waw.png'
  }              alt="waw"
              title="Click to open image slider"
              onClick={() => handleImgClickForSlider(0)}
            />
          </BigImgContainer>

      </ImagesContainer>
    </Container>
  );
};

export default HotelDetails;
