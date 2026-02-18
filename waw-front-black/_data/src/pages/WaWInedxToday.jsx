  import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';
import ViatorBenefits from '../components/ViatorBenefits';
import Footer from '../components/Footer';
import Slider from '../components/Slider';
import ReservationLastMinute from '../components/ReservationLastMinute';
import BlogGrid from '../components/blogPosts';
import { Link } from "react-router-dom";
import PortfolioGallery from "../components/PortfolioGallery";
import ImageIndex from "../components/ImageIndex";
import ExperiencesSection from "../components/ExperiencesSection";
import PageMeta from "../components/common/PageMeta";
 import ExperiencesGrid from "../components/ExperiencesGrid";
 import CommentCaMarche from "../components/CommentCaMarche";


 import PourquoiChoisirWAW from "../components/PourquoiChoisirWAW";

 import Ramadan from "../components/ramadan";
  
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
  import {
    Box,
    Typography,
    Button,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Popover,
    List,
    ListItem,
    ListItemText,
    Collapse,
    useTheme,
    useMediaQuery,IconButton,
    Autocomplete,
    Grid, 
  } from '@mui/material';
    import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

  import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // or AdapterDayjs, etc.
  import { format } from 'date-fns'; // For formatting dates
  import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
  import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
  import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
  import TinderCard from "../components/TinderCardEvent";
  const datePeriods = [
    { value: 'in spring 2026', label: 'in spring 2026' },
    { value: 'in winter 25/26', label: 'in winter 25/26' },
    { value: 'in autumn 2025', label: 'in autumn 2025' },
    { value: 'in summer 2025', label: 'in summer 2025' },
    { value: 'in spring 2025', label: 'in spring 2025' },
    { value: 'anytime', label: 'anytime' },
    { value: 'custom-dates', label: 'on my own dates' },
  ];

  const dateDurations = {
    'default': [ // Default durations for seasonal periods
      { value: 'One way', label: 'One way' },
      { value: 'a weekend break', label: 'a weekend break' },
      { value: '1 week', label: '1 week' },
      { value: '2 weeks', label: '2 weeks' },
    ],
    'custom-dates': [ // Specific durations for 'on my own dates'
      { value: 'Departing Only', label: 'Departing Only' },
      { value: 'Departing and Returning', label: 'Departing and Returning' },
    ],
    'anytime': [], // No durations for 'anytime'
  };
// Define breakpoints for consistent use
const breakpoints = {
  mobile: '768px', // Common breakpoint for mobile devices
  tablet: '1024px', // Common breakpoint for tablets
};

const HeroSection = styled.div`
  background-color: #f8bf20; /* Dark green background */
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 80px 80px; /* Default for larger screens */
  font-family: Arial, sans-serif;
  border-radius: 15px;
  margin: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  flex-wrap: wrap; /* Allows items to wrap to the next line on smaller screens */

  @media (max-width: ${breakpoints.tablet}) {
    padding: 60px 80px;
    margin: 15px;
    flex-direction: column; /* Stack content and image vertically on tablets */
    text-align: center; /* Center text when stacked */
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 40px 20px;
    margin: 10px;
    border-radius: 10px;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px; /* Space between title and search bar */
  min-width: 300px; /* Ensure content doesn't shrink too much */

  @media (max-width: ${breakpoints.tablet}) {
    order: 2; /* Put content below the image on tablets */
    gap: 20px;
    align-items: center; /* Center the search bar */
    width: 100%; /* Take full width */
  }

  @media (max-width: ${breakpoints.mobile}) {
    gap: 15px;
  }
`;

const Title = styled.h1`
  font-size: 3.2em; /* Default for larger screens */
  font-weight: bold;
  line-height: 1.2;
  margin: 0;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 2.5em; /* Smaller font for tablets */
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.8em; /* Even smaller for mobile */
    br { /* Hide line break on small screens for better flow */
      display: none;
    }
  }
`;

const SearchBarContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: fit-content; /* Default for larger screens */
padding :15px;
  @media (max-width: ${breakpoints.tablet}) {
    width: 80%; /* Occupy more width on tablets */
    flex-direction: column; /* Stack inputs vertically */
    border-radius: 10px; /* More rectangular shape */
    align-items: stretch; /* Stretch inputs to full width */
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%; /* Full width on mobile */
    border-radius: 8px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-right: 1px solid #e0e0e0; /* Default separator */

  &:last-of-type {
    border-right: none;
  }

  @media (max-width: ${breakpoints.tablet}) {
    border-right: none; /* Remove vertical separator */
    border-bottom: 1px solid #e0e0e0; /* Add horizontal separator */
    padding: 10px 15px;
    
    &:last-of-type {
      border-bottom: none; /* No separator for the last input group */
    }
  }
`;

const Icon = styled.span`
  color: #a0a0a0;
  margin-right: 10px;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;

  & .MuiSvgIcon-root {
    font-size: 1.2em;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1em; /* Slightly smaller icons on mobile */
    & .MuiSvgIcon-root {
      font-size: 1em;
    }
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  font-size: 1.1em;
  color: #333;
  width: 250px; /* Default width */
  flex-grow: 1; /* Allow input to grow */

  &::placeholder {
    color: #a0a0a0;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: auto; /* Let it grow naturally */
    font-size: 1em;
  }
`;

const SearchButton = styled.button`
  background-color: #d65113;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  border-radius: 15px;
  transition: background-color 0.3s ease;
  flex-shrink: 0; /* Prevent button from shrinking */

  &:hover {
    background-color: #d65113;
  }

  @media (max-width: ${breakpoints.tablet}) {
    border-radius: 0 0 10px 10px; /* Rounded at the bottom for stacked layout */
    padding: 12px 20px;
    font-size: 1em;
    width: 100%; /* Full width on tablets */
  }

  @media (max-width: ${breakpoints.mobile}) {
    border-radius: 0 0 8px 8px;
    padding: 10px 15px;
  }
`;

const ImageContainer = styled.div`
  width: 330px;
  height: 330px;
  border-radius: 50%;
  background-color: #f0f0f0;
  background-image: url('logo/waw.png'); /* Assuming this path is correct */
  background-size: cover;
  background-position: center;
  margin-left: 20px; /* Default margin */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  margin-right:-50px;
  @media (max-width: ${breakpoints.tablet}) {
    width: 250px; /* Smaller image on tablets */
    height: 250px;
    margin: 0 0 30px 0; /* Center and add space below on tablets */
    order: 1; /* Put image above content on tablets */
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 180px; /* Even smaller image on mobile */
    height: 180px;
    margin: 0 0 20px 0; /* Adjust margin */
  }
`;
// Grid container responsive
const GridContainer = styled.div`
  display: grid;
  gap: 16px;
  padding: 20px;

  grid-template-columns: repeat(3, 1fr); // max 3 par ligne

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: center;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  height: 200px;
  transition: transform 0.5s ease, box-shadow 0.5s ease;

  background-image: url(${({ bg }) => bg});
  background-size: cover;
  background-position: center;

  /* overlay sombre pour lisibilité */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.25);
    transition: background 0.5s ease;
    z-index: 0;
  }

  /* hover effects: zoom entire card */
  &:hover {
    transform: scale(1.05); /* zoom whole container */
    box-shadow: 0 12px 25px rgba(0,0,0,0.4);
  }
`;

const ActivityInfo = styled.div`
  position: relative;
  z-index: 1;
  padding: 15px;
  color: #fff;
  backdrop-filter: blur(2px);
`;

const ActivityTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: bold;
`;

const ActivityEvents = styled.span`
  font-size: 14px;
  color: #eee;
`;


const RegionGridCard = styled.div`
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  cursor: pointer;
  transition: 0.3s;
  position: relative; /* needed for absolute text */

  &:hover {
    transform: translateY(-5px);
  }

  /* Responsive pour tablettes */
  @media (max-width: 1024px) {
    border-radius: 12px;
  }

  /* Responsive pour mobiles */
  @media (max-width: 768px) {
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  /* Très petit écran */
  @media (max-width: 480px) {
    border-radius: 8px;
    box-shadow: none;
  }
`;


const RegionGridImage = styled.img`
  width: 100%;
  height: 200px; /* adjust height as needed */
  object-fit: cover;
`;

