import React, { useState, useRef,useEffect } from "react";
import styled, { keyframes } from 'styled-components';
import {
  Button,
  Popper,
  Paper,
  ClickAwayListener,Link,
  Stack,
  Box, MenuList, MenuItem, Typography,FormControl,  Radio,
  RadioGroup,FormHelperText,IconButton
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,FormLabel,FormControlLabel
} from '@mui/material';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FavoriteBorder } from "@mui/icons-material";
import StarIcon from "@mui/icons-material/Star";
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import ShareIcon from "@mui/icons-material/Share";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import ChatIcon from "@mui/icons-material/Chat";
import axios from 'axios';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSearchParams } from "react-router-dom";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import { Slider as RangeSlider } from "@mui/material";
import { useNavigate } from "react-router-dom";

dayjs.locale('fr');


const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    height: auto;
  }
`;

const MapWrapper = styled.div`
  flex: 1;
  height: 100%;

  @media (max-width: 768px) {
    height: 40vh;
    order: -1;
  }
`;

const ListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f7f7f7;
  position: relative;
`;

const StickyFilters = styled.div`
  top: 0px;
  background: white;
  padding: 10px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1200;

  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
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
const Card2 = styled.div`
  display: flex;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgb(0 0 0 / 0.1);
  background: white;
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

const Content = styled.div`
  flex: 1;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.h2`
  margin: 0 0 10px;
  color: black;
`;

const Address = styled.p`
  margin: 0 0 10px;
  color: #555;
  font-size: 0.95rem;
`;

const Price = styled.p`
  font-weight: 700;
  color: #ee4d2d;
  margin: 0 0 14px;
`;

const Slider = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: black;
    border-radius: 3px;
  }
`;

const Slot = styled.button`
  flex: 0 0 auto;
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid black;
  background: ${({ selected }) => (selected ? "black" : "white")};
  color: ${({ selected }) => (selected ? "white" : "black")};
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;

  &:hover {
    background-color: black;
    color: white;
  }
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
  font-weight: bold;
  color: #444;
  font-size: 0.9rem;

  svg {
    color: #ffc107;
    font-size: 1rem;
    margin-right: 3px;
  }
`;

const FavoriteIcon = styled(FavoriteBorder)`
  color: #d62828;
  cursor: pointer;
`;

const Label = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: black;
  color: white;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: bold;
  border-bottom-right-radius: 10px;
  z-index: 2;
`;
const HeaderBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px;
`;

// Nouveau bloc réservation moderne
const ReservationCard = styled.div`
  background: #fff;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.3);
  border-radius: 12px;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 40px auto 0;

  @media screen and (max-width: 675px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const ReservationDetails = styled.div`
  flex: 1;
  color: #262626;
`;

const ReservationTitle = styled.h3`
  margin: 0 0 12px 0;
  font-weight: 700;
  font-size: 1.3rem;
  color: #3c71c2;
`;

const ReservationText = styled.p`
  margin: 4px 0;
  font-size: 1rem;
`;

const ReservationTotal = styled.p`
  margin-top: 8px;
  font-weight: 700;
  font-size: 1.1rem;
  color: #222;
`;

const ConfirmButton = styled.button`
  background-color: black;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 32px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  min-width: 160px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: black;
  }
  
  @media screen and (max-width: 675px) {
    min-width: 100%;
  }
`;
const StyledDialogTitle = styled(DialogTitle)`
  color: black;
  font-weight:1000 !important;
`;
const StyledTypography = styled(Typography)`
  color: black;
  font-weight: 600;
`;

const StyledFormLabel = styled(FormLabel)`
  color: black !important;
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  && {
    color: black;
  }
  && .Mui-checked {
    color: black;
  }
`;
const StyledTextField = styled(TextField)`
  && {
    & label {
      color: #1c4f6c;
    }
    & label.Mui-focused {
      color: #1c4f6c;
    }
    & .MuiOutlinedInput-root {
      color: #1c4f6c;
      & fieldset {
        border-color: #1c4f6c;
      }
      &:hover fieldset {
        border-color: #1c4f6c;
      }
      &.Mui-focused fieldset {
        border-color: #1c4f6c;
      }
    }
  }
`;
const StyledRadioGroup = styled(RadioGroup)`
  && .Mui-checked {
    color: black;
  }
`;
const StyledFormHelperText = styled(FormHelperText)`
  color: black !important;
`;

const StyledButtonOutlined = styled(Button)`
  && {
    border-color: black;
    color: black;
    &:hover {
      background-color: black;
      color: white;
      border-color: black;
    }
  }
`;

const StyledButtonContained = styled(Button)`
  && {
    background-color: black;
    color: white;
    &:hover {
      background-color: #c8470f;
    }
  }
`;
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const Places = styled.span`
  color: black;
  font-size: 13px;
  font-weight: 500;
    margin-top: 4px;

  animation: ${blink} 1s infinite;
`;
const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  margin-top: 8px;
`;


export default function ResponsiveMapWithFilters() {
const navigate = useNavigate();

    const isDateBetween = (target, start, end) => {
  const t = new Date(target).getTime();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return t >= s && t <= e;
};

const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

function generateCalendarEventsFromEvent(event) {
  const calendarEvents = [];
  const exceptionDatesSet = new Set();

  // Handle scheduleRangeExceptions
  (event.scheduleRangeExceptions || []).forEach((range) => {
    const selectedDays = range.selectedDays || [];
    const exclureDatesSet = new Set(range.selectedExclureDates || []);
    let current = new Date(range.startDate);
    const rangeEnd = new Date(range.endDate);

    while (current <= rangeEnd) {
      const dayStr = current.toISOString().split("T")[0];
      const dayName = dayNames[current.getDay()];
      if (selectedDays.includes(dayName.toUpperCase()) && !exclureDatesSet.has(dayStr)) {
        calendarEvents.push({
          id: `exception-${event.id}-${range.id}-${dayStr}`,
          title: `${event.nom} (Exception)`,
          start: dayStr,
          allDay: true,
          extendedProps: {
            eventData: event,
            scheduleRange: range,
            isException: true,
          },
        });
        exceptionDatesSet.add(`${event.id}-${dayStr}`);
      }
      current.setDate(current.getDate() + 1);
    }
  });

  // Handle scheduleRanges
  (event.scheduleRanges || []).forEach((range) => {
    const selectedDays = range.selectedDays || [];
    const exclureDatesSet = new Set(range.selectedExclureDates || []);
    let current = new Date(range.startDate);
    const rangeEnd = new Date(range.endDate);

    while (current <= rangeEnd) {
      const dayStr = current.toISOString().split("T")[0];
      const dayName = dayNames[current.getDay()];
      const key = `${event.id}-${dayStr}`;

      if (
        selectedDays.includes(dayName.toUpperCase()) &&
        !exclureDatesSet.has(dayStr) &&
        !exceptionDatesSet.has(key)
      ) {
        calendarEvents.push({
          id: `event-${event.id}-${range.id}-${dayStr}`,
          title: event.nom,
          start: dayStr,
          allDay: true,
          extendedProps: {
            eventData: event,
            scheduleRange: range,
            isException: false,
          },
        });
      }

      current.setDate(current.getDate() + 1);
    }
  });
  return calendarEvents;
}

function generateCalendarEventsForDay(event, dateString, selectedPers) {
  const events = [];
  const date = new Date(dateString);
  const dayName = dayNames[date.getDay()];
  const key = `${event.id}-${dateString}`;
  const exceptionDatesSet = new Set();

  const filterDailySchedules = (dailySchedules) => {
    let filtered = dailySchedules || [];

    // Filter by selectedPers (formulas or packs)
    if (selectedPers != null && selectedPers > 1) {
      filtered = filtered.filter(ds =>
        ds.formulas?.some(f => f.nbr === Number(selectedPers)) ||
        ds.packs?.some(p => p.nbr === Number(selectedPers))
      );
    }

    // Filter by selectedHour if defined
    if (selectedHour) {
      const [selH] = selectedHour.split(":").map(Number);
      filtered = filtered.filter(ds => {
        const [dsH] = ds.startTime.split(":").map(Number);
        return dsH >= selH;
      });
    }

    // ✅ Exclude past hours if selected date is today
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      filtered = filtered.filter(ds => {
        const [dsH, dsM] = ds.startTime.split(":").map(Number);
        return dsH > now.getHours() || (dsH === now.getHours() && dsM >= now.getMinutes());
      });
    }

    return filtered;
  };

  // Handle scheduleRangeExceptions
  (event.scheduleRangeExceptions || []).forEach(range => {
    const selectedDays = range.selectedDays || [];
    const exclureDatesSet = new Set(range.selectedExclureDates || []);
    const start = new Date(range.startDate);
    const end = new Date(range.endDate);

    if (date >= start && date <= end &&
        selectedDays.includes(dayName.toUpperCase()) &&
        !exclureDatesSet.has(dateString)) {

      const dailySchedules = filterDailySchedules(range.dailySchedules);
      if (dailySchedules.length > 0) {
        events.push({
          id: `exception-${event.id}-${range.id}-${dateString}`,
          title: `${event.nom} (Exception)`,
          start: dateString,
          allDay: true,
          extendedProps: {
            eventData: event,
            scheduleRange: range,
            dailySchedules,
            isException: true,
          },
        });
        exceptionDatesSet.add(key);
      }
    }
  });

  // Handle normal scheduleRanges
  if (!exceptionDatesSet.has(key)) {
    (event.scheduleRanges || []).forEach(range => {
      const selectedDays = range.selectedDays || [];
      const exclureDatesSet = new Set(range.selectedExclureDates || []);
      const start = new Date(range.startDate);
      const end = new Date(range.endDate);

      if (date >= start && date <= end &&
          selectedDays.includes(dayName.toUpperCase()) &&
          !exclureDatesSet.has(dateString)) {

        const dailySchedules = filterDailySchedules(range.dailySchedules);
        if (dailySchedules.length > 0) {
          events.push({
            id: `event-${event.id}-${range.id}-${dateString}`,
            title: event.nom,
            start: dateString,
            allDay: true,
            extendedProps: {
              eventData: event,
              scheduleRange: range,
              dailySchedules,
              isException: false,
            },
          });
        }
      }
    });
  }

  return events;
}



  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedPack, setSelectedPack] = useState(null);

