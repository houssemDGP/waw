import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,Stack
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const BookingCard = ({ price }) => {
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(1);

  return (
    <Card elevation={4} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box mb={2}>
          <Typography variant="h6">
            À partir de <strong style={{ color: "#2e7d32" }}>{price} TND</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          {/* Date */}
          <FormControl fullWidth>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>

          {/* Personnes */}
          <FormControl fullWidth>
            <InputLabel>Personnes</InputLabel>
            <Select
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              label="Personnes"
            >
              {[1, 2, 3, 4, 5, 6].map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* CTA */}
          <Button variant="contained" size="large" fullWidth>
            Vérifier les disponibilités
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
