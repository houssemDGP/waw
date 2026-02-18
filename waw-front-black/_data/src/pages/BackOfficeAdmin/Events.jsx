import React, { useState, useEffect } from 'react';
import {
  Typography,
  TableContainer,
  Paper,
  IconButton,
  Container,
  Box,
  Toolbar,
  Button,
  TextField,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Checkbox, FormControlLabel } from '@mui/material';

import { fetchEvents } from '../../api/event';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SideBar from './SideBar';
import axios from "axios";
import {  Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from '@mui/material';
const defaultScheduleRangesExample = [
  {
    startDate: '2025-07-01',
    endDate: '2025-07-10',
    dailySchedules: [
      {
        startTime: '09:00',
        endTime: '12:00',
        formulas: [
          { label: 'Solo', price: 10, capacity: 20 },
          { label: 'Duo', price: 18, capacity: 15 },
        ],
      },
      {
        startTime: '14:00',
        endTime: '18:00',
        formulas: [{ label: 'Solo', price: 12, capacity: 25 }],
      },
    ],
  },
  {
    startDate: '2025-07-15',
    endDate: '2025-07-20',
    dailySchedules: [
      {
        startTime: '10:00',
        endTime: '16:00',
        formulas: [{ label: 'Groupe', price: 50, capacity: 50 }],
      },
    ],
  },
];
const StatusIcon = ({ active, onToggle }) => {
  return (
    <Tooltip title={active ? "Active" : "Inactive"}>
      <IconButton onClick={onToggle}>
        {active ? (
          <CheckCircleIcon style={{ color: 'green' }} />
        ) : (
          <CancelIcon style={{ color: 'gray' }} />
        )}
      </IconButton>
    </Tooltip>
  );
};
const AgendaPage = () => {
  const [events, setEvents] = useState([]);

  // Modales
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);

  // Événement sélectionné (pour détails et horaires)
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Horaires à éditer (dans modale édition)
  const [scheduleRanges, setScheduleRanges] = useState([
    {
      startDate: '',
      endDate: '',
      dailySchedules: [
        {
          startTime: '',
          endTime: '',
          formulas: [{ label: '', price: '', capacity: '' }],
        },
      ],
    },
  ]);

const [isScheduleRangesModalOpen, setScheduleRangesModalOpen] = useState(false);
const [editedScheduleRanges, setEditedScheduleRanges] = useState([]);

const [isScheduleExceptionsModalOpen, setScheduleExceptionsModalOpen] = useState(false);
const [editedScheduleExceptions, setEditedScheduleExceptions] = useState([]);

const openScheduleRangesModal = (event) => {
  setSelectedEvent(event);
  setEditedScheduleRanges(event.scheduleRanges || []);
  setScheduleRangesModalOpen(true);
};

const closeScheduleRangesModal = () => setScheduleRangesModalOpen(false);

const openScheduleExceptionsModal = (event) => {
  setSelectedEvent(event);
  setEditedScheduleExceptions(event.scheduleRangeExceptions || []);
  setScheduleExceptionsModalOpen(true);
};

const closeScheduleExceptionsModal = () => setScheduleExceptionsModalOpen(false);
const addScheduleException = () => {
  setEditedScheduleExceptions(prev => [...prev, { dateStart: '', dateEnd: '', dailyScheduleExceptions: [] }]);
};

const removeScheduleException = (index) => {
  setEditedScheduleExceptions(prev => prev.filter((_, i) => i !== index));
};

const updateScheduleException = (index, field, value) => {
  setEditedScheduleExceptions(prev =>
    prev.map((item, i) => i === index ? { ...item, [field]: value } : item)
  );
};

  // Chargement événements
  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
        console.log(data);
      } catch (error) {
        console.error('Erreur chargement événements', error);
      }
    };
    getEvents();
  }, []);

  // Ouvrir modale détails événement
  const handleOpenDetailsModal = (event) => {
    setSelectedEvent(event);
    setOpenDetailsModal(true);
  };
  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedEvent(null);
  };

  // Ouvrir modale vue horaires (lecture seule)
  const handleOpenViewModal = (event) => {
    setSelectedEvent(event);
    setOpenViewModal(true);
  };
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedEvent(null);
  };

  // Ouvrir modale édition horaires
  const handleOpenScheduleModal = (event) => {
    setSelectedEvent(event);
    if (event.scheduleRanges && event.scheduleRanges.length > 0) {
      setScheduleRanges(event.scheduleRanges);
    } else {
      setScheduleRanges([
        {
          startDate: '',
          endDate: '',
          dailySchedules: [
            {
              startTime: '',
              endTime: '',
              formulas: [{ label: '', price: '', capacity: '' }],
            },
          ],
        },
      ]);
    }
    setOpenScheduleModal(true);
  };
  const handleCloseScheduleModal = () => {
    setOpenScheduleModal(false);
    setSelectedEvent(null);
    setScheduleRanges([]);
  };

  // Actions Edit / Delete événement (exemple)
  const handleEditActivity = (event) => {
    console.log('Modifier activité', event);
  };
  const handleDeleteActivity = (event) => {
    console.log('Supprimer activité', event);
  };

  // --- Gestion des horaires dans modale édition ---

  // Ajouter plage de dates
  const handleAddScheduleRange = () => {
    setScheduleRanges((prev) => [
      ...prev,
      {
        startDate: '',
        endDate: '',
        dailySchedules: [
          {
            startTime: '',
            endTime: '',
            formulas: [{ label: '', price: '', capacity: '' }],
          },
        ],
      },
    ]);
  };

  // Supprimer plage de dates
  const handleRemoveScheduleRange = (index) => {
    setScheduleRanges((prev) => prev.filter((_, i) => i !== index));
  };

  // Modifier plage de dates
  const handleDateRangeChange = (index, field, value) => {
    const newRanges = [...scheduleRanges];
    newRanges[index][field] = value;
    setScheduleRanges(newRanges);
  };

  // Ajouter horaire quotidien
  const handleAddDailySchedule = (rangeIndex) => {
    const newRanges = [...scheduleRanges];
    newRanges[rangeIndex].dailySchedules.push({
      startTime: '',
      endTime: '',
      formulas: [{ label: '', price: '', capacity: '' }],
    });
    setScheduleRanges(newRanges);
  };

  // Supprimer horaire quotidien
  const handleRemoveDailySchedule = (rangeIndex, scheduleIndex) => {
    const newRanges = [...scheduleRanges];
    newRanges[rangeIndex].dailySchedules = newRanges[rangeIndex].dailySchedules.filter(
      (_, i) => i !== scheduleIndex
    );
    setScheduleRanges(newRanges);
  };

  // Modifier horaire quotidien
  const handleDailyScheduleChange = (rangeIndex, scheduleIndex, field, value) => {
    const newRanges = [...scheduleRanges];
    newRanges[rangeIndex].dailySchedules[scheduleIndex][field] = value;
    setScheduleRanges(newRanges);
  };

  // Ajouter formule
  const handleAddFormula = (rangeIndex, scheduleIndex) => {
    const newRanges = [...scheduleRanges];
    newRanges[rangeIndex].dailySchedules[scheduleIndex].formulas.push({
      label: '',
      price: '',
      capacity: '',
    });
    setScheduleRanges(newRanges);
  };

  // Supprimer formule
  const handleRemoveFormula = (rangeIndex, scheduleIndex, formulaIndex) => {
    const newRanges = [...scheduleRanges];
    newRanges[rangeIndex].dailySchedules[scheduleIndex].formulas =
      newRanges[rangeIndex].dailySchedules[scheduleIndex].formulas.filter(
        (_, i) => i !== formulaIndex
      );
    setScheduleRanges(newRanges);
  };

  // Modifier formule
  const handleFormulaChange = (rangeIndex, scheduleIndex, formulaIndex, field, value) => {
    const newRanges = [...scheduleRanges];
    newRanges[rangeIndex].dailySchedules[scheduleIndex].formulas[formulaIndex][field] = value;
    setScheduleRanges(newRanges);
  };
