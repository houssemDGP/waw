import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {Link} from "@mui/material";

const Container = styled.div`padding: 20px; max-width: 1200px; margin: auto;`;
const FilterWrapper = styled.div`margin-bottom: 20px;`;
const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
const Card = styled.div`
  display: flex;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgb(0 0 0 / 0.1);
  background: white;
  position: relative;
  flex-direction: column;
`;
const ImgWrapper = styled.div`width: 100%; position: relative;`;
const Image = styled.img`width: 100%; height: 200px; object-fit: cover;`;
const Content = styled.div`padding: 20px; display: flex; flex-direction: column;`;
const Title = styled.h2`margin: 0 0 10px; color: #00564a;`;
const Address = styled.p`margin: 0 0 10px; color: #555; font-size: 0.95rem;`;
const Price = styled.p`font-weight: 700; color: #ee4d2d; margin: 0 0 14px;`;
const Slider = styled.div`display: flex; overflow-x: auto; gap: 12px; padding-bottom: 8px;`;
const Slot = styled.button`
  flex: 0 0 auto;
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid #00564a;
  background: ${({ selected }) => (selected ? "#00564a" : "white")};
  color: ${({ selected }) => (selected ? "white" : "#00564a")};
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
`;

function EventCard({ event, selectedSlot, onSelectSlot, onIgnore }) {
  const [modalOpen, setModalOpen] = useState(false);
localStorage.setItem("fav-count", 0);
      window.dispatchEvent(new Event("fav-count-changed"));


  return (
    <Card>
      <ImgWrapper>
        <Box sx={{ position: "absolute", bottom: 8, right: 8, display: "flex", gap: 1, zIndex: 2 }}>
<Box
  sx={{
    backgroundColor: "white",
    borderRadius: "50%",
    p: 0.5,
    boxShadow: 1,
    cursor: "pointer"
  }}
  onClick={async () => {
    const userId = localStorage.getItem("userId"); // récupère l'userId
    const eventId = event.id; // id de l'événement courant

    try {
      const res = await fetch(`https://waw.com.tn/api/wishlist/remove?userId=${userId}&eventId=${eventId}`, {
        method: "DELETE" // ou "GET" si ton backend attend GET
      });

      if (res.ok) {
        // Optionnel : mettre à jour le state pour retirer l'event du front
        onIgnore(); // si tu passes cette fonction depuis le parent pour filtrer la liste
        console.log("Événement retiré de la wishlist !");
      } else {
        console.error("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error(err);
    }
  }}
>
  <DoNotDisturbAltIcon sx={{ fontSize: 20, color: "#555" }} />
</Box>
        </Box>
<a href={`http://102.211.209.131:3333/detailsEvent?id=${event.id}`} target="_blank" rel="noopener noreferrer">
  <Image 
    src={`https://waw.com.tn/api${event.imageUrls?.[0] || "/imgs/offers/default.jpg"}`} 
    alt={event.nom} 
  />
</a>
     </ImgWrapper>
      <Content>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: '#666' }}>
          <AccountCircleIcon sx={{ fontSize: 18, mr: 1 }} />

                          <Link href={`/profile?id=${event.business.id}`} passHref>
          <Typography variant="caption">Publié par <b>{event.business?.nom || "Anonyme"}</b></Typography>

  </Link>
        </Box>
        <Title>{event.nom}</Title>
        <Address>{event.rue}</Address>
      </Content>
    </Card>
  );
}

export default function WishlistPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [wishlist, setWishlist] = useState([]);

const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetch(`https://waw.com.tn/api/wishlist/user/${userId}`)
      .then(res => res.json())
      .then(data => setWishlist(data))
      .catch(err => console.error(err));
  }, [userId]);

  const filteredEvents = selectedDate
    ? wishlist.filter((event) =>
        event.scheduleRanges?.some(range =>
          range.startDate <= selectedDate.toISOString().split("T")[0] &&
          range.endDate >= selectedDate.toISOString().split("T")[0]
        )
      )
    : wishlist;

  return (
    <>
      <TopBar />
      <Navbar />
      <Container>
        <Typography variant="h5" sx={{ color: '#181AD6', fontWeight: 'bold', mb: 2, mt: 3 }}>Wishlist</Typography>
        <FilterWrapper>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Filtrer par date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </FilterWrapper>

<ListWrapper>
  {filteredEvents.length > 0 ? (
    filteredEvents.map((event) => (
      <div
        key={event.id}
        onClick={() => setSelectedId(event.id)}
        style={{
          cursor: "pointer",
          border: event.id === selectedId ? "2px solid #00564a" : "2px solid transparent",
          borderRadius: 15,
        }}
      >
        <EventCard
          event={event}
          selectedSlot={event.id === selectedId ? selectedSlot : null}
          onSelectSlot={setSelectedSlot}
          onIgnore={() =>
            setWishlist((prev) => prev.filter((e) => e.id !== event.id))
          }
        />
      </div>
    ))
  ) : (
    <div style={{ textAlign: "center", padding: 20, color: "#888" }}>
      Aucun événement disponible
    </div>
  )}
</ListWrapper>
      </Container>
      <Footer />
    </>
  );
}
