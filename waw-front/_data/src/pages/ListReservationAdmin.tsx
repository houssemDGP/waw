import { useState, useRef, useEffect,useMemo  } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal } from "../components/ui/modal/ModalCalender";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/fr";  // si tu veux le format français
dayjs.locale("fr");
import frLocale from '@fullcalendar/core/locales/fr';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,FormLabel,FormControlLabel,Select
} from '@mui/material';
import {
  Button,
  Popper,
  Paper,
  ClickAwayListener,Link,
  Stack,
  Box, MenuList, MenuItem, Typography,FormControl,  Radio,
  RadioGroup,FormHelperText,IconButton
} from "@mui/material";
interface Reservation {
  id: number;
  nomClient: string | null;
  status: string;
  date: string | null;
  formule?: {
    label: string;
    price: number;
    capacity: number;
  } | null;
  dailyScheduleReservation?: {
    startTime: string;
    endTime: string;
  } | null;
}

interface ApiEvent {
  id: number;
  nom: string;
  description: string;
  reservations: Reservation[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay: boolean;
  extendedProps: {
    status: string;
    clientName: string;
    originalReservation: Reservation;
    originalEvent: ApiEvent;
  };
}

const statusColorMap: Record<string, string> = {
  CONFIRMER: "success",
  EN_ATTENTE: "warning",
  LIST_ATTENTE: "orange",
  ANNULER: "danger",
  N_A: "primary",
};

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const businessId = localStorage.getItem("businessId");

  useEffect(() => {
    axios
      .get<ApiEvent[]>(`https://waw.com.tn/api/api/events`)
      .then(({ data }) => {
        const fcEvents: CalendarEvent[] = [];
        console.log(data);
        data.forEach((event) => {
          event.reservations.forEach((res) => {
            if (!res.date) return;

            let startDateTime = res.date;
            if (res.dailyScheduleReservation?.startTime) {
              startDateTime = dayjs(res.date)
                .hour(parseInt(res.dailyScheduleReservation.startTime.split(":")[0]))
                .minute(parseInt(res.dailyScheduleReservation.startTime.split(":")[1]))
                .toISOString();
            }

            let endDateTime: string | undefined;
            if (res.dailyScheduleReservation?.endTime) {
              endDateTime = dayjs(res.date)
                .hour(parseInt(res.dailyScheduleReservation.endTime.split(":")[0]))
                .minute(parseInt(res.dailyScheduleReservation.endTime.split(":")[1]))
                .toISOString();
            }

            fcEvents.push({
              id: `res-${res.id}`,
              title: `${res.nomClient || "Client inconnu"} - ${res.formule?.label || "Réservation"}`,
              start: startDateTime,
              end: endDateTime,
              allDay: false,
               display: "block", 
              extendedProps: {
                status: res.status || "N_A",
                clientName: res.nomClient || "Client inconnu",
                originalReservation: res,
                originalEvent: event,
                businessName: event.business?.rs || "N/A", 
              },
            });
          });
        });

        setEvents(fcEvents);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des réservations :", err);
      });
  }, []);

  const handleEventClick = (clickInfo: any) => {
    setSelectedReservation(clickInfo.event.extendedProps.originalReservation);
    setSelectedEvent(clickInfo.event.extendedProps.originalEvent);
    openModal();
  };

const renderEventContent = (eventInfo: any) => {
  const status = eventInfo.event.extendedProps.status?.toUpperCase();
  const color = statusColorMap[status] || "primary";

  const colorBgMap: Record<string, string> = {
    success: "bg-green-500",
    warning: "bg-yellow-400",
    orange: "bg-orange-400",
    danger: "bg-red-500",
    primary: "bg-blue-500",
  };

  return (
    <div
      className={`flex flex-col  p-1 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full`}
      style={{ width: "100%", height: "100%" }} 
    >
<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-1 gap-1">
        <span
          className={` py-0.5 text-xs font-semibold text-white rounded ${colorBgMap[color]}`}
        >
          {status}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-300">
          {eventInfo.timeText}
        </span>
      </div>
      <div className="text-sm font-semibold text-gray-800 dark:text-white truncate">
        {eventInfo.event.title}
      </div>
    </div>
  );
};


