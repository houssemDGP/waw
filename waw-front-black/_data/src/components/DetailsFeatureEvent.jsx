import React, { useState, useEffect, useRef,useMemo  } from 'react';
import styled from 'styled-components';
import { VerifiedOutlined, EnergySavingsLeafOutlined, LocationOn as LocationOnIcon, Star as StarIcon, ArrowBackIos, ArrowForwardIos, Close } from "@mui/icons-material";
import { DateCalendar, PickersDay } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AvisVoyageurs from "../components/AvisVoyageurs";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { Grid } from "@mui/material";
import axios from 'axios';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from "react-router-dom";

import {
  ChildFriendly,
  BabyChangingStation,
  AccessibilityNew,
  Pets,
  Block,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,Link,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
dayjs.locale('fr');

const Container = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 30px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  flex: 3;
`;
const RightStickyColumn = styled.div`
  flex: 1;
  position: sticky;
  top: 10px;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #ddd;
  height: fit-content;

  @media screen and (max-width: 768px) {
    position: static;
  }
`;
const TitleSection = styled.h5`
  color:black;
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
      color: black;
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
  background-color: #FF7900;
  color: #fff;
  border: none;
  font-weight: bold;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #FF7900;
  }
`;
const StyledDialogTitle = styled(DialogTitle)`
  color: black;
  font-weight: 1000 !important;
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

const StyledFormHelperText = styled(FormHelperText)`
  color: black !important;
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

const StyledButtonOutlined = styled(Button)`
  && {
    border-color: #FF7900;
    color: black;
    &:hover {
      background-color: #FF7900;
      color: white;
      border-color: #FF7900;
    }
  }
`;

const StyledButtonContained = styled(Button)`
  && {
    background-color: black;
    color: white;
    &:hover {
      background-color: black;
    }
  }
`;

const StyledRadioGroup = styled(RadioGroup)`
  && .Mui-checked {
    color: black;
  }
`;

const BottomStickyBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
    @media (max-width: 639px) {
    font-size: 0.875rem; 
    padding: 4px 10px;

}
`;

// === HOTEL DETAILS STYLE ===

const DetailsContainer = styled.div`
  /* border: 1px solid blue; */
`;

const BoxBtnContainer = styled.div`
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
  background-color: #f2f2f2;
  color: #262626;
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
  button {
    background-color: #FF7900;
    color: white;
    font-size: 15px;
    font-weight: 600;
    width: 130px;
    padding: 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      background-color: black;
    }
  }
`;

const AddressContainer = styled.div`
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

const ImagesContainer = styled.div``;

const BigMedImgContainer = styled.div`
  display: flex;
