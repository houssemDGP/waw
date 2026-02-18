// App.js (or equivalent main application file)
import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material'; // For consistent styling

// Import your converted components
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SearchForm from '../components/SearchForm';
import ServicesSection from '../components/ServicesSection';
import DestinationCarousel from '../components/DestinationCarousel';
import TourDestinations from '../components/TourDestinations';
import AboutSection from '../components/AboutSection';
import Testimonials from '../components/Testimonials';
import BlogSection from '../components/BlogSection';
import IntroSection from '../components/IntroSection';
import Footer from '../components/Footer';
import ViatorBenefits from '../components/ViatorBenefits';
import DestinationSlider from '../components/DestinationSlider';
import TopBar from '../components/TopBar';
import TourCard from '../components/TourCard';
import AdventureComponent from'../components/AdventureComponent';
import EventMap from '../components/EventMap';
import HeroWithSearch from '../components/HeroWithSearch';
import CardIndex from "../components/CardIndex";
// Define a custom MUI theme if needed (e.g., for primary colors, typography)
// This helps to centralize your design system.
const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff', // Bootstrap primary blue
    },
    secondary: {
      main: '#f8f9fa', // Light gray
    },
    // You can define other colors here to match the template
  },
typography: {
  fontFamily: ['Aeonik', 'Helvetica', 'Arial', 'sans-serif'].join(','),
  h1: {
    fontFamily: ['Aeonik', 'Helvetica', 'Arial', 'sans-serif'].join(','),
  },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent uppercase by default
        },
      },
    },
  },
});

function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets CSS and provides a consistent baseline */}
    <TopBar />
      <Navbar />
      <HeroWithSearch />
            <ViatorBenefits />
      <TourDestinations />

      <DestinationSlider />
      <CardIndex />
      <EventMap />
      <BlogSection />
      <Footer />
    </ThemeProvider>

  );
}

export default Home;