const cleanScheduleRanges = (ranges) => {
  return ranges.map(range => {
    const { id, ...rangeWithoutId } = range; // supprime id de range
    return {
      ...rangeWithoutId,
      dailySchedules: range.dailySchedules?.map(daily => {
        const { id, ...dailyWithoutId } = daily; // supprime id de dailySchedules
        return {
          ...dailyWithoutId,
          formulas: daily.formulas?.map(formula => {
            const { id, ...formulaWithoutId } = formula; // supprime id de formulas
            return { ...formulaWithoutId };
          }) || [],
        };
      }) || [],
    };
  });
};
  // Sauvegarder horaires (exemple : console.log, à adapter selon API)
  const handleSaveSchedules = async () => {
      try {
    // Send updated event to backend
    await axios.put(`http://102.211.209.131:3011/api/schedule-ranges/event/${selectedEvent.id}`, cleanScheduleRanges(scheduleRanges));

    // Update local state
    setEvents((prev) =>
      prev.map((ev) => (ev.id === selectedEvent.id ? selectedEvent : ev))
    );
    setSelectedEvent(selectedEvent);

    handleCloseEditModal();
    console.log("mise à jour");
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
  }
    console.log('Sauvegarder horaires pour événement:', selectedEvent.id);
    console.log(cleanScheduleRanges(scheduleRanges));
    // TODO: envoyer scheduleRanges à backend pour cet événement

    // Fermer modale
    setOpenScheduleModal(false);
  };
const [openEditModal, setOpenEditModal] = useState(false);
const [editedEvent, setEditedEvent] = useState(null);

const handleOpenEditModal = (event) => {
  setEditedEvent({ ...event });
  setOpenEditModal(true);
};

