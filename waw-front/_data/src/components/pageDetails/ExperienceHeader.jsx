import React from "react";
import {
  Box,
  Typography,
  Rating,
  Chip,
  IconButton,
  Stack,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ExperienceHeader = ({ title, rating, reviewCount, location, category }) => {
  return (
    <Box mb={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
        <IconButton>
          <FavoriteBorderIcon />
        </IconButton>
      </Stack>

      <Box mt={1} display="flex" alignItems="center" flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center">
          <Rating value={rating} precision={0.5} readOnly size="small" />
          <Typography variant="body2" ml={1}>
            {rating} ({reviewCount})
          </Typography>
        </Box>
        <Chip
          icon={<LocationOnIcon />}
          label={location}
          size="small"
          variant="outlined"
        />
        <Chip label={category} size="small" color="primary" />
      </Box>
    </Box>
  );
};

export default ExperienceHeader;
