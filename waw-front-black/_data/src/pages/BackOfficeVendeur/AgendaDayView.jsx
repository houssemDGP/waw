import React, { useState, useEffect,useRef } from 'react';
import styled from 'styled-components';
import {
  Drawer,
  Divider,
  Toolbar,
  TextField,
} from '@mui/material';
import {
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
  Stack, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { fetchEventsByBusinessId } from '../../api/event';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import SideBar from "./SideBar";
import { Modal } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, isSameDay } from 'date-fns';
import axios from 'axios'; // Import axios


const hours = Array.from({ length: 12 }, (_, i) => `${8 + i}h00`);

const activityColors = {
  'Jet': '#4fc3f7',
  'Équitation': '#81c784',
  'Coach': '#ffb74d',
  'Beach': '#ce93d8',
};

// ---- Styled Components ---- //
const Layout = styled.div`
  display: flex;
`;

const Main = styled.main`
  flex-grow: 1;
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const AgendaContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const LeftPane = styled.div`
  flex: 1;
  padding: 16px 32px;
  overflow-y: auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 16px;
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  margin-top: 32px;
`;

const TimeColumn = styled.div`
  div {
    height: 100px;
    border-bottom: 1px solid #ccc;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
  }
`;

const EventColumn = styled.div`
  position: relative;
  border-left: 1px solid #ccc;
  div {
    height: 100px;
    border-bottom: 1px solid #eee;
  }
`;

const ReservationBlock = styled.div`
  position: absolute;
  padding: 12px;
  border-radius: 6px;
  color: white;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
`;

const DrawerContent = styled.div`
  width: 300px;
  padding: 16px;
`;

const ReservationLabel = styled.p`
  margin: 6px 0;
  font-size: 0.9rem;
