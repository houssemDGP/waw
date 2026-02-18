import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, Container } from '@mui/material';

const activities = [
  {
    id: 1,
    title: 'Safari dans le désert avec dîner BBQ',
    image: 'https://source.unsplash.com/featured/?desert',
    description: 'Une expérience inoubliable dans les dunes dorées.',
    price: '€75.00'
  },
  {
    id: 2,
    title: 'Croisière sur la Seine avec dîner',
    image: 'https://source.unsplash.com/featured/?paris',
    description: 'Découvrez Paris la nuit depuis la Seine.',
    price: '€89.00'
  },
  {
    id: 3,
    title: 'Excursion au Mont Saint-Michel',
    image: 'https://source.unsplash.com/featured/?mont-saint-michel',
    description: 'Visitez un site classé au patrimoine mondial de l’UNESCO.',
    price: '€120.00'
  },
  {
    id: 4,
    title: 'Visite guidée du Colisée à Rome',
    image: 'https://source.unsplash.com/featured/?colosseum',
    description: 'Plongez dans l’histoire romaine avec un guide expert.',
    price: '€59.00'
  },
];

const ActivityCard = ({ title, image, description, price }) => (
  <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3, mx: 'auto' }}>
    <CardMedia
      component="img"
      height="180"
      image={image}
      alt={title}
    />
    <CardContent>
      <Typography gutterBottom variant="h6" component="div" color="primary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      <Typography variant="subtitle2" color="secondary" sx={{ mt: 1 }}>
        À partir de {price}
      </Typography>
      <Button variant="contained" fullWidth sx={{ mt: 2, borderRadius: 1 }} color="primary">
        Voir plus
      </Button>
    </CardContent>
  </Card>
);

const ActivityGrid = () => (
  <Container sx={{ py: 6 }}>
    <Typography variant="h4" component="h2" gutterBottom textAlign="center" color="primary">
      Circuits et Activités Populaires
    </Typography>
    <Grid container spacing={4} justifyContent="center">
      {activities.map((activity) => (
        <Grid item key={activity.id} xs={12} sm={6} md={4} lg={3}>
          <ActivityCard {...activity} />
        </Grid>
      ))}
    </Grid>
  </Container>
);

export default ActivityGrid;
