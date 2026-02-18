import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import axios from "axios";
import dayjs from "dayjs";
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from "../components/ui/button/Button";
import frLocale from '@fullcalendar/core/locales/fr';


dayjs.locale('fr');


interface Reservation {
  id: number;
  nomClient: string | null;
  email?: string | null;
  telephone?: string | null;
  paymentMethods?: string | null;
  commentaire?: string | null;
  nbrAdulte?: string | null;
  nbrEnfant?: string | null;
  nbrBebe?: string | null;
  status: string;
  date?: string | null;
  formule?: {
    label: string;
    price: number;
    capacity: number;
  } | null;
  dailyScheduleReservation?: {
    startTime: string;
    endTime: string;
  } | null;
  event: {
    id: number;
    nom: string;
  };
}

interface ApiEvent {
  id: number;
  nom: string;
  reservations: Reservation[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay: boolean;
  url?: string;
  extendedProps: {
    status: string;
    clientName: string;
    reservation: Reservation;
    originalEvent: ApiEvent;
  };
}

const statusColorMap: Record<string, string> = {
  CONFIRMER: "#28a745",
  EN_ATTENTE: "#ffc107",
  ANNULER: "#dc3545",
  N_A: "#0d6efd",
};

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios.get<any>(`https://waw.com.tn/api/api/users/${userId}`)
      .then(({ data }) => {
        const fcEvents: CalendarEvent[] = [];
        console.log(data.reservations)   ;
             data.reservations.forEach((res: Reservation) => {
          if (!res.date) return;

          let start = dayjs(res.date);
          let end = dayjs(res.date);

          if (res.dailyScheduleReservation?.startTime) {
            const [h, m] = res.dailyScheduleReservation.startTime.split(":").map(Number);
            start = start.hour(h).minute(m);
          }
          if (res.dailyScheduleReservation?.endTime) {
            const [h, m] = res.dailyScheduleReservation.endTime.split(":").map(Number);
            end = end.hour(h).minute(m);
          }

          fcEvents.push({
            id: `res-${res.id}`,
            title: `${res.nomClient || "Client Inconnu"} - ${res.formule?.label || "Réservation"}`,
            start: start.toISOString(),
            end: end.toISOString(),
            allDay: false,
            url: `https://waw.com.tn/detailsEvent?id=${res.event.id}`,
            extendedProps: {
              status: res.status || "N_A",
              clientName: res.nomClient || "Client Inconnu",
              reservation: res,
              originalEvent: {
                id: res.event.id,
                nom: res.event.nom,
                reservations: [],
              },
            },
          });
        });

        setEvents(fcEvents);
        console.log(fcEvents);
      })
      .catch(err => console.error("Erreur chargement réservations :", err));
  }, []);

  const handleEventClick = (clickInfo: any) => {
    // On empêche la navigation automatique via event.url
    clickInfo.jsEvent.preventDefault();

    setSelectedReservation(clickInfo.event.extendedProps.reservation);
    setSelectedEvent(clickInfo.event.extendedProps.originalEvent);
    openModal();
  };
const downloadVoucher = async (reservation) => {
const response = await fetch(`https://waw.com.tn/api/api/reservations/voucher/${reservation.id}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});


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
};

  const renderEventContent = (eventInfo: any) => {
    const status = eventInfo.event.extendedProps.status.toUpperCase();
    const color = statusColorMap[status] || "#0d6efd";

    return (
      <div style={{ backgroundColor: color, color: "#fff", padding: "2px 4px", borderRadius: "4px" }}>
        <div>{eventInfo.timeText}</div>
        <div>{eventInfo.event.title}</div>
      </div>
    );
  };


  return (
    <>
      <PageMeta title="Calendrier Réservations" description="Calendrier affichant réservations" />
      <TopBar />
      <Navbar />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-2">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          nowIndicator={true}
            locale={frLocale} 
        />
      </div>

<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6">
  {selectedReservation ? (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Réservation de {selectedReservation.nomClient || "Client Inconnu"}
      </h2>

      {/* Client Info */}
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

      {/* Reservation Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg border-b border-gray-600 pb-1">Détails de la Réservation</h3>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Événement :</strong> {selectedReservation.event?.nom || "N/A"}</p>
          <p><strong>Statut :</strong> 
            <span className={`px-2 py-1 rounded-full text-white font-semibold ${
              selectedReservation.status === "CONFIRMER" ? "bg-green-500" :
              selectedReservation.status === "EN_ATTENTE" ? "bg-yellow-500" :
              selectedReservation.status === "ANNULER" ? "bg-red-500" : "bg-blue-500"
            }`}>
              {selectedReservation.status}
            </span>
          </p>
          <p><strong>Date :</strong> {selectedReservation.date ? dayjs(selectedReservation.date).format("DD/MM/YYYY") : "N/A"}</p>
          <p><strong>Heure :</strong> {selectedReservation.dailyScheduleReservation ? `${selectedReservation.dailyScheduleReservation.startTime} - ${selectedReservation.dailyScheduleReservation.endTime}` : "N/A"}</p>
          <p><strong>Libellé :</strong> {selectedReservation.dailyScheduleReservation?.label || "N/A"}</p>
          <p><strong>Adultes :</strong> {selectedReservation.nbrAdulte || "N/A"}</p>
          <p><strong>Enfants :</strong> {selectedReservation.nbrEnfant || "N/A"}</p>
          <p><strong>Bébés :</strong> {selectedReservation.nbrBebe || "N/A"}</p>
        </div>
      </div>

      {/* Formulas / Packs */}
      {selectedReservation.reservationFormulas?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-lg border-b border-gray-600 pb-1">Liste Formules / Packs</h3>
          {selectedReservation.reservationFormulas.map((resFormula, idx) => (
            <p key={idx} className="font-semibold">
              {resFormula.nbr || "N/A"} × {resFormula.formula?.price || "N/A"} TND pour {resFormula.formula?.nbr || "N/A"} personne(s)
            </p>
          ))}
        </div>
      )}

      {/* Extras */}
      {selectedReservation.extrasReservation?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-lg border-b border-gray-600 pb-1">Extras</h3>
          {selectedReservation.extrasReservation.map((extra, idx) => (
            <p key={idx} className="font-semibold">
              {extra.nbr || "N/A"} × {extra.prix || "N/A"} TND {extra.titre || "N/A"}
            </p>
          ))}
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center font-semibold text-gray-800">
        <span>Total :</span>
        <span>{selectedReservation.total || "N/A"} TND</span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-row gap-3 justify-center">
        <a
          href={`https://waw.com.tn/detailsEvent?id=${selectedReservation.event?.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#181AD6] text-white px-4 py-2 rounded-lg inline-block"
        >
          Voir plus de détails
        </a>

        <button
          onClick={async () => {
            const shareData = {
              title: selectedReservation.event?.nom,
              text: "Découvrez cet événement !",
              url: `https://waw.com.tn/detailsEvent?id=${selectedReservation.event?.id}`,
            };
            if (navigator.share) {
              try { await navigator.share(shareData); } 
              catch (err) { console.error("Partage annulé ou erreur :", err); }
            } else alert("Le partage n'est pas supporté par ce navigateur.");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Partager
        </button>

{selectedReservation?.status === "CONFIRMER" && (
  <button
    onClick={() => downloadVoucher(selectedReservation)}
    className="bg-[#181AD6] text-white px-4 py-2 rounded-lg"
  >
    Télécharger
  </button>
)}

      </div>
    </div>
  ) : (
    <p>Aucune réservation sélectionnée</p>
  )}
</Modal>


      <Footer />
    </>
  );
};

export default Calendar;