const RegionGridTitle = styled.h3`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* center */
  margin: 0;
  padding: 8px 12px;
  font-size: 18px;
  color: #fff;
  background-color: rgba(0,0,0,0.5); /* optional overlay for readability */
  border-radius: 8px;
  text-align: center;
`;


const BannerContainer = styled.div`
  background-color: #f5e0a9;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
    margin: 0 auto; /* centre horizontalement */
  text-align: center;
    width: 80%;
    border-radius:25px;
      margin: 60px auto; /* 40px haut et bas, auto gauche droite (centré) */


`;
const BannerWrapper = styled.div`
  max-width: 500px;
  text-align: center;
`;

const BannerTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const PromptText = styled.p`
  font-size: 14px;
  margin-bottom: 24px;

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;


const LoginButton = styled.button`
  background-color: black;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  border-radius: 15px;
  transition: background-color 0.3s ease;
  flex-shrink: 0;

  &:hover {
    background-color: black;
  }

  @media (max-width: ${breakpoints.tablet}) {
    border-radius: 0 0 10px 10px;
    padding: 12px 20px;
    font-size: 1em;
    width: 100%;
  }

  @media (max-width: ${breakpoints.mobile}) {
    border-radius: 0 0 8px 8px;
    padding: 10px 15px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 2rem 0;
`;

const TextBlock = styled.div`
  flex: 1 1 40%; /* s’adapte au responsive */
  padding: 2rem;
  background-color: white;
  clip-path: polygon(0 8%, 0 100%, 100% 100%, 100% 0);
  color: #fff;
  border-radius: 12px;
`;

const ActivitiesWrapper = styled.div`
  flex: 2 1 600px; /* plus large que le bloc texte */
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CardWrapper = styled.div`
  flex: 1 1 calc(33.33% - 1rem); /* 3 cartes par ligne */
  min-width: 200px;
`;

const ShowMoreWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 1.5rem;
`;
const MainTitle = styled.h2`
  font-size: 3.2rem;
  font-weight: 800;
  color: black;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
  text-align: center;
  span {
    color: #b78c4a; /* WAW golden accent */
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;


const TopActivity = ({ imgSrc, title, eventsCount, href }) => (
  <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
    <ActivityCard bg={imgSrc}>
      <ActivityInfo>
        <ActivityTitle>{title}</ActivityTitle>
        <ActivityEvents>{eventsCount} événements</ActivityEvents>
      </ActivityInfo>
    </ActivityCard>
  </a>
);
// ==== Données d'activités ====
const activitiesData = {
  Tunis: [
    { title: 'Visite de la Médina', img: 'imgs/33.jpg', events: 10 },
    { title: 'Musée du Bardo', img: 'imgs/33.jpg', events: 5 },
  ],
  'Cap Bon': [
    { title: 'Nabeul Souk', img: 'imgs/30.jpg', events: 6 },
    { title: 'Plage Hammamet', img: 'imgs/30.jpg', events: 8 },
  ],
  Nord: [
    { title: 'Randonnée à Ain Draham', img: 'imgs/31.jpg', events: 3 },
  ],
  Sousse: [
    { title: 'Port El Kantaoui', img: 'imgs/32.jpg', events: 7 },
    { title: 'Vieille Médina', img: 'imgs/32.jpg', events: 4 },
  ],
  Djerba: [
    { title: 'La Ghriba', img: 'imgs/33.jpg', events: 9 },
    { title: 'Plongée sous-marine', img: 'imgs/33.jpg', events: 5 },
  ],
  Sud: [
    { title: 'Sahara tour', img: 'imgs/30.jpg', events: 11 },
    { title: 'Campement Douz', img: 'imgs/30.jpg', events: 4 },
  ],
};

const ShowMoreButton = styled.button`
  background-color: black;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  border-radius: 15px;
  transition: background-color 0.3s ease;
  flex-shrink: 0;

  &:hover {
    background-color: black;
  }

  @media (max-width: ${breakpoints.tablet}) {
    border-radius: 0 0 10px 10px;
    padding: 12px 20px;
    font-size: 1em;
    width: 100%;
  }

  @media (max-width: ${breakpoints.mobile}) {
    border-radius: 0 0 8px 8px;
    padding: 10px 15px;
  }
`;
const regionImages = {
  Tunis: 'imgs/33.jpg',
  'Cap Bon': 'imgs/30.jpg',
  Nord: 'imgs/31.jpg',
  Sousse: 'imgs/32.jpg',
  Djerba: 'imgs/33.jpg',
  Sud: 'imgs/30.jpg',
};
const regionDescriptions = {
  Tunis: 'Capitale culturelle et économique de la Tunisie.',
  'Cap Bon': 'Région côtière avec plages et poteries.',
  Nord: 'Forêts et montagnes verdoyantes.',
  Sousse: 'Ville portuaire et touristique du Sahel.',
  Djerba: 'Île de traditions et de plages dorées.',
  Sud: 'Le désert et les oasis vous attendent.',
};

const BASE_URL = "https://waw.com.tn";

const RestaurantHero = () => {
    const [selectedAction, setSelectedAction] = useState('fly from');
    const [originAirport, setOriginAirport] = useState('Enfidha - Hammamet');
    const [airportAutoCompleteValue, setAirportAutoCompleteValue] = useState(null);
    const [autocompleteInputValue, setAutocompleteInputValue] = useState('');

    const [anchorElAirportPicker, setAnchorElAirportPicker] = useState(null);
    const [openCountries, setOpenCountries] = useState({});

    const airportsByCountryButtonRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [selectedPeriod, setSelectedPeriod] = useState(datePeriods[0].value); // Default to 'in spring 2026'
    const [selectedDuration, setSelectedDuration] = useState(dateDurations['default'][0].value); // Default 'One way'
    const [displayedSummaryPeriod, setDisplayedSummaryPeriod] = useState(datePeriods[0].label); // For summary text
    const [displayedSummaryDuration, setDisplayedSummaryDuration] = useState(dateDurations['default'][0].label); // For summary text


    const [budgetInput, setBudgetInput] = useState('');
    const [currentBudgetSummary, setCurrentBudgetSummary] = useState("I don't mind");
    const [showBudgetError, setShowBudgetError] = useState(false);
    const [isBudgetPanelActive, setIsBudgetPanelActive] = useState(false);

    const [anchorElActivities, setAnchorElActivities] = useState(null);
    const activitiesButtonRef = useRef(null);

    // States for Date Selection Panel
    const [departingDate, setDepartingDate] = useState(null);
    const [returningDate, setReturningDate] = useState(null); // Will be null for 'Departing Only'
    const [isDatePanelActive, setIsDatePanelActive] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState('Tunis');


  const [villes, setVilles] = useState([]);
useEffect(() => {
  fetch('https://waw.com.tn/api/api/villes')
    .then((res) => res.json())
    .then((data) => {
        setVilles(data);
        console.log(data);
    })
    .catch((error) => {
      console.error('Erreur lors du chargement des villes :', error);
    });
}, []);
  const regions = Object.keys(activitiesData);
    useEffect(() => {
      setIsBudgetPanelActive(selectedAction === 'stick to a budget');
      if (selectedAction !== 'choose my travel style') {
        handleActivitiesPopoverClose();
      }
      // Control visibility of date panel
      setIsDatePanelActive(selectedAction === 'leave on');
    }, [selectedAction]);

    // Update summary text when period or duration changes in date panel
    useEffect(() => {
      if (selectedPeriod === 'anytime') {
          setDisplayedSummaryPeriod('anytime');
          setDisplayedSummaryDuration(''); // No duration for anytime
      } else if (selectedPeriod === 'custom-dates') {
          let periodText = departingDate ? format(departingDate, 'MMM d, yyyy') : 'Departing';
          if (selectedDuration === 'Departing and Returning' && returningDate) {
              periodText += ` - ${format(returningDate, 'MMM d, yyyy')}`;
          }
          setDisplayedSummaryPeriod(periodText);
          setDisplayedSummaryDuration(selectedDuration);
      } else {
          setDisplayedSummaryPeriod(selectedPeriod);
          setDisplayedSummaryDuration(selectedDuration);
      }
    }, [selectedPeriod, selectedDuration, departingDate, returningDate]);


    const handleActionChange = (event) => {
      setSelectedAction(event.target.value);
      // When switching actions, reset relevant states for a clean start
      setBudgetInput('');
      setCurrentBudgetSummary("I don't mind");
      setDepartingDate(null);
      setReturningDate(null);
      setSelectedPeriod(datePeriods[0].value); // Reset date panel selects
      setSelectedDuration(dateDurations['default'][0].value);
    };

    const handleAirportsByCountryClick = (event) => {
      setAnchorElAirportPicker(event.currentTarget);
    };

    const handleAirportPickerClose = () => {
      setAnchorElAirportPicker(null);
    };

    const handleCountryToggle = (countryName) => {
      setOpenCountries((prev) => ({
        ...prev,
        [countryName]: !prev[countryName],
      }));
    };

    const handleAirportSelect = (airportName) => {
      setOriginAirport(airportName);
      setAirportAutoCompleteValue({ name: airportName, code: '' });
      setAutocompleteInputValue(airportName);
      handleAirportPickerClose();
    };



    const openAirportPickerPopover = Boolean(anchorElAirportPicker);
    const airportPickerPopoverId = openAirportPickerPopover ? 'airport-picker-popover' : undefined;

    const numColumns = 3;

    const handleEditPeriod = () => {
      setSelectedAction('leave on'); // Switch to date selection panel
      setSelectedPeriod('custom-dates'); // Focus on custom dates
    };

    const handleEditDuration = () => {
      setSelectedAction('leave on'); // Switch to date selection panel
    };

    const handleBudgetInputChange = (event) => {
      const value = event.target.value;
      if (/^\d*$/.test(value) && value.length <= 7) {
        setBudgetInput(value);
        setShowBudgetError(false);
        setCurrentBudgetSummary(value ? `£${value}` : "I don't mind");
      }
    };

    const handleEditBudget = () => {
      setSelectedAction('stick to a budget');
    };

    // Activities Panel handlers
    const handleActivitiesButtonClick = (event) => {
      setAnchorElActivities(event.currentTarget);
    };

    const handleActivitiesPopoverClose = () => {
      setAnchorElActivities(null);
    };

    const handleActivitySelect = (activity) => {
      setSelectedActivity(activity);
      handleActivitiesPopoverClose();
    };

    const openActivitiesPopover = Boolean(anchorElActivities);
    const activitiesPopoverId = openActivitiesPopover ? 'activities-popover' : undefined;

    // Date Panel Handlers
    const handlePeriodChange = (event) => {
      const newPeriod = event.target.value;
      setSelectedPeriod(newPeriod);
      // Reset duration if period changes, set to default for that period type
      if (newPeriod === 'custom-dates') {
          setSelectedDuration(dateDurations['custom-dates'][0].value);
      } else if (newPeriod === 'anytime') {
          setSelectedDuration(''); // No duration for anytime
          setDepartingDate(null);
          setReturningDate(null);
      } else {
          setSelectedDuration(dateDurations['default'][0].value);
          setDepartingDate(null);
          setReturningDate(null);
      }
    };

    const handleDurationChange = (event) => {
      setSelectedDuration(event.target.value);
      // Clear dates if switching duration type
      setDepartingDate(null);
      setReturningDate(null);
    };

    const handleDepartingDateChange = (date) => {
      setDepartingDate(date);
      // If selecting departing date for 'Departing Only', clear returning
      if (selectedDuration === 'Departing Only') {
        setReturningDate(null);
      }
    };

    const handleReturningDateChange = (date) => {
      setReturningDate(date);
    };

    const handleSwipe = (direction) => {
      setCards((prev) => prev.slice(1));
    };
    const [showAll, setShowAll] = useState(false);


  const [activites, setActivitess] = useState([]);

useEffect(() => {
  fetch('https://waw.com.tn/api/api/activites/active')
    .then((res) => res.json())
    .then((data) => {
      const filtered = data.filter((activite) => 
        Array.isArray(activite.events) && activite.events.length > 0
      );
      setActivitess(filtered);
      console.log(filtered);
    })
    .catch((error) => {
      console.error('Erreur lors du chargement des activités :', error);
    });
}, []);


        const visibleActivites = showAll
    ? activites
    : activites.slice(0, 0);


      const swiperRef = useRef(null);
  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };
  return (
    <>
          <PageMeta title="waw" description="waw" />

              <TopBar />
        <Navbar />
  {/*    <ExperiencesGrid 
        activities={activites}
        baseUrl={BASE_URL}
        showAll={showAll}
        onShowMore={() => setShowAll(true)}
        initialDisplayCount={4}
      />*/}
      < Ramadan />
<PourquoiChoisirWAW />
        <MainTitle
        >
    Explorez nos catégories
        </MainTitle>
<Container>


      <ActivitiesWrapper>
        {visibleActivites.map((cat, index) => (
          <CardWrapper key={index}>
            <TopActivity
              title={cat.titre}
              eventsCount={cat.events.length}
              imgSrc={`${BASE_URL}${cat.imageUrl}`}
              href={`/decouvrir?activite=${cat.titre}`}
            />
          </CardWrapper>
        ))}

        {activites.length > 1 && !showAll && (
          <ShowMoreWrapper>
            <ShowMoreButton onClick={() => setShowAll(true)}>
              Voir toutes les catégories
            </ShowMoreButton>
          </ShowMoreWrapper>
        )}
      </ActivitiesWrapper>
    </Container>

    <CommentCaMarche />
{/*
              <Slider />

                <Typography
          variant="h2"
          sx={{ color: "black", fontWeight: "bold", flexGrow: 1, textAlign: "center" ,marginTop:"50px",fontSize: "35px"}}
        >
          Vivez des expériences uniques
        </Typography>

 <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingTop: 60,
          paddingBottom: 30,
        }}
      >
        <IconButton aria-label="Previous" sx={{ color: "black" }} onClick={handlePrev}>
          <ArrowBackIosNewIcon />
        </IconButton>



        <IconButton aria-label="Next" sx={{ color: "black" }} onClick={handleNext}>
          <ArrowForwardIosIcon />
        </IconButton>
      </div>

    <Swiper
  ref={swiperRef}
  spaceBetween={16}
  slidesPerView={1} // Default for smallest devices
  breakpoints={{
    600: { slidesPerView: 2 },  // ≥600px
    900: { slidesPerView: 4 },  // ≥900px
    1400: { slidesPerView: 6 }, // ≥1400px
  }}
  style={{ paddingBottom: "24px" }}
>

        {villes.map((ville) => (
          <SwiperSlide key={ville.id}>
        <Link to={`/decouvrir?rue=${ville.nom}`} style={{ textDecoration: "none" }}>
            <RegionGridCard>
              <RegionGridImage src={`${BASE_URL}${ville.imageUrl}`} alt={ville.nom} />
              <RegionGridTitle>{ville.nom}</RegionGridTitle>
            </RegionGridCard>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
       Bloc texte
      <center>




<Typography
  variant="h5"
  sx={{ color: 'black', fontWeight: 'bold', paddingTop: '60px',paddingBottom: '30px',  fontFamily: "Rock Salt"
  }}
>
  Explorez des expériences inoubliables
</Typography>
  </center>
      <GridContainer>
        {visibleActivites.map((cat, index) => (
      <TopActivity
        title={cat.titre}
        eventsCount={cat.events.length}
        imgSrc={`${BASE_URL}${cat.imageUrl}`}
                  href={`/decouvrir?activite=${cat.titre}`}
      />
        ))}
      </GridContainer>

      {activites.length > 9 && !showAll && (
        <div style={{ textAlign: 'center' }}>
          <ShowMoreButton onClick={() => setShowAll(true)}>
            Voir toutes les catégories
          </ShowMoreButton>
        </div>
      )}       */}

{/*  

< ExperiencesSection />

      <ReservationLastMinute/>
                    <ViatorBenefits />
                                      <PortfolioGallery />

                    <BlogGrid />
                    <ImageIndex />
                    <BannerContainer>
      <BannerWrapper>
        <BannerTitle>
         Connectez-vous pour gérer les réservations
        </BannerTitle>
        <PromptText>
         Vous n'avez pas encore de compte ?
          <a href="/signup">Sign up</a>
        </PromptText>
        <LoginButton href="/login">
          Se connecter
        </LoginButton>
      </BannerWrapper>
    </BannerContainer>*/}
      <Footer />

    </>
  );
};

export default RestaurantHero;