`;

const MedImgContainer = styled.div`
  flex: 0.5;

  div {
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
  flex: 2.5;
  margin: 0px 0px 10px 10px;
  overflow: hidden;

  @media screen and (max-width: 426px) {
    height: 270px;
    margin: 0px 0px 5px 5px;
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
`;

const SamllImgContainer = styled.div`
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
const Slider = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;          // Slider au-dessus de tout
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Slides = styled.div`
  position: relative;
  width: 80%;
  max-width: 1200px;
  height: 80%;
  max-height: 80vh;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 15px 12px rgba(0,0,0,0.45);
  background-color: #000;

  @media (max-width: 1024px) {
    width: 90%;
    height: 75%;
  }

  @media (max-width: 770px) {
    width: 95%;
    height: 85%;
  }

  @media (max-width: 426px) {
    width: 98%;
    height: 90%;
  }

  img, video, iframe {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .arrow-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    font-size: 36px;
    cursor: pointer;
    z-index: 10000;       // Au-dessus de l’image/vidéo
    transition: color 0.2s;

    &:hover {
      color: #2874f0;
    }

    @media (max-width: 770px) { font-size: 30px; }
    @media (max-width: 426px) { font-size: 26px; }
  }

  .left { left: 10px; }
  .right { right: 10px; }

  .close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 36px;
    padding: 5px;
    border-radius: 50%;
    background-color: white;
    color: black;
    cursor: pointer;
    z-index: 10000;       // Toujours au-dessus
    transition: all 0.2s;

    &:hover {
      background-color: #2874f0;
      color: white;
    }

    @media (max-width: 770px) { font-size: 32px; top: 8px; right: 8px; }
    @media (max-width: 426px) { font-size: 28px; top: 5px; right: 5px; padding: 4px; }
  }
`;


const HotelFeature = () => {


function CustomDay({ day, selected, calendarEvents = [], onClickDay, ...other }) {
  const dateStr = day.format('YYYY-MM-DD');
  const eventsForDay = calendarEvents.filter(e => e.start === dateStr);
  const isAvailable = eventsForDay.length > 0;

  return (
    <div
      style={{ position: 'relative', cursor: isAvailable ? 'pointer' : 'default' }}
      onClick={() => isAvailable && onClickDay?.(day)}
    >
      <PickersDay
        {...other}
        day={day}
        selected={selected}
        disabled={!isAvailable}
        sx={{
          '& .MuiTypography-root': {
            fontWeight: day.isSame(selected, 'day') ? 700 : 400,
          },
          ...(!isAvailable && {
            opacity: 0.4,
            pointerEvents: 'none',
          }),
        }}
      />

      {eventsForDay.map((event, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: 6 + i * 6,
            left: '10%',
            right: '10%',
            height: 4,
            backgroundColor: event.extendedProps.isException ? 'red' : 'black',
            borderRadius: 2,
          }}
          title={event.title}
        />
      ))}
    </div>
  );
}


    const handleDateSelect = (selectInfo) => {
            console.log(selectInfo);

    setSelectedDate(selectInfo.startStr);
    setSelectedEvent(null);
    setSelectedSchedule(null);
    setSelectedFormula(null);
  };
const handleEventClick = (clickInfo) => {
  // Determine the date string
  const eventDateStr = clickInfo.event.startStr || clickInfo.event.start;

  if (!eventDateStr) {
    console.warn("Event has no valid start date:", clickInfo.event);
    return;
  }

  console.log(eventDateStr);
  setSelectedDate(eventDateStr);
  setSelectedEvent(clickInfo.event);
  setSelectedSchedule(null);
  setSelectedFormula(null);
};

  // === LeftColumn state for image slider & hotel data ===
  const [openSlider, setOpenSlider] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [peopleCount, setPeopleCount] = useState(1);
  const [comments, setComments] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [nbrAdulte, setNbrAdulte] = useState(0);
  const [nbrEnfant, setNbrEnfant] = useState(0);
  const [nbrBebe, setNbrBebe] = useState(0);
const [extrasNbr, setExtrasNbr] = useState({});
  const [formulasNbr, setFormulasNbr] = useState({});


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

  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (!selectedSchedule) return;
    const formulesTotal = (selectedSchedule.formulas || []).reduce((sum, f) => {
      const nbr = formulasNbr[f.id] || 0;
      return sum + nbr * f.price;
    }, 0);

const extrasTotal = (event?.extras || []).reduce((sum, extra, idx) => {
  const qty = extrasNbr[idx] || 0;
  return sum + qty * (extra?.prix || 0);
}, 0);
      console.log(extrasNbr);

    const totalCalc =
      (nbrAdulte * (selectedSchedule.prixAdulte || 0)) +
      (nbrEnfant * (selectedSchedule.prixEnfant || 0)) +
      (nbrBebe * (selectedSchedule.prixBebe || 0)) +
      formulesTotal +
      extrasTotal;
    setTotal(totalCalc);
  }, [nbrAdulte, nbrEnfant, nbrBebe, formulasNbr, extrasNbr, selectedSchedule, selectedEvent]);
  const canConfirm = nbrAdulte > 0 || Object.values(formulasNbr).some(n => n > 0);

  const [peopleNames, setPeopleNames] = useState(['']);
  const [isFavorite, setIsFavorite] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("sur_place");
  const [paymentPercentage, setPaymentPercentage] = useState(30);
const [videoSlideNumber, setVideoSlideNumber] = useState(0);
const [openVideoSlider, setOpenVideoSlider] = useState(false);
const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [selectedPack, setSelectedPack] = useState(null);
    const [selectedFormulas, setSelectedFormulas] = useState([]);

     const [minPrix, setMinPrix] = useState(0);

  const eventsOfTheDay = calendarEvents.filter((ev) => ev.start === selectedDate);

  const rightColumnRef = useRef(null);
    const { isOpen, openModal, closeModal } = useModal();