const handleCloseEditModal = () => {
  setOpenEditModal(false);
  setEditedEvent(null);
};
const handleToggle = async (id) => {
  try {
    const res = await axios.put(`http://102.211.209.131:3011/api/events/status/${id}`);
    const updatedEvent = res.data;

    // Update the events state without reloading
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, active: updatedEvent.active } : event
      )
    );
  } catch (err) {
    console.error('Error updating status', err);
  }
};
const handleSaveEditedEvent = async () => {
  try {
    // Send updated event to backend
    await axios.put(`http://102.211.209.131:3011/api/schedule-ranges/events/${editedEvent.id}`, editedEvent);

    // Update local state
    setEvents((prev) =>
      prev.map((ev) => (ev.id === editedEvent.id ? editedEvent : ev))
    );
    setSelectedEvent(editedEvent);

    handleCloseEditModal();
    console.log("mise à jour");
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
  }
};


  const [openScheduleExceptionModal, setOpenScheduleExceptionModal] = useState(false);

    const [scheduleRangeExceptions, setScheduleRangeExceptions] = useState([
        {
          startDate: '',
          endDate: '',
          dailyScheduleExceptions: [
            {
              startTime: '',
              endTime: '',
              formulas: [{ label: '', price: '', capacity: '' }],
            },
          ],
        },
      ]);
  // ouvrir modal

   const handleOpen = (event) => {
    setSelectedEvent(event);
    if (event.scheduleRangeExceptions && event.scheduleRangeExceptions.length > 0) {
      setScheduleRangeExceptions(event.scheduleRangeExceptions);
    } else {
      setScheduleRangeExceptions([
        {
          startDate: '',
          endDate: '',
          dailyScheduleExceptions: [
            {
              startTime: '',
              endTime: '',
              formulas: [{ label: '', price: '', capacity: '' }],
            },
          ],
        },
      ]);
    }
    setOpenScheduleExceptionModal(true);
  };
  // fermer modal
  const handleClose = () => setOpenScheduleExceptionModal(false);

  // Gérer changement date début ou fin d'une plage d'exception
  const handleScheduleExceptionDateChange = (rangeIndex, field, value) => {
    const newRanges = [...scheduleRangeExceptions];
    newRanges[rangeIndex][field] = value;
    setScheduleRangeExceptions(newRanges);
  };

  // Ajouter une nouvelle plage d'exception
  const handleAddScheduleException = () => {
    setScheduleRangeExceptions(prev => [
      ...prev,
      {
        startDate: '',
        endDate: '',
        dailyScheduleExceptions: [
          {
            startTime: '',
            endTime: '',
            formulas: [{ label: '', price: '', capacity: '' }],
          },
        ],
      },
    ]);
  };

  // Supprimer une plage d'exception
  const handleRemoveScheduleException = (rangeIndex) => {
    if (scheduleRangeExceptions.length <= 1) return; // au moins 1
    const newRanges = scheduleRangeExceptions.filter((_, i) => i !== rangeIndex);
    setScheduleRangeExceptions(newRanges);
  };

  // Gérer changement horaire quotidien dans une plage d'exception
  const handleExceptionDailyScheduleChange = (rangeIndex, scheduleIndex, field, value) => {
    const newRanges = [...scheduleRangeExceptions];
    newRanges[rangeIndex].dailyScheduleExceptions[scheduleIndex][field] = value;
    setScheduleRangeExceptions(newRanges);
  };

  // Ajouter un horaire quotidien à une plage d'exception
  const handleAddExceptionDailySchedule = (rangeIndex) => {
    const newRanges = [...scheduleRangeExceptions];
    newRanges[rangeIndex].dailyScheduleExceptions.push({
      startTime: '',
      endTime: '',
      formulas: [{ label: '', price: '', capacity: '' }],
    });
    setScheduleRangeExceptions(newRanges);
  };

  // Supprimer un horaire quotidien dans une plage d'exception
  const handleRemoveExceptionDailySchedule = (rangeIndex, scheduleIndex) => {
    const dailyScheduleExceptions = scheduleRangeExceptions[rangeIndex].dailyScheduleExceptions;
    if (dailyScheduleExceptions.length <= 1) return; // au moins 1
    const newRanges = [...scheduleRangeExceptions];
    newRanges[rangeIndex].dailyScheduleExceptions = dailyScheduleExceptions.filter((_, i) => i !== scheduleIndex);
    setScheduleRangeExceptions(newRanges);
  };

  // Gérer changement formule dans un horaire quotidien d'une plage d'exception
  const handleExceptionFormulaChange = (rangeIndex, scheduleIndex, formulaIndex, field, value) => {
    const newRanges = [...scheduleRangeExceptions];
    newRanges[rangeIndex].dailyScheduleExceptions[scheduleIndex].formulas[formulaIndex][field] = value;
    setScheduleRangeExceptions(newRanges);
  };

  // Ajouter une formule dans un horaire quotidien d'une plage d'exception
  const handleAddExceptionFormula = (rangeIndex, scheduleIndex) => {
    const newRanges = [...scheduleRangeExceptions];
    newRanges[rangeIndex].dailyScheduleExceptions[scheduleIndex].formulas.push({ label: '', price: '', capacity: '' });
    setScheduleRangeExceptions(newRanges);
  };

  // Supprimer une formule dans un horaire quotidien d'une plage d'exception
  const handleRemoveExceptionFormula = (rangeIndex, scheduleIndex, formulaIndex) => {
    const formulas = scheduleRangeExceptions[rangeIndex].dailyScheduleExceptions[scheduleIndex].formulas;
    if (formulas.length <= 1) return; // au moins 1
    const newRanges = [...scheduleRangeExceptions];
    newRanges[rangeIndex].dailyScheduleExceptions[scheduleIndex].formulas = formulas.filter((_, i) => i !== formulaIndex);
    setScheduleRangeExceptions(newRanges);
  };
