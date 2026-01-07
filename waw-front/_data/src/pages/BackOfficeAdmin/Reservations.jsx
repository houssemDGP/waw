import React, { useState, useEffect,useRef } from 'react';
import styled from 'styled-components';
import {
  Drawer,
  Divider,
  Toolbar,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Container,
  Box,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SideBar from './SideBar';
import { Modal } from '@mui/material';
import axios from 'axios';
const API_URL = 'http://102.211.209.131:3011/api/business';




const Container2 = styled.div`
  font-family: 'Poppins', sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
  padding: 0 1rem;
`;
const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;
const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;
const DayBox = styled.div`
  background: ${({ selected }) => (selected ? '#1976d2' : '#fff')};
  color: ${({ selected }) => (selected ? '#fff' : '#333')};
  padding: ${({ isMobile }) => (isMobile ? '8px' : '12px')};
  border-radius: 8px;
  min-height: ${({ isMobile }) => (isMobile ? '60px' : '80px')};
  cursor: pointer;
  border: 1px solid #ddd;
  text-align: center;
  font-size: ${({ isMobile }) => (isMobile ? '0.75rem' : '0.85rem')};
  transition: 0.2s;

  &:hover {
    background: ${({ selected }) => (selected ? '#1565c0' : '#f5f5f5')};
  }

  small {
    display: block;
    margin-top: 4px;
    font-size: ${({ isMobile }) => (isMobile ? '0.6rem' : '0.7rem')};
    color: ${({ selected }) => (selected ? '#cfd8dc' : '#888')};
  }
`;
const getMonthGrid = (currentDate) => {
  const startOfMonth = dayjs(currentDate).startOf('month');
  const endOfMonth = dayjs(currentDate).endOf('month');
  const startWeekDay = startOfMonth.day();
  const daysInMonth = endOfMonth.date();
  const days = [];
  for (let i = 0; i < startWeekDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(dayjs(currentDate).date(d));
  return days;
};

const AgendaDayView = () => {
      const targetRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [allReservations, setAllReservations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('table');
  const [businessesByDate, setBusinessesByDate] = useState({});
const [groupedByBusiness, setGroupedByBusiness] = useState({});
const [flatReservations, setFlatReservations] = useState([]);
 useEffect(() => {
  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      const { grouped, flat } = transformBusinessReservations(response.data);
      setGroupedByBusiness(grouped);
      setFlatReservations(flat);
      setBusinessesByDate(getBusinessesByDate(grouped));
      console.log(response.data);
    } catch (e) {
      console.error(e);
      setError("Échec de récupération des données.");
    } finally {
      setLoading(false);
    }
  };

  fetchReservations();
}, []);

const fetchReservations = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await axios.get(API_URL);
    const { grouped, flat } = transformBusinessReservations(response.data);
    setGroupedByBusiness(grouped);
    setFlatReservations(flat);
  } catch (e) {
    console.error(e);
    setError("Échec de récupération des données.");
  } finally {
    setLoading(false);
  }
};

