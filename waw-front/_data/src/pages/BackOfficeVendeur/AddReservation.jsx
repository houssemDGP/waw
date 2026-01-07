import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Toolbar,
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { fetchEventsByBusinessId } from "../../api/event";

import SideBar from "./SideBar";
import "dayjs/locale/fr";
import DeleteIcon from "@mui/icons-material/Delete";
dayjs.locale("fr");

function getMonthGrid(currentMonth) {
  const startOfMonth = currentMonth.startOf("month");
  const startWeekDay = startOfMonth.day();
  const daysInMonth = currentMonth.daysInMonth();

  const grid = [];

  for (let i = 0; i < startWeekDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push(currentMonth.date(d));
  }
  while (grid.length < 42) grid.push(null);

  return grid;
}

const AdminReservationCreator = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [currentMonth, setCurrentMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [formError, setFormError] = useState("");
  const [participants, setParticipants] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [nbrAdulte, setNbrAdulte] = useState("0");
  const [nbrEnfant, setNbrEnfant] = useState("0");
  const [nbrBebe, setNbrBebe] = useState("0");
  const totalParticipants =
    parseInt(nbrAdulte || "0") + parseInt(nbrEnfant || "0") + parseInt(nbrBebe || "0");

const handleChange = (setter) => (e) => {
  const value = e.target.value;
  if (/^\d*$/.test(value)) {
    setter(value);
  }
};
  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEventsByBusinessId();
        setEvents(data);
      } catch (error) {
        console.error("Erreur chargement événements", error);
      }
    };
    getEvents();
  }, []);

  const event = events.find((e) => e.id === selectedEventId);

  useEffect(() => {
    if (selectedEventId) {
      const ev = events.find((e) => e.id === selectedEventId);
      const firstRangeDate = ev?.scheduleRanges?.[0]?.startDate;
      if (firstRangeDate) {
        setCurrentMonth(dayjs(firstRangeDate));
        setSelectedDate(null);
        setOpenDialog(false);
      }
    }
  }, [selectedEventId, events]);

  const getAllDailySchedules = (event) => {
    if (!event || !event.scheduleRanges) return [];
    return event.scheduleRanges.flatMap((range) =>
      range.dailySchedules.map((ds) => ({
        ...ds,
        startDate: range.startDate,
        endDate: range.endDate,
      }))
    );
  };

  const isDateInRange = (date, event) =>
    event?.scheduleRanges?.some((range) =>
      dayjs(date).isBetween(
        dayjs(range.startDate).subtract(1, "day"),
        dayjs(range.endDate).add(1, "day"),
        null,
        "[]"
      )
    );

  const handleSelectDate = (day) => {
    if (!day || !event || !isDateInRange(day, event)) return;
    setSelectedDate(day);
    setOpenDialog(false);
  };

  const handleOpenDialog = (schedule, formula) => {
    setSelectedSchedule(schedule);
    setSelectedFormula(formula);
    setClientName("");
    setClientEmail("");
    setQuantity(1);
    setFormError("");
        setCommentaire("");
    setParticipants([]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmitReservation = async () => {
    if (!clientName.trim() || !clientEmail.trim()) {
      setFormError("Veuillez remplir tous les champs.");
      return;
    }
    if (quantity < 1 || quantity > selectedFormula.capacity) {
      setFormError(`La quantité doit être entre 1 et ${selectedFormula.capacity}.`);
      return;
    }

    const reservationData = {
            event: { id: selectedEventId }, 
  eventId: selectedEventId,
      date: selectedDate.format("YYYY-MM-DD"),
      formule: selectedFormula,
      nomClient:clientName,
      email:clientEmail,
  nbrAdulte: nbrAdulte,
  nbrEnfant: nbrEnfant,
  nbrBebe: nbrBebe,
              paymentMethods: selectedPaymentMethod,
            dateReservation: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
            dailyScheduleReservation:selectedSchedule,
            commentaire

    };

    try {
      await axios.post("http://102.211.209.131:3011/api/reservations", reservationData);
      console.log(reservationData);
      alert("Réservation enregistrée avec succès.");
      setOpenDialog(false);
    } catch (err) {
      console.error("Erreur lors de l'envoi de la réservation", err);
      setFormError("Une erreur est survenue lors de la réservation.");
    }
  };

  const maxCapacity = selectedFormula?.capacity || 0;
  const addParticipant = (type) => {
    if (participants.length >= maxCapacity) return;
    setParticipants([...participants, { type, name: "" }]);
  };
  const removeParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };
  const updateName = (index, name) => {
    const updated = [...participants];
    updated[index].nom = name;
    setParticipants(updated);
  };
    const updatePrenom = (index, name) => {
    const updated = [...participants];
    updated[index].prenom = name;
    setParticipants(updated);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
      >
        <Toolbar />
        <Typography variant="h5" gutterBottom>
          Créer une Réservation
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Événement</InputLabel>
          <Select
            value={selectedEventId}
            label="Événement"
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            {events.map((e) => (
              <MenuItem key={e.id} value={e.id}>
                {e.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {event && currentMonth && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Button
                size="small"
                onClick={() => setCurrentMonth((m) => m.subtract(1, "month"))}
                disabled={currentMonth.isSame(dayjs(event.scheduleRanges[0].startDate), "month")}
              >
                ← Mois précédent
              </Button>
              <Typography variant="h6">{currentMonth.format("MMMM YYYY")}</Typography>
              <Button
                size="small"
                onClick={() => setCurrentMonth((m) => m.add(1, "month"))}
                disabled={currentMonth.isSame(dayjs(event.scheduleRanges[0].endDate), "month")}
              >
                Mois suivant →
              </Button>
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1} mb={2}>
              {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((d) => (
                <Box key={d} sx={{ fontWeight: "bold", textAlign: "center" }}>{d}</Box>
              ))}
              {getMonthGrid(currentMonth).map((day, idx) => {
                const isValid = day && isDateInRange(day, event);
                const isSelected = day && selectedDate && day.isSame(selectedDate, "day");

                return (
                  <Box
                    key={idx}
                    sx={{
                      height: 40,
                      borderRadius: 1,
                      cursor: isValid ? "pointer" : "default",
                      bgcolor: isSelected ? "#181AD6" : isValid ? "#e0e0e0" : "#f5f5f5",
                      color: isSelected ? "white" : isValid ? "black" : "#aaa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      userSelect: "none",
                    }}
                    onClick={() => handleSelectDate(day)}
                  >
                    {day ? day.date() : ""}
                  </Box>
                );
              })}
            </Box>

            {selectedDate && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Plages horaires disponibles le {selectedDate.format("DD/MM/YYYY")} :
                </Typography>
                <Stack spacing={2}>
                  {getAllDailySchedules(event).map((schedule, idx) => (
                    <Box key={idx} p={2} sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
                      <Typography>
                        🕒 {schedule.startTime} - {schedule.endTime}
                      </Typography>
                      {schedule.formulas.map((f, i) => (
                        <Box
                          key={i}
                          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}
                        >
                          <Typography>
                            • {f.label} - {f.price} DT ({f.capacity} places)
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenDialog(schedule, f)}
                            sx={{ bgcolor: "#181AD6", color: "white" }}
                          >
                            Réserver
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
              <DialogTitle>Réserver une plage horaire</DialogTitle>
              <DialogContent>
                <Typography variant="subtitle1" mb={2}>
                  Date: {selectedDate ? selectedDate.format("DD/MM/YYYY") : ""}
                </Typography>
                <Typography variant="subtitle2" mb={2}>
                  Horaire: {selectedSchedule?.startTime} - {selectedSchedule?.endTime}
                </Typography>
                <Typography variant="subtitle2" mb={2}>
                  Formule: {selectedFormula?.label} - {selectedFormula?.price} DT
                </Typography>
                <TextField
                  label="Nom du client"
                  fullWidth
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Typography variant="subtitle1">
        Participants (max {maxCapacity}) — total sélectionné : {totalParticipants}
      </Typography>

      <Stack direction="row" spacing={2}>
        <TextField
          label="Nombre d'adultes"
          value={nbrAdulte}
          onChange={handleChange(setNbrAdulte)}
          error={totalParticipants > maxCapacity}
          fullWidth
        />
        <TextField
          label="Nombre d'enfants"
          value={nbrEnfant}
          onChange={handleChange(setNbrEnfant)}
          error={totalParticipants > maxCapacity}
          fullWidth
        />
        <TextField
          label="Nombre de bébés"
          value={nbrBebe}
          onChange={handleChange(setNbrBebe)}
          error={totalParticipants > maxCapacity}
          fullWidth
        />
      </Stack>

      {totalParticipants > maxCapacity && (
        <Typography color="error">
          Le nombre total de participants dépasse la capacité maximale ({maxCapacity}).
        </Typography>
      )}
                            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Mode de paiement</InputLabel>
              <Select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                label="Mode de paiement"
              >
                {event?.paymentMethods?.map((method, idx) => (
                  <MenuItem key={idx} value={method}>{method}</MenuItem>
                ))}
              </Select>
                                <Typography variant="subtitle1">Commentaire</Typography>

            </FormControl>
                            <TextField
                  label="commentaire"
                  type="commentaire"
                  fullWidth
                  required
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  sx={{ mb: 2 }}
                />
                {formError && <Typography color="error" variant="body2" sx={{ mb: 1 }}>{formError}</Typography>}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Annuler</Button>
                <Button variant="contained" onClick={handleSubmitReservation} sx={{ bgcolor: "#181AD6", color: "white" }}>Confirmer</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AdminReservationCreator;