const cleanScheduleRangeExceptions = (ranges) => {
  return ranges.map(range => {
    const { id, ...rangeWithoutId } = range;
    return {
      ...rangeWithoutId,
      dailyScheduleExceptions: range.dailyScheduleExceptions?.map(daily => {
        const { id, ...dailyWithoutId } = daily;
        return {
          ...dailyWithoutId,
          formulas: daily.formulas?.map(formula => {
            const { id, ...formulaWithoutId } = formula;
            return { ...formulaWithoutId };
          }) || [],
        };
      }) || [],
    };
  });
};

const handleSaveScheduleExceptions = async () => {
  try {
    await axios.put(
      `http://102.211.209.131:3011/api/schedule-range-exceptions/event/${selectedEvent.id}`,
      cleanScheduleRangeExceptions(scheduleRangeExceptions)
    );

    // Mise à jour locale si besoin
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === selectedEvent.id ? selectedEvent : ev
      )
    );
    setSelectedEvent(selectedEvent);

    handleClose();
    console.log("Exceptions horaires mises à jour");
  } catch (error) {
        console.log(selectedEvent.id);
        console.log(cleanScheduleRangeExceptions(scheduleRangeExceptions));

    console.error("Erreur lors de la mise à jour des exceptions :", error);
  }
};
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <SideBar />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}
        >
          <Toolbar />
          <Container>
                      <Typography variant="h4" gutterBottom>Événements</Typography>