const { isOpen: isOpenModal1, openModal: openModal1, closeModal: closeModal1 } = useModal();
const { isOpen: isOpenModal2, openModal: openModal2, closeModal: closeModal2 } = useModal();
const renderSchedulesAndFormulas = (event, selectedPers) => {
  if (!selectedDate) return null;

  const eventData = event.extendedProps.eventData;
  const selected = selectedDate;
  const selectedDayName = dayNames[new Date(selected).getDay()].toUpperCase();

  // Helper to filter dailySchedules by selectedPers
  const filterDailySchedules = (dailySchedules) => {
    if (selectedPers != null && selectedPers > 1) {
      return (dailySchedules || [])
        .filter(ds => ds.packs && ds.packs.some(pack => pack.nbr === Number(selectedPers)))
        .map(ds => ({
          ...ds,
          formulas: [], // Clear formulas when filtering
        }));
    }
    return dailySchedules || [];
  };

  // 1. Check for exceptions
  const exceptionRange = (eventData.scheduleRangeExceptions || []).find(range =>
    isDateBetween(selected, range.startDate, range.endDate) &&
    range.selectedDays.includes(selectedDayName) &&
    !(range.selectedExclureDates || []).includes(selected)
  );

  if (exceptionRange) {
    const schedules = filterDailySchedules(exceptionRange.dailyScheduleExceptions);
    if (!schedules.length) return <p className="text-gray-500">Aucun horaire disponible ce jour-là</p>;

    return schedules.map((s, idx) => (
      <div key={idx} className="border p-3 rounded mb-2 bg-yellow-50">
        <p className="font-semibold">🕒 {s.startTime} - {s.endTime}</p>

        {s.formulas?.length > 0 && (
          <>
            <strong>Formules</strong>
            {s.formulas.map((f, i) => (
              <div key={i} className="flex items-center justify-between mt-2">
                <p>{f.label} - {f.price} DT ({f.capacity} places)</p>
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() => {
                    setSelectedEvent(event);
                    setSelectedSchedule(s);
                    setSelectedFormula(f);
                  }}
                >
                  Sélectionner
                </button>
              </div>
            ))}
          </>
        )}

        {s.packs?.length > 0 && (
          <>
            <strong>Packs</strong>
            {s.packs.map((f, i) => (
              <div key={i} className="flex items-center justify-between mt-2">
                <p>{f.label} (pack de {f.nbr}) - {f.price} DT ({f.capacity} places)</p>
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() => {
                    setSelectedEvent(event);
                    setSelectedSchedule(s);
                    setSelectedPack(f);
                  }}
                >
                  Sélectionner
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    ));
  }

  // 2. Normal schedule
  const normalRange = (eventData.scheduleRanges || []).find(range =>
    isDateBetween(selected, range.startDate, range.endDate) &&
    range.selectedDays.includes(selectedDayName) &&
    !(range.selectedExclureDates || []).includes(selected)
  );

  if (!normalRange) return <p className="text-gray-500">Aucun horaire disponible ce jour-là</p>;

  const schedules = filterDailySchedules(normalRange.dailySchedules);
  if (!schedules.length) return <p className="text-gray-500">Aucun horaire disponible ce jour-là</p>;

  return schedules.map((s, idx) => (
    <div key={idx} className="border p-3 rounded mb-2">
      <p className="font-semibold">🕒 {s.startTime} - {s.endTime}</p>

      {s.formulas?.length > 0 && (
        <>
          <strong>Formules</strong>
          {s.formulas.map((f, i) => (
            <div key={i} className="flex items-center justify-between mt-2">
              <p>{f.label} - {f.price} DT ({f.capacity} places)</p>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => {
                  setSelectedEvent(event);
                  setSelectedSchedule(s);
                  setSelectedFormula(f);
                }}
              >
                Sélectionner
              </button>
            </div>
          ))}
        </>
      )}

      {s.packs?.length > 0 && (
        <>
          <strong>Packs</strong>
          {s.packs.map((f, i) => (
            <div key={i} className="flex items-center justify-between mt-2">
              <p>{f.label} (pack de {f.nbr}) - {f.price} DT ({f.capacity} places)</p>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => {
                  setSelectedEvent(event);
                  setSelectedSchedule(s);
                  setSelectedPack(f);
                }}
              >
                Sélectionner
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  ));
};


function EventCard({ data, selectedSlot, onSelectSlot, onIgnore, isOpen, onOpen, onClose }) {
  generateCalendarEventsFromEvent(data);


const EventsForDay = generateCalendarEventsForDay(data, selectedDate,selectedPers);
if (EventsForDay[0] !== undefined && EventsForDay[0] !== null) {

}
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("sur_place");
const [paymentPercentage, setPaymentPercentage] = useState(30);
const [adults, setAdults] = useState([{ name: "" }]);
const [children, setChildren] = useState([{ name: "", age: "" }]);

const addAdult = () => setAdults([...adults, { name: "" }]);
const addChild = () => setChildren([...children, { name: "", age: "" }]);

const handleAdultChange = (index, value) => {
  const updated = [...adults];
  updated[index].name = value;
  setAdults(updated);
};

const handleChildChange = (index, field, value) => {
  const updated = [...children];
  updated[index][field] = value;
  setChildren(updated);
};
    const userId = localStorage.getItem("userId"); // récupérer userId

const handleVote = async (eventId, liked) => {
  try {
    await axios.put(
      `https://waw.com.tn/api/events/${eventId}/vote`,
      null, // pas de body
      {
        params: { 
          userId: 22,   // remplace par ton userId dynamique si nécessaire
          liked: liked.toString() // converti en string pour Spring Boot
        },
      }
    );
    alert(liked ? "Vous avez liké l'événement !" : "Vous avez disliké l'événement !");

    window.location.reload();  } catch (err) {
    console.error("Erreur lors du vote", err);
    alert("Erreur lors du vote");
  }
};

const [nom, setNom] = useState("");
const [email, setEmail] = useState("");
const [telephone, setTelephone] = useState("");
useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  fetch(`https://waw.com.tn/api/users/${userId}`)
    .then(res => res.json())
    .then(data => {
      setNom(`${data.nom || ""} ${data.prenom || ""}`.trim());
      setEmail(data.mail || "");
      setTelephone(data.phone || "");
    })
    .catch(err => console.error("Erreur chargement user:", err));
}, []);

  const [selectedFormulas, setSelectedFormulas] = useState([]);
  const [nbrAdulte, setNbrAdulte] = useState(0);
  const [nbrEnfant, setNbrEnfant] = useState(0);
  const [nbrBebe, setNbrBebe] = useState(0);
  const [formulasNbr, setFormulasNbr] = useState({});
  const [extrasNbr, setExtrasNbr] = useState({});
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (!selectedSchedule) return;
    const formulesTotal = (selectedSchedule.formulas || []).reduce((sum, f) => {
      const nbr = formulasNbr[f.id] || 0;
      return sum + nbr * f.price;
    }, 0);

    const extrasTotal = (selectedEvent?.extras || []).reduce((sum, extra, idx) => {
      const qty = extrasNbr[idx] || 0;
      return sum + qty * (extra?.prix || 0);
    }, 0);

    const totalCalc =
      (nbrAdulte * (selectedSchedule.prixAdulte || 0)) +
      (nbrEnfant * (selectedSchedule.prixEnfant || 0)) +
      (nbrBebe * (selectedSchedule.prixBebe || 0)) +
      formulesTotal +
      extrasTotal;
    setTotal(totalCalc);
  }, [nbrAdulte, nbrEnfant, nbrBebe, formulasNbr, extrasNbr, selectedSchedule, selectedEvent]);

  const canConfirm = nbrAdulte > 0 || Object.values(formulasNbr).some(n => n > 0);

  return (

    <Card>
      {data.nom && <Label>{data.nom}</Label>}

<ImgWrapper style={{ position: 'relative' }}>
  {/* Boutons superposés */}
  <Box
    sx={{
      position: 'absolute',
      bottom: 8,
      right: 8,
      display: 'flex',
      gap: 1,
      zIndex: 2
    }}
  >
<Box
  sx={{
    backgroundColor: 'white',
    borderRadius: '50%',
    p: 0.5,
    boxShadow: 1,
    cursor: 'pointer',
    '&:hover': { backgroundColor: '#f5f5f5' }
  }}
  onClick={async () => {
    const userId = localStorage.getItem("userId"); // récupérer userId
    const eventId = data.id; // id de l'événement

    try {
      const res = await fetch(`https://waw.com.tn/api/wishlist/add?userId=${userId}&eventId=${eventId}`, {
        method: 'POST' // selon ton API
      });

      if (res.ok) {
const current = Number(localStorage.getItem("fav-count")) || 0;
localStorage.setItem("fav-count", (current + 1).toString());
      window.dispatchEvent(new Event("fav-count-changed"));

      } else {
        console.error('Erreur lors de l\'ajout à la wishlist');
      }
    } catch (err) {
      console.error(err);
    }
  }}
>
  <FavoriteBorderIcon sx={{ fontSize: 20, color: '#d62828' }} />
</Box>

<Box
  sx={{
    backgroundColor: 'white',
    borderRadius: '50%',
    p: 0.5,
    boxShadow: 1,
    cursor: 'pointer',
    '&:hover': { backgroundColor: '#f5f5f5' }
  }}
  onClick={onIgnore} // appel de la fonction
>
  <DoNotDisturbAltIcon sx={{ fontSize: 20, color: '#555' }} />
</Box>
  </Box>
              <Link href={`/detailsEvent?id=${data.id}`} passHref>

<Image src={`https://waw.com.tn${data.imageUrls[0]}`} alt={data.nom} />
    </Link>

</ImgWrapper>

      <Content>
        <InfoBar>
            {/* 

          <Rating>
            <StarIcon />
          </Rating>Like */}
<Box

>

<div className="flex items-center gap-2">
  {/* Like */}
  <ThumbUpIcon
    sx={{ fontSize: 20, color: '#555', cursor: 'pointer' }}
    onClick={() => handleVote(data.id, true)} // true = like
  />
  <span>{data.likes}</span>

  {/*   <span>{data.dislikes}</span> */}
  <ThumbDownIcon
    sx={{ fontSize: 20, color: '#555', cursor: 'pointer' }}
    onClick={() => handleVote(data.id, false)} // false = dislike
  />
</div>
</Box>
        </InfoBar>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: '#666' }}>
  <AccountCircleIcon sx={{ fontSize: 18, mr: 1 }} />
                <Link href={`/profile?id=${data.business.id}`} passHref>

  <Typography variant="caption">
    Publié par <b>{data.business.rs}</b>
  </Typography>
  </Link>
</Box>
        <Title>{data.nom}</Title>
        <Address>{data.ville},{data.ville}</Address>
        <PriceRow>
  <Price></Price>
  <Places></Places>
</PriceRow>
<Slider>
  {EventsForDay[0]?.extendedProps?.scheduleRange?.dailySchedules
    ?.sort((a, b) => {
      const [aH, aM] = a.startTime.split(":").map(Number);
      const [bH, bM] = b.startTime.split(":").map(Number);
      console.log('Sorting - a:', a.startTime, 'b:', b.startTime);
      return aH !== bH ? aH - bH : aM - bM;
    })
    ?.filter(slot => {
      const selectedDate = new Date(EventsForDay[0].start);
      const now = new Date();

      console.log('=== FILTER DEBUG ===');
      console.log('selectedHour:', selectedHour);
      console.log('slot.startTime:', slot.startTime);
      console.log('selectedDate:', selectedDate);
      console.log('isToday:', selectedDate.toDateString() === now.toDateString());

      // Si la date est aujourd'hui, exclure les horaires passés
      const isToday = selectedDate.toDateString() === now.toDateString();
      if (isToday) {
        const [slotH, slotM] = slot.startTime.split(":").map(Number);
        const isPast = !(slotH > now.getHours() || (slotH === now.getHours() && slotM >= now.getMinutes()));
        console.log('isToday check - slot:', slot.startTime, 'isPast:', isPast);
        if (isPast) return false;
      }

      if (selectedHour) {
        const [selectedH, selectedM] = selectedHour.split(":").map(Number);
        const [slotH, slotM] = slot.startTime.split(":").map(Number);
        const matchesHourFilter = slotH > selectedH || (slotH === selectedH && slotM >= selectedM);
        console.log('Hour filter - selected:', selectedHour, 'slot:', slot.startTime, 'matches:', matchesHourFilter);
        
        if (!matchesHourFilter) return false;
      }

      console.log('✅ Slot accepted:', slot.startTime);
      return true;
    })
    .map((slot, i) => {
      console.log('Rendering slot:', slot.startTime, 'index:', i);
      return (
        <Slot
          key={i}
          selected={selectedSlot === i}
          onClick={() => {
            console.log('Slot clicked:', slot.startTime);
            setSelectedEvent(data);    
            setSelectedSchedule(slot);
            openModal2();
          }}
        >
          {slot.startTime}
        </Slot>
      );
    })
  }
</Slider>



      </Content>
     {selectedSchedule && (
       
      <Modal isOpen={isOpenModal2} onClose={closeModal2} className="max-w-[700px] p-6">

  <h2 className="text-xl font-bold mb-4">
Événements du {dayjs(selectedDate).format("YYYY-MM-DD")}
  </h2>

  {/* Event details */}
    <div className="border rounded p-3 mb-4">
      <p className="font-semibold">
        🕒 {selectedSchedule.startTime} - {selectedSchedule.endTime}         {selectedSchedule.label}

      </p>
    </div>
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const userId = localStorage.getItem("userId"); 

        const reservationData = {
           event: {id:selectedEvent?.id},
           user: userId ? { id: userId } : null,
          eventId: selectedEvent?.id,
          date: dayjs(selectedDate).format("YYYY-MM-DD"),
          dailyScheduleReservation: selectedSchedule,
        reservationFormulas: Object.entries(formulasNbr)
          .filter(([_, nbr]) => nbr > 0)
          .map(([id, nbr]) => ({ formula: { id }, nbr })),
        extrasReservation: Object.entries(extrasNbr)
          .filter(([_, nbr]) => nbr > 0)
          .map(([idx, nbr]) => {
            const extra = selectedEvent.extras[parseInt(idx)];
            return { titre: extra.titre, prix: extra.prix, nbr };
          }),
          nomClient: formData.get("nom"),
          email: formData.get("email"),
          telephone: formData.get("telephone"),
          commentaire: formData.get("remarque") || "",
          paymentMethods: formData.get("paymentMethod"),
          dateReservation: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
          nbrAdulte,
          nbrEnfant,
          nbrBebe,
          total,



   };

try {
  const res = await axios.post("https://waw.com.tn/api/reservations", reservationData);
  alert(res.data); 
  navigate("/");
} catch (err) {
  console.error(err);
  if (err.response && err.response.data) {
    alert(err.response.data);
  } else {
    alert("Erreur lors de la réservation.");
  }
}
      }}
      className="flex flex-col gap-4"
    >

          <div className="flex items-center justify-between border p-2 rounded">
            <span className="text-black">Prix Adulte : {selectedSchedule.prixAdulte} TND</span>
            <input type="number" min={0} value={nbrAdulte} onChange={e => setNbrAdulte(parseInt(e.target.value))} className="border p-1 rounded w-20 text-black"/>
          </div>

          {selectedEvent.accepteEnfants && (
            <div className="flex items-center justify-between border p-2 rounded">
              <span className="text-black">Prix Enfant : {selectedSchedule.prixEnfant} TND</span>
              <input type="number" min={0} value={nbrEnfant} onChange={e => setNbrEnfant(parseInt(e.target.value))} className="border p-1 rounded w-20 text-black"/>
            </div>
          )}
          {selectedEvent.accepteBebes && (
            <div className="flex items-center justify-between border p-2 rounded">
              <span className="text-black">Prix Bébé : {selectedSchedule.prixBebe} TND</span>
              <input type="number" min={0} value={nbrBebe} onChange={e => setNbrBebe(parseInt(e.target.value))} className="border p-1 rounded w-20 text-black"/>
            </div>
          )}
{selectedSchedule && selectedSchedule.formulas?.length > 0 && (
  <div className="mb-4">
    <p className="text-lg font-medium mb-2">Sélectionnez vos packs :</p>
    {selectedSchedule.formulas.map((f) => (
      <div
        key={f.id}
        onClick={() => {
          if (selectedFormulas.some(sf => sf.id === f.id)) {
            setSelectedFormulas(prev => prev.filter(sf => sf.id !== f.id));
          } else {
            setSelectedFormulas(prev => [...prev, f]);
          }
        }}
      >
        <div className="flex items-center justify-between border p-2 rounded text-black">
          <div>
            <p className="font-semibold text-black">{f.label} {f.price} DT ({f.nbr} places)</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              className="border p-1 rounded w-20 text-black"
              value={formulasNbr[f.id] || 0}
onChange={e => {
  const newNbr = parseInt(e.target.value, 10) || 0;

  const updated = { ...formulasNbr, [f.id]: newNbr }; // crée l’objet mis à jour
  setFormulasNbr(updated);

}}


            />
          </div>
        </div>
      </div>
    ))}
  </div>
)}
    <p className="text-lg font-medium mb-2">Sélectionnez vos extras :</p>
          {selectedEvent.extras?.length > 0 && (
            <div>
              <p className="font-medium mb-2 text-black">Sélectionnez vos extras :</p>
              {selectedEvent.extras.map((extra, idx) => (
                <div key={idx} className="flex items-center justify-between border p-2 rounded mb-2">
                  <span className="text-black">{extra.titre} {extra.prix} TND</span>
                  <input type="number" min={0} value={extrasNbr[idx]||0} onChange={e => {
                    const nbr = parseInt(e.target.value)||0;
                    setExtrasNbr(prev => ({...prev, [idx]: nbr}));
                  }} className="text-black border p-1 rounded w-20"/>
                </div>
              ))}
            </div>
          )}


  

<div>
  <label htmlFor="nom" className="block font-medium mb-1">Nom</label>
  <input
    type="text"
    id="nom"
    name="nom"
    required
    className="border p-2 rounded w-full"
    value={nom}
    onChange={(e) => setNom(e.target.value)}
  />
</div>

<div>
  <label htmlFor="email" className="block font-medium mb-1">Email</label>
  <input
    type="email"
    id="email"
    name="email"
    required
    className="border p-2 rounded w-full"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>

<div>
  <label htmlFor="telephone" className="block font-medium mb-1">Téléphone</label>
  <input
    type="text"
    id="telephone"
    name="telephone"
    required
    className="border p-2 rounded w-full"
    value={telephone}
    onChange={(e) => setTelephone(e.target.value)}
  />
</div>



      <div>
        <label htmlFor="paymentMethod" className="block font-medium mb-1">Type de paiement</label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          required
          className="border p-2 rounded w-full"
        >
          <option value="" disabled>Sélectionnez un mode de paiement</option>
          {(selectedEvent?.paymentMethods || []).map((method, i) => (
            <option key={i} value={method}>{method}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="remarque" className="block font-medium mb-1">Remarque</label>
        <textarea id="remarque" name="remarque" rows={3} className="border p-2 rounded w-full" />
      </div>
      {canConfirm && (

      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded"   disabled={!canConfirm}
>
         total : {total} TND Confirmer la réservation
      </button>
      )}

    </form>
</Modal>
)}

    </Card>

  );
}


function EventCardBest({ data, selectedSlot, onSelectSlot, onIgnore }) {
  generateCalendarEventsFromEvent(data);


const EventsForDay = generateCalendarEventsForDay(data, selectedDate,selectedPers);
if (EventsForDay[0] !== undefined && EventsForDay[0] !== null) {

}
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("sur_place");
const [paymentPercentage, setPaymentPercentage] = useState(30);
const [adults, setAdults] = useState([{ name: "" }]);
const [children, setChildren] = useState([{ name: "", age: "" }]);

const addAdult = () => setAdults([...adults, { name: "" }]);
const addChild = () => setChildren([...children, { name: "", age: "" }]);

const handleAdultChange = (index, value) => {
  const updated = [...adults];
  updated[index].name = value;
  setAdults(updated);
};

const handleChildChange = (index, field, value) => {
  const updated = [...children];
  updated[index][field] = value;
  setChildren(updated);
};

    const userId = localStorage.getItem("userId"); // récupérer userId

const handleVote = async (eventId, liked) => {
  try {
    await axios.put(
      `https://waw.com.tn/api/events/${eventId}/vote`,
      null, // pas de body
      {
        params: { 
          userId: 22,   // remplace par ton userId dynamique si nécessaire
          liked: liked.toString() // converti en string pour Spring Boot
        },
      }
    );
    alert(liked ? "Vous avez liké l'événement !" : "Vous avez disliké l'événement !");

    window.location.reload();  } catch (err) {
    console.error("Erreur lors du vote", err);
    alert("Erreur lors du vote");
  }
};

const [nom, setNom] = useState("");
const [email, setEmail] = useState("");
const [telephone, setTelephone] = useState("");
useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  fetch(`https://waw.com.tn/api/users/${userId}`)
    .then(res => res.json())
    .then(data => {
      setNom(`${data.nom || ""} ${data.prenom || ""}`.trim());
      setEmail(data.mail || "");
      setTelephone(data.phone || "");
    })
    .catch(err => console.error("Erreur chargement user:", err));
}, []);

  const [selectedFormulas, setSelectedFormulas] = useState([]);
  const [nbrAdulte, setNbrAdulte] = useState(0);
  const [nbrEnfant, setNbrEnfant] = useState(0);
  const [nbrBebe, setNbrBebe] = useState(0);
  const [formulasNbr, setFormulasNbr] = useState({});
  const [extrasNbr, setExtrasNbr] = useState({});
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (!selectedSchedule) return;
    const formulesTotal = (selectedSchedule.formulas || []).reduce((sum, f) => {
      const nbr = formulasNbr[f.id] || 0;
      return sum + nbr * f.price;
    }, 0);

    const extrasTotal = (selectedEvent?.extras || []).reduce((sum, extra, idx) => {
      const qty = extrasNbr[idx] || 0;
      return sum + qty * (extra?.prix || 0);
    }, 0);
    const totalCalc =
      (nbrAdulte * (selectedSchedule.prixAdulte || 0)) +
      (nbrEnfant * (selectedSchedule.prixEnfant || 0)) +
      (nbrBebe * (selectedSchedule.prixBebe || 0)) +
      formulesTotal +
      extrasTotal;
    setTotal(totalCalc);
  }, [nbrAdulte, nbrEnfant, nbrBebe, formulasNbr, extrasNbr, selectedSchedule, selectedEvent]);
    const canConfirm = nbrAdulte > 0 || Object.values(formulasNbr).some(n => n > 0);

  return (

    <Card>
      {data.nom && <Label>{data.nom}</Label>}

<ImgWrapper style={{ position: 'relative' }}>
  {/* Boutons superposés */}
  <Box
    sx={{
      position: 'absolute',
      bottom: 8,
      right: 8,
      display: 'flex',
      gap: 1,
      zIndex: 2
    }}
  >
<Box
  sx={{
    backgroundColor: 'white',
    borderRadius: '50%',
    p: 0.5,
    boxShadow: 1,
    cursor: 'pointer',
    '&:hover': { backgroundColor: '#f5f5f5' }
  }}
  onClick={async () => {
    const userId = localStorage.getItem("userId"); // récupérer userId
    const eventId = data.id; // id de l'événement

    try {
      const res = await fetch(`https://waw.com.tn/api/wishlist/add?userId=${userId}&eventId=${eventId}`, {
        method: 'POST' // selon ton API
      });

      if (res.ok) {
        // Optionnel : mettre à jour le state local pour refléter le changement
      } else {
        console.error('Erreur lors de l\'ajout à la wishlist');
      }
    } catch (err) {
      console.error(err);
    }
  }}
>
  <FavoriteBorderIcon sx={{ fontSize: 20, color: '#d62828' }} />
</Box>

<Box
  sx={{
    backgroundColor: 'white',
    borderRadius: '50%',
    p: 0.5,
    boxShadow: 1,
    cursor: 'pointer',
    '&:hover': { backgroundColor: '#f5f5f5' }
  }}
  onClick={onIgnore} // appel de la fonction
>
  <DoNotDisturbAltIcon sx={{ fontSize: 20, color: '#555' }} />
</Box>
  </Box>
              <Link href={`/detailsEvent?id=${data.id}`} passHref>

<Image src={`https://waw.com.tn${data.imageUrls[0]}`} alt={data.nom} />
    </Link>

</ImgWrapper>

      <Content>
        <InfoBar>
          <Rating>
            <StarIcon />
          </Rating>
<div className="flex items-center gap-2">
  {/* Like */}
  <ThumbUpIcon
    sx={{ fontSize: 20, color: '#555', cursor: 'pointer' }}
    onClick={() => handleVote(data.id, true)} // true = like
  />
  <span>{data.likes}</span>

  {/* Dislike */}
  <ThumbDownIcon
    sx={{ fontSize: 20, color: '#555', cursor: 'pointer' }}
    onClick={() => handleVote(data.id, false)} // false = dislike
  />
  <span>{data.dislikes}</span>
</div>
        </InfoBar>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: '#666' }}>
  <AccountCircleIcon sx={{ fontSize: 18, mr: 1 }} />
                <Link href={`/profile?id=${data.business.id}`} passHref>

  <Typography variant="caption">
    Publié par <b>{data.business.nom}</b>
  </Typography>
  </Link>
