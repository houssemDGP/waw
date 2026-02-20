import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Container, Button, IconButton, Slider,InputLabel ,Select ,MenuItem ,FormControlLabel,Checkbox ,Autocomplete,TextField 
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import axios from 'axios';
import styled from "styled-components";
import { Link } from "react-router-dom";

const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
};

// Styled Components
const SearchBarContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: fit-content;
  padding: 15px;
  align-items: center;

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    flex-direction: column;
    border-radius: 10px;
    align-items: stretch;
  }
  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
    border-radius: 8px;
  flex-shrink: 0;
  }
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-right: 1px solid #e0e0e0;

  &:last-of-type {
    border-right: none;
  }

  @media (max-width: ${breakpoints.tablet}) {
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    padding: 10px 15px;

    &:last-of-type {
      border-bottom: none;
    }
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  font-size: 1.1em;
  color: #333;
  width: 180px;
  flex-grow: 1;

  &::placeholder {
    color: #a0a0a0;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: auto;
    font-size: 1em;
  }
`;

const SearchButton = styled.button`
  background-color: #181AD6;
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
    background-color: #b7410e;
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
    font-size: 1em;
    & .MuiSvgIcon-root {
      font-size: 1em;
    }
  }
`;

function HeroWithSearch() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [textAnimationKey, setTextAnimationKey] = useState(0);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [slides, setBanners] = useState([
    {
      imageUrl: "/sliderindex/hammamet.png",
      title: "Découvrez nos activités",
      subTitle: "Bienvenue",
      description: "Trouvez les meilleures expériences"
    }
  ]);
  const [anchorPrix, setAnchorPrix] = useState(null);
  const [openPrix, setOpenPrix] = useState(false);
  const [simpleSearchMode, setSimpleSearchMode] = useState(false);
  const [simpleSearchText, setSimpleSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState('today');
  const [plus2000, setPlus2000] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activites, setActivitess] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // AJOUT: Fonction pour optimiser les URLs d'images
  const optimizeImageUrl = (url) => {
    if (!url) return '';
    
    const baseUrl = "https://waw.com.tn";
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    
    // Si c'est une vidéo, retourner l'URL originale
    if (/\.(mp4|avi|mov|webm)$/i.test(url)) {
      return fullUrl;
    }
    
    // AJOUT: Paramètres d'optimisation pour les images
    const optimizationParams = new URLSearchParams({
      'format': 'webp',
      'quality': '85',
      'width': '1920',
      'height': '1080',
      'fit': 'cover',
    });
    
    return `${fullUrl}?${optimizationParams.toString()}`;
  };

  // AJOUT: Fonction pour précharger l'image LCP
  const preloadLCPImage = (imageUrl) => {
    if (!imageUrl || /\.(mp4|avi|mov|webm)$/i.test(imageUrl)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = optimizeImageUrl(imageUrl);
    link.fetchpriority = 'high';
    document.head.appendChild(link);
  };

  // AJOUT: Détection de la taille d'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= parseInt(breakpoints.mobile));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch('https://waw.com.tn/api/activites/active')
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((activite) =>
          Array.isArray(activite.events) && activite.events.length > 0
        );
        setActivitess(filtered);

        const newCategories = filtered.map((cat) => ({
          id: cat.id,
          nom: cat.titre,
          type: "activite",
        }));

        setCategories((prev) => {
          const merged = [...prev];
          newCategories.forEach((newCat) => {
            const exists = merged.some((oldCat) => oldCat.id === newCat.id && oldCat.type === "activite");
            if (!exists) {
              merged.push(newCat);
            }
          });
          return merged;
        });
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des activités :', error);
      });
  }, []);

  const getPath = () => {
    const selected = categories.find(item => item.nom === simpleSearchText);
    if (selected?.type === "categorie") return `/decouvrir?categorie=${simpleSearchText}`;
    if (selected?.type === "subCategorie") return `/decouvrir?subCategorie=${simpleSearchText}`;
    if (selected?.type === "activite") return `/decouvrir?activite=${simpleSearchText}`;
    return `/decouvrir?nom=${simpleSearchText}`;
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get("https://waw.com.tn/api/banners/active");
        if (response.data && response.data.length > 0) {
          const optimizedBanners = response.data.map(banner => ({
            ...banner,
            optimizedImageUrl: optimizeImageUrl(banner.imageUrl)
          }));
          setBanners(optimizedBanners);
          
          // AJOUT: Précharger la première image (LCP candidate)
          if (optimizedBanners.length > 0) {
            preloadLCPImage(optimizedBanners[0].imageUrl);
          }
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    // AJOUT: Précharger l'image par défaut
    preloadLCPImage("/sliderindex/hammamet.png");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTextAnimationKey((k) => k + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTextAnimationKey((k) => k + 1);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTextAnimationKey((k) => k + 1);
  };

  const handleChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée.");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const address = res.data.address;
        const location = address.city || address.town || address.village || address.county;
        if (location) {
          setCountry(location);
        } else {
          alert("Impossible de détecter la ville.");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la récupération de l'adresse.");
      }
    }, () => {
      alert("Impossible d'accéder à votre position.");
    });
  };

  const openPricePopper = (e) => {
    setAnchorPrix(e.currentTarget);
    setOpenPrix((prev) => !prev);
  };
  const closePrix = () => setOpenPrix(false);

  // MODIFICATION: Gestion du cas où slides est vide
  if (!slides.length) {
    return (
      <Box sx={{
        position: 'relative',
        height: { xs: '100vh', md: '738px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
      }}>
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" sx={{ mb: 4, color: 'black', fontWeight: 'bold' }}>
            Trouvez votre activité
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              bottom: 30,
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: 900,
              width: '90%',
              zIndex: 10,
            }}
          >
            <SearchBarContainer
              sx={{
                width: '100%',
                maxWidth: 900,
                backgroundColor: 'white',
                borderRadius: '25px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                padding: '10px 20px',
                margin: '0 auto',
              }}
            >
              <InputGroup sx={{ flexGrow: 1, borderRight: 'none', width: '100%' }}>
                <Icon><SearchIcon /></Icon>
                <Autocomplete
                  freeSolo
                  sx={{ width: '100%' }}
                  options={categories.map((option) => option.nom)}
                  value={simpleSearchText}
                  onChange={(e, newValue) => setSimpleSearchText(newValue)}
                  onInputChange={(e, newInputValue) => setSimpleSearchText(newInputValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Tapez ici votre recherche..."
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </InputGroup>
              <SearchButton as={Link} to={getPath()}>
                RECHERCHE
              </SearchButton>
            </SearchBarContainer>
          </Box>
        </Container>
      </Box>
    );
  }

  const { imageUrl, title, subTitle, description } = slides[currentSlide];
  const optimizedImageUrl = slides[currentSlide]?.optimizedImageUrl || optimizeImageUrl(imageUrl);

  const handleSearchMode = (mode) => {
    setSimpleSearchMode(mode);
  };

  const minPrice = priceRange[0];
  const maxPrice = plus2000 ? 9999999 : priceRange[1];

  let apiUrl = `/decouvrir?`;
  const selected = categories.find(item => item.nom === simpleSearchText);

  if (selected?.type === 'categorie') {
    apiUrl += `categorie=${encodeURIComponent(simpleSearchText)}&`;
  } else if (selected?.type === 'subCategorie') {
    apiUrl += `subCategorie=${encodeURIComponent(simpleSearchText)}&`;
  } else if (selected?.type === 'activite') {
    apiUrl += `activite=${encodeURIComponent(simpleSearchText)}&`;
  } else {
    apiUrl += `nom=${encodeURIComponent(simpleSearchText)}&`;
  }

  apiUrl += `country=${encodeURIComponent(country)}&selectedDate=${encodeURIComponent(selectedDate)}&minPrice=${minPrice}&maxPrice=${maxPrice}`;

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'relative',
        height: { xs: '100vh', md: '738px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {isMobile ? (
        <Box sx={{ 
          width: '100%', 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ 
            flex: 1,
            position: 'relative'
          }}>
            {imageUrl && /\.(mp4|avi|mov|webm)$/i.test(imageUrl) ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                src={`https://waw.com.tn/api${imageUrl}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 0,
                }}
                fetchpriority="high"
              />
            ) : (
              <Box
                component="img"
                src={optimizedImageUrl}
                alt={title || "Image principale"}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 0,
                  backgroundColor: '#e0e0e0',
                }}
                loading="eager"
                fetchpriority="high"
                decoding="async"
                width="1920"
                height="1080"
              />
            )}

            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
                zIndex: 1,
              }}
            />

            <IconButton onClick={handlePrev} sx={{
              position: 'absolute', top: '50%', left: 10,
              transform: 'translateY(-50%)', color: 'white',
              backgroundColor: 'rgba(0,0,0,0.4)', opacity: hovered ? 1 : 0,
              pointerEvents: hovered ? 'auto' : 'none', transition: 'opacity 0.4s',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }, zIndex: 3,
            }}>
              <ArrowBackIosNewIcon />
            </IconButton>

            <IconButton onClick={handleNext} sx={{
              position: 'absolute', top: '50%', right: 10,
              transform: 'translateY(-50%)', color: 'white',
              backgroundColor: 'rgba(0,0,0,0.4)', opacity: hovered ? 1 : 0,
              pointerEvents: hovered ? 'auto' : 'none', transition: 'opacity 0.4s',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }, zIndex: 3,
            }}>
              <ArrowForwardIosIcon />
            </IconButton>

            <Container sx={{ 
              position: 'relative', 
              zIndex: 2, 
              height: '100%',
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              alignItems: 'center', 
              textAlign: 'center'
            }}>
              <Box key={textAnimationKey} sx={{
                animation: 'fadeInUp 1s ease-in-out',
                '@keyframes fadeInUp': {
                  '0%': { opacity: 0, transform: 'translateY(20px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
              }}>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)' }}>{subTitle}</Typography>
                <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold' }}>{title}</Typography>
                <Typography variant="body1" sx={{ mb: 4, textTransform: 'uppercase', letterSpacing: '2px' }}>{description}</Typography>
              </Box>
            </Container>
          </Box>
          <Box sx={{ 
            position: 'relative',
            zIndex: 20,
            padding: 2,flexShrink: 0,height: '100%',
          }}>
            <SearchBarContainer
              sx={{
                width: '100%',height: '100%',
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                padding: '10px'
              }}
            >
              {simpleSearchMode ? (
                <>
                  <InputGroup sx={{ flexGrow: 1, borderRight: 'none', width: '100%' }}>
                    <Icon><SearchIcon /></Icon>
                    <Autocomplete
                      freeSolo
                      sx={{ width: '100%' }}
                      options={categories.map((option) => option.nom)}
                      value={simpleSearchText}
                      onChange={(e, newValue) => setSimpleSearchText(newValue)}
                      onInputChange={(e, newInputValue) => setSimpleSearchText(newInputValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Tapez ici votre recherche..."
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </InputGroup>
                  <SearchButton as={Link} to={getPath()}>
                    RECHERCHE
                  </SearchButton>
                </>
              ) : (
                <>
                  <InputGroup sx={{ flexGrow: 1, borderRight: 'none', width: '100%' }}>
                    <Icon><LocationOnIcon /></Icon>
                    <Input placeholder="Quelle destination ?" value={country} onChange={(e) => setCountry(e.target.value)} />
                    <IconButton onClick={handleDetectLocation} sx={{ ml: 1, color: '#181AD6' }}>
                      <MyLocationIcon />
                    </IconButton>
                  </InputGroup>
                  <Autocomplete
                    freeSolo
                    sx={{ width: '100%' }}
                    options={categories.map((option) => option.nom)}
                    value={simpleSearchText}
                    onChange={(e, newValue) => setSimpleSearchText(newValue)}
                    onInputChange={(e, newInputValue) => setSimpleSearchText(newInputValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Tapez ici votre recherche..."
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                  <InputGroup sx={{ flexGrow: 1, borderRight: 'none', width: '100%' }}>
                    <Input
                      type="text"
                      readOnly
                      value={plus2000 ? 'Budget: 2000+ TND' : `Budget: ${priceRange[0]} - ${priceRange[1]} TND`}
                      onClick={openPricePopper}
                      placeholder="Budget (TND)"
                      sx={{ cursor: 'pointer' }}
                    />
                  </InputGroup>

                  <Popper open={openPrix} anchorEl={anchorPrix} placement="bottom-start" sx={{ zIndex: 1300, p: 1, width: 320 }}>
                    <ClickAwayListener onClickAway={closePrix}>
                      <Box sx={{
                        width: 320, p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 3,
                        display: 'flex', flexDirection: 'column', gap: 2, color: '#111',
                      }}>
                        <Typography variant="subtitle1">Fourchette de prix</Typography>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={plus2000}
                              onChange={(e) => setPlus2000(e.target.checked)}
                              sx={{ color: '#d65113' }}
                            />
                          }
                          label="2000+"
                        />
                        <Typography variant="body2">
                          Prix : {plus2000 ? '2000+' : `${priceRange[0]} TND - ${priceRange[1]} TND`}
                        </Typography>
                        <Slider
                          getAriaLabel={() => 'Prix'}
                          value={priceRange}
                          onChange={handleChange}
                          valueLabelDisplay="auto"
                          min={0}
                          max={2000}
                          step={5}
                          sx={{ color: '#d65113' }}
                          disabled={plus2000}
                        />
                      </Box>
                    </ClickAwayListener>
                  </Popper>
                  <InputGroup sx={{ flexGrow: 1, width: '100%' }}>
                    <Select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      displayEmpty
                      variant="standard"
                      sx={{
                        flexGrow: 1,
                        width: '100%',
                        '.MuiSelect-select': {
                          padding: '8px 14px',
                        },
                        '&:before, &:after': { borderBottom: 'none !important' },
                      }}
                    >
                      <MenuItem value="today">Aujourd'hui</MenuItem>
                      <MenuItem value="tomorrow">Demain</MenuItem>
                      <MenuItem value="autres">Plus tard</MenuItem>
                    </Select>
                  </InputGroup>
                  <SearchButton as={Link} to={apiUrl}>
                    RECHERCHE
                  </SearchButton>
                </>
              )}
            </SearchBarContainer>
          </Box>
        </Box>
      ) : (
        <>
          {imageUrl && /\.(mp4|avi|mov|webm)$/i.test(imageUrl) ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              src={`https://waw.com.tn/api${imageUrl}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
              }}
              fetchpriority="high"
            />
          ) : (
            <Box
              component="img"
              src={optimizedImageUrl}
              alt={title || "Image principale"}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
                backgroundColor: '#e0e0e0',
              }}
              loading="eager"
              fetchpriority="high"
              decoding="async"
              width="1920"
              height="1080"
            />
          )}

          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 1,
            }}
          />

          <IconButton onClick={handlePrev} sx={{
            position: 'absolute', top: '50%', left: { xs: 10, md: 40 },
            transform: 'translateY(-50%)', color: 'white',
            backgroundColor: 'rgba(0,0,0,0.4)', opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? 'auto' : 'none', transition: 'opacity 0.4s',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }, zIndex: 3,
          }}>
            <ArrowBackIosNewIcon />
          </IconButton>

          <IconButton onClick={handleNext} sx={{
            position: 'absolute', top: '50%', right: { xs: 10, md: 40 },
            transform: 'translateY(-50%)', color: 'white',
            backgroundColor: 'rgba(0,0,0,0.4)', opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? 'auto' : 'none', transition: 'opacity 0.4s',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }, zIndex: 3,
          }}>
            <ArrowForwardIosIcon />
          </IconButton>

          <Container sx={{ position: 'relative', zIndex: 2, height: '100%',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', textAlign: 'center'
          }}>
            <Box key={textAnimationKey} sx={{
              animation: 'fadeInUp 1s ease-in-out',
              '@keyframes fadeInUp': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}>
              <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)' }}>{subTitle}</Typography>
              <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold' }}>{title}</Typography>
              <Typography variant="body1" sx={{ mb: 4, textTransform: 'uppercase', letterSpacing: '2px' }}>{description}</Typography>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                bottom: 30,
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: 900,
                width: '90%',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '0 20px',
              }}
            >
              <SearchBarContainer
                sx={{
                  width: '100%',
                  maxWidth: 900,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: '25px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  padding: '10px 20px',
                }}
              >
                {simpleSearchMode ? (
                  <>
                    <InputGroup sx={{ flexGrow: 1, borderRight: 'none', width: '100%' }}>
                      <Icon><SearchIcon /></Icon>
                      <Autocomplete
                        freeSolo
                        sx={{ width: { xs: '100%', sm: '400px' } }}
                        options={categories.map((option) => option.nom)}
                        value={simpleSearchText}
                        onChange={(e, newValue) => setSimpleSearchText(newValue)}
                        onInputChange={(e, newInputValue) => setSimpleSearchText(newInputValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Tapez ici votre recherche..."
                            variant="outlined"
                            fullWidth
                            sx={{ width: { xs: '100%', sm: '400px' } }}
                          />
                        )}
                      />
                    </InputGroup>
                    <SearchButton as={Link} to={getPath()}>
                      RECHERCHE
                    </SearchButton>
                  </>
                ) : (
                  <>
                    <InputGroup sx={{ flexGrow: 1, borderRight: 'none', width: '100%' }}>
                      <Icon><LocationOnIcon /></Icon>
                      <Input placeholder="Quelle destination ?" value={country} onChange={(e) => setCountry(e.target.value)} />
                      <IconButton onClick={handleDetectLocation} sx={{ ml: 1, color: '#181AD6' }}>
                        <MyLocationIcon />
                      </IconButton>
                    </InputGroup>
                    <Autocomplete
                      freeSolo
                      sx={{ width: { xs: '100%', sm: '400px' } }}
                      options={categories.map((option) => option.nom)}
                      value={simpleSearchText}
                      onChange={(e, newValue) => setSimpleSearchText(newValue)}
                      onInputChange={(e, newInputValue) => setSimpleSearchText(newInputValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Tapez ici votre recherche..."
                          variant="outlined"
                          fullWidth
                          sx={{ width: { xs: '100%', sm: '400px' } }}
                        />
                      )}
                    />
                    <InputGroup sx={{ flexGrow: 1, borderRight: 'none', width: '100%' }}>
                      <Input
                        type="text"
                        readOnly
                        value={plus2000 ? 'Budget: 2000+ TND' : `Budget: ${priceRange[0]} - ${priceRange[1]} TND`}
                        onClick={openPricePopper}
                        placeholder="Budget (TND)"
                        sx={{ cursor: 'pointer' }}
                      />
                    </InputGroup>

                    <Popper open={openPrix} anchorEl={anchorPrix} placement="bottom-start" sx={{ zIndex: 1300, p: 1, width: 320 }}>
                      <ClickAwayListener onClickAway={closePrix}>
                        <Box sx={{
                          width: 320, p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 3,
                          display: 'flex', flexDirection: 'column', gap: 2, color: '#111',
                        }}>
                          <Typography variant="subtitle1">Fourchette de prix</Typography>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={plus2000}
                                onChange={(e) => setPlus2000(e.target.checked)}
                                sx={{ color: '#d65113' }}
                              />
                            }
                            label="2000+"
                          />
                          <Typography variant="body2">
                            Prix : {plus2000 ? '2000+' : `${priceRange[0]} TND - ${priceRange[1]} TND`}
                          </Typography>
                          <Slider
                            getAriaLabel={() => 'Prix'}
                            value={priceRange}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={2000}
                            step={5}
                            sx={{ color: '#d65113' }}
                            disabled={plus2000}
                          />
                        </Box>
                      </ClickAwayListener>
                    </Popper>
                    <InputGroup sx={{ flexGrow: 1, width: '100%' }}>
                      <Select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        displayEmpty
                        variant="standard"
                        sx={{
                          flexGrow: 1,
                          width: '100%',
                          '.MuiSelect-select': {
                            padding: '8px 14px',
                          },
                          '&:before, &:after': { borderBottom: 'none !important' },
                        }}
                      >
                        <MenuItem value="today">Aujourd'hui</MenuItem>
                        <MenuItem value="tomorrow">Demain</MenuItem>
                        <MenuItem value="autres">Plus tard</MenuItem>
                      </Select>
                    </InputGroup>
                    <SearchButton as={Link} to={apiUrl}>
                      RECHERCHE
                    </SearchButton>
                  </>
                )}
              </SearchBarContainer>
            </Box>
          </Container>
        </>
      )}
    </Box>
  );
}

export default HeroWithSearch;