<TableContainer component={Paper}>
  <Table>
    <TableHead >
      <TableRow>
        <TableCell>Active</TableCell>
        <TableCell>Titre</TableCell>
        <TableCell align="right">Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {events.length > 0 ? (
        events.map((event, idx) => (
          <TableRow key={idx}>
            <TableCell>{event.active ? 'Oui' : 'Non'}</TableCell>
            <TableCell>{event.nom}</TableCell>
           <TableCell align="right">
  <Box display="flex" justifyContent="flex-end" flexWrap="wrap" gap={1}>
    <Button
      variant="outlined"
        sx={{
    borderColor: '#181AD6',
    color: '#181AD6',
    '&:hover': {
      borderColor: '#0f0fb4',
      backgroundColor: 'rgba(24, 26, 214, 0.04)', // léger fond au hover
    },
  }}
      size="small"
      onClick={() => handleOpenDetailsModal(event)}
    >
      Voir détails
    </Button>
    <Button


            variant="contained"
      size="small"
        sx={{ backgroundColor: '#181AD6', color: '#fff', '&:hover': { backgroundColor: '#0f0fb4' } }}
      onClick={() => handleOpenViewModal(event)}
    >
      Voir horaires
    </Button>
    <Button
      variant="outlined"
        sx={{
    borderColor: '#181AD6',
    color: '#181AD6',
    '&:hover': {
      borderColor: '#0f0fb4',
      backgroundColor: 'rgba(24, 26, 214, 0.04)', // léger fond au hover
    },
  }}
      size="small"
      onClick={() => handleOpenScheduleModal(event)}
    >
      Modifier / Ajouter horaires
    </Button>
    <Button variant="outlined"
        sx={{
    borderColor: '#181AD6',
    color: '#181AD6',
    '&:hover': {
      borderColor: '#0f0fb4',
      backgroundColor: 'rgba(24, 26, 214, 0.04)', // léger fond au hover
    },
  }}
      size="small" onClick={() => handleOpen(event)}>
        Modifier / Ajouter Exceptions horaires
      </Button>

    <StatusIcon active={event.active} onToggle={() => handleToggle(event.id)} />

    <IconButton
      onClick={() => handleOpenEditModal(event)}
      size="small"
      aria-label="Modifier"
    >
      <EditIcon />
    </IconButton>
    <IconButton
      onClick={() => handleDeleteActivity(event)}
      size="small"
      color="error"
      aria-label="Supprimer"
    >
      <DeleteIcon />
    </IconButton>
  </Box>
</TableCell>

          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
            Aucun événement trouvé.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>


          </Container>
        </Box>
      </Box>

      {/* Modal détails événement */}
      <Dialog
        open={openDetailsModal}
        onClose={handleCloseDetailsModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Détails de l'événement</DialogTitle>
        <DialogContent dividers>
          {selectedEvent && (
  <Box>
    <Typography>
      <strong>Description:</strong> {selectedEvent.description}
    </Typography>
    <Typography>
      <strong>Accepte bébés:</strong>{' '}
      {selectedEvent.accepteBebes ? 'Oui' : 'Non'}
    </Typography>
    <Typography>
      <strong>Accepte enfants:</strong>{' '}
      {selectedEvent.accepteEnfants ? 'Oui' : 'Non'}
    </Typography>
    <Typography>
      <strong>Âge minimum:</strong> {selectedEvent.ageMinimum}
    </Typography>
    <Typography>
      <strong>Langues parlées:</strong>{' '}
      {selectedEvent.languages?.join(', ')}
    </Typography>
    <Typography>
      <strong>Latitude / Longitude:</strong>{' '}
      {selectedEvent.latitude} / {selectedEvent.longitude}
    </Typography>
    <Typography>
      <strong>Mobilité réduite:</strong>{' '}
      {selectedEvent.mobiliteReduite ? 'Oui' : 'Non'}
    </Typography>
    <Typography>
      <strong>Moyens de paiement:</strong>{' '}
      {selectedEvent.paymentMethods?.join(', ')}
    </Typography>
    <Typography>
      <strong>Ouvert aux animaux:</strong>{' '}
      {selectedEvent.animaux ? 'Oui' : 'Non'}
    </Typography>
    <Typography>
      <strong>Ouvert aux groupes:</strong>{' '}
      {selectedEvent.groupes ? 'Oui' : 'Non'}
    </Typography>

    <Typography>
      <strong>Catégories:</strong>{' '}
      {selectedEvent.categories?.map(c => c.nom).join(', ')}
    </Typography>

    <Typography>
      <strong>Sous-catégories:</strong>{' '}
      {selectedEvent.subCategories?.map(sc => sc.nom).join(', ')}
    </Typography>
  </Box>
)}
{selectedEvent && (
  <Box>
    <Typography>
      <strong>Description:</strong> {selectedEvent.description}
    </Typography>
    <Typography>
      <strong>Âge minimum:</strong> {selectedEvent.ageMinimum}
    </Typography>
    <Typography>
      <strong>Langues parlées:</strong>{' '}
      {selectedEvent.languages?.join(', ')}
    </Typography>

    <Typography>
      <strong>Moyens de paiement:</strong>{' '}
      {selectedEvent.paymentMethods?.join(', ')}
    </Typography>

    {/* Images */}
    {selectedEvent.imageUrls?.length > 0 && (
      <>
        <Typography><strong>Images:</strong></Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {selectedEvent.imageUrls.map((url, index) => (
            <img key={index} src={"http://102.211.209.131:3011"+ url} alt={`img-${index}`} width={150} />
          ))}
        </Box>
      </>
    )}

    {/* Vidéos générales */}
    {selectedEvent.videoUrls?.length > 0 && (
      <>
        <Typography><strong>Vidéos:</strong></Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {selectedEvent.videoUrls.map((url, index) => (
            <video key={index} controls width="320">
              <source src={"http://102.211.209.131:3011"+url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}
        </Box>
      </>
    )}

    {/* YouTube links */}
    {selectedEvent.videosYoutube?.length > 0 && (
      <>
        <Typography><strong>Vidéos YouTube:</strong></Typography>
        {selectedEvent.videosYoutube.map((link, index) => (
          <Box key={index}>
            <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
          </Box>
        ))}
      </>
    )}

    {/* Instagram links */}
    {selectedEvent.videosInstagram?.length > 0 && (
      <>
        <Typography><strong>Vidéos Instagram:</strong></Typography>
        {selectedEvent.videosInstagram.map((link, index) => (
          <Box key={index}>
            <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
          </Box>
        ))}
      </>
    )}
  </Box>
)}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsModal}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Modal horaires lecture seule */}
      <Dialog open={openViewModal} onClose={handleCloseViewModal} maxWidth="md" fullWidth>
        <DialogTitle>Horaires</DialogTitle>
        <DialogContent dividers>
          {(selectedEvent?.scheduleRanges?.length > 0
            ? selectedEvent.scheduleRanges
            : defaultScheduleRangesExample
          ).map((range, idx) => (
            <Paper
              key={idx}
              sx={{ p: 2, mb: 3, backgroundColor: '#f9f9f9', borderRadius: 2 }}
              variant="outlined"
            >
<Box display="flex" justifyContent="space-between" alignItems="center">
  <Typography variant="h6">
    Plage de dates : {range.startDate} au {range.endDate}
  </Typography>
  <Box>
    <IconButton
      aria-label="Modifier cette plage"
      size="small"
      onClick={() => {
        setScheduleRanges([range]); // charge cette plage
        setSelectedEvent(selectedEvent);
        setOpenScheduleModal(true); // ouvre modale édition
      }}
    >
      <EditIcon fontSize="small" />
    </IconButton>
    <IconButton
      aria-label="Supprimer cette plage"
      size="small"
      color="error"
      onClick={() => {
        const updatedRanges = selectedEvent.scheduleRanges.filter((_, i) => i !== idx);
        const updatedEvent = { ...selectedEvent, scheduleRanges: updatedRanges };
        setSelectedEvent(updatedEvent);
        setEvents((prev) =>
          prev.map((ev) => (ev.id === selectedEvent.id ? updatedEvent : ev))
        );
      }}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  </Box>
</Box>
              {range.dailySchedules.map((schedule, i) => (
                <Box key={i} sx={{ mt: 2, pl: 2 }}>
                  <Typography>
                    {schedule.startTime} - {schedule.endTime}
                  </Typography>
                  <Typography>Formules :</Typography>
                  <ul>
                    {schedule.formulas.map((formula, j) => (
                      <li key={j}>
                        {formula.label} - Prix: {formula.price} € - Capacité: {formula.capacity}
                      </li>
                    ))}
                  </ul>
                </Box>
              ))}
            </Paper>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewModal}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Modal édition horaires */}
      <Dialog open={openScheduleModal} onClose={handleCloseScheduleModal} maxWidth="lg" fullWidth>
        <DialogTitle>Modifier / Ajouter horaires</DialogTitle>
        <DialogContent dividers>
          {scheduleRanges.map((range, rangeIndex) => (
            <Paper
              key={rangeIndex}
              sx={{ p: 3, mb: 4, borderRadius: 2, position: 'relative' }}
              variant="outlined"
            >
              {scheduleRanges.length > 1 && (
                <IconButton
                  aria-label="Supprimer plage de dates"
                  onClick={() => handleRemoveScheduleRange(rangeIndex)}
                  color="error"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <DeleteIcon />
                </IconButton>
              )}

              <Typography variant="h6" sx={{ mb: 2 }}>
                Plage de dates
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="Du"
                    type="date"
                    value={range.startDate}
                    onChange={(e) =>
                      handleDateRangeChange(rangeIndex, 'startDate', e.target.value)
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={1} sx={{ textAlign: 'center' }}>
                  <Typography>au</Typography>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="Au"
                    type="date"
                    value={range.endDate}
                    onChange={(e) =>
                      handleDateRangeChange(rangeIndex, 'endDate', e.target.value)
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Horaires quotidiens
              </Typography>

              {range.dailySchedules.map((schedule, scheduleIndex) => (
                <Paper
                  key={scheduleIndex}
                  variant="outlined"
                  sx={{ p: 2, mb: 2, position: 'relative' }}
                >
                  {range.dailySchedules.length > 1 && (
                    <IconButton
                      aria-label="Supprimer horaire quotidien"
                      onClick={() => handleRemoveDailySchedule(rangeIndex, scheduleIndex)}
                      color="error"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Heure début"
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) =>
                          handleDailyScheduleChange(
                            rangeIndex,
                            scheduleIndex,
                            'startTime',
                            e.target.value
                          )
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Heure fin"
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) =>
                          handleDailyScheduleChange(
                            rangeIndex,
                            scheduleIndex,
                            'endTime',
                            e.target.value
                          )
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>

                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Formules
                  </Typography>

                  {schedule.formulas.map((formula, formulaIndex) => (
                    <Grid
                      container
                      spacing={1}
                      alignItems="center"
                      key={formulaIndex}
                      sx={{ mt: 1 }}
                    >
                      <Grid item xs={4}>
                        <TextField
                          label="Label"
                          value={formula.label}
                          onChange={(e) =>
                            handleFormulaChange(
                              rangeIndex,
                              scheduleIndex,
                              formulaIndex,
                              'label',
                              e.target.value
                            )
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          label="Prix"
                          type="number"
                          value={formula.price}
                          onChange={(e) =>
                            handleFormulaChange(
                              rangeIndex,
                              scheduleIndex,
                              formulaIndex,
                              'price',
                              e.target.value
                            )
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          label="Capacité"
                          type="number"
                          value={formula.capacity}
                          onChange={(e) =>
                            handleFormulaChange(
                              rangeIndex,
                              scheduleIndex,
                              formulaIndex,
                              'capacity',
                              e.target.value
                            )
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          aria-label="Supprimer formule"
                          onClick={() =>
                            handleRemoveFormula(rangeIndex, scheduleIndex, formulaIndex)
                          }
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}

                  <Button
                    variant="outlined"
                    startIcon={<AddCircleIcon />}
                    onClick={() => handleAddFormula(rangeIndex, scheduleIndex)}
                    sx={{ mt: 1 }}
                  >
                    Ajouter une formule
                  </Button>
                </Paper>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddCircleIcon />}
                onClick={() => handleAddDailySchedule(rangeIndex)}
                sx={{ width: '100%', mt: 2 }}
              >
                Ajouter une plage horaire
              </Button>
            </Paper>
          ))}

          <Button
            variant="contained"
            onClick={handleAddScheduleRange}
            startIcon={<AddCircleIcon />}
            sx={{ width: '100%', mt: 3 }}
          >
            Ajouter une nouvelle plage de dates
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseScheduleModal}>Annuler</Button>
          <Button variant="contained" onClick={handleSaveSchedules}>
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

<Dialog
  open={openEditModal}
  onClose={handleCloseEditModal}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>Modifier l'événement</DialogTitle>
  <DialogContent dividers>
    {editedEvent && (
      <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label="Titre"
          value={editedEvent.name || ''}
          onChange={(e) =>
            setEditedEvent({ ...editedEvent, name: e.target.value })
          }
        />
        <TextField
          fullWidth
          multiline
          label="Description"
          value={editedEvent.description || ''}
          onChange={(e) =>
            setEditedEvent({ ...editedEvent, description: e.target.value })
          }
        />
        <TextField
          fullWidth
          type="date"
          label="Date de publication"
          InputLabelProps={{ shrink: true }}
          value={editedEvent.dateDePublication || ''}
          onChange={(e) =>
            setEditedEvent({ ...editedEvent, dateDePublication: e.target.value })
          }
        />
        <TextField
          fullWidth
          type="number"
          label="Âge minimum"
          value={editedEvent.ageMinimum || ''}
          onChange={(e) =>
            setEditedEvent({ ...editedEvent, ageMinimum: e.target.value })
          }
        />

<TextField
  fullWidth
  label="Langues parlées (séparées par virgule)"
  value={
    Array.isArray(editedEvent.languages)
      ? editedEvent.languages.map(lang => typeof lang === 'string' ? lang : '') // assure strings
        .filter(Boolean)
        .join(', ')
      : ''
  }
  onChange={(e) =>
    setEditedEvent({
      ...editedEvent,
      languages: e.target.value
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    })
  }
/>

        {/* Checkbox pour booléens */}
        <FormControlLabel
          control={
            <Checkbox
              checked={!!editedEvent.accepteBebes}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, accepteBebes: e.target.checked })
              }
            />
          }
          label="Accepte bébés"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={!!editedEvent.accepteEnfants}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, accepteEnfants: e.target.checked })
              }
            />
          }
          label="Accepte enfants"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={!!editedEvent.mobiliteReduite}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, mobiliteReduite: e.target.checked })
              }
            />
          }
          label="Mobilité réduite"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={!!editedEvent.animaux}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, animaux: e.target.checked })
              }
            />
          }
          label="Ouvert aux animaux"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={!!editedEvent.groupes}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, groupes: e.target.checked })
              }
            />
          }
          label="Ouvert aux groupes"
        />

        {/* Latitude / Longitude */}
        <TextField
          fullWidth
          type="number"
          label="Latitude"
          value={editedEvent.latitude || ''}
          onChange={(e) =>
            setEditedEvent({ ...editedEvent, latitude: parseFloat(e.target.value) || 0 })
          }
        />
        <TextField
          fullWidth
          type="number"
          label="Longitude"
          value={editedEvent.longitude || ''}
          onChange={(e) =>
            setEditedEvent({ ...editedEvent, longitude: parseFloat(e.target.value) || 0 })
          }
        />

        {/* Payment Methods (séparés par virgule) */}
        <TextField
          fullWidth
          label="Moyens de paiement (séparés par virgule)"
          value={editedEvent.paymentMethods?.join(', ') || ''}
          onChange={(e) =>
            setEditedEvent({
              ...editedEvent,
              paymentMethods: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s.length > 0),
            })
          }
        />

        {/* Catégories (optionnel : afficher noms séparés par virgule) */}
        <TextField
          fullWidth
          label="Catégories (séparées par virgule)"
          value={editedEvent.categories?.map(c => c.nom).join(', ') || ''}
          onChange={(e) => {
            const cats = e.target.value.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
            // Ici, il faudrait reconstruire l'objet categories avec au moins { nom: string }
            setEditedEvent({
              ...editedEvent,
              categories: cats.map((nom) => ({ nom })),
            });
          }}
        />

        {/* Sous-catégories */}
        <TextField
          fullWidth
          label="Sous-catégories (séparées par virgule)"
          value={editedEvent.subCategories?.map(sc => sc.nom).join(', ') || ''}
          onChange={(e) => {
            const subs = e.target.value.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
            setEditedEvent({
              ...editedEvent,
              subCategories: subs.map((nom) => ({ nom })),
            });
          }}
        />

