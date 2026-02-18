import React from 'react';
import styled from 'styled-components';
import { AccountCircle, CalendarToday, Logout } from '@mui/icons-material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  useTheme,
} from "@mui/material";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Stack, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import EventIcon from "@mui/icons-material/Event";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import GroupIcon from "@mui/icons-material/Group";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {

  Toolbar,
 
} from "@mui/material";
import SideBar from "./SideBar";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from "react";
import axios from "axios";
const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
  padding: 0 1rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
`;

const Logo = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  color: #ff5e5e;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ControlButton = styled.button`
  border: none;
  background: #fff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: ${(props) => props.bg || '#fff'};
  color: ${(props) => props.color || '#000'};
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const Activities = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const ActivityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const ActivityCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const ActivityImage = styled.div`
  height: 140px;
  background: url(${(props) => props.src}) center/cover no-repeat;
`;

const ActivityInfo = styled.div`
  padding: 1rem;
`;

const Badge = styled.span`
  background: #4caf50;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Box2 = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const ReservationSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Footer = styled.footer`
  text-align: center;
  font-size: 0.85rem;
  padding: 1rem;
  border-top: 1px solid #ddd;
`;
const StatsBox = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #fafafa;
  border-radius: 8px;
`;
const StatCard = ({ icon, label, value, color }) => (
  <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center" }}>
    <Avatar sx={{ bgcolor: color, mr: 2 }}>{icon}</Avatar>
    <Box>
      <Typography variant="h6">{label}</Typography>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
    </Box>
  </Paper>
);
const Dashboard = () => {
    const theme = useTheme();
const [events, setEvents] = useState([]);
  const [eventCount, setEventCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);
const [businessCount, setBusinessCount] = useState(0);
const [businesses, setBusiness] = useState([]);

useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://102.211.209.131:3011/api/events");
      setEvents(res.data);
      setEventCount(res.data.length);
      console.log(res.data);

      const reservationsRes = await axios.get("http://102.211.209.131:3011/api/reservations");
        setReservationCount(reservationsRes.data.length);
      const businessCountRes = await axios.get("http://102.211.209.131:3011/api/business");
        setBusinessCount(businessCountRes.data.length);
              console.log(businessCountRes.data);
              setBusiness(businessCountRes.data);
                      const data = transformData(businessCountRes.data);
        setChartData(data);

    } catch (err) {
      console.error("Erreur chargement événements :", err);
    }
  };
  fetchEvents();
}, []);
const totalPersonnes = events.reduce((accEvents, ev) => {
  if (!ev.reservations) return accEvents;
  const totalForEvent = ev.reservations.reduce((accRes, res) => {
    return accRes + (res.personnes ? res.personnes.length : 0);
  }, 0);
  return accEvents + totalForEvent;
}, 0);
  const [chartData, setChartData] = useState([]);

 const transformData = (businessList) => {
    const dateMap = {};

    businessList.forEach((business) => {
      const businessDate = business.creationDate?.slice(0, 10);
      if (!dateMap[businessDate]) dateMap[businessDate] = { businessCount: 0, eventCount: 0, reservationCount: 0 };
      dateMap[businessDate].businessCount++;

      business.events?.forEach((event) => {
        const eventDate = event.creationDate?.slice(0, 10);
        if (!dateMap[eventDate]) dateMap[eventDate] = { businessCount: 0, eventCount: 0, reservationCount: 0 };
        dateMap[eventDate].eventCount++;

        event.reservations?.forEach((res) => {
          const resDate = res.dateReservation?.slice(0, 10);
          if (!dateMap[resDate]) dateMap[resDate] = { businessCount: 0, eventCount: 0, reservationCount: 0 };
          dateMap[resDate].reservationCount++;
        });
      });
    });

    return Object.entries(dateMap)
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  return (
        <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
      >
        <Toolbar />
    <Container>
      <SummaryCards>
        <Card>{businessCount}<br /><small>Nombre des vendeurs</small></Card>
        <Card>{totalPersonnes}<br /><small>Nombre des clients</small></Card>
        <Card>{eventCount}<br /><small>Nombre des evenements</small></Card>
        <Card>{reservationCount}<br /><small>Nombre des reservations</small></Card>
      </SummaryCards>


                  <Box sx={{ p: 4 }}>
    <div style={{ width: '100%', height: 400 }}>
      <h2 style={{ textAlign: 'center' }}>Évolution des activités</h2>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="businessCount" name="Business" stroke="#8884d8" />
          <Line type="monotone" dataKey="eventCount" name="Événements" stroke="#82ca9d" />
          <Line type="monotone" dataKey="reservationCount" name="Réservations" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div>
<SectionTitle>Liste des Vendeurs, Événements et Réservations</SectionTitle>

      {businesses.map((business) => (
        <Accordion key={business.id} defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              {business.nom || business.rs || business.email}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {business.events && business.events.length > 0 ? (
              business.events.map((event) => (
                <Accordion key={event.id} sx={{ mb: 1 }} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      {event.nom} ({event.reservations?.length || 0} réservations)
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {event.reservations && event.reservations.length > 0 ? (
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Date</TableCell>
                              <TableCell>Horaire</TableCell>
                              <TableCell>Client</TableCell>
                              <TableCell>Places réservées / max</TableCell>
                              <TableCell>Paiement</TableCell>
                              <TableCell>Statut</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {event.reservations.map((res) => (
                              <TableRow key={res.id}>
                                <TableCell>{res.date}</TableCell>
                                <TableCell>
                                  {res.dailyScheduleReservation?.startTime} au{" "}
                                  {res.dailyScheduleReservation?.endTime}
                                </TableCell>
                                <TableCell>{res.nomClient}</TableCell>
                                <TableCell>
                                  {res.personnes?.length || 0} / {res.formule?.capacity}
                                </TableCell>
                                <TableCell>{res.paymentMethods}</TableCell>
                                <TableCell>
                                  <Chip label={res.status} />
                                  {res.status === "EN_ATTENTE" && (
                                    <>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        color="success"
                                      >
                                        Confirmer
                                      </Button>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                      >
                                        Annuler
                                      </Button>
                                    </>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <IconButton size="small">
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton size="small">
                                    <DeleteIcon color="error" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography>Aucune réservation</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography>Aucun événement</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>

    </Box>
    </Container>
          </Box>

    </Box>

  );
};

export default Dashboard;
