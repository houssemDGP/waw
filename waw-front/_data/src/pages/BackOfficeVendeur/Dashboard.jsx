import React from 'react';
import styled from 'styled-components';
import { AccountCircle, CalendarToday, Logout } from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  useTheme,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import GroupIcon from "@mui/icons-material/Group";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {

  Toolbar,
 
} from "@mui/material";
import SideBar from "./SideBar";

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

const Chip = styled.div`
  display: inline-block;
  background: #e0f7fa;
  color: #00796b;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  margin: 0.2rem;
  font-size: 0.85rem;
`;

const Footer = styled.footer`
  text-align: center;
  font-size: 0.85rem;
  padding: 1rem;
  border-top: 1px solid #ddd;
`;

const pieData = [
  { name: 'Places disponibles', value: 22 },
  { name: 'Ventes de places', value: 10 },
];
const barData = [
  { name: 'Avr 22', ventes: 4 },
  { name: 'Avr 26', ventes: 8 },
  { name: 'Mai 8', ventes: 12 },
];
const lineData = [
  { name: 'Avr 22', value: 0 },
  { name: 'Avr 26', value: 2 },
  { name: 'Mai 8', value: 4 },
];
const reservationsData = [
  { month: "Jan", reservations: 120 },
  { month: "Feb", reservations: 90 },
  { month: "Mar", reservations: 150 },
  { month: "Apr", reservations: 200 },
  { month: "May", reservations: 250 },
  { month: "Jun", reservations: 180 },
  { month: "Jul", reservations: 210 },
];

// Données des ventes par jour avec dates complètes
const salesData = [
  { date: "01 Jul 2025", sales: 320 },
  { date: "02 Jul 2025", sales: 450 },
  { date: "03 Jul 2025", sales: 380 },
  { date: "04 Jul 2025", sales: 420 },
  { date: "05 Jul 2025", sales: 470 },
  { date: "06 Jul 2025", sales: 600 },
  { date: "07 Jul 2025", sales: 510 },
];
const activityList = [
  {
    title: "test 1",
    image: "/img1.jpg",
    status: "Available",
    stats: [
      { name: "Réservées", value: 8, color: "#ff9800" },
      { name: "Disponibles", value: 12, color: "#03a9f4" }
    ]
  },
  {
    title: "test 2",
    image: "/img2.jpg",
    status: "Available",
    stats: [
      { name: "Réservées", value: 4, color: "#ff9800" },
      { name: "Disponibles", value: 16, color: "#03a9f4" }
    ]
  },
  {
    title: "test 3",
    image: "/img3.jpg",
    status: "Available",
    stats: [
      { name: "Réservées", value: 10, color: "#ff9800" },
      { name: "Disponibles", value: 10, color: "#03a9f4" }
    ]
  }
];
const StatsBox = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #fafafa;
  border-radius: 8px;
`;
// Composant pour afficher une carte statistique
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

  return (
        <Box sx={{ display: "flex" }}>
      <SideBar />

      {/* Main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
      >
        <Toolbar />
    <Container>
      <SummaryCards>
        <Card bg="#ffe5e5" color="#000">27577 DT<br /><small>Total de vente</small></Card>
        <Card>4<br /><small>Nombre des evenements</small></Card>
        <Card>6<br /><small>Nombre des collaborateurs</small></Card>
        <Card>4<br /><small>Nombre d'activité</small></Card>
      </SummaryCards>


                  <Box sx={{ p: 4 }}>

      <Grid container spacing={3}>

            <Typography variant="h6" gutterBottom>
              Réservations par Mois
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reservationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reservations" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>

            <Typography variant="h6" gutterBottom>
              Ventes par Jour (Juillet 2025)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill={theme.palette.warning.main} />
              </BarChart>
            </ResponsiveContainer>
      </Grid>
<Activities>
  <SectionTitle>Les Activités</SectionTitle>
  <ActivityGrid>
    {activityList.map((activity, index) => (
      <ActivityCard key={index}>
        <ActivityInfo>
          <h4>{activity.title}</h4>
          <Badge>{activity.status}</Badge>
        </ActivityInfo>

        <StatsBox>
          <h4>Total des places</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={activity.stats}
                dataKey="value"
                nameKey="name"
                outerRadius={60}
              >
                {activity.stats.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </StatsBox>
      </ActivityCard>
    ))}
  </ActivityGrid>
</Activities>


    </Box>
    </Container>
          </Box>

    </Box>

  );
};

export default Dashboard;
