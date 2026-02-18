import React from "react";
import {
  Box,
  Typography,
  Rating,
  Divider,
  Avatar,
  Grid,
  Paper,
} from "@mui/material";

const reviews = [
  {
    name: "Nour El Houda",
    rating: 5,
    comment:
      "Expérience incroyable ! Équipe très sympa, paysages magnifiques et une ambiance de folie. Je recommande à 100% !",
    avatar: "/avatars/avatar1.jpg"
  },
  {
    name: "Karim B.",
    rating: 4,
    comment:
      "Très bonne journée, bien organisée. Le repas était bon. Juste un peu de monde sur le bateau.",
    avatar: "/avatars/avatar2.jpg"
  }
];

const ReviewsSection = () => {
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <Box mt={6}>
      {/* Note moyenne */}
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Avis des voyageurs
      </Typography>

      <Box display="flex" alignItems="center" mb={3}>
        <Rating value={averageRating} precision={0.5} readOnly />
        <Typography ml={1}>
          {averageRating.toFixed(1)} / 5 ({reviews.length} avis)
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Liste des avis */}
      <Grid container spacing={2}>
        {reviews.map((review, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar src={review.avatar} alt={review.name} sx={{ mr: 2 }} />
                <Box>
                  <Typography fontWeight="bold">{review.name}</Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {review.comment}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReviewsSection;
