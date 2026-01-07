import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  TextField, 
  Button, 
  Avatar, 
  CircularProgress, 
  Chip,
  Card,
  CardContent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReplayIcon from '@mui/icons-material/Replay';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';

const AIChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('aiChatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      {
        id: 1,
        text: "Bonjour ! Je suis votre assistant IA pour découvrir des activités. Je vais vous aider à trouver l'activité parfaite !",
        isUser: false,
        timestamp: new Date(),
      },
      {
        id: 2,
        text: "Pour commencer, quelle date envisagez-vous pour votre activité ?",
        isUser: false,
        timestamp: new Date(),
        isQuestion: true,
        questionType: 'date'
      }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [userPreferences, setUserPreferences] = useState(() => {
    const savedPrefs = localStorage.getItem('aiChatPreferences');
    return savedPrefs ? JSON.parse(savedPrefs) : {
      date: '',
      activityType: '',
      location: '',
      budget: ''
    };
  });
  const [foundActivities, setFoundActivities] = useState(() => {
    const savedActivities = localStorage.getItem('aiChatActivities');
    return savedActivities ? JSON.parse(savedActivities) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    return localStorage.getItem('aiChatCurrentQuestion') || 'date';
  });
  const [activityTypes, setActivityTypes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const popularLocations = [
    'Tunis', 'Hammamet', 'Sousse', 'Djerba', 
    'Monastir', 'Nabeul', 'Bizerte', 'Autre'
  ];

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const getUserName = () => {
    return userName || 'cher visiteur';
  };

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(`https://waw.com.tn/api/api/users/${userId}`);
      const userData = response.data;
      
      if (userData && userData.nom) {
                const fullName = userData.prenom ? `${userData.prenom} ${userData.nom}` : userData.nom;

        setUserName(fullName);
        setUserEmail(userData.email || '');
      } else {
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des infos utilisateur:", error);
    }
  };

  const fetchBusinessInfo = async (businessId) => {
    try {
      const response = await axios.get(`https://waw.com.tn/api/api/business/${businessId}`);
      const businessData = response.data;
      
      if (businessData && businessData.rs) {
        setUserName(businessData.rs);
      } else {
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des infos business:", error);
    }
  };

  const fetchAdminInfo = async (adminId) => {
    try {
      const response = await axios.get(`https://waw.com.tn/api/api/admins/${adminId}`);
      const adminData = response.data;
      
      if (adminData && adminData.nom) {
        setUserName(adminData.nom);
        setUserEmail(adminData.email || '');
      } else {
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des infos admin:", error);
    }
  };

  const checkUserConnection = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const businessId = localStorage.getItem('businessId');
    const adminId = localStorage.getItem('adminId');
    
    
    if ((token || userId || businessId || adminId)) {
      
      if (businessId) {
        fetchBusinessInfo(businessId);
      }
      else if (adminId) {
        fetchAdminInfo(adminId);
      }
      else if (userId) {
        fetchUserInfo(userId);
      }
      
      return true;
    }
      return false;
  };

  useEffect(() => {
    const connected = checkUserConnection();
    setIsUserConnected(connected);
  }, [isOpen]);

  useEffect(() => {
    
    if (isOpen && isUserConnected && userName) {
      const lastUser = localStorage.getItem('aiChatLastUser');
      const currentUser = localStorage.getItem('userId') || localStorage.getItem('businessId') || localStorage.getItem('adminId');
      
      
      if (lastUser !== currentUser) {
        addWelcomeMessage();
        localStorage.setItem('aiChatLastUser', currentUser);
      } else {
      }
    }
  }, [isOpen, isUserConnected, userName]);

  const addWelcomeMessage = () => {
    if (isUserConnected && userName) {
      const welcomeMessage = {
        id: generateUniqueId(),
        text: `Bonjour ${userName} ! 👋 Ravie de vous revoir ! Je suis votre assistant IA pour découvrir des activités. Voulez-vous continuer notre recherche ou commencer une nouvelle ?`,
        isUser: false,
        timestamp: new Date(),
        isQuestion: true,
        questionType: 'welcome',
        quickReplies: ['Continuer la recherche', 'Nouvelle recherche']
      };
      
      setMessages(prev => [welcomeMessage]);
      setCurrentQuestion('welcome');
    }
  };

  useEffect(() => {
    localStorage.setItem('aiChatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('aiChatPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  useEffect(() => {
    localStorage.setItem('aiChatActivities', JSON.stringify(foundActivities));
  }, [foundActivities]);

  useEffect(() => {
    localStorage.setItem('aiChatCurrentQuestion', currentQuestion);
  }, [currentQuestion]);

  useEffect(() => {
    const connected = checkUserConnection();
    setIsUserConnected(connected);
  }, [isOpen]);

  // Vérifier si on doit afficher le message de bienvenue
  useEffect(() => {
    if (isOpen && isUserConnected && userName) {
      const lastUser = localStorage.getItem('aiChatLastUser');
      const currentUser = localStorage.getItem('userId') || localStorage.getItem('businessId') || localStorage.getItem('adminId');
      
      if (lastUser !== currentUser) {
        // Nouvel utilisateur ou utilisateur différent
        addWelcomeMessage();
        localStorage.setItem('aiChatLastUser', currentUser);
      }
    }
  }, [isOpen, isUserConnected, userName]);

  // Charger les types d'activités
  useEffect(() => {
    fetchActivityTypes();
  }, []);

  const fetchActivityTypes = () => {
    setLoadingTypes(true);
    fetch("https://waw.com.tn/api/api/activites/active")
      .then(res => res.json())
      .then(data => {
        const uniqueTypes = [...new Set(data.map(activity => activity.titre))].filter(Boolean);
        setActivityTypes(uniqueTypes);
      })
      .catch(err => console.error("❌ Erreur chargement types d'activités:", err))
      .finally(() => setLoadingTypes(false));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      addAIMessage("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const address = res.data.address;
          const location = address.city || address.town || address.village || address.county || address.state;
          
          if (location) {
            handleQuickResponse(location, 'location');
          } else {
            addAIMessage("Impossible de détecter votre ville. Veuillez la sélectionner manuellement.");
          }
        } catch (err) {
          console.error(err);
          addAIMessage("Erreur lors de la détection de votre position. Veuillez choisir manuellement.");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        let errorMessage = "Impossible d'accéder à votre position.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permission de géolocalisation refusée. Veuillez autoriser l'accès à votre position.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Information de localisation non disponible.";
            break;
          case error.TIMEOUT:
            errorMessage = "La demande de localisation a expiré.";
            break;
        }
        
        addAIMessage(errorMessage);
      },
      {
        timeout: 10000,
        enableHighAccuracy: true
      }
    );
  };

  const addAIMessage = (text) => {
    const aiMessage = {
      id: generateUniqueId(),
      text: text,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleQuickResponse = (response, questionType) => {
    const userMessage = {
      id: generateUniqueId(),
      text: response,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setUserPreferences(prev => ({
      ...prev,
      [questionType]: response
    }));

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      if (questionType === 'budget') {
        searchActivities();
      } else {
        generateNextQuestion(questionType, response);
      }
    }, 1500);
  };

  const generateNextQuestion = (currentQ, response) => {
    let nextQuestion = '';
    let questionText = '';
    let quickReplies = [];

    switch (currentQ) {
      case 'date':
        nextQuestion = 'activityType';
        questionText = `Parfait pour le ${response} ! Quel type d'activité vous intéresse ?`;
        
        if (activityTypes.length === 0 && !loadingTypes) {
          quickReplies = ['Chargement...'];
          fetchActivityTypes();
        } else {
          quickReplies = activityTypes;
        }
        break;
      
      case 'activityType':
        nextQuestion = 'location';
        questionText = `Excellent choix ! Les activités "${response}" sont géniales. Où souhaitez-vous faire cette activité ?`;
        quickReplies = popularLocations;
        break;
      
      case 'location':
        nextQuestion = 'budget';
        questionText = `Super ! ${response} est une belle destination. Quel est votre budget approximatif ?`;
        quickReplies = ['Moins de 50 DT', '50-100 DT', '100-200 DT', 'Plus de 200 DT', 'Peu importe'];
        break;
      
      default:
        nextQuestion = 'complete';
    }

    const aiMessage = {
      id: generateUniqueId(),
      text: questionText,
      isUser: false,
      timestamp: new Date(),
      isQuestion: true,
      questionType: nextQuestion,
      quickReplies: quickReplies
    };

    setMessages(prev => [...prev, aiMessage]);
    setCurrentQuestion(nextQuestion);
    setInputValue('');
  };

  useEffect(() => {
    if (userPreferences.budget && userPreferences.budget !== '') {
      searchActivities();
    }
  }, [userPreferences.budget]);

  const getMinPriceFromActivity = (activity) => {
    if (!activity.scheduleRanges || activity.scheduleRanges.length === 0) {
      return activity.prix || 0;
    }

    let minPrice = Infinity;
    
    activity.scheduleRanges.forEach(range => {
      if (range.dailySchedules && range.dailySchedules.length > 0) {
        range.dailySchedules.forEach(schedule => {
          if (schedule.prixAdulte && schedule.prixAdulte < minPrice) {
            minPrice = schedule.prixAdulte;
          }
        });
      }
    });

    return minPrice !== Infinity ? minPrice : activity.prix || 0;
  };

  const searchActivities = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (userPreferences.activityType) {
        params.append('activite', userPreferences.activityType);
      }
      if (userPreferences.location && userPreferences.location !== 'Autre') {
        params.append('rue', userPreferences.location);
      }
      
      let minPrice = 0;
      let maxPrice = 2000;
      
      if (userPreferences.budget === 'Moins de 50 DT') {
        maxPrice = 50;
      } else if (userPreferences.budget === '50-100 DT') {
        minPrice = 50;
        maxPrice = 100;
      } else if (userPreferences.budget === '100-200 DT') {
        minPrice = 100;
        maxPrice = 200;
      } else if (userPreferences.budget === 'Plus de 200 DT') {
        minPrice = 200;
        maxPrice = 2000000;
      }

      params.append('minPrice', minPrice);
      params.append('maxPrice', maxPrice);

      if (userPreferences.date) {
        const searchDate = new Date(userPreferences.date);
        const formattedDate = searchDate.toISOString().split('T')[0];
        params.append('searchDate', formattedDate);
      }
      const apiUrl = "https://waw.com.tn/api/api/events/search";
      const response = await axios.get(apiUrl, { params });      
      const activities = response.data.slice(0, 5);
      setFoundActivities(activities);

      let resultsMessage;

      if (activities.length === 0) {
        resultsMessage = {
          id: generateUniqueId(),
          text: `😔 Je n'ai trouvé aucune activité correspondant à vos critères. Voulez-vous voir toutes les activités disponibles ou modifier vos critères ?`,
          isUser: false,
          timestamp: new Date(),
          isQuestion: true,
          questionType: 'no_results',
          quickReplies: ['Voir toutes les activités', 'Modifier mes critères', 'Non merci']
        };
      } else {
        resultsMessage = {
          id: generateUniqueId(),
          text: `🎉 J'ai trouvé ${activities.length} activité(s) correspondant à vos critères !`,
          isUser: false,
          timestamp: new Date(),
          isQuestion: true,
          questionType: 'results',
          activities: activities,
          quickReplies: ['Voir plus d\'activités', 'Recommencer']
        };
      }

      setMessages(prev => [...prev, resultsMessage]);

    } catch (error) {
      console.error("❌ Erreur lors de la recherche d'activités:", error);
      addAIMessage("Désolé, une erreur s'est produite lors de la recherche d'activités. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (currentQuestion === 'date') {
      if (!selectedDate) return;
      
      const formattedDate = new Date(selectedDate).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const userMessage = {
        id: generateUniqueId(),
        text: formattedDate,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setUserPreferences(prev => ({
        ...prev,
        date: formattedDate
      }));
      setSelectedDate('');

      setIsLoading(true);
      
      setTimeout(() => {
        setIsLoading(false);
        generateNextQuestion('date', formattedDate);
      }, 1500);

    } else {
      if (inputValue.trim() === '') return;

      const userMessage = {
        id: generateUniqueId(),
        text: inputValue,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInputValue('');

      setIsLoading(true);
      
      setTimeout(() => {
        setIsLoading(false);
        if (currentQuestion === 'budget') {
          setUserPreferences(prev => ({
            ...prev,
            budget: inputValue
          }));
          searchActivities();
        } else {
          generateNextQuestion(currentQuestion, inputValue);
        }
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

 const handleActivityClick = (activityId) => {
  window.location.href = `/detailsEvent?id=${activityId}`;
   setIsOpen(false); 
};

  const handleCompleteAction = (action) => {
    const userResponse = {
      id: generateUniqueId(),
      text: action,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userResponse]);

    setTimeout(() => {
      switch (action) {
        case 'Continuer la recherche':
          const continueMessage = {
            id: generateUniqueId(),
            text: "Parfait ! Continuons notre recherche d'activités.",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, continueMessage]);
          break;

        case 'Nouvelle recherche':
          resetChat();
          break;

        case 'Voir plus d\'activités':
        case 'Voir toutes les activités':
          const queryParams = new URLSearchParams({
            date: userPreferences.date,
            type: userPreferences.activityType,
            country: userPreferences.location,
            budget: userPreferences.budget,
            source: 'ai-chat'
          }).toString();
          
          const redirectMessage = {
            id: generateUniqueId(),
            text: "Parfait ! Je vous redirige vers toutes nos activités...",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, redirectMessage]);
          
          setTimeout(() => {
            setIsOpen(false);
            navigate(`/decouvrir?${queryParams}`);
          }, 1500);
          break;

        case 'Modifier mes critères':
          const modifyMessage = {
            id: generateUniqueId(),
            text: "Très bien ! Modifions vos critères de recherche.",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, modifyMessage]);
          
          setTimeout(() => {
            const dateQuestion = {
              id: generateUniqueId(),
              text: "Pour commencer, quelle date envisagez-vous pour votre activité ?",
              isUser: false,
              timestamp: new Date(),
              isQuestion: true,
              questionType: 'date'
            };
            setMessages(prev => [...prev, dateQuestion]);
            setCurrentQuestion('date');
          }, 1000);
          break;

        case 'Non merci':
          const thankYouMessage = {
            id: generateUniqueId(),
            text: "Merci d'avoir utilisé notre assistant ! N'hésitez pas à revenir si vous cherchez d'autres activités. À bientôt ! 👋",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, thankYouMessage]);
          
          setTimeout(() => setIsOpen(false), 3000);
          break;

        case 'Recommencer':
          const restartMessage = {
            id: generateUniqueId(),
            text: "Parfait ! Recommençons notre recherche d'activités.",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, restartMessage]);
          
          setTimeout(() => resetChat(), 1000);
          break;

        default:
          break;
      }
    }, 500);
  };

  const resetChat = () => {
    const initialMessages = [
      {
        id: generateUniqueId(),
        text: isUserConnected && userName
          ? `Bonjour ${userName} ! 👋 Je suis votre assistant IA pour découvrir des activités. Je vais vous aider à trouver l'activité parfaite !`
          : "Bonjour ! Je suis votre assistant IA pour découvrir des activités. Je vais vous aider à trouver l'activité parfaite !",
        isUser: false,
        timestamp: new Date(),
      },
      {
        id: generateUniqueId(),
        text: "Pour commencer, quelle date envisagez-vous pour votre activité ?",
        isUser: false,
        timestamp: new Date(),
        isQuestion: true,
        questionType: 'date'
      }
    ];

    setMessages(initialMessages);
    setUserPreferences({
      date: '',
      activityType: '',
      location: '',
      budget: ''
    });
    setFoundActivities([]);
    setCurrentQuestion('date');
    setSelectedDate('');
    setInputValue('');
    
    localStorage.removeItem('aiChatMessages');
    localStorage.removeItem('aiChatPreferences');
    localStorage.removeItem('aiChatActivities');
    localStorage.removeItem('aiChatCurrentQuestion');
  };

  const getQuickReplyColor = (questionType) => {
    switch (questionType) {
      case 'date': return 'primary';
      case 'activityType': return 'secondary';
      case 'location': return 'success';
      case 'budget': return 'warning';
      case 'welcome': return 'primary';
      default: return 'primary';
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 65,
        right: 20,
        zIndex: 1000,
      }}
    >
      {isOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: { xs: 'calc(100vw - 40px)', sm: 420 },
            height: { xs: '70vh', sm: 550 },
            maxWidth: 420,
            maxHeight: { xs: '80vh', sm: 600 },
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            border: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1001,
            overflow: 'hidden',
            '@media (max-width: 400px)': {
              right: 10,
              left: 10,
              width: 'calc(100vw - 20px)',
            }
          }}
        >
          <Box
            sx={{
              padding: 2,
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: '#181AD6',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon />
              <Box>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                  Assistant Activités
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                  {isUserConnected && userName ? `Connecté en tant que ${userName}` : 'Trouvez l\'activité parfaite'}
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              sx={{ color: 'white' }}
              onClick={handleCloseChat}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              padding: 2,
              overflowY: 'auto',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {messages.map((message) => (
              <Box key={message.id}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  {!message.isUser && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#181AD6' }}>
                      <SmartToyIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      maxWidth: '80%',
                      padding: 1.5,
                      borderRadius: 2,
                      backgroundColor: message.isUser ? '#181AD6' : 'white',
                      color: message.isUser ? 'white' : 'text.primary',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {message.text}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        mt: 0.5,
                        opacity: 0.7,
                        fontSize: '0.7rem'
                      }}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </Box>

                {message.activities && message.activities.length > 0 && (
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Activités trouvées :
                    </Typography>
                    {message.activities.map((activity, index) => (
                      <Card 
                        key={activity.id || index}
                        sx={{ 
                          mb: 1, 
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: 3,
                            backgroundColor: '#f5f5f5'
                          }
                        }}
                        onClick={() => handleActivityClick(activity.id)}
                      >
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            {activity.nom}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            À partir de {getMinPriceFromActivity(activity)} DT • {activity.rue}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}

                {message.isQuestion && message.quickReplies && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, mb: 2 }}>
                    {message.questionType === 'location' && (
                      <Chip
                        icon={<LocationOnIcon />}
                        label={isDetectingLocation ? "Détection..." : "📍 Ma localisation"}
                        onClick={handleDetectLocation}
                        color="success"
                        variant="outlined"
                        disabled={isDetectingLocation}
                        sx={{ 
                          cursor: isDetectingLocation ? 'default' : 'pointer',
                          '&:hover': !isDetectingLocation ? {
                            backgroundColor: '#181AD6',
                            color: 'white'
                          } : {}
                        }}
                      />
                    )}
                    {message.quickReplies.map((reply, index) => (
                      <Chip
                        key={index}
                        label={reply}
                        onClick={() => {
                          if (message.questionType === 'welcome') {
                            handleCompleteAction(reply);
                          } else if (message.questionType === 'results' || message.questionType === 'no_results') {
                            handleCompleteAction(reply);
                          } else {
                            handleQuickResponse(reply, message.questionType);
                          }
                        }}
                        color={getQuickReplyColor(message.questionType)}
                        variant="outlined"
                        disabled={reply === 'Chargement...'}
                        sx={{ 
                          cursor: reply === 'Chargement...' ? 'default' : 'pointer',
                          '&:hover': reply !== 'Chargement...' ? {
                            backgroundColor: '#181AD6',
                            color: 'white'
                          } : {}
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            ))}

            {(isLoading || isDetectingLocation) && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1, mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#181AD6' }}>
                  <SmartToyIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Box
                  sx={{
                    padding: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'white',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <CircularProgress size={16} />
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    {isDetectingLocation ? "Détection de votre position..." : "Recherche en cours..."}
                  </Typography>
                </Box>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', backgroundColor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                onClick={resetChat}
                sx={{
                  backgroundColor: '#FF7900',
                  color: 'white',
                  minWidth: 'auto',
                  px: 2,
                  '&:hover': {
                    backgroundColor: '#e56a00',
                  },
                }}
              >
                <ReplayIcon sx={{ fontSize: 18 }} />
              </Button>

              {currentQuestion === 'date' ? (
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                  <DatePicker
                    value={selectedDate}
                    onChange={(newValue) => {
                      setSelectedDate(newValue);
                    }}
                    minDate={new Date()}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        sx: {
                          '& .MuiInputBase-input': {
                            padding: '8px 12px',
                          }
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
              ) : (
                <TextField
                  placeholder="Tapez votre réponse..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  multiline
                  maxRows={2}
                  fullWidth
                  size="small"
                  disabled={isLoading || isDetectingLocation}
                />
              )}

              <Button
                onClick={handleSendMessage}
                disabled={
                  (currentQuestion === 'date' ? !selectedDate : !inputValue.trim()) || 
                  isLoading || 
                  isDetectingLocation
                }
                sx={{
                  backgroundColor: '#181AD6',
                  color: 'white',
                  minWidth: 'auto',
                  px: 2,
                  '&:hover': {
                    backgroundColor: '#1517b8',
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc',
                  }
                }}
              >
                <SendIcon sx={{ fontSize: 18 }} />
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          backgroundColor: '#181AD6',
          color: 'white',
          width: 60,
          height: 60,
          borderRadius: '50%',
          boxShadow: '0 4px 15px rgba(24, 26, 214, 0.3)',
          '&:hover': {
            backgroundColor: '#1517b8',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <SmartToyIcon />
      </IconButton>

      {isOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={handleCloseChat}
        />
      )}
    </Box>
  );
};

export default AIChatButton;