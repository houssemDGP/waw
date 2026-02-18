import React from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, Drawer, TextField, Chip } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';

const categories = [
  { name: "Metro passes", icon: "🚇" },
  { name: "Theme parks", icon: "🎢" },
  { name: "Car rentals", icon: "🚗" },
  { name: "Hotels", icon: "🏨" },
  { name: "Attractions", icon: "🎫" },
  { name: "Tours", icon: "🗺️" },
  { name: "Experiences", icon: "🎎" },
  { name: "Flights", icon: "✈️" },
  { name: "WiFi & SIM", icon: "📶" }
];

const cities = ["Tokyo", "Kyoto", "Osaka", "Sapporo", "Nagoya", "Yokohama"];

const experiences = new Array(12).fill(null).map((_, i) => ({
  id: i,
  city: cities[i % cities.length],
  title: `Experience ${i + 1}`,
  image: `https://source.unsplash.com/random/300x200?sig=${i}`,
  price: `$${20 + i}`
}));

export default function TravelLandingPage() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <Box p={2}>
      {/* Banner */}
      <Box sx={{ height: 300, backgroundImage: 'url(https://source.unsplash.com/1600x300/?japan)', backgroundSize: 'cover', borderRadius: 2, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold' }}>Japan</Typography>
      </Box>

      {/* Categories */}
      <Grid container spacing={2} justifyContent="center" mb={4}>
        {categories.map((cat, i) => (
          <Grid item key={i}>
            <Button variant="outlined" startIcon={<span>{cat.icon}</span>}>
              {cat.name}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* City Slider */}
      <Typography variant="h5" gutterBottom>Japan's must-visit cities</Typography>
      <Grid container spacing={2} mb={4}>
        {cities.map((city, i) => (
          <Grid item key={i} xs={6} sm={4} md={2}>
            <Card>
              <CardMedia component="img" height="120" image={`https://source.unsplash.com/random/300x200?${city}`} alt={city} />
              <CardContent>
                <Typography variant="subtitle1" align="center">{city}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filter and Experience Cards */}
      <Box display="flex">
        <Button onClick={() => setDrawerOpen(true)} startIcon={<FilterListIcon />} sx={{ mb: 2 }}>
          Filter
        </Button>

        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box p={2} width={250} role="presentation">
            <Typography variant="h6" gutterBottom>Filter by city</Typography>
            {cities.map((city, i) => (
              <Chip key={i} label={city} clickable sx={{ mb: 1 }} />
            ))}
          </Box>
        </Drawer>
      </Box>

      {/* Experience Grid */}
      <Grid container spacing={3}>
        {experiences.map((exp) => (
          <Grid item key={exp.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia component="img" height="140" image={exp.image} alt={exp.title} />
              <CardContent>
                <Typography variant="h6">{exp.title}</Typography>
                <Typography variant="body2">{exp.city}</Typography>
                <Typography variant="subtitle1" color="primary">{exp.price}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
