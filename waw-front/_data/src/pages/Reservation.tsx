import { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal } from "../components/ui/modal/ModalCalender";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import dayjs from "dayjs";
import frLocale from '@fullcalendar/core/locales/fr';

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const isDateBetween = (target, start, end) => {
  const t = new Date(target).getTime();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return t >= s && t <= e;
};

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [nbrAdulte, setNbrAdulte] = useState(0);
  const [nbrEnfant, setNbrEnfant] = useState(0);
  const [nbrBebe, setNbrBebe] = useState(0);
  const [formulasNbr, setFormulasNbr] = useState({});
  const [extrasNbr, setExtrasNbr] = useState({});
  const [total, setTotal] = useState(0);

  const { isOpen: isScheduleOpen, openModal: openScheduleModal, closeModal: closeScheduleModal } = useModal();
  const { isOpen: isReservationOpen, openModal: openReservationModal, closeModal: closeReservationModal } = useModal();

  // --- Calcul automatique du total ---
  useEffect(() => {
    if (!selectedSchedule) return;
    const formulesTotal = (selectedSchedule.formulas || []).reduce((sum, f) => {
      const nbr = formulasNbr[f.id] || 0;
      return sum + nbr * f.price;
    }, 0);

    const extrasTotal = (selectedEvent?.extras || []).reduce((sum, extra, idx) => {
      const qty = extrasNbr[idx] || 0;
      return sum + qty * (extra?.prix || 0);
    }, 0);

    const totalCalc =
      (nbrAdulte * (selectedSchedule.prixAdulte || 0)) +
      (nbrEnfant * (selectedSchedule.prixEnfant || 0)) +
      (nbrBebe * (selectedSchedule.prixBebe || 0)) +
      formulesTotal +
      extrasTotal;
    console.log(formulasNbr);

    setTotal(totalCalc);
  }, [nbrAdulte, nbrEnfant, nbrBebe, formulasNbr, extrasNbr, selectedSchedule, selectedEvent]);

  // --- Charger les événements ---
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const businessId = localStorage.getItem("businessId");
        const res = await fetch(`https://waw.com.tn/api/events/business/${businessId}`);
        const data = await res.json();

        const calendarEvents = [];
        const exceptionDatesSet = new Set();

        data.forEach(event => {
          (event.scheduleRangeExceptions || []).forEach(range => {
            const selectedDays = range.selectedDays || [];
            const exclureDatesSet = new Set(range.selectedExclureDates || []);
            let current = new Date(range.startDate);
            const rangeEnd = new Date(range.endDate);
            while (current <= rangeEnd) {
              const dayStr = current.toISOString().split("T")[0];
              const dayName = dayNames[current.getDay()];
              if (selectedDays.includes(dayName.toUpperCase()) && !exclureDatesSet.has(dayStr)) {
                calendarEvents.push({
                  id: `exception-${event.id}-${range.id}-${dayStr}`,
                  title: `${event.nom} (Exception)`,
                  start: dayStr,
                  allDay: true,
                  extendedProps: { eventData: event, scheduleRange: range, isException: true },
                });
                exceptionDatesSet.add(`${event.id}-${dayStr}`);
              }
              current.setDate(current.getDate() + 1);
            }
          });
        });

        data.forEach(event => {
          (event.scheduleRanges || []).forEach(range => {
            const selectedDays = range.selectedDays || [];
            const exclureDatesSet = new Set(range.selectedExclureDates || []);
            let current = new Date(range.startDate);
            const rangeEnd = new Date(range.endDate);
            while (current <= rangeEnd) {
              const dayStr = current.toISOString().split("T")[0];
              const dayName = dayNames[current.getDay()];
              const key = `${event.id}-${dayStr}`;
              if (selectedDays.includes(dayName.toUpperCase()) && !exclureDatesSet.has(dayStr) && !exceptionDatesSet.has(key)) {
                calendarEvents.push({
                  id: `event-${event.id}-${range.id}-${dayStr}`,
                  title: event.nom,
                  start: dayStr,
                  allDay: true,
                  extendedProps: { eventData: event, scheduleRange: range, isException: false },
                });
              }
              current.setDate(current.getDate() + 1);
            }
          });
        });

        setEvents(calendarEvents);
      } catch (err) {
        console.error("Erreur chargement événements :", err);
      }
    };
    fetchEvents();
  }, []);

  // --- Gestion clic sur événement ---
  const handleEventClick = clickInfo => {
    setSelectedEvent(clickInfo.event.extendedProps.eventData);
    setSelectedDate(clickInfo.event.startStr);
    setSelectedSchedule(null);
    setNbrAdulte(0);
    setNbrEnfant(0);
    setNbrBebe(0);
    setFormulasNbr({});
    setExtrasNbr({});
    openScheduleModal();
  };

  const handleScheduleSelect = schedule => {
    setSelectedSchedule(schedule);
    closeScheduleModal();
    openReservationModal();
  };

  // --- Modal horaires ---
  const ScheduleModal = () => {
    if (!selectedEvent) return null;
    const dayName = dayNames[new Date(selectedDate).getDay()].toUpperCase();
    const schedules = [];

    (selectedEvent.scheduleRangeExceptions || []).forEach(range => {
      if (isDateBetween(selectedDate, range.startDate, range.endDate) &&
          range.selectedDays.includes(dayName)) {
        schedules.push(...(range.dailyScheduleExceptions || []));
      }
    });

    (selectedEvent.scheduleRanges || []).forEach(range => {
      if (isDateBetween(selectedDate, range.startDate, range.endDate) &&
          range.selectedDays.includes(dayName)) {
        schedules.push(...(range.dailySchedules || []));
      }
    });

    return (
      <Modal isOpen={isScheduleOpen} onClose={closeScheduleModal} className="max-w-[600px] p-6">
        <h2 className="text-white text-xl font-bold mb-4">
          Choisissez un créneau {selectedDate} pour "{selectedEvent.nom}"
        </h2>
        {schedules.length === 0 ? <p>Aucun créneau disponible</p> :
          schedules.map((s, i) => (
            <button key={i} className="border p-3 text-white rounded hover:bg-blue-500 w-full mb-2"
                    onClick={() => handleScheduleSelect(s)}>
              {s.startTime} - {s.endTime}
            </button>
          ))
        }
      </Modal>
    );
  };

  // --- Modal réservation ---
  const ReservationModal = () => {
    if (!selectedEvent || !selectedSchedule) return null;

    const handleSubmit = async e => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const reservationData = {
        event: { id: selectedEvent.id },
        eventId: selectedEvent.id,
        date: selectedDate,
        nomClient: formData.get("nom"),
        email: formData.get("email"),
        telephone: formData.get("telephone"),
        commentaire: formData.get("remarque") || "",
        paymentMethods: formData.get("paymentMethod"),
        dateReservation: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        dailyScheduleReservation: selectedSchedule,
        nbrAdulte,
        nbrEnfant,
        nbrBebe,
        reservationFormulas: Object.entries(formulasNbr)
          .filter(([_, nbr]) => nbr > 0)
          .map(([id, nbr]) => ({ formula: { id }, nbr })),
        extrasReservation: Object.entries(extrasNbr)
          .filter(([_, nbr]) => nbr > 0)
          .map(([idx, nbr]) => {
            const extra = selectedEvent.extras[parseInt(idx)];
            return { titre: extra.titre, prix: extra.prix, nbr };
          }),
        total
      };

      try {
        await axios.post("https://waw.com.tn/api/reservations", reservationData);
        alert("Réservation enregistrée avec succès !");
        closeReservationModal();
        setSelectedSchedule(null);
        setSelectedEvent(null);
        setFormulasNbr({});
        setExtrasNbr({});
      } catch (err) {
        console.error(err);
        alert("Capacité totale dépassée ou erreur de réservation.");
      }
    };

    return (
      <Modal isOpen={isReservationOpen} onClose={closeReservationModal} className="max-w-[700px] p-6">
        <h2 className="text-xl font-bold mb-4 text-white">
          Événements du {dayjs(selectedDate).format("YYYY-MM-DD")}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Adulte / Enfant / Bébé */}
          <div className="flex items-center justify-between border p-2 rounded">
            <span className="text-white">Prix Adulte : {selectedSchedule.prixAdulte} TND</span>
            <input type="number" min={0} value={nbrAdulte} onChange={e => setNbrAdulte(parseInt(e.target.value)||0)} className="border p-1 rounded w-20 text-white"/>
          </div>
          {selectedEvent.accepteEnfants && (
            <div className="flex items-center justify-between border p-2 rounded">
              <span className="text-white">Prix Enfant : {selectedSchedule.prixEnfant} TND</span>
              <input type="number" min={0} value={nbrEnfant} onChange={e => setNbrEnfant(parseInt(e.target.value)||0)} className="border p-1 rounded w-20 text-white"/>
            </div>
          )}
          {selectedEvent.accepteBebes && (
            <div className="flex items-center justify-between border p-2 rounded">
              <span className="text-white">Prix Bébé : {selectedSchedule.prixBebe} TND</span>
              <input type="number" min={0} value={nbrBebe} onChange={e => setNbrBebe(parseInt(e.target.value)||0)} className="border p-1 rounded w-20 text-white"/>
            </div>
          )}

          {/* Formules */}
          {selectedSchedule.formulas?.length > 0 && (
            <div>
              <p className="font-medium mb-2 text-white">Sélectionnez vos packs :</p>
              {selectedSchedule.formulas.map(f => (
                <div key={f.id} className="text-white flex items-center justify-between border p-2 rounded mb-2">
                  <span>{f.label} {f.price} DT ({f.nbr} places)</span>
                  <input type="number" min={0} value={formulasNbr[f.id] || 0}
                         onChange={e => {
                           const nbr = parseInt(e.target.value, 10) || 0;
                           setFormulasNbr(prev => ({ ...prev, [f.id]: nbr }));
                         }}
                         className="text-white border p-1 rounded w-20"/>
                </div>
              ))}
            </div>
          )}

          {/* Extras */}
          {selectedEvent.extras?.length > 0 && (
            <div>
              <p className="font-medium mb-2 text-white">Sélectionnez vos extras :</p>
              {selectedEvent.extras.map((extra, idx) => (
                <div key={idx} className="flex items-center justify-between border p-2 rounded mb-2">
                  <span className="text-white">{extra.titre} {extra.prix} TND</span>
                  <input type="number" min={0} value={extrasNbr[idx]||0} onChange={e => {
                    const nbr = parseInt(e.target.value)||0;
                    setExtrasNbr(prev => ({...prev, [idx]: nbr}));
                  }} className="text-white border p-1 rounded w-20"/>
                </div>
              ))}
            </div>
          )}

          {/* Client form */}
          <div>
            <label className="text-white">Nom</label>
            <input type="text" name="nom" required className="text-white border p-2 rounded w-full"/>
          </div>
          <div>
            <label className="text-white">Email</label>
            <input type="email" name="email" required className="text-white border p-2 rounded w-full"/>
          </div>
          <div>
            <label className="text-white">Téléphone</label>
            <input type="text" name="telephone" required className="text-white border p-2 rounded w-full"/>
          </div>
          <div>
            <label className="text-white">Type de paiement</label>
            <select name="paymentMethod" required className="border p-2 rounded w-full text-white">
              <option value="" disabled>Sélectionnez un mode de paiement</option>
              {selectedEvent.paymentMethods?.map((method, i) => (
                <option key={i} value={method} className="text-black">{method}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white">Remarque</label>
            <textarea name="remarque" rows={3} className="border p-2 rounded w-full text-white"/>
          </div>

          <p className="font-bold text-lg text-white">Total : {total} TND</p>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
            Confirmer la réservation
          </button>
        </form>
      </Modal>
    );
  };

  return (
    <>
      <PageMeta title="Calendrier" description="Vue calendrier des événements" />
      <div className="rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable
          eventClick={handleEventClick}
          events={events}
          height="auto"
          locale={frLocale}
        />
      </div>

      <ScheduleModal />
      <ReservationModal />
    </>
  );
};

export default Calendar;