{/* Gestion des images */}
<Typography sx={{ mt: 3, mb: 1 }}>Images</Typography>
{editedEvent.imageUrls?.map((url, idx) => (
  <TextField
    key={idx}
    fullWidth
    margin="normal"
    label={`Image URL #${idx + 1}`}
    value={url || ''}
    onChange={(e) => {
      const newUrls = [...(editedEvent.imageUrls || [])];
      newUrls[idx] = e.target.value;
      setEditedEvent({ ...editedEvent, imageUrls: newUrls });
    }}
  />
))}
<Button
  variant="outlined"
  onClick={() => {
    setEditedEvent({
      ...editedEvent,
      imageUrls: [...(editedEvent.imageUrls || []), ''],
    });
  }}
  sx={{ mb: 2 }}
>
  Ajouter une image
</Button>

{/* Gestion des vidéos générales */}
<Typography sx={{ mt: 3, mb: 1 }}>Vidéos générales (URL)</Typography>
{editedEvent.videoUrls?.map((url, idx) => (
  <TextField
    key={idx}
    fullWidth
    margin="normal"
    label={`Vidéo URL #${idx + 1}`}
    value={url || ''}
    onChange={(e) => {
      const newUrls = [...(editedEvent.videoUrls || [])];
      newUrls[idx] = e.target.value;
      setEditedEvent({ ...editedEvent, videoUrls: newUrls });
    }}
  />
))}
<Button
  variant="outlined"
  onClick={() => {
    setEditedEvent({
      ...editedEvent,
      videoUrls: [...(editedEvent.videoUrls || []), ''],
    });
  }}
  sx={{ mb: 2 }}