const transformBusinessReservations = (businesses) => {
  const groupedByBusiness = {};
  const flatReservationsArray = [];

  businesses.forEach(business => {
    const businessName = business.nom || 'Business inconnu';
    if (!groupedByBusiness[businessName]) groupedByBusiness[businessName] = { events: {} };

    business.events?.forEach(event => {
      const eventName = event.nom || 'Événement inconnu';

      event.reservations?.forEach(res => {
        const date = res.date ? dayjs(res.date) : dayjs();
        const formattedDate = date.format('YYYY-MM-DD');
        const clientName = res.nomClient || 'Client Inconnu';
        const startTime = res.dailyScheduleReservation?.startTime || 'N/A';
        const endTime = res.dailyScheduleReservation?.endTime || 'N/A';
        const capacity = res.formule?.capacity || 0;
        const numPeople = res.personnes?.length || 1;
        const statut = res.status || 'EN_ATTENTE';
        const paiement = res.paymentMethods || 'Non spécifié';
        const personnes = res.personnes;

        const transformedRes = {
          id: res.id,
          client: clientName,
          date: res.date,
          start: startTime,
          end: endTime,
          statut,
          paiement,
          max: capacity,
          quantity: numPeople,
          originalDate: date,
          activity: event.nom,
          personnes
        };

        if (!groupedByBusiness[businessName].events[eventName]) {
          groupedByBusiness[businessName].events[eventName] = [];
        }
        groupedByBusiness[businessName].events[eventName].push(transformedRes);
        flatReservationsArray.push(transformedRes);
      });
    });
  });

  return { grouped: groupedByBusiness, flat: flatReservationsArray };
};
const getBusinessesByDate = (groupedByBusiness) => {
  const businessesByDate = {};
  Object.entries(groupedByBusiness).forEach(([businessName, businessData]) => {
    Object.values(businessData.events).forEach(eventReservations => {
      eventReservations.forEach(res => {
        const dateStr = res.originalDate.format('YYYY-MM-DD');
        if (!businessesByDate[dateStr]) businessesByDate[dateStr] = new Set();
        businessesByDate[dateStr].add(businessName);
      });
    });
  });

  // Convert sets to arrays
  Object.keys(businessesByDate).forEach(date => {
    businessesByDate[date] = Array.from(businessesByDate[date]);
  });

  return businessesByDate;
};


  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMER': return 'success';
      case 'EN_ATTENTE': return 'warning';
      case 'ANNULER': return 'error';
      default: return 'default';
    }
  };

  const handleViewChange = (_, nextView) => {
    if (nextView) setView(nextView);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const transformedReservationsForTable = flatReservations.reduce((acc, res) => {
    const activity = res.activity;
    if (!acc[activity]) acc[activity] = [];
    acc[activity].push(res);
    return acc;
  }, {});
  const reservationsForSelectedDate = allReservations[selectedDate.format('YYYY-MM-DD')] || [];
const exportReservationsToPDF = () => {
  const doc = new jsPDF();

  const logoImg = new Image();
  logoImg.src = '/logo/waw.png'; // ton logo

  logoImg.onload = () => {
    // ➤ Titre à gauche
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("WHEN AND WHERE", 14, 20);

    // ➤ Logo à droite
    doc.addImage(logoImg, 'PNG', 150, 10, 40, 30); // x=150, y=10, largeur=40, hauteur=30

    // ➤ Titre secondaire
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Liste des réservations", 14, 40);

    const tableColumn = ["Business", "Activité", "Date", "Client", "Heure", "Places", "Paiement", "Statut", "Participants"];
    const tableRows = [];

    Object.entries(groupedByBusiness).forEach(([businessName, businessData]) => {
      Object.entries(businessData.events).forEach(([eventName, reservations]) => {
        reservations.forEach(res => {
          const participants = res.personnes && res.personnes.length > 0
            ? res.personnes.map(p => `${p.nom} ${p.prenom} (${p.type || "N/A"})`).join(', ')
            : "Aucun";

          const rowData = [
            businessName,
            eventName,
            res.originalDate.format('YYYY-MM-DD'),
            res.client,
            `${res.start} - ${res.end}`,
            `${res.quantity} / ${res.max}`,
            res.paiement,
            res.statut,
            participants
          ];
          tableRows.push(rowData);
        });
      });
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [247, 107, 28] }, // orange
    });

    doc.save('reservations.pdf');
  };
};



const exportSingleReservationToPDF = (res, businessName, eventName) => {
  const doc = new jsPDF();

  const logoImg = new Image();
  logoImg.src = '/logo/waw.png'; // ton logo

  logoImg.onload = () => {
    // ➤ Ajouter Titre à gauche
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("WHEN AND WHERE", 14, 20); // position x=14, y=20

    // ➤ Ajouter Logo à droite
    doc.addImage(logoImg, 'PNG', 150, 10, 40, 30); // x=150, y=10, largeur=40, hauteur=15

    // ➤ Titre secondaire
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Détail de la réservation", 14, 40);

    const rows = [
      ["Business", businessName],
      ["Activité", eventName],
      ["Date", res.originalDate.format('YYYY-MM-DD')],
      ["Heure", `${res.start} - ${res.end}`],
      ["Client", res.client],
      ["Places réservées", `${res.quantity} / ${res.max}`],
      ["Paiement", res.paiement],
      ["Statut", res.statut]

    ];

    if (res.personnes && res.personnes.length > 0) {
      res.personnes.forEach((person, index) => {
        rows.push([
          `Participant ${index + 1}`,
          `${person.nom} ${person.prenom} (${person.type || "N/A"})`
        ]);
      });
    } else {
      rows.push(["Participants", "Aucun"]);
    }

    rows.forEach(([label, value], i) => {
      const y = 50 + i * 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`${label}:`, 14, y);
      doc.setFontSize(14);
      doc.text(String(value), 60, y);
    });

    doc.save(`reservation_${res.id}.pdf`);
  };
};

