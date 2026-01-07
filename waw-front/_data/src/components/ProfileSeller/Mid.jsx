import React, { useState,useEffect } from 'react';
import styled from 'styled-components';
import { Phone, Email, VerifiedOutlined } from "@mui/icons-material";
import AvisVoyageurs from "./Avis";
import { DateCalendar, PickersDay } from '@mui/x-date-pickers';
import {
  Button,
  Popper,
  Paper,
  ClickAwayListener,
  Stack,
  Box, MenuList, MenuItem, Typography,
} from "@mui/material";
import { FavoriteBorder } from "@mui/icons-material";
import StarIcon from "@mui/icons-material/Star";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Link } from "react-router-dom";


const LeftColumn = styled.div`
  flex: 2;
`;

const RightStickyColumn = styled.div`
  flex: 2;
  position: sticky;
  top: 100px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ddd;
  height: fit-content;

  @media screen and (max-width: 768px) {
    position: static;
  }
`;

const TitleSection = styled.h5`
  color: #3c71c2;
  font-weight: 700;
  margin-bottom: 10px;
  margin-top: 30px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 10px;

  div {
    border: 1px solid #e0dede;
    border-radius: 3px;
    display: flex;
    align-items: center;
    padding: 10px;
    color: #262626;
    font-size: 15px;
    background: #fff;

    .feature-icon {
      margin-right: 8px;
      font-size: 25px;
      color: #4c71c2;
    }
  }
`;

const DescriptionBlock = styled.div`
  margin-top: 30px;
  h2 {
    margin-bottom: 15px;
  }

  p {
    font-size: 15px;
    line-height: 1.5;
    color: #262626;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  margin: 12px 0;
  span:first-child {
    font-weight: 600;
  }
`;

const PublisherRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const ReserveButton = styled.button`
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  background-color: #d65113;
  color: #fff;
  border: none;
  font-weight: bold;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c8470f;
  }
`;

const ListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #f7f7f7;
  position: relative;
`;
const Card = styled.div`
  display: flex;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgb(0 0 0 / 0.1);
  background: white;
  margin-bottom: 20px;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImgWrapper = styled.div`
  flex: 0 0 30%;
  max-width: 30%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const FavoriteIcon = styled(FavoriteBorder)`
  color: #d62828;
  cursor: pointer;
`;

const Label = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: #ee4d2d;
  color: white;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: bold;
  border-bottom-right-radius: 10px;
  z-index: 2;
`;
const Container = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 30px;
  padding: 0 16px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;
const Content = styled.div`
  flex: 1;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 768px) {
    padding: 15px 20px;
  }
`;

const Title = styled.h2`
  margin: 0 0 6px;
  font-size: 1.1rem;
  color: #00564a;
`;

const Address = styled.p`
  margin: 0 0 6px;
  color: #555;
  font-size: 0.85rem;
`;
const InfoBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  position: absolute;
  top: 16px;
  right: 20px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: bold;
  color: #444;
  font-size: 0.9rem;

  svg {
    color: #ffc107;
    font-size: 1rem;
  }
`;
const Price = styled.p`
  font-weight: 600;
  color: #ee4d2d;
  margin: 0 0 10px;
  font-size: 0.9rem;
`;
const Slider = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding: 8px 0 8px 8px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #00564a;
    border-radius: 3px;
  }
`;

const Slot = styled.button`
  flex: 0 0 auto;
  padding: 5px 10px;
  font-size: 0.8rem;
  border-radius: 16px;
  border: 1px solid #00564a;
  background: ${({ selected }) => (selected ? "#00564a" : "white")};
  color: ${({ selected }) => (selected ? "white" : "#00564a")};
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background-color: #007d67;
    color: white;
  }
`;
// --------- MAIN COMPONENT ---------
function RestaurantCard({ data, selectedSlot, onSelectSlot }) {
  return (
        <Link to={`/detailsEvent?id=${data.id}`} style={{ textDecoration: "none" }}>
    <Card>
      {data.nom && <Label>{data.nom}</Label>}
      <ImgWrapper>
        <Image   src={`https://waw.com.tn${data.imageUrls[0]}`}
 alt={data.title} />
      </ImgWrapper>
      <Content>
        <InfoBar>
                {/* <Rating>
  <StarIcon />
  <span>{data.rating}</span>
  <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
    ({data.votes} avis)
  </Typography>
</Rating>           <FavoriteIcon />
*/}


        </InfoBar>
        <Title>{data.nom}</Title>
        <Address>{data.ville} {data.pays}</Address>
<Price>
  {data.description.length > 50
    ? data.description.slice(0, 50) + "..."
    : data.description}
</Price>      </Content>
    </Card>
    </Link>
  );
}
const HotelFeature = ({ profile }) => {
    const [price, setPrice] = useState(50);

  const handleChange = (e) => {
    setPrice(e.target.value);
  };
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  return (
    <Container>
      <LeftColumn>

              <TitleSection>Description</TitleSection>
          <div>{profile.description}</div>

        <TitleSection>Plus de details</TitleSection>
        <FeatureGrid>
          <div><Phone className="feature-icon" />{profile.phone}</div>
          <div><Email className="feature-icon" />{profile.email}</div>
        </FeatureGrid>


      </LeftColumn>

      {/*                 <AvisVoyageurs />
 */}
      <RightStickyColumn>

<ListWrapper>
{profile.events
  .filter(rest => rest.active).filter(rest => rest.view)  
  .map(rest => (
              <div
              key={rest.id}
              onClick={() => setSelectedId(rest.id)}
              style={{
                cursor: "pointer",
                border:
                  rest.id === selectedId
                    ? "2px solid #00564a"
                    : "2px solid transparent",
                borderRadius: 15,
              }}
            >
              <RestaurantCard
                data={rest}
                selectedSlot={rest.id === selectedId ? selectedSlot : null}
                onSelectSlot={setSelectedSlot}
              />
            </div>
          ))}
        </ListWrapper>
      </RightStickyColumn>
    </Container>
  );
};

export default HotelFeature;