const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const [isDateAvailable, setIsDateAvailable] = useState(false);
const isDateBetween = (target, start, end) => {
  const t = new Date(target).getTime();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return t >= s && t <= e;
};
const [loading, setLoading] = useState(true); // ← nouvel état
function generateCalendarEventsFromEvent(event) {
  const calendarEvents = [];
  const exceptionDatesSet = new Set();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to start of today

  const getMinPrixAdulte = (schedules) => {
    if (!schedules || schedules.length === 0) return null;
    return Math.min(...schedules.map(s => s.prixAdulte || Infinity));
  };

  // Handle scheduleRangeExceptions
  (event.scheduleRangeExceptions || []).forEach((range) => {
    const selectedDays = range.selectedDays || [];
    const exclureDatesSet = new Set(range.selectedExclureDates || []);
    let current = new Date(range.startDate);
    const rangeEnd = new Date(range.endDate);

    while (current <= rangeEnd) {
      // ✅ Skip past dates
      if (current < today) {
        current.setDate(current.getDate() + 1);
        continue;
      }

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
      // ✅ Skip past dates
      if (current < today) {
        current.setDate(current.getDate() + 1);
        continue;
      }

      const dayStr = current.toISOString().split("T")[0];
      const dayName = dayNames[current.getDay()];
      const key = `${event.id}-${dayStr}`;

      if (
        selectedDays.includes(dayName.toUpperCase()) &&
        !exclureDatesSet.has(dayStr) &&
        !exceptionDatesSet.has(key)
      ) {
        const minPrix = getMinPrixAdulte(range.dailySchedules);
        setMinPrix(minPrix);

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

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
  const [mainImage, setMainImage] = useState();

const [event, setEvent] = useState([]);
useEffect(() => {
  const eventF = async () => {
    try {
      setLoading(true); // ← début du chargement
      const response = await axios.get(`https://waw.com.tn/api/events/event/${id}`);
      setEvent(response.data);
      setMainImage(response.data.imageUrls[0]);
      setCalendarEvents(generateCalendarEventsFromEvent(response.data));
    } catch (error) {
      console.error("Failed to fetch event:", error);
    } finally {
      setLoading(false); // ← fin du chargement
    }
  };
  eventF();
}, []);



  // Slider handlers
  const handleOpenSlider = (index) => {
    setSlideNumber(index);
    setOpenSlider(true);
  };

  const handleCloseSlider = () => {
    setOpenSlider(false);
  };

  const handlePrev = () => {
    setSlideNumber(slideNumber === 0 ? hotel[0].img.length - 1 : slideNumber - 1);
  };

  const handleNext = () => {
    setSlideNumber(slideNumber === hotel[0].img.length - 1 ? 0 : slideNumber + 1);
  };

  // Submit handler for reservation confirmation
  const handleSubmit = () => {
    if (!canReserve) {
      alert('Veuillez remplir tous les champs correctement.');
      return;
    }
    setModalOpen(true);
  };

const renderSchedulesAndFormulas = (event) => {
  if (!selectedDate) return null;
  const eventData = event.extendedProps.eventData;
  const selected = selectedDate;
  const selectedDayName = dayNames[new Date(selected).getDay()].toUpperCase();

  // 1. Vérifier s’il y a une exception applicable
  const exceptionRange = (eventData.scheduleRangeExceptions || []).find((range) =>
    isDateBetween(selected, range.startDate, range.endDate) &&
    range.selectedDays.includes(selectedDayName) &&
    !(range.selectedExclureDates || []).includes(selected)
  );

  if (exceptionRange) {
    return exceptionRange.dailyScheduleExceptions?.map((s, idx) => (
      <div key={idx} className="border p-3 rounded mb-2 bg-yellow-50">
        <p className="font-semibold">🕒 {s.startTime} - {s.endTime}</p>
        {(s.formulas || []).map((f, i) => (
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

      </div>
    ));
  }

  // 2. Sinon, chercher une plage normale
  const normalRange = (eventData.scheduleRanges || []).find((range) =>
    isDateBetween(selected, range.startDate, range.endDate) &&
    range.selectedDays.includes(selectedDayName) &&
    !(range.selectedExclureDates || []).includes(selected)
  );

  if (!normalRange) {
    return <p className="text-gray-500">Aucun horaire disponible ce jour-là</p>;
  }

  return normalRange.dailySchedules?.map((s, idx) => (
    <div key={idx} className="border p-3 rounded mb-2">
      <p className="font-semibold">🕒 {s.startTime} - {s.endTime}</p>
      <strong>formules</strong>
      {(s.formulas || []).map((f, i) => (
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
      <strong>Packs</strong>
            {(s.packs || []).map((f, i) => (
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
    </div>
  ));
};
const renderSchedules = (event) => {
  if (!selectedDate) return null;
  const eventData = event.extendedProps.eventData;
  const selected = selectedDate;
  const selectedDayName = dayNames[new Date(selected).getDay()].toUpperCase();

  // 1. Vérifier s’il y a une exception applicable
  const exceptionRange = (eventData.scheduleRangeExceptions || []).find((range) =>
    isDateBetween(selected, range.startDate, range.endDate) &&
    range.selectedDays.includes(selectedDayName) &&
    !(range.selectedExclureDates || []).includes(selected)
  );

  if (exceptionRange) {
    return exceptionRange.dailyScheduleExceptions?.map((s, idx) => (
      <div key={idx} className="border p-3 rounded mb-2 bg-yellow-50">
        <p className="font-semibold">🕒 {s.startTime} - {s.endTime}</p>
        {(s.formulas || []).map((f, i) => (
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

      </div>
    ));
  }

  // 2. Sinon, chercher une plage normale
const normalRange = (eventData.scheduleRanges || []).find(
  (range) =>
    isDateBetween(selected, range.startDate, range.endDate) &&
    range.selectedDays.includes(selectedDayName) &&
    !(range.selectedExclureDates || []).includes(selected)
);

if (!normalRange) {
  return <p className="text-gray-500">Aucun horaire disponible ce jour-là</p>;
}

// Check if selected date is today
const now = new Date();
const isToday =
  new Date(selected).toDateString() === now.toDateString();

const filteredSchedules = normalRange.dailySchedules?.filter((s) => {
  if (!isToday) return true; // keep all schedules for other days

  const [hour, minute] = s.startTime.split(":").map(Number);
  return hour > now.getHours() || (hour === now.getHours() && minute >= now.getMinutes());
});

if (!filteredSchedules.length) {
  return <p className="text-gray-500">Aucun horaire disponible ce jour-là</p>;
}

return filteredSchedules
  .sort((a, b) => a.startTime.localeCompare(b.startTime))
  .map((s, idx) => (
    <div
      key={idx}
      className="border p-3 rounded mb-2 cursor-pointer hover:bg-[black] hover:text-white"
      onClick={() => {
        setSelectedEvent(event);
        setSelectedSchedule(s);
        setIsFormulaModalOpen(true); // ✅ Open your modal
      }}
    >
      <p className="font-semibold">🕒 {s.startTime} - {s.endTime}</p>
    </div>
  ));



};
const BASE_URL = "https://waw.com.tn";

const allMedia = [];

// 1️⃣ Ajouter les images locales
if (event.imageUrls && event.imageUrls.length > 0) {
  event.imageUrls.forEach(imgPath => {
    allMedia.push({
      type: "image",
      src: BASE_URL + imgPath,
      alt: event.business?.nom || "Image",
    });
  });
}

// 2️⃣ Ajouter les vidéos locales (MP4)
if (event.videoUrls && event.videoUrls.length > 0) {
  event.videoUrls.forEach(videoPath => {
    allMedia.push({
      type: "video",
      src: BASE_URL + videoPath,
      format: "mp4",
    });
  });
}

// 3️⃣ Ajouter les vidéos Instagram
if (event.videosInstagram && event.videosInstagram.length > 0) {
  event.videosInstagram.forEach(instaUrl => {
    allMedia.push({
      type: "video",
      src: instaUrl,
      platform: "instagram",
    });
  });
}

// 4️⃣ Ajouter les vidéos YouTube
if (event.videosYoutube && event.videosYoutube.length > 0) {
  event.videosYoutube.forEach(link => {
    const embedLink = link.includes("watch?v=") ? link.replace("watch?v=", "embed/") : link;
    allMedia.push({
      type: "video",
      src: embedLink,
      platform: "youtube",
    });
  });
}
const extractInstagramId = (url) => {
  const match = url.match(/\/p\/([^\/]+)/);
  return match ? match[1] : null;
};
const navigate = useNavigate();

  return (
      loading ? (
    <div>Chargement...</div>
  ) : (
    <Container>
      {/* LEFT COLUMN: Hotel details and images */}
      <LeftColumn>
        <DetailsContainer>
          {openSlider && (
            <Slider>
              <Slides>
                <ArrowBackIos className="arrow-icon left" onClick={handlePrev} />
                <ArrowForwardIos className="arrow-icon right" onClick={handleNext} />
                <Close className="close-icon" onClick={handleCloseSlider} />
                <img src={`https://waw.com.tn${event.imageUrls[0]}`} alt={`slide ${slideNumber + 1}`} />
              </Slides>
            </Slider>
          )}


<AddressContainer>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <h1 style={{ fontWeight: "bold", fontSize: "25px" }}>{event.nom}</h1>
    <span style={{  fontWeight: "bold",fontSize: "15px" }}>A partir de {minPrix} TND</span>
  </div>
</AddressContainer>
        <BigMedImgContainer>
          <MedImgContainer>
            {event.imageUrls.slice(0, 2).map((imgUrl, index) => (
              <div key={index}>
                <img
                src={`https://waw.com.tn${imgUrl}`}

                  alt={`med-${index}`}
                  onClick={() => setMainImage(imgUrl)}
                />
              </div>
            ))}
{event.imageUrls.slice(2, 3).map((imgUrl, index) => (
  <div
    key={index + 3}
    onClick={() => handleOpenSlider(index + 3)}
    style={{
      position: 'relative',
      cursor: 'pointer',
      width: '100%',
      height: '90px', // Adjust as needed
      backgroundImage: `url(https://waw.com.tn${imgUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '8px',
      overflow: 'hidden',
    }}
  >
    {/* Overlay */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '16px',
      }}
    >
      Plus de medias    </div>
  </div>
))}

          </MedImgContainer>

          <BigImgContainer>
            <img
              src={`https://waw.com.tn${mainImage}`}
              alt="big-img"
              onClick={() => handleOpenSlider(event.imageUrls.indexOf(mainImage))}
            />
          </BigImgContainer>
        </BigMedImgContainer>

{openSlider && (
  <Slider>
    <Slides>
      <ArrowBackIos
        className="arrow-icon left"
        onClick={() =>
          setSlideNumber(prev => (prev === 0 ? allMedia.length - 1 : prev - 1))
        }
      />
      <ArrowForwardIos
        className="arrow-icon right"
        onClick={() =>
          setSlideNumber(prev => (prev === allMedia.length - 1 ? 0 : prev + 1))
        }
      />
      <Close className="close-icon" onClick={() => setOpenSlider(false)} />

      <div
        style={{
          width: "80%",
          maxWidth: "900px",
          height: "60vh",
          maxHeight: "600px",
          borderRadius: "12px",
          overflow: "hidden",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
        }}
      >
        {allMedia[slideNumber].type === "image" ? (
          <img
            src={allMedia[slideNumber].src}
            alt={allMedia[slideNumber].alt}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
          />
) : allMedia[slideNumber].platform === "instagram" ? (
  <iframe
    src={`https://www.instagram.com/p/${extractInstagramId(allMedia[slideNumber].src)}/embed`}
    width="100%"
    height="100%"
    frameBorder="0"
    allowTransparency={true}
    allow="encrypted-media"
    style={{ borderRadius: "12px" }}
    title={`Instagram video ${slideNumber + 1}`}
  />
) : allMedia[slideNumber].platform === "youtube" ? (
          <iframe
            width="100%"
            height="100%"
            src={allMedia[slideNumber].src}
            title={`Vidéo ${slideNumber + 1}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "12px" }}
          />
        ) : (
          <video
            width="100%"
            height="100%"
            controls
            style={{ borderRadius: "12px", objectFit: "cover" }}
          >
            <source src={allMedia[slideNumber].src} type="video/mp4" />
          </video>
        )}
      </div>
    </Slides>
  </Slider>
)}

            <p>
              <LocationOnIcon className="location-icon" /> {event.rue}
            </p>
                      <DescriptionBlock>
            <TitleSection>Description </TitleSection>
            <p>{event.description}</p>
          </DescriptionBlock>
          <TitleSection>Plus d'informations</TitleSection>
          <FeatureGrid>
  {event.accepteEnfants ? (
          <div><ChildFriendly className="feature-icon" /> Enfants acceptés (dès {event.ageMinimum} ans)</div>
        ) : (
          <div><Block className="feature-icon" /> Enfants non acceptés</div>
        )}

        {event.accepteBebes ? (
          <div><BabyChangingStation className="feature-icon" /> Bébés acceptés</div>
        ) : (
          <div><Block className="feature-icon" /> Bébés non acceptés</div>
        )}

        {event.animaux ? (
          <div><Pets className="feature-icon" /> Animaux acceptés</div>
        ) : (
          <div><Block className="feature-icon" /> Animaux non acceptés</div>
        )}

        {event.mobiliteReduite ? (
          <div><AccessibilityNew className="feature-icon" /> Accessible PMR</div>
        ) : (
          <div><Block className="feature-icon" /> Non accessible PMR</div>
        )}          </FeatureGrid>
                            <TitleSection>Langues</TitleSection>
          <FeatureGrid>

        {event.languages && event.languages.length > 0 && (
          <div>

            <VerifiedOutlined className="feature-icon" /> {event.languages.join(", ")}
          </div>
        )}
                  </FeatureGrid>
          <TitleSection>Ce qui est inclus</TitleSection>
          <FeatureGrid>
                      {event.includedEquipments.map((inclus, index) => (
            <div><VerifiedOutlined className="feature-icon" />{inclus}</div>

            ))}
        </FeatureGrid>

          <FeatureGrid>
                                  {event.nonInclus.map((inclus, index) => (
            <div><Block className="feature-icon" />{inclus}</div>

            ))}


          </FeatureGrid>
                                  <TitleSection>Ce qui est extras</TitleSection>
          <FeatureGrid>
              {event.extras.map(extra => (
            <div><VerifiedOutlined className="feature-icon" />{extra.titre} — {extra.prix}TND</div>

            ))}
        </FeatureGrid>      
          <TitleSection>Tags</TitleSection>
          <BoxBtnContainer>
            <BoxesContainer>
                    {/*               <Box2>
                <StarIcon className="star-icon" />
              </Box2> */}


{/* Afficher le titre de l'activité si elle existe */}
{event.activite?.titre && <Box5>{event.activite.titre}</Box5>}

{/* Afficher toutes les catégories */}
{event.categories?.length > 0 &&
  event.categories.map((cat) => (
    <Box5 key={cat.id}>{cat.nom}</Box5>
  ))}

{/* Afficher toutes les sous-catégories */}
{event.subCategories?.length > 0 &&
  event.subCategories.map((sub) => (
    <Box5 key={sub.id}>{sub.nom}</Box5>
  ))}

            </BoxesContainer>
            <BtnContainer>
                      {/* <button>Réserver</button> */}
            </BtnContainer>
          </BoxBtnContainer>


          <AvisVoyageurs />
        </DetailsContainer>
      </LeftColumn>

      <RightStickyColumn ref={rightColumnRef}>

             {/* 
  <FullCalendar
         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          events={calendarEvents}
          height="auto"
        /> */}
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">

<DateCalendar
  date={selectedDate}
  onChange={(newDate) => {
    setSelectedDate(newDate);
    setSelectedTime(null);

    if (handleDateSelect) {
      handleDateSelect({
        startStr: newDate.startOf('day').toDate(),
        end: newDate.endOf('day').toDate(),
      });
    }
  }}
  minDate={dayjs()}
  slots={{
    day: (props) => (
      <CustomDay
        {...props}
        calendarEvents={calendarEvents}
        onClickDay={(day) => {
          const startStr = day.format('YYYY-MM-DD');
          const eventForDay = calendarEvents.find(e => e.start === startStr);
          if (eventForDay) {
            handleEventClick({ event: eventForDay });
            handleEventClick({ event: eventForDay });

          }
        }}
      />
    ),
  }}

/>


</LocalizationProvider>
        {eventsOfTheDay.length > 0 ? (
          eventsOfTheDay.map((ev) => (
            <div key={ev.id} className="border rounded p-3 mb-2">
              {renderSchedules(ev)}
            </div>
          ))
        ) : (
          <p>Aucun événement ce jour-là.</p>
        )}
   {selectedSchedule && (
       
<Modal
  isOpen={isFormulaModalOpen}
  onClose={() => {
    setIsFormulaModalOpen(false);
    setSelectedSchedule(null);
    setSelectedEvent(null);
    setSelectedFormulas([]);
  }}
  className="max-w-[700px] p-6"
>
  <h2 className="text-xl font-bold mb-4">
    Événements du {selectedDate}
  </h2>

  {/* Event details */}
  {selectedEvent && (
    <div className="border rounded p-3 mb-4">
      <p className="font-semibold">
        🕒 {selectedSchedule.startTime} - {selectedSchedule.endTime}         {selectedSchedule.label}

      </p>
    </div>
  )}
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const reservationData = {
                           user: localStorage.getItem("userId")
    ? { id: parseInt(localStorage.getItem("userId")) }
    : null,
          event: {id:selectedEvent?.extendedProps?.eventData?.id},
          eventId: selectedEvent?.extendedProps?.eventData?.id,
          date: selectedDate,
          dailyScheduleReservation: selectedSchedule,
reservationFormulas: selectedFormulas
  .filter(f => (formulasNbr[f.id] || 0) > 0) // ne garder que nbr > 0
  .map(f => ({
    formula: { id: f.id },
    nbr: formulasNbr[f.id],
  })),
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
extrasReservation: Object.entries(extrasNbr)
  .filter(([index, nbr]) => nbr > 0)
  .map(([index, nbr]) => {
    const extra = event.extras[parseInt(index)]; // now index matches array position
    return {
      titre: extra.titre,
      prix: extra.prix,
      nbr: nbr,
    };
  }), 


   };

try {
  const res = await axios.post("https://waw.com.tn/api/reservations/new", reservationData);
  console.log("Réservation créée:", res.data);

  // Vérifier si la réservation a été créée avec succès
  if (!res.data.success) {
    alert("Erreur lors de la création de la réservation: " + res.data.errorMessage);
    return;
  }

  const reservationId = res.data.reservationId;

  if (reservationData.paymentMethods === "Carte bancaire") {
    alert("Paiement par carte bancaire sélectionné. Redirection vers la page de paiement...");
    
    // 2. Préparer la requête de paiement
    const paymentRequest = {
      orderNumber: reservationId.toString(), // Utiliser l'ID de réservation comme numéro de commande
      amount: reservationData.total // Montant de la réservation
    };

    console.log("Requête de paiement:", paymentRequest);

    // 3. Initialiser le paiement
    const paymentResponse = await axios.post(
      "https://waw.com.tn/api/payment/clictopay/initiate", 
      paymentRequest
    );

    console.log("Réponse paiement:", paymentResponse.data);

    if (paymentResponse.data.success && paymentResponse.data.paymentUrl) {
      // 4. Rediriger vers la page de paiement
      window.location.href = paymentResponse.data.paymentUrl;
    } else {
      alert("Erreur lors de l'initialisation du paiement: " + 
            (paymentResponse.data.errorMessage || "Erreur inconnue"));
    }

  } else {
    alert("Réservation créée avec succès! ID: " + reservationId);
  }
  setIsFormulaModalOpen(false);
  setSelectedSchedule(null);
  setSelectedEvent(null);
  setSelectedFormulas([]);
  //navigate("/");
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
  {/* Formules selection */}
        <div className="flex items-center justify-between border p-2 rounded text-black">
        <div>
          <p className="font-semibold text-black">Prix Adulte :  {selectedSchedule.prixAdulte} TND</p>
        </div>
        <div className="flex items-center gap-2">
          <label>Nombre</label>
            <input type="number" min={0} value={nbrAdulte} onChange={e => setNbrAdulte(parseInt(e.target.value))} className="border p-1 rounded w-20 text-black"/>

        </div>
      </div>
      {event.accepteEnfants&&
              <div className="flex items-center justify-between border p-2 rounded text-black">
        <div>
          <p className="font-semibold text-black">Prix Enfant :  {selectedSchedule.prixEnfant} TND</p>
        </div>
        <div className="flex items-center gap-2">
          <label>Nombre</label>
              <input type="number" min={0} value={nbrEnfant} onChange={e => setNbrEnfant(parseInt(e.target.value))} className="border p-1 rounded w-20 text-black"/>

        </div>
      </div>}
            {event.accepteBebes&&
<>
              <div className="flex items-center justify-between border p-2 rounded text-black">
        <div>
          <p className="font-semibold text-black">Prix Bebe :  {selectedSchedule.prixBebe} TND</p>
        </div>
        <div className="flex items-center gap-2">
          <label>Nombre</label>
              <input type="number" min={0} value={nbrBebe} onChange={e => setNbrBebe(parseInt(e.target.value))} className="border p-1 rounded w-20 text-black"/>

        </div>
      </div>
</>
    }
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

          {event.extras?.length > 0 && (
            <div>
              <p className="font-medium mb-2 text-black">Sélectionnez vos extras :</p>
              {event.extras.map((extra, idx) => (
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
          {(selectedEvent?.extendedProps?.eventData?.paymentMethods || []).map((method, i) => (
            <option key={i} value={method}>{method}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="remarque" className="block font-medium mb-1">Remarque</label>
        <textarea id="remarque" name="remarque" rows={3} className="border p-2 rounded w-full" />
      </div>

      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
        Total : {total} TND Confirmer la réservation
      </button>
    </form>
</Modal>
)}


              <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6">
        <h2 className="text-xl font-bold mb-4">Événements du {selectedDate}</h2>
        {eventsOfTheDay.length > 0 ? (
          eventsOfTheDay.map((ev) => (
            <div key={ev.id} className="border rounded p-3 mb-2">
              <p><strong>Titre :</strong> {ev.title}</p>
              {renderSchedulesAndFormulas(ev)}
            </div>
          ))
        ) : (
          <p>Aucun événement ce jour-là.</p>
        )}

        {selectedSchedule && selectedFormula && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);

              const reservationData = {
                event: { id: selectedEvent?.extendedProps?.eventData?.id },
                eventId: selectedEvent?.extendedProps?.eventData?.id,
                date: selectedDate,
                formule: selectedFormula,
                nomClient: formData.get("nom"),
                email: formData.get("email"),
                nbrAdulte: parseInt(formData.get("nbrAdulte") || "0"),
                nbrEnfant: parseInt(formData.get("nbrEnfant") || "0"),
                nbrBebe: parseInt(formData.get("nbrBebe") || "0"),
                commentaire: formData.get("remarque") || "",
                paymentMethods: formData.get("paymentMethod"),
                dateReservation: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
                dailyScheduleReservation: selectedSchedule,
                 user: localStorage.getItem("userId")
    ? { id: parseInt(localStorage.getItem("userId")) }
    : null,
              };

              try {
  const reservationResponse = await axios.post(
    "https://waw.com.tn/api/reservations",
    reservationData
  );
                  alert("Réservation enregistrée avec succès.");
                closeModal();
                setSelectedSchedule(null);
                setSelectedFormula(null);
                setSelectedEvent(null);
                console.log(reservationResponse.data);


  const response = await fetch('https://waw.com.tn/api/reservations/voucher', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservationResponse.data),
  });

  if (!response.ok) {
    alert('Erreur lors du téléchargement du voucher');
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'voucher_reservation.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
    alert("Voucher généré avec succès !");

              } catch (err) {
                console.error("Erreur lors de l'envoi de la réservation", err);
                alert("Une erreur est survenue lors de la réservation.");
              }
            }}
            className="mt-4 border-t pt-4 flex flex-col gap-4"
          >
            <p className="text-lg font-medium">Formule choisie:</p>
            <p>{selectedFormula.label} - {selectedFormula.price} DT</p>
    {!localStorage.getItem("userId") && (
<>
            <div>
              <label htmlFor="nom" className="block font-medium mb-1">Nom</label>
              <input type="text" id="nom" name="nom" placeholder="Nom" required className="border p-2 rounded w-full" />
            </div>

            <div>
              <label htmlFor="email" className="block font-medium mb-1">Email</label>
              <input type="email" id="email" name="email" placeholder="Email" required className="border p-2 rounded w-full" />
            </div>
            </>
)}
            <div>
              <label htmlFor="paymentMethod" className="block font-medium mb-1">Type de paiement</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                required
                className="border p-2 rounded w-full"
                defaultValue=""
              >
                <option value="" disabled>Sélectionnez un mode de paiement</option>
                {(selectedEvent?.extendedProps?.eventData?.paymentMethods || []).map((method, i) => (
                  <option key={i} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="nbrAdulte" className="block font-medium mb-1">Nombre d'adultes</label>
              <input type="number" id="nbrAdulte" name="nbrAdulte" min={0} defaultValue={0} className="border p-2 rounded w-full" />
            </div>

            <div>
              <label htmlFor="nbrEnfant" className="block font-medium mb-1">Nombre d'enfants</label>
              <input type="number" id="nbrEnfant" name="nbrEnfant" min={0} defaultValue={0} className="border p-2 rounded w-full" />
            </div>

            <div>
              <label htmlFor="nbrBebe" className="block font-medium mb-1">Nombre de bébés</label>
              <input type="number" id="nbrBebe" name="nbrBebe" min={0} defaultValue={0} className="border p-2 rounded w-full" />
            </div>

            <div>
              <label htmlFor="remarque" className="block font-medium mb-1">Remarque</label>
              <textarea id="remarque" name="remarque" placeholder="Remarque" rows={3} className="border p-2 rounded w-full" />
            </div>

            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
              Confirmer la réservation
            </button>
          </form>
        )}
        {selectedSchedule && selectedPack && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
  const participants = Array.from({ length: selectedPack.nbr }).map((_, index) => ({
    nom: formData.get(`nom-${index}`),
    email: formData.get(`email-${index}`)
  }));
              const reservationData = {
                event: { id: selectedEvent?.extendedProps?.eventData?.id },
                eventId: selectedEvent?.extendedProps?.eventData?.id,
                date: selectedDate,
                pack: selectedPack,
                personnes : participants,
                nomClient: formData.get("nom"),
                email: formData.get("email"),
                commentaire: formData.get("remarque") || "",
                paymentMethods: formData.get("paymentMethod"),
                dateReservation: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
                dailyScheduleReservation: selectedSchedule,
                 user: localStorage.getItem("userId")
    ? { id: parseInt(localStorage.getItem("userId")) }
    : null,
              };

              try {
  const reservationResponse = await axios.post(
    "https://waw.com.tn/api/reservations",
    reservationData
  );
                  alert("Réservation enregistrée avec succès.");
                closeModal();
                setSelectedSchedule(null);
                setSelectedFormula(null);
                setSelectedEvent(null);
                console.log(reservationResponse.data);


  const response = await fetch('https://waw.com.tn/api/reservations/voucher', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservationResponse.data),
  });

  if (!response.ok) {
    alert('Erreur lors du téléchargement du voucher');
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'voucher_reservation.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
    alert("Voucher généré avec succès !");

              } catch (err) {
                console.error("Erreur lors de l'envoi de la réservation", err);
                alert("Une erreur est survenue lors de la réservation.");
              }
            }}
            className="mt-4 border-t pt-4 flex flex-col gap-4"
          >
            <p className="text-lg font-medium">Pack choisie:</p>
            <p>{selectedPack.label} nbr de personnes {selectedPack.nbr}- {selectedPack.price} DT</p>
    {!localStorage.getItem("userId") && (
<>
            <div>
              <label htmlFor="nom" className="block font-medium mb-1">Nom</label>
              <input type="text" id="nom" name="nom" placeholder="Nom" required className="border p-2 rounded w-full" />
            </div>

            <div>
              <label htmlFor="email" className="block font-medium mb-1">Email</label>
              <input type="email" id="email" name="email" placeholder="Email" required className="border p-2 rounded w-full" />
            </div>
            </>
)}
            <div>
              <label htmlFor="paymentMethod" className="block font-medium mb-1">Type de paiement</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                required
                className="border p-2 rounded w-full"
                defaultValue=""
              >
                <option value="" disabled>Sélectionnez un mode de paiement</option>
                {(selectedEvent?.extendedProps?.eventData?.paymentMethods || []).map((method, i) => (
                  <option key={i} value={method}>{method}</option>
                ))}
              </select>
            </div>

{Array.from({ length: selectedPack.nbr }).map((_, index) => (
  <div key={index} className="mb-4 border p-3 rounded">
    <div>
      <label htmlFor={`nom-${index}`} className="block font-medium mb-1">
        Nom {index + 1}
      </label>
      <input
        type="text"
        id={`nom-${index}`}
        name={`nom-${index}`}
        placeholder={`Nom ${index + 1}`}
        required
        className="border p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor={`email-${index}`} className="block font-medium mb-1">
        Email {index + 1}
      </label>
      <input
        type="email"
        id={`email-${index}`}
        name={`email-${index}`}
        placeholder={`Email ${index + 1}`}
        required
        className="border p-2 rounded w-full"
      />
    </div>
  </div>
))}


            <div>
              <label htmlFor="remarque" className="block font-medium mb-1">Remarque</label>
              <textarea id="remarque" name="remarque" placeholder="Remarque" rows={3} className="border p-2 rounded w-full" />
            </div>

            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
              Confirmer la réservation
            </button>
          </form>
        )}
      </Modal>
          {isDateAvailable && (
            <>
              <h4 style={{ marginBottom: 8 }}>Sélectionnez une heure</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: '1px solid #FF7900',
                      backgroundColor: selectedTime === time ? '#FF7900' : '#fff',
                      color: selectedTime === time ? '#fff' : '#FF7900',
                      cursor: 'pointer',
                      minWidth: 70,
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  htmlFor="people-count"
                  style={{ fontWeight: '600', display: 'block', marginBottom: 6 }}
                >
                  Nombre de personnes
                </label>
                <input
                  id="people-count"
                  type="number"
                  min={1}
                  max={20}
                  value={peopleCount}
                  onChange={(e) =>
                    setPeopleCount(Math.max(1, Math.min(20, Number(e.target.value))))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 5,
                    border: '1px solid #ccc',
                    fontSize: 16,
                  }}
                />
              </div>
            </>
          )}
                      {/*           <button
            disabled={!selectedDate || !selectedTime}
            style={{
              marginTop: 10,
              width: '100%',
              padding: 12,
              backgroundColor: selectedDate && selectedTime ? '#FF7900' : '#ccc',
              color: '#fff',
              border: 'none',
              fontWeight: 'bold',
              fontSize: 16,
              borderRadius: 5,
              cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed',
            }}
            onClick={() => setModalOpen(true)}
          >
            Réserver
          </button> 

        <h3 style={{ color: '#3c71c2', fontWeight: 'bold', marginBottom: 20 }}>
          À partir de {hotel[0].price} TND
        </h3>

          */}





        <InfoRow>
          <span>Lieu :</span>
          <span>{event.ville}</span>
        </InfoRow>
                <Link href={`/profile?id=${event.business.id}`} passHref>

        <InfoRow>
          <span>Publié par : {event.business.rs}</span>
          <PublisherRow>
<img src={`https://waw.com.tn${event.business.imageUrl}`} alt={event.business.nom} />
          </PublisherRow>
        </InfoRow>
      </Link>
      </RightStickyColumn>

      <BottomStickyBar>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'black' }}>
            Réservez votre place
          </Typography>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StyledButtonContained
            onClick={() => {
              rightColumnRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Réserver maintenant
          </StyledButtonContained>
        </div>
      </BottomStickyBar>
    </Container>
    )
  );
};

export default HotelFeature;