</Box>
        <Title>{data.nom}</Title>
        <Address>{data.ville},{data.ville}</Address>
        <PriceRow>
  <Price></Price>
  <Places></Places>
</PriceRow>


<Slider>
  {EventsForDay[0]?.extendedProps?.scheduleRange?.dailySchedules
    ?.filter(slot => {
      const selectedDate = new Date(EventsForDay[0].start);
      const now = new Date();

      // Si la date est aujourd'hui, exclure les horaires passés
      const isToday = selectedDate.toDateString() === now.toDateString();
      if (isToday) {
        const [slotH, slotM] = slot.startTime.split(":").map(Number);
        return slotH > now.getHours() || (slotH === now.getHours() && slotM >= now.getMinutes());
      }
        console.log(selectedHour);

      if (selectedHour) {
        const [selectedH, selectedM] = selectedHour.split(":").map(Number);
        const [slotH, slotM] = slot.startTime.split(":").map(Number);
        return slotH > selectedH || (slotH === selectedH && slotM >= selectedM);
      }

      return true; // Toutes les autres dates passent
    })
    .sort((a, b) => {
      const [aH, aM] = a.startTime.split(":").map(Number);
      const [bH, bM] = b.startTime.split(":").map(Number);
      return aH !== bH ? aH - bH : aM - bM; // trier par heure puis minute
    })
    .map((slot, i) => (
      <Slot
        key={i}
        selected={selectedSlot === i}
        onClick={() => {
          setSelectedEvent(data);    
          setSelectedSchedule(slot);
          openModal2();
        }}
      >
        {slot.startTime}
      </Slot>
    ))
  }