  const handleChangeStatus = async (reservation: any, newStatus: string) => {
    if (!reservation || !reservation.id) {
      console.error("Impossible de changer le statut : réservation ou ID manquant.");
      return;
    }

    const clientName = reservation.nomClient || "Client inconnu";

    if (!window.confirm(`Êtes-vous sûr de vouloir changer le statut de ${clientName} à ${newStatus} ?`)) {
      return;
    }

    try {
      const url = `https://waw.com.tn/api/api/reservations/${reservation.id}/status?newStatus=${newStatus}`;
      const response = await axios.put(url);
      console.log(`Statut mis à jour avec succès pour la réservation ID ${reservation.id}:`, response.data);
      closeModal();
      window.location.reload();
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour du statut :", err);
      if (err.response) {
        console.error(`Échec de la mise à jour : ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        console.error("Échec de la mise à jour : aucune réponse du serveur. Vérifiez la connexion réseau.");
      } else {
        console.error("Échec de la mise à jour : une erreur inattendue est survenue.");
      }
    }
  };

const downloadVoucher = async (reservation: any) => {
  try {
    const response = await fetch(
      `https://waw.com.tn/api/api/reservations/voucher/${reservation.id}`,
      { method: 'POST' } // ⚠️ car ta méthode est @PostMapping actuellement
    );

    if (!response.ok) {
      alert('Erreur lors du téléchargement du voucher');
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voucher_reservation.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert('Erreur lors du téléchargement du voucher');
  }
};
const [inputValue, setInputValue] = useState("");
const [statusFilter, setStatusFilter] = useState("");
const [activityFilter, setActivityFilter] = useState("");
const [clientName , setClientName ] = useState("");
 const [businessFilter, setBusinessFilter] = useState("");

 
  const filteredEvents = useMemo(() => {
    console.log(events);
    return events.filter((event) => {
      const matchesActivity = activityFilter
        ? event.extendedProps.originalEvent.nom?.toLowerCase().includes(activityFilter.toLowerCase())
        : true;
      const matchesClient = clientName
        ? event.extendedProps.clientName?.toLowerCase().includes(clientName.toLowerCase())
        : true;
            const matchesBusiness = businessFilter
      ? event.extendedProps.businessName?.toLowerCase().includes(businessFilter.toLowerCase())
      : true;
      const matchesStatus = statusFilter ? event.extendedProps.status === statusFilter : true;
          return matchesActivity && matchesClient && matchesStatus && matchesBusiness;
    });
  }, [events, activityFilter, clientName, statusFilter,businessFilter]);
const businessList = useMemo(() => {
  const set = new Set<string>();
  events.forEach((ev) => {
    if (ev.extendedProps.businessName) {
      set.add(ev.extendedProps.businessName);
    }
  });
  return Array.from(set);
}, [events]);

  return (
    <>
      <PageMeta title="Calendrier des Réservations" description="Calendrier affichant les réservations" />
      <div className="rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
<div>
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={2}
    alignItems={{ xs: "stretch", sm: "center" }}
    justifyContent="center"
    flexWrap="wrap"
    sx={{
      width: "100%",
      mb: 2,
      px: { xs: 2, sm: 0 }, // ← padding horizontal : 16px sur mobile, 0 sur desktop
      py: { xs: 1, sm: 0 }, // ← padding vertical : 8px sur mobile
    }}
  >
    {/* Activité */}
    <TextField
      placeholder="Activité"
      value={activityFilter}
      onChange={(e) => setActivityFilter(e.target.value)}
      size="small"
      sx={{ minWidth: 150, borderRadius: "20px", width: { xs: "100%", sm: "auto" } }}
    />

    {/* Nom client */}
    <TextField
      placeholder="Nom client"
      value={clientName}
      onChange={(e) => setClientName(e.target.value)}
      size="small"
      sx={{ minWidth: 150, borderRadius: "20px", width: { xs: "100%", sm: "auto" } }}
    />

    <label>Par status</label>
    <Select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      displayEmpty
      sx={{ minWidth: 150, width: { xs: "100%", sm: "auto" } }}
    >
      <MenuItem value="">Tous les statuts</MenuItem>
      <MenuItem value="LIST_ATTENTE">Liste d'attente</MenuItem>
      <MenuItem value="EN_ATTENTE">En attente</MenuItem>
      <MenuItem value="CONFIRMER">Confirmé</MenuItem>
      <MenuItem value="ANNULER">Annulé</MenuItem>
    </Select>
    <label>Par business</label>
    <Select
  value={businessFilter}
  onChange={(e) => setBusinessFilter(e.target.value)}
  displayEmpty
  sx={{ minWidth: 150, width: { xs: "100%", sm: "auto" } }}
>
    <MenuItem value="">Tous les business</MenuItem>

{businessList.map((b) => (
  <MenuItem key={b} value={b}>{b}</MenuItem>
))}
</Select>
  </Stack>
</div>


{/* FullCalendar */}
<FullCalendar
  ref={calendarRef}
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  initialView="timeGridThreeDays"
  locale={frLocale}
  headerToolbar={{
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridThreeDays,timeGridWeek,timeGridDay",
  }}
  views={{
    timeGridThreeDays: { type: "timeGrid", duration: { days: 3 }, buttonText: "3 jours" },
    timeGridWeek: { buttonText: "Semaine" },
    timeGridDay: { buttonText: "Jour" },
    dayGridMonth: { buttonText: "Mois" },
  }}
  events={filteredEvents}
  eventClick={handleEventClick}
  eventContent={renderEventContent}
  nowIndicator={true}
  slotEventOverlap={false}
/>



      </div>

<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 sm:p-10">
  {selectedReservation && selectedEvent ? (
    <div className="text-white space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold border-b border-gray-600 pb-2 mb-4">
        Réservation de {selectedReservation.nomClient || "Client inconnu"}
      </h2>

      {/* Section Client */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg border-b border-gray-600 pb-1">Informations Client</h3>
        {selectedReservation.user ? (
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Nom :</strong> {selectedReservation.user.nom} {selectedReservation.user.prenom}</p>
            <p><strong>Email :</strong> {selectedReservation.user.mail}</p>
            <p><strong>Téléphone :</strong> {selectedReservation.telephone || "Non renseigné"}</p>
            <p><strong>Moyen de paiement :</strong> {selectedReservation.paymentMethods || "Non renseigné"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Client :</strong> {selectedReservation.nom || "Non renseigné"}</p>
            <p><strong>Email :</strong> {selectedReservation.email || "Non renseigné"}</p>
            <p><strong>Téléphone :</strong> {selectedReservation.telephone || "Non renseigné"}</p>
            <p><strong>Moyen de paiement :</strong> {selectedReservation.paymentMethods || "Non renseigné"}</p>
          </div>
        )}
      </div>

      {/* Section Réservation */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg border-b border-gray-600 pb-1">Détails de la Réservation</h3>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Événement :</strong> {selectedEvent.nom}</p>
          <p><strong>Statut :</strong> {selectedReservation.status}</p>
          <p><strong>Date :</strong> {selectedReservation.date ? dayjs(selectedReservation.date).format("DD/MM/YYYY") : "N/A"}</p>
          <p><strong>Heure :</strong> {selectedReservation.dailyScheduleReservation ? `${selectedReservation.dailyScheduleReservation.startTime} - ${selectedReservation.dailyScheduleReservation.endTime}` : "N/A"}</p>
          <p><strong>label :</strong> {selectedReservation.dailyScheduleReservation.label}</p>
<br/>
    {selectedReservation.reservationFormulas.map((reservationFormula, index) => (

      <>

          <p className="font-semibold"> {reservationFormula.nbr || "N/A"} * {reservationFormula.formula.price} DT pour {reservationFormula.formula.nbr} personne(s)</p>

          <br/>
      </>
))}

        </div>
      </div>

      {/* Section Actions */}
      <div className="space-y-3">
        <div>
          <label className="block font-semibold mb-1">Changer le Statut</label>
          <select
            value={selectedReservation.status}
            onChange={(e) => handleChangeStatus(selectedReservation, e.target.value)}
            className="w-full bg-gray-800 text-white rounded-md p-2"
          >
            <option value="LIST_ATTENTE">Liste d'attente</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="CONFIRMER">Confirmé</option>
            <option value="ANNULER">Annulé</option>
          </select>
        </div>

        <button
          onClick={() => downloadVoucher(selectedReservation)}
          className="w-full bg-gradient-to-r from-[#181AD6] to-[#FF7900] text-white px-4 py-2 rounded-lg font-semibold"
        >
          Télécharger le voucher
        </button>
      </div>
    </div>
  ) : (
    <p className="text-white">Aucune réservation sélectionnée</p>
  )}
</Modal>

    </>
  );
};

export default Calendar;