>
  Ajouter une vidéo
</Button>

{/* Gestion des vidéos YouTube */}
<Typography sx={{ mt: 3, mb: 1 }}>Vidéos YouTube (liens)</Typography>
{editedEvent.videosYoutube?.map((link, idx) => (
  <TextField
    key={idx}
    fullWidth
    margin="normal"
    label={`Lien YouTube #${idx + 1}`}
    value={link || ''}
    onChange={(e) => {
      const newLinks = [...(editedEvent.videosYoutube || [])];
      newLinks[idx] = e.target.value;
      setEditedEvent({ ...editedEvent, videosYoutube: newLinks });
    }}
  />
))}
<Button
  variant="outlined"
  onClick={() => {
    setEditedEvent({
      ...editedEvent,
      videosYoutube: [...(editedEvent.videosYoutube || []), ''],
    });
  }}
  sx={{ mb: 2 }}
>
  Ajouter un lien YouTube
</Button>

{/* Gestion des vidéos Instagram */}
<Typography sx={{ mt: 3, mb: 1 }}>Vidéos Instagram (liens)</Typography>
{editedEvent.videosInstagram?.map((link, idx) => (
  <TextField
    key={idx}
    fullWidth
    margin="normal"
    label={`Lien Instagram #${idx + 1}`}
    value={link || ''}
    onChange={(e) => {
      const newLinks = [...(editedEvent.videosInstagram || [])];
      newLinks[idx] = e.target.value;
      setEditedEvent({ ...editedEvent, videosInstagram: newLinks });
    }}
  />
))}
<Button
  variant="outlined"
  onClick={() => {
    setEditedEvent({
      ...editedEvent,
      videosInstagram: [...(editedEvent.videosInstagram || []), ''],
    });
  }}
  sx={{ mb: 2 }}