const exportSingleEventToPDF = (businessName, eventName, reservations) => {
  const doc = new jsPDF();

  const logoImg = new Image();
  logoImg.src = '/logo/waw.png';

  logoImg.onload = () => {
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("WHEN AND WHERE", 14, 20);
    doc.addImage(logoImg, 'PNG', 150, 10, 40, 30);

    doc.setFontSize(14);
    doc.text(`Réservations - ${eventName}`, 14, 40);

    const tableColumn = ["Date", "Client", "Heure", "Places", "Paiement", "Statut", "Participants"];
    const tableRows = reservations.map(res => {
      const participants = res.personnes?.length
        ? res.personnes.map(p => `${p.nom} ${p.prenom} (${p.type || "N/A"})`).join(', ')
        : "Aucun";

      return [
        res.originalDate.format('YYYY-MM-DD'),
        res.client,
        `${res.start} - ${res.end}`,
        `${res.quantity} / ${res.max}`,
        res.paiement,
        res.statut,
        participants
      ];
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [247, 107, 28] },
    });

    doc.save(`reservations_${businessName}_${eventName}.pdf`);
  };
};


  return (
        <Box sx={{ display: "flex" }}>
      <SideBar />

      {/* Main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
      >
        <Toolbar />
    <Container2>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box p={3}>
            <Typography variant="h4">Agenda</Typography>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
  <Button variant="contained" color="primary" onClick={exportReservationsToPDF}>
    Exporter PDF
  </Button>
</Box>

            <CalendarContainer>
              <CalendarHeader>
                <button onClick={() => setSelectedDate(prev => prev.subtract(1, 'month'))}>⬅</button>
                <h3>{selectedDate.format('MMMM YYYY')}</h3>
                <button onClick={() => setSelectedDate(prev => prev.add(1, 'month'))}>➡</button>
              </CalendarHeader>
              <CalendarGrid>
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                  <strong key={day} style={{ textAlign: 'center' }}>{day}</strong>
                ))}
              {getMonthGrid(selectedDate).map((day, idx) => {
  if (!day) return <div key={idx}></div>;
  const dayStr = day.format('YYYY-MM-DD');
  const businessNames = businessesByDate[dayStr] || [];
  const isSelected = day.isSame(selectedDate, 'day');
  return (
    <DayBox
      key={dayStr}
      selected={isSelected}
      isMobile={isMobile}
      onClick={() => {setSelectedDate(day);
                          if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
    }}
    >
      {day.format('D')}
      {businessNames.map((name, i) => (
        <small
          key={i}
          style={{
            display: 'block',
            backgroundColor: '#1976d2',
            color: 'white',
            padding: '2px 6px',
            borderRadius: 4,
            marginTop: 2,
            fontWeight: 'bold',
            cursor: 'default'
          }}
          title={`Business avec réservation ce jour`}
        >
          {name}
        </small>
      ))}
    </DayBox>
  );
})}
              </CalendarGrid>
            </CalendarContainer>

            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              size="small"
              color="primary"
              fullWidth={isMobile}
              sx={{ my: 2 }}

            >
              <ToggleButton value="table">Vue tableau</ToggleButton>
              <ToggleButton value="grid">Vue carte</ToggleButton>
            </ToggleButtonGroup>

            {loading ? (
              <Typography>Chargement...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : view === 'table' ? (
              <Container>
  <Container  ref={targetRef}>
{Object.entries(groupedByBusiness).map(([businessName, businessData]) => (
  <Accordion key={businessName} defaultExpanded>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h6">{businessName}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      {Object.entries(businessData.events).map(([eventName, reservations]) => {
        // Filtrer par date sélectionnée
        const filteredReservations = reservations.filter(res =>
          res.originalDate.isSame(selectedDate, 'day')
        );
        console.log(filteredReservations);
        // Ne rien afficher si pas de réservations à cette date
        if (filteredReservations.length === 0) return null;

        return (
          <Accordion key={eventName} sx={{ mb: 2 }} defaultExpanded>
<AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <Typography variant="subtitle1">
    {eventName} ({filteredReservations.length})
  </Typography>
  <Button
    variant="outlined"
    size="small"
    onClick={(e) => {
      e.stopPropagation(); // évite d’ouvrir l’accordion
      exportSingleEventToPDF(businessName, eventName, filteredReservations);
    }}
    sx={{ marginLeft: 'auto' }}
  >
    Exporter
  </Button>
</AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Heure</TableCell>
                      <TableCell>Client</TableCell>
                      <TableCell>Places</TableCell>
                      <TableCell>Paiement</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Actions</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredReservations.map((res, i) => (
                      <TableRow key={i}>
                        <TableCell>{res.originalDate.format('YYYY-MM-DD')}</TableCell>
                        <TableCell>{res.start} - {res.end}</TableCell>
                        <TableCell>{res.client}</TableCell>
                        <TableCell>{res.quantity} / {res.max}</TableCell>
                        <TableCell>{res.paiement}</TableCell>
                        <TableCell>
                          <Chip label={res.statut} color={getStatusColor(res.statut)} size="small" />
                        </TableCell>
                        <TableCell>
  <Button 
    size="small" 
    variant="outlined" 
    onClick={() => exportSingleReservationToPDF(res, businessName, eventName)}
  >
    Exporter
  </Button>
</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </AccordionDetails>
  </Accordion>
))}

  </Container>

              </Container>
            ) : (
              <Typography>Vue carte non encore implémentée.</Typography>
            )}
          </Box>
        </LocalizationProvider>
    </Container2>
          </Box>

    </Box> 
  );
};

export default AgendaDayView;