</Slider>

        {data.description && (
<Box
  sx={{
    maxHeight: 160,
    overflowY: 'auto',
    mt: 2,
    pr: 1,
    color: '#555',
    fontSize: 14,
    lineHeight: 1.5,
  }}
>
  {data.description}
</Box>
    )}
      </Content>
{isOpenModal1 && selectedSchedule && (
       
      <Modal isOpen={isOpenModal1} onClose={closeModal1} className="max-w-[700px] p-6">

  <h2 className="text-xl font-bold mb-4">
Événements du {dayjs(selectedDate).format("YYYY-MM-DD")}
  </h2>

  {/* Event details */}
    <div className="border rounded p-3 mb-4">
      <p className="font-semibold">
        🕒 {selectedSchedule.startTime} - {selectedSchedule.endTime}
      </p>
    </div>
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const reservationData = {
           event: {id:selectedEvent?.id},
           user: userId ? { id: userId } : null,
          eventId: selectedEvent?.id,
          date: selectedDate,
          dailyScheduleReservation: selectedSchedule,
        reservationFormulas: Object.entries(formulasNbr)
          .filter(([_, nbr]) => nbr > 0)
          .map(([id, nbr]) => ({ formula: { id }, nbr })),
        extrasReservation: Object.entries(extrasNbr)
          .filter(([_, nbr]) => nbr > 0)
          .map(([idx, nbr]) => {
            const extra = selectedEvent.extras[parseInt(idx)];
            return { titre: extra.titre, prix: extra.prix, nbr };
          }),
          nomClient: formData.get("nom"),
          email: formData.get("email"),
          telephone: formData.get("telephone"),
          commentaire: formData.get("remarque") || "",
          paymentMethods: formData.get("paymentMethod"),
          dateReservation: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
          nbrAdulte,
          nbrEnfant,
          nbrBebe,
          total,



   };

try {
  const res = await axios.post("https://waw.com.tn/api/reservations", reservationData);
  alert(res.data); 
  navigate("/");
} catch (err) {
  console.error(err);
  if (err.response && err.response.data) {
    alert(err.response.data);
  } else {
    alert("Erreur lors de la réservation.");
  }
}
      }}
      className="flex flex-col gap-4"
    >

          <div className="flex items-center justify-between border p-2 rounded">
            <span className="text-black">Prix Adulte : {selectedSchedule.prixAdulte} TND</span>
            <input type="number" min={0} value={nbrAdulte} onChange={e => setNbrAdulte(parseInt(e.target.value))} className="border p-1 rounded w-20 text-black"/>
          </div>

          {selectedEvent.accepteEnfants && (
            <div className="flex items-center justify-between border p-2 rounded">
              <span className="text-black">Prix Enfant : {selectedSchedule.prixEnfant} TND</span>
              <input type="number" min={0} value={nbrEnfant} onChange={e => setNbrEnfant(parseInt(e.target.value))} className="border p-1 rounded w-20 text-black"/>
            </div>
          )}
          {selectedEvent.accepteBebes && (
            <div className="flex items-center justify-between border p-2 rounded">
              <span className="text-black">Prix Bébé : {selectedSchedule.prixBebe} TND</span>
              <input type="number" min={0} value={nbrBebe} onChange={e => setNbrBebe(parseInt(e.target.value))} className="border p-1 rounded w-20 text-black"/>
            </div>
          )}
{selectedSchedule && selectedSchedule.formulas?.length > 0 && (
  <div className="mb-4">
    <p className="text-lg font-medium mb-2">Sélectionnez vos packs :</p>
    {selectedSchedule.formulas.map((f) => (
      <div
        key={f.id}
        onClick={() => {
          if (selectedFormulas.some(sf => sf.id === f.id)) {
            setSelectedFormulas(prev => prev.filter(sf => sf.id !== f.id));
          } else {
            setSelectedFormulas(prev => [...prev, f]);
          }
        }}
      >
        <div className="flex items-center justify-between border p-2 rounded text-black">
          <div>
            <p className="font-semibold text-black">{f.label} {f.price} DT ({f.nbr} places)</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              className="border p-1 rounded w-20 text-black"
              value={formulasNbr[f.id] || 0}
onChange={e => {
  const newNbr = parseInt(e.target.value, 10) || 0;

  const updated = { ...formulasNbr, [f.id]: newNbr }; // crée l’objet mis à jour
  setFormulasNbr(updated);

}}


            />
          </div>
        </div>
      </div>
    ))}
  </div>
)}
    <p className="text-lg font-medium mb-2">Sélectionnez vos extras :</p>
          {data.extras?.length > 0 && (
            <div>
              <p className="font-medium mb-2 text-black">Sélectionnez vos extras :</p>
              {data.extras.map((extra, idx) => (
                <div key={idx} className="flex items-center justify-between border p-2 rounded mb-2">
                  <span className="text-black">{extra.titre} {extra.prix} TND</span>
                  <input type="number" min={0} value={extrasNbr[idx]||0} onChange={e => {
                    const nbr = parseInt(e.target.value)||0;
                    setExtrasNbr(prev => ({...prev, [idx]: nbr}));
                  }} className="text-black border p-1 rounded w-20"/>
                </div>
              ))}
            </div>
          )}

  