>
  Ajouter un lien Instagram
</Button>      </Box>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseEditModal}>Annuler</Button>
    <Button variant="contained" onClick={handleSaveEditedEvent}>
      Sauvegarder
    </Button>
  </DialogActions>
</Dialog>
 <Dialog open={openScheduleExceptionModal} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Modifier / Ajouter exceptions horaires</DialogTitle>
        <DialogContent dividers>
          {scheduleRangeExceptions.map((exception, rangeIndex) => (
            <Paper
              key={rangeIndex}
              sx={{ p: 3, mb: 4, borderRadius: 2, position: 'relative' }}
              variant="outlined"
            >
              {scheduleRangeExceptions.length > 1 && (
                <IconButton
                  aria-label="Supprimer plage d'exception"
                  onClick={() => handleRemoveScheduleException(rangeIndex)}
                  color="error"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <DeleteIcon />
                </IconButton>
              )}

              <Typography variant="h6" sx={{ mb: 2 }}>
                Plage de dates (exception)
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="Du"
                    type="date"
                    value={exception.startDate}
                    onChange={(e) =>
                      handleScheduleExceptionDateChange(rangeIndex, 'startDate', e.target.value)
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={1} sx={{ textAlign: 'center' }}>
                  <Typography>au</Typography>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="Au"
                    type="date"
                    value={exception.endDate}
                    onChange={(e) =>
                      handleScheduleExceptionDateChange(rangeIndex, 'endDate', e.target.value)
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Horaires quotidiens
              </Typography>

              {exception.dailyScheduleExceptions.map((schedule, scheduleIndex) => (
                <Paper
                  key={scheduleIndex}
                  variant="outlined"
                  sx={{ p: 2, mb: 2, position: 'relative' }}
                >
                  {exception.dailyScheduleExceptions.length > 1 && (
                    <IconButton
                      aria-label="Supprimer horaire quotidien"
                      onClick={() => handleRemoveExceptionDailySchedule(rangeIndex, scheduleIndex)}
                      color="error"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Heure début"
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) =>
                          handleExceptionDailyScheduleChange(
                            rangeIndex,
                            scheduleIndex,
                            'startTime',
                            e.target.value
                          )
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Heure fin"
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) =>
                          handleExceptionDailyScheduleChange(
                            rangeIndex,
                            scheduleIndex,
                            'endTime',
                            e.target.value
                          )
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>

                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Formules
                  </Typography>

                  {schedule.formulas.map((formula, formulaIndex) => (
                    <Grid
                      container
                      spacing={1}
                      alignItems="center"
                      key={formulaIndex}
                      sx={{ mt: 1 }}
                    >
                      <Grid item xs={4}>
                        <TextField
                          label="Label"
                          value={formula.label}
                          onChange={(e) =>
                            handleExceptionFormulaChange(
                              rangeIndex,
                              scheduleIndex,
                              formulaIndex,
                              'label',
                              e.target.value
                            )
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          label="Prix"
                          type="number"
                          value={formula.price}
                          onChange={(e) =>
                            handleExceptionFormulaChange(
                              rangeIndex,
                              scheduleIndex,
                              formulaIndex,
                              'price',
                              e.target.value
                            )
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          label="Capacité"
                          type="number"
                          value={formula.capacity}
                          onChange={(e) =>
                            handleExceptionFormulaChange(
                              rangeIndex,
                              scheduleIndex,
                              formulaIndex,
                              'capacity',
                              e.target.value
                            )
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          aria-label="Supprimer formule"
                          onClick={() =>
                            handleRemoveExceptionFormula(rangeIndex, scheduleIndex, formulaIndex)
                          }
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}

                  <Button
                    variant="outlined"
                    startIcon={<AddCircleIcon />}
                    onClick={() => handleAddExceptionFormula(rangeIndex, scheduleIndex)}
                    sx={{ mt: 1 }}
                  >
                    Ajouter une formule
                  </Button>
                </Paper>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddCircleIcon />}
                onClick={() => handleAddExceptionDailySchedule(rangeIndex)}
                sx={{ width: '100%', mt: 2 }}
              >
                Ajouter une plage horaire
              </Button>
            </Paper>
          ))}

          <Button
            variant="contained"
            onClick={handleAddScheduleException}
            startIcon={<AddCircleIcon />}
            sx={{ width: '100%', mt: 3 }}
          >
            Ajouter une nouvelle plage d'exception
          </Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button variant="contained" onClick={handleSaveScheduleExceptions}>
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AgendaPage;