`;
const CenteredModalBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 360px;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.2);
  outline: none;
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
  const startWeekDay = startOfMonth.day(); // 0 (Sunday) to 6 (Saturday)
  const daysInMonth = endOfMonth.date();

  const days = [];

  // Add empty cells before the 1st
  for (let i = 0; i < startWeekDay; i++) {
    days.push(null);
  }

  // Fill the actual days of month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(dayjs(currentDate).date(d));
  }

  return days;
};

const API_URL = 'http://102.211.209.131:3011/api/reservations'; // Your API endpoint

const AgendaDayView = () => {
    const targetRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [allReservations, setAllReservations] = useState({}); // Stores all fetched reservations grouped by date
  const [flatReservations, setFlatReservations] = useState([]); // Stores all fetched reservations as a flat array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('table'); // Default to table view

useEffect(() => {
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Appel avec ta fonction importée
      const data = await fetchEventsByBusinessId(); // ajoute un paramètre si besoin, par ex. (businessId)
      const { grouped, flat } = transformEventsToReservations(data);
      setAllReservations(grouped);
      setFlatReservations(flat);
    } catch (e) {
      console.error("Erreur lors de la récupération des événements:", e);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  fetchEvents();
}, []);

const transformEventsToReservations = (events) => {
  const groupedReservations = {};
  const flatReservationsArray = [];

  events.forEach(event => {
    const eventName = event.nom || 'Événement inconnu';

    event.reservations.forEach(res => {
      if (!res.date) return; // On ignore les réservations sans date

      const date = dayjs(res.date);
      const formattedDate = date.format('YYYY-MM-DD');

      const clientName = res.nomClient || 'Client Inconnu';
      const startTime = res.dailyScheduleReservation?.startTime || 'N/A';
      const endTime = res.dailyScheduleReservation?.endTime || 'N/A';
      const capacity = res.formule?.capacity || 0;
      const quantity = Number(res.nbrAdulte || 0) + Number(res.nbrEnfant || 0) + Number(res.nbrBebe || 0);

      const transformedRes = {
        id: res.id,
        activity: eventName,
        client: clientName,
        status: res.status || 'N/A',
        start: startTime,
        end: endTime,
        date: res.date,
        originalDate: date,
        max: capacity,
        quantity,
        paiement: res.paymentMethods || 'Non spécifié',
        formuleLabel: res.formule?.label || '',
      };

      if (!groupedReservations[formattedDate]) {
        groupedReservations[formattedDate] = [];
      }
      groupedReservations[formattedDate].push(transformedRes);
      flatReservationsArray.push(transformedRes);
    });
  });

  return { grouped: groupedReservations, flat: flatReservationsArray };
};


  const handleReservationClick = (res) => {
    console.log('handleReservationClick: Réservation sélectionnée pour la modale:', res);
    setSelectedReservation(res);
    setDrawerOpen(true);
  };

  const handleEditReservation = (reservation) => {
    console.log('handleEditReservation: Modifier la réservation:', reservation);
    // Implement logic to open an edit dialog for a specific reservation
  };

const handleDeleteReservation = async (reservation) => {
    console.log('handleDeleteReservation: Supprimer la réservation:', reservation);
    if (!reservation || !reservation.id) {
      console.error("Cannot delete: Reservation or Reservation ID is missing.");
      return;
    }

    // Optional: Add a confirmation dialog before deleting
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la réservation pour ${reservation.client} (${reservation.activity}) ?`)) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${reservation.id}`); // Use axios.delete
      console.log(`Reservation with ID ${reservation.id} deleted successfully.`);
      window.location.reload();

    } catch (error) {
      console.error("Error deleting reservation:", error);
      setError("Failed to delete reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const handleChangeStatus = async (reservation, newStatus) => {
    console.log(`handleChangeStatus: Changing status for ${reservation.client} to ${newStatus}`);

    if (!reservation || !reservation.id) {
      console.error("Cannot change status: Reservation or Reservation ID is missing.");
      setError("Cannot update reservation: Missing ID.");
      return;
    }

    // Optional: Add a confirmation dialog
    if (!window.confirm(`Are you sure you want to change the status of ${reservation.client} to ${newStatus}?`)) {
      return;
    }

    try {
      setLoading(true); // Show loading indicator
      setError(null); // Clear previous errors

      const url = `${API_URL}/${reservation.id}/status?newStatus=${newStatus}`;

      const response = await axios.put(url);

      console.log(`Status updated successfully for reservation ID ${reservation._id}:`, response.data);
      window.location.reload();


    } catch (err) {
      console.error("Error updating reservation status:", err);
      if (err.response) {
        setError(`Failed to update status: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setError("Failed to update status: No response from server. Check network connection.");
      } else {
        setError("Failed to update status: An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditActivity = (activity) => {
    console.log(`handleEditActivity: Modifier l'activité: ${activity}`);
    // Implement logic to open an edit dialog or navigate to an edit page
  };
  const handleDeleteActivity = (activity) => {
    console.log(`handleDeleteActivity: Supprimer l'activité: ${activity}`);
    // Implement logic to confirm deletion and then remove the activity
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMER':
        return 'success';
      case 'EN_ATTENTE':
        return 'warning';
      case 'ANNULER':
        return 'error';
      default:
        return 'default';
    }
  };
  

  const handleViewChange = (_, nextView) => {
    if (nextView !== null) {
      console.log('handleViewChange: Changer la vue vers:', nextView);
      setView(nextView);
    }
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Prepare reservations grouped by activity for the table view (all reservations)
  const transformedReservationsForTable = flatReservations.reduce((acc, res) => {
    const activity = res.activity;
    if (!acc[activity]) acc[activity] = [];
    acc[activity].push(res);
    return acc;
  }, {});
  console.log('transformedReservationsForTable (pour Vue tableau):', transformedReservationsForTable);

  // Get reservations for the currently selected date for the grid view
  const reservationsForSelectedDate = allReservations[selectedDate.format('YYYY-MM-DD')] || [];
  console.log('reservationsForSelectedDate (pour Vue carte, date sélectionnée):', selectedDate.format('YYYY-MM-DD'), '->', reservationsForSelectedDate);

  return (
    <Layout>
      <SideBar />
      <Main>
        <Toolbar />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AgendaContainer>
            <LeftPane>
              <Title>📅 Agenda</Title> {/* Removed date from title as it's not filtered anymore */}
              {/* Calendar remains to show activity counts per day */}
              <CalendarContainer>
                <CalendarHeader>
                  <button onClick={() => {
                    setSelectedDate(prev => prev.subtract(1, 'month'));
                    console.log('Calendar: Mois précédent sélectionné.');
                  }}>⬅</button>
                  <h3>{selectedDate.format('MMMM YYYY')}</h3>
                  <button onClick={() => {
                    setSelectedDate(prev => prev.add(1, 'month'));
                    console.log('Calendar: Mois suivant sélectionné.');
                  }}>➡</button>
                </CalendarHeader>

                <CalendarGrid>
                  {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                    <strong key={day} style={{ textAlign: 'center' }}>{day}</strong>
                  ))}
                  {getMonthGrid(selectedDate).map((day, idx) => {
                    if (!day) return <div key={idx}></div>;

                    const dayStr = day.format('YYYY-MM-DD');
                    const reservations = allReservations[dayStr] || []; // Use grouped data for calendar

                    // Count reservations by activity for the calendar view
                    const activityCount = reservations.reduce((acc, res) => {
                      acc[res.activity] = (acc[res.activity] || 0) + 1;
                      return acc;
                    }, {});

                    const uniqueActivities = [...new Set(reservations.map(r => r.activity))];

                    const isSelected = day.isSame(selectedDate, 'day');

                    return (
                      <DayBox
                        key={dayStr}
                        selected={isSelected}
                        isMobile={isMobile}
                        onClick={() => {
                          setSelectedDate(day);
                          console.log('Calendar: Date sélectionnée:', day.format('YYYY-MM-DD'));
                          if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
                        }}

                      >
                        {day.format('D')}

                        {uniqueActivities.map((activity, i) => {
                          const firstRes = reservations.find(r => r.activity === activity);
                          if (!firstRes) return null;
                          const count = activityCount[activity];
                          const max = firstRes.max;

                          const isFull = count >= max;

                          return (
                            <small
                              key={i}
                              style={{
                                display: 'block',
                                backgroundColor: isFull ? 'red' : 'green',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: 4,
                                marginTop: 2,
                                fontWeight: 'bold',
                              }}
                              title={`${activity} : ${count} / ${max} réservations`}
                            >
                              {activity} {isFull ? 'complet' : 'disponible'}
                            </small>
                          );
                        })}

                        {reservations.length > 0 && (
                          <small>{reservations.length} réservation{reservations.length > 1 ? 's' : ''}.</small>
                        )}
                      </DayBox>
                    );
                  })}
                </CalendarGrid>
              </CalendarContainer>

              <Box sx={{ width: isMobile ? '100%' : 'auto', mb: 2 }}  ref={targetRef}>
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={handleViewChange}
                  size="small"
                  color="primary"
                  fullWidth={isMobile}
                >
                  <ToggleButton value="table">Vue tableau (Sélection Date)</ToggleButton>
                  <ToggleButton value="grid">Vue carte (Sélection Date)</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {loading ? (
                <Typography>Chargement des réservations...</Typography>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : view === 'table' ? (
                <Box sx={{ display: "flex" }}>
                  <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
                    <Container sx={{ py: 4 }}>
                      {Object.entries(transformedReservationsForTable).length === 0 && (
                         <Typography variant="body1" color="textSecondary" sx={{textAlign: 'center', py: 3}}>
                            Aucune réservation trouvée dans la base de données.
                         </Typography>
                      )}
                      {Object.entries(transformedReservationsForTable).map(([activity, reservations]) => {
                        console.log(`Rendering Accordion for Activity: ${activity}, Reservations count: ${reservations.length}`);
                        return (
                          <Accordion key={activity} defaultExpanded sx={{ mb: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 2 }}>
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>{activity} ({reservations.length})</Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <TableContainer component={Paper}>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Date</TableCell> {/* Added Date column */}
                                      {activity === 'Beach Bar' ? (
                                        <>
                                          <TableCell>Table</TableCell>
                                          <TableCell>Horaire</TableCell>
                                        </>
                                      ) : (
                                        <TableCell>Créneau horaire</TableCell>
                                      )}
                                      <TableCell>Client</TableCell>
                                      <TableCell>Places réservées / max</TableCell>
                                      <TableCell>Paiement</TableCell>
                                      <TableCell>Statut</TableCell>
                                      <TableCell>Actions</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {reservationsForSelectedDate.length > 0 ? (
                                      reservationsForSelectedDate.map((res, idx) => {
                                        console.log(`Rendering Table Row for: ${res.client} on ${res.originalDate.format('YYYY-MM-DD')} for ${activity}`);
                                        return (
                                        <TableRow key={idx}>
                                          <TableCell>{res.originalDate.format('YYYY-MM-DD')}</TableCell> {/* Display the date */}
                                          {activity === 'Beach Bar' ? (
                                            <>
                                              <TableCell>{res.table}</TableCell>
                                              <TableCell>{res.time}</TableCell>
                                            </>
                                          ) : (
                                            <TableCell>du {res.start} au {res.end}</TableCell>
                                          )}
                                          <TableCell>{res.client}</TableCell>
                                          <TableCell>{`${res.quantity} / ${res.max}`}</TableCell>
                                          <TableCell>{res.paiement}</TableCell> {/* Corrected to res.paiement */}
                                          <TableCell>
                                            <Stack direction="column" spacing={0.5}>
                                              <Chip label={res.status} color={getStatusColor(res.status)} size="small" />
                                              {res.status === 'EN_ATTENTE' && (
                                                <Button variant="outlined" size="small" color="success" onClick={() => handleChangeStatus(res, 'CONFIRMER')}>
                                                  Confirmer
                                                </Button>
                                              )}
                                              {res.status !== "ANNULER" &&
                                                res.paiement &&
                                                res.paiement.toLowerCase() !== "waw" &&
                                                res.paiement.toLowerCase() !== "avance waw" && (
                                                  <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleChangeStatus(res, "ANNULER")}
                                                  >
                                                    Annuler
                                                  </Button>
                                                )}
                                            </Stack>
                                          </TableCell>
                                          <TableCell>
                                            <IconButton onClick={() => handleDeleteReservation(res)} size="small">
                                              <DeleteIcon color="error" />
                                            </IconButton>
                                          </TableCell>
                                        </TableRow>
                                      )})
                                    ) : (
                                      <TableRow>
                                        <TableCell colSpan={8} sx={{ textAlign: 'center', py: 3 }}> {/* Colspan adjusted */}
                                          <Typography variant="body1" color="textSecondary">
                                            Aucune réservation trouvée pour cette activité.
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}
                    </Container>
                  </Box>
                </Box>
              ) : (
                // Grid view still filtered by selected date
                <TimeGrid>
                  <TimeColumn>
                    {hours.map((hour, i) => (
                      <div key={i}>{hour}</div>
                    ))}
                  </TimeColumn>

                  <EventColumn>
                    {hours.map((_, i) => (
                      <div key={i} />
                    ))}

                    {reservationsForSelectedDate.length === 0 && (
                        <Typography variant="body1" color="textSecondary" sx={{textAlign: 'center', py: 3, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%'}}>
                            Aucune réservation pour la date sélectionnée.
                        </Typography>
                    )}

                    {Object.entries(
                      reservationsForSelectedDate.reduce((acc, res) => { // Use reservationsForSelectedDate for grid
                        const key = `${res.start}-${res.end}`;
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(res);
                        return acc;
                      }, {})
                    ).map(([slot, resList]) => {
                      const [start, end] = slot.split('-');
                      const startHour = parseInt(start);
                      const endHour = parseInt(end);
                      const top = (startHour - 8) * 100;
                      const height = (endHour - startHour) * 100;
                      const blockWidth = 100 / resList.length;

                      return resList.map((res, idx) => {
                        console.log(`Rendering Grid Block for: ${res.client} on ${res.originalDate.format('YYYY-MM-DD')} at ${res.start}`);
                        return (
                          <ReservationBlock
                            key={`${res.client}-${res.activity}-${res.originalDate.format('YYYY-MM-DD')}-${idx}`}
                            onClick={() => handleReservationClick(res)}
                            style={{
                              top,
                              height,
                              width: `calc(${blockWidth}% - 8px)`,
                              left: `calc(${blockWidth * idx}% + 4px)`,
                              backgroundColor: activityColors[res.activity.split(' ')[0]] || '#888',
                            }}
                          >
                            <strong>{res.activity}</strong>
                            <span>{res.client}</span>
                            <small>{res.start} - {res.end}</small>
                          </ReservationBlock>
                        );
                      }) // <--- ADD THIS CLOSING PARENTHESIS HERE
                    })}
                  </EventColumn>
                </TimeGrid>
              )}
            </LeftPane>

            <Modal open={drawerOpen} onClose={() => {
              setDrawerOpen(false);
              console.log('Modal: Modale fermée.');
            }}>
              <CenteredModalBox>
                <h3>📋 Détail de la réservation</h3>
                <Divider sx={{ mb: 2 }} />
                {selectedReservation ? (
                  <>
                    <ReservationLabel><strong>Activité :</strong> {selectedReservation.activity}</ReservationLabel>
                    <ReservationLabel><strong>Client :</strong> {selectedReservation.client}</ReservationLabel>
                    <ReservationLabel><strong>Date :</strong> {selectedReservation.originalDate.format('dddd D MMMM YYYY')}</ReservationLabel> {/* Display date in modal */}
                    <ReservationLabel><strong>Heure :</strong> {selectedReservation.start} → {selectedReservation.end}</ReservationLabel>
                    <ReservationLabel><strong>Statut :</strong> {selectedReservation.statut}</ReservationLabel>
                    <ReservationLabel><strong>Paiement :</strong> {selectedReservation.paiement}</ReservationLabel>
                  </>
                ) : (
                  <p>Aucune réservation sélectionnée</p>
                )}
              </CenteredModalBox>
            </Modal>
          </AgendaContainer>
        </LocalizationProvider>
      </Main>
    </Layout>
  );
};

export default AgendaDayView;