<div>
  <label htmlFor="nom" className="block font-medium mb-1">Nom</label>
  <input
    type="text"
    id="nom"
    name="nom"
    required
    className="border p-2 rounded w-full"
    value={nom}
    onChange={(e) => setNom(e.target.value)}
  />
</div>

<div>
  <label htmlFor="email" className="block font-medium mb-1">Email</label>
  <input
    type="email"
    id="email"
    name="email"
    required
    className="border p-2 rounded w-full"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>

<div>
  <label htmlFor="telephone" className="block font-medium mb-1">Téléphone</label>
  <input
    type="text"
    id="telephone"
    name="telephone"
    required
    className="border p-2 rounded w-full"
    value={telephone}
    onChange={(e) => setTelephone(e.target.value)}
  />
</div>



      <div>
        <label htmlFor="paymentMethod" className="block font-medium mb-1">Type de paiement</label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          required
          className="border p-2 rounded w-full"
        >
          <option value="" disabled>Sélectionnez un mode de paiement</option>
          {(selectedEvent?.paymentMethods || []).map((method, i) => (
            <option key={i} value={method}>{method}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="remarque" className="block font-medium mb-1">Remarque</label>
        <textarea id="remarque" name="remarque" rows={3} className="border p-2 rounded w-full" />
      </div>
      {canConfirm && (

      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
        total : {total} TND Confirmer la réservation
      </button>
      )}

    </form>
</Modal>
)}


    </Card>

  );
}


  const [selectedId, setSelectedId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
const [openEventId, setOpenEventId] = useState(null); 

  // États filtres
  const [dateOpen, setDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateAnchorRef = useRef(null);

  const [hourOpen, setHourOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const hourAnchorRef = useRef(null);

  const [persOpen, setPersOpen] = useState(false);
  const [selectedPers, setSelectedPers] = useState(1);
  const persAnchorRef = useRef(null);

const [showBestOnly, setShowBestOnly] = useState(false);

const [events, setEvents] = useState([]);

  const [activite, setActivite] = useState("");
  const [categorie, setCategorie] = useState("");
  const [subCategorie, setSubCategorie] = useState("");
  const [rue, setRue] = useState("");

  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));
useEffect(() => {

  console.log(selectedDate);
  console.log(dayjs(selectedDate).format('DD MMMM YYYY'))
  }, [selectedDate]); 
useEffect(() => {
  const fetchEvents = async () => {
    try {
      const activite = searchParams.get("activite");
      const categorie = searchParams.get("categorie");
      const subCategorie = searchParams.get("subCategorie");
      const rue = searchParams.get("rue");
      const nom = searchParams.get("nom");
      const country = searchParams.get("country") || "";
      const selectedDatee = searchParams.get("selectedDate") || "";
      const minPrice = searchParams.get("minPrice") || 0;
      const maxPrice = searchParams.get("maxPrice") || 2000;
      
      if(selectedDatee === "tomorrow") {
        var date = new Date();
        date.setDate(date.getDate() + 1);
        setSelectedDate(date);
        console.log(selectedDate);
      }

      let response;
      const params = {};

      // If activity is selected, ONLY filter by activity
      if (activite) {
        params.activite = activite;
      } else {
        // Otherwise, apply all other filters
        if (categorie) params.categorie = categorie;
        if (subCategorie) params.subCategorie = subCategorie;
        if (rue) params.rue = rue;
        if (nom) params.nom = nom;
      }

      // Always apply price filters regardless
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      // IMPORTANT: Don't send date parameters when filtering by activity
      // This ensures the backend doesn't filter by date

      response = await axios.get("https://waw.com.tn/api/events/search", { params });
      console.log(params);

      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  fetchEvents();
}, [searchParams]);


  useEffect(() => {
    const handlePopState = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);





    const toggleDateOpen = () => {
    setDateOpen((v) => !v);
    setHourOpen(false);
    setPersOpen(false);
  };
  const toggleHourOpen = () => {
    setHourOpen((v) => !v);
    setDateOpen(false);
    setPersOpen(false);
  };
  const togglePersOpen = () => {
    setPersOpen((v) => !v);
    setDateOpen(false);
    setHourOpen(false);
  };

  const closeDatePopper = (event) => {
    if (dateAnchorRef.current && dateAnchorRef.current.contains(event.target)) return;
    setDateOpen(false);
  };
  const closeHourPopper = (event) => {
    if (hourAnchorRef.current && hourAnchorRef.current.contains(event.target)) return;
    setHourOpen(false);
  };
  const closePersPopper = (event) => {
    if (persAnchorRef.current && persAnchorRef.current.contains(event.target)) return;
    setPersOpen(false);
  };

const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = String(i + 1).padStart(2, "0"); // ajoute un 0 devant si < 10
  return `${hour}:00`;
});  const persons = Array.from({ length: 30 }, (_, i) => i + 1);
  const [anchorType, setAnchorType] = useState(null);
  const [anchorPrix, setAnchorPrix] = useState(null);
    const [anchorActivite, setAnchorActivite] = useState(null);

  const toggleType = (event) => {
    setAnchorType(anchorType ? null : event.currentTarget);
  };

  const togglePrix = (event) => {
    setAnchorPrix(anchorPrix ? null : event.currentTarget);
  };

    const toggleActivite = (event) => {
    setAnchorActivite(anchorActivite ? null : event.currentTarget);
  };

  const closeType = () => setAnchorType(null);
  const closePrix = () => setAnchorPrix(null);
    const closeActivite = () => setAnchorActivite(null);

  
  const typeOptions = ['Italienne', 'Française', 'Asiatique'];
  const [priceRange, setPriceRange] = React.useState([0, 3000]);
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };
  const [price, setPrice] = useState(50);
  const handleChange = (e) => {
    setPrice(e.target.value);
  };
    const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000);
  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= maxPrice) setMinPrice(value);
  };
  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= minPrice) setMaxPrice(value);
  };
  const openType = Boolean(anchorType);
  const openPrix = Boolean(anchorPrix);
  const openActivite = Boolean(anchorActivite);
   const [listActivites, setListActivites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
const [activityOnlyMode, setActivityOnlyMode] = useState(false);

  const inputRef = useRef();

  useEffect(() => {
    setLoading(true);
    fetch("https://waw.com.tn/api/activites/active")
      .then(res => res.json())
      .then(data => setListActivites(data))
      .catch(err => console.error("❌ Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

const [inputValue, setInputValue] = useState("");

// Filtered activities based on input
const filteredActivites = listActivites.filter((act) =>
  act.titre.toLowerCase().includes(inputValue.toLowerCase())
);


  const handleSelect = (act) => {
    setInputValue(act.titre);
      setActivityOnlyMode(!!act.titre);

    closeActivite();

  const url = new URL(window.location);
  url.searchParams.set("activite", act.titre);
  window.history.pushState({}, "", url);

    // Mettre à jour le state pour relancer useEffect
    setSearchParams(new URLSearchParams(url.search));

  };

const nativeDate = selectedDate?.toDate ? selectedDate.toDate() : selectedDate;
const selectedDateStr = selectedDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
const selectedDateOnly = new Date(nativeDate.getFullYear(), nativeDate.getMonth(), nativeDate.getDate());

const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

let selectedDayName;
if (nativeDate instanceof Date && !isNaN(nativeDate)) {
  selectedDayName = daysOfWeek[nativeDate.getDay()];
} else {
  selectedDayName = null;
}

const filteredEvents = events.filter(event => {
  if (activityOnlyMode) {
    return event.scheduleRanges?.some(range => {
      return range.dailySchedules?.some(ds => {
        const matchesPers = selectedPers != null && selectedPers > 1
          ? ds.formulas?.some(f => f.nbr === Number(selectedPers)) || ds.packs?.some(p => p.nbr === Number(selectedPers))
          : true;
        return matchesPers;
      });
    });
  }  if (inputValue && inputValue.trim() !== "") {
    // Just check if the event has ANY available schedules, regardless of date
    return event.scheduleRanges?.some(range => {
      return range.dailySchedules?.some(ds => {
        const matchesPers = selectedPers != null && selectedPers > 1
          ? ds.formulas?.some(f => f.nbr === Number(selectedPers)) || ds.packs?.some(p => p.nbr === Number(selectedPers))
          : true;

        return matchesPers;
      });
    });
  }

  // Otherwise, apply all filters (date, hour, person count)
  return event.scheduleRanges?.some(range => {
    const rangeStart = new Date(range.startDate);
    const rangeEnd = new Date(range.endDate);

    const inDateRange = selectedDateOnly >= rangeStart && selectedDateOnly <= rangeEnd;

    const notExcluded = !range.selectedExclureDates?.some(dateStr => {
      const exclDate = new Date(dateStr);
      return exclDate.getTime() === selectedDateOnly.getTime();
    });

    const daysOfWeek = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
    const selectedDayName = daysOfWeek[selectedDateOnly.getDay()];

    const inSelectedDays = range.selectedDays?.includes(selectedDayName);

    if (!(inDateRange && notExcluded && inSelectedDays)) return false;

    return range.dailySchedules?.some(ds => {
      const matchesPers = selectedPers != null && selectedPers > 1
        ? ds.formulas?.some(f => f.nbr === Number(selectedPers)) || ds.packs?.some(p => p.nbr === Number(selectedPers))
        : true;

      const matchesHour = selectedHour
        ? parseInt(ds.startTime.split(":")[0]) >= parseInt(selectedHour.split(":")[0])
        : true;

      // Exclude past hours if selected date is today
      const now = new Date();
      const isToday = now.toDateString() === selectedDateOnly.toDateString();
      let notPastHour = true;
      if (isToday) {
        const [dsHour, dsMinute] = ds.startTime.split(":").map(Number);
        notPastHour = dsHour > now.getHours() || (dsHour === now.getHours() && dsMinute >= now.getMinutes());
      }

      return matchesPers && matchesHour && notPastHour;
    });
  });
});




  return (
    <>
          <link
        href="https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap"
        rel="stylesheet"
      />
        <TopBar />
      <Navbar />
<StickyFilters>
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { 
        xs: 'repeat(2, 1fr)',  // 2 colonnes sur mobile
        sm: 'repeat(5, auto)'  // 5 colonnes sur desktop
      },
      gap: 2,
      width: '100%',
      alignItems: 'center'
    }}
  >
    <Button
      ref={dateAnchorRef}
      variant="outlined"
      startIcon={<CalendarMonthIcon />}
      sx={{
        textTransform: "none",
        fontWeight: 500,
        borderColor: "#e5e7eb",
        color: "#2a3944",
        borderRadius: "20px",
            fontSize: {
      xs: '0.8rem',  // Taille mobile (12px)
    },        gridColumn: {
        xs: '1 / -1', // Prend toute la largeur sur mobile (de la colonne 1 à la dernière)
        sm: 'auto'     // Comportement normal sur desktop
      },
        "&:hover": {
          backgroundColor: "black10",
          borderColor: "black"
        }
      }}
      onClick={toggleDateOpen}
    >
      {selectedDate ? dayjs(selectedDate).format('DD MMMM YYYY') : 'Date'}
    </Button>

    <Button
      ref={hourAnchorRef}
      variant="outlined"
      startIcon={<AccessTimeIcon />}
      sx={{
        textTransform: "none",
        fontWeight: 500,
        borderColor: "#e5e7eb",
        color: "#2a3944",
        borderRadius: "20px",
        "&:hover": {
          backgroundColor: "black10",
          borderColor: "black"
        }
      }}
      onClick={toggleHourOpen}
    >
      {selectedHour ?? "Heure"}
    </Button>

    <Button
      ref={persAnchorRef}
      variant="outlined"
      startIcon={<GroupIcon />}
      sx={{
        textTransform: "none",
        fontWeight: 500,
        borderColor: "#e5e7eb",
        borderRadius: "20px",
        color: "#2a3944",
        "&:hover": {
          backgroundColor: "black10",
          borderColor: "black"
        }
      }}
      onClick={togglePersOpen}
    >
      {selectedPers ?? "Pers."}
    </Button>

    <Button
      variant="outlined"
      sx={{
        textTransform: "none",
        fontWeight: 500,
        borderColor: inputValue ? "black" : "#e5e7eb",
        borderRadius: "20px",
        color: inputValue ? "#fff" : "#2a3944",
        backgroundColor: inputValue ? "black" : "transparent",
        "&:hover": {
          backgroundColor: inputValue ? "black" : "black10",
          borderColor: "black",
          color: inputValue ? "#fff" : "black",
        },
      }}
      onClick={toggleActivite}
    >
      {inputValue || "Activite"}
    </Button>

    <Button 
      variant="outlined"   
      sx={{
        textTransform: "none",
        fontWeight: 500,
        borderColor: "#e5e7eb",
        borderRadius: "20px",
        color: "#2a3944",

        "&:hover": {
          backgroundColor: "black10",
          borderColor: "black"
        }
      }} 
      onClick={togglePrix}
    >
      Prix
    </Button>
    </Box>
        {/* Popper Date */}
        <Popper
          open={dateOpen}
          anchorEl={dateAnchorRef.current}
          placement="bottom-start"
          style={{ zIndex: 1600 }}
        >
          <ClickAwayListener onClickAway={closeDatePopper}>
            <Paper sx={{ p: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                <DateCalendar
                  date={selectedDate}
                  onChange={(newDate) => {
                    setSelectedDate(newDate);
                    setDateOpen(false);
                  }}
                  minDate={dayjs()}
                />
              </LocalizationProvider>
            </Paper>
          </ClickAwayListener>
        </Popper>
        <Popper
          open={hourOpen}
          anchorEl={hourAnchorRef.current}
          placement="bottom-start"
          style={{ zIndex: 1600 }}
        >
          <ClickAwayListener onClickAway={closeHourPopper}>
            <Paper
              sx={{
                maxHeight: 250,
                overflowY: "auto",
                minWidth: 350,
                p: 1,
              }}
            >
              <Box
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 2,               
    padding: 2,         
    backgroundColor: "#fff",
    borderRadius: 2,  
  }}              >
  <Button
    variant="outlined"
    size="small"
    sx={{
      borderRadius: "25px",
      textTransform: "none",
      borderColor: "#e5e7eb",
      color: "#2a3944",
      backgroundColor: "transparent",
      padding: "2px 8px",
      "&:hover": {
        backgroundColor: "#f3f4f6",
      },
    }}
    onClick={() => {
      setSelectedHour(null); // clear the selection
      setHourOpen(false);    // close popper if desired
    }}
  >
    Tous
  </Button>
                {hours.map((h) => {
  const [hour] = h.split(":").map(Number);
  const now = new Date();
  const isToday = dayjs(selectedDate).isSame(dayjs(), "day");

  // Disable past hours only if the selected date is today
  const disabled = isToday && hour < now.getHours();

  return (
    <Button
      key={h}
      variant={selectedHour === h ? "contained" : "outlined"}
      size="small"
      disabled={disabled} 
      sx={{
        borderRadius: "25px",
        textTransform: "none",
        borderColor: "#e5e7eb",
        color: selectedHour === h ? "#fff" : "#2a3944",
        backgroundColor: selectedHour === h ? "black" : "transparent",
        padding: "2px 8px",
        "&:hover": {
          backgroundColor: disabled ? "transparent" : "black",
          color: disabled ? "#9ca3af" : "#fff",
          borderColor: disabled ? "#e5e7eb" : "black",
        },
      }}
      onClick={() => {
        setSelectedHour(h);
        setHourOpen(false);
      }}
    >
      {h}
    </Button>
  );
})}

              </Box>
            </Paper>
          </ClickAwayListener>
        </Popper>
        <Popper
          open={persOpen}
          anchorEl={persAnchorRef.current}
          placement="bottom-start"
          style={{ zIndex: 1600 }}
        >
          <ClickAwayListener onClickAway={closePersPopper}>
            <Paper
              sx={{
                maxHeight: 250,
                overflowY: "auto",
                minWidth: 350,
                p: 2,
              }}
            >
              <Box
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 2,             
    padding: 2,          
    backgroundColor: "#fff", 
    borderRadius: 2,    
  }} 
              >
  <Button onClick={() => setSelectedPers(Math.max(1, selectedPers - 1))}     
    sx={{
    width: { xs: '35px', sm: '40px' },
    height: { xs: '35px', sm: '40px' },
    fontSize: { xs: '2rem', sm: '1.5rem' },
    fontWeight: 'bold',
  }}>-</Button>
  <input
    type="number"
    min={1}
    max={100}
    value={selectedPers}
    onChange={(e) => setSelectedPers(Number(e.target.value))}
    style={{ width: "60px", textAlign: "center" }}
  />
  <Button onClick={() => setSelectedPers(Math.min(100, selectedPers + 1))}
    sx={{
    width: { xs: '35px', sm: '40px' },
    height: { xs: '35px', sm: '40px' },
    fontSize: { xs: '2rem', sm: '1.5rem' },
    fontWeight: 'bold',
  }}
  >+</Button>

              </Box>
            </Paper>
          </ClickAwayListener>
        </Popper>
        <Popper open={openType} anchorEl={anchorType} placement="bottom-start" style={{ zIndex: 1300 }}>
          <Paper>
            <ClickAwayListener onClickAway={closeType}>
              <MenuList>
                {typeOptions.map((option) => (
                  <MenuItem   sx={{
    color: "#333",
    "&:hover": {
      backgroundColor: "black10",
      color: "black"
    }
  }} key={option}>{option}</MenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>


     <Popper open={openActivite} anchorEl={anchorActivite} placement="bottom-start" style={{ zIndex: 1300 }}>
  <Paper               sx={{
                maxHeight: 350,
                overflowY: "auto",
                minWidth: 350,
                p: 1,
              }}> 
    <ClickAwayListener onClickAway={closeActivite}>
      <div>
        <TextField
          placeholder="Choisir une activité..."
          fullWidth
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setHighlightIndex(0); // reset highlight
          }}
        />

        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          <MenuList>
             <MenuItem
                  onClick={() => {
                    handleSelect({titre:""});
                  }}
                  sx={{
                    color: "#333",
                    "&:hover": {
                      backgroundColor: "black10",
                      color: "black",
                    },
                  }}
                >
Tous                </MenuItem>
            {loading && <MenuItem>Chargement...</MenuItem>}
            {!loading && filteredActivites.length === 0 && <MenuItem>Aucune activité</MenuItem>}
            {!loading &&
              filteredActivites.map((act, index) => (
                <MenuItem
                  key={act.id}
                  selected={highlightIndex === index}
                  onClick={() => {
                    handleSelect(act);
                    setInputValue(act.titre); // set input when selected
                  }}
                  sx={{
                    color: "#333",
                    "&:hover": {
                      backgroundColor: "black10",
                      color: "black",
                    },
                  }}
                >
                  {act.titre}
                </MenuItem>
              ))}
          </MenuList>
        </div>
      </div>
    </ClickAwayListener>
  </Paper>
</Popper>
      <Popper
  open={openPrix}
  anchorEl={anchorPrix}
  placement="bottom-start"
  style={{ zIndex: 1300, padding: 10, width: 350 }}
>
  <ClickAwayListener onClickAway={closePrix}>
    <Box
      sx={{
        width: 350,
        p: 2,
        bgcolor: "#fff",
        borderRadius: 2,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        fontFamily: "Arial",
        color: "#111",
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        Fourchette de prix
      </Typography>

      <Typography variant="body2" sx={{ mb: 1 }}>
        Prix : {minPrice} TND - {maxPrice} TND
      </Typography>

<RangeSlider
  value={[minPrice, maxPrice]}
  onChange={(e, newValue) => {
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);

    // ✅ mettre à jour l'URL
    const url = new URL(window.location);
    url.searchParams.set("minPrice", newValue[0]);
    url.searchParams.set("maxPrice", newValue[1]);
    window.history.pushState({}, "", url);

    // ✅ déclencher useEffect
    setSearchParams(new URLSearchParams(url.search));
  }}
  valueLabelDisplay="auto"
  min={0}
  max={3000}
  step={5}
  sx={{
    color: "black",
  }}
/>



    </Box>
  </ClickAwayListener>
</Popper>

      </StickyFilters>
<center style={{ textAlign: 'center', padding: '20px' }} >
  <Typography
    variant="h5"
    sx={{ 
      color: 'black', 
      fontWeight: 'bold',
      fontFamily: "Rock Salt",
      fontSize: { 
        xs: '1rem',  // Taille mobile (environ 20px)
      }
    }}
  >
    Explorez des expériences inoubliables
  </Typography>
</center>
  
      <Container>



        <ListWrapper>
          <HeaderBar>
<Box sx={{ display: 'flex', gap: 2 }}>
  <Button
    variant="contained"
    onClick={() => setShowBestOnly(true)}
    sx={{
      textTransform: "none",
      fontWeight: 500,
      borderColor: "black",
      color: showBestOnly ? "white" : "black",
      backgroundColor: showBestOnly ? "black" : "#f0f0f0",
      "&:hover": {
        backgroundColor: "black",
        color: "white",
        borderColor: "black"
      }
    }}
  >
    Meilleure offre
  </Button>

  <Button
    variant="contained"
    onClick={() => setShowBestOnly(false)}
    sx={{
      textTransform: "none",
      fontWeight: 500,
      borderColor: "black",
      color: !showBestOnly ? "white" : "black",
      backgroundColor: !showBestOnly ? "black" : "#f0f0f0",
      "&:hover": {
        backgroundColor: "black",
        color: "white",
        borderColor: "black"
      }
    }}
  >
    Voir tout
  </Button>
</Box>

  </HeaderBar>
{showBestOnly ? (
    <div
    style={{
      cursor: "pointer",
      borderRadius: 15,
    }}
  >
    <EventCardBest
      data={filteredEvents[0]} // meilleure offre
      selectedSlot={selectedSlot}
      onSelectSlot={setSelectedSlot}
 onIgnore={() => {
    setEvents(prev =>
      prev.filter(r => r.id !== filteredEvents[0].id)
    );
  }}
    />
        <div style={{ marginTop: 10, textAlign: "center", color: "black", fontWeight: "bold" }}>
{filteredEvents.length ?? 0} activités restants
    </div>
  </div>
) : (
filteredEvents.map((rest) => (
  <div key={rest.id} style={{ cursor: "pointer", borderRadius: 15 }}>
    <EventCard
      data={rest}
      selectedSlot={rest.id === openEventId ? selectedSlot : null}
      onSelectSlot={setSelectedSlot}
      isOpen={openEventId === rest.id}
      onOpen={() => setOpenEventId(rest.id)}  // << pass this
      onClose={() => setOpenEventId(null)}    // << pass this
      onIgnore={() => setEvents(prev => prev.filter(r => r.id !== rest.id))}
    />
  </div>
))
)}
        </ListWrapper>
                <MapWrapper class="z-[50]">
<MapContainer
  center={[33.8869, 9.5375]}
  zoom={5.5}
  scrollWheelZoom={false}
  style={{ height: "100%", width: "100%" }}
>
  <TileLayer
    attribution='&copy; OpenStreetMap'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  {filteredEvents.map((m) => (
<Marker key={m.id} position={[m.latitude, m.longitude]} >
<Popup>
  <div >
    <Link href={`/detailsEvent?id=${m.id}`} passHref>
      <img 
        src={`https://waw.com.tn${m.imageUrls[0]}`}
        alt={m.nom} 
        style={{ width: 150, objectFit: "cover", borderRadius: 8 }}
      />
    </Link>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <b>{m.nom}</b>
      <Link href={`/profile?id=${m.business.id}`} passHref>
        <span style={{ color: "black", marginTop: 4 }}>{m.business.nom}</span>
      </Link>
    </div>
  </div>
</Popup>


    </Marker>
  ))}
</MapContainer>
        </MapWrapper>
      </Container>
            <Footer />

    </>
  );
}
