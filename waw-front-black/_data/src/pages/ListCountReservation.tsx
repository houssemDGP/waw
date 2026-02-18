import { useState, useEffect, useRef, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");

interface DailyScheduleCount {
  id: number;
  date: string;
  nbrReservation: number;
  nbrAttente: number;
  dailySchedule: { id: number; label?: string };
  event: { id: number; nom: string };
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay: boolean;
  extendedProps: {
    nbrReservation: number;
    nbrAttente: number;
    eventName: string;
  };
}

const DailyScheduleCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const businessId = localStorage.getItem("businessId");

  useEffect(() => {
    axios
      .get<DailyScheduleCount[]>(`https://waw.com.tn/api/api/dailyScheduleCounts/business/${businessId}`)
      .then(({ data }) => {
        const fcEvents: CalendarEvent[] = data.map((dsc) => ({
          id: `dsc-${dsc.id}`,
          title: `${dsc.event.id} - ${dsc.nbrReservation} réservations (${dsc.nbrAttente} attente)`,
          start: dayjs(dsc.date).toISOString(),
          allDay: true,
          extendedProps: {
            nbrReservation: dsc.nbrReservation,
            nbrAttente: dsc.nbrAttente,
            eventName: dsc.event.nom,
          },
        }));
        setEvents(fcEvents);
      })
      .catch((err) => console.error("Erreur lors du chargement des DailyScheduleCount :", err));
  }, [businessId]);

  const renderEventContent = (eventInfo: any) => {
    const { nbrReservation, nbrAttente } = eventInfo.event.extendedProps;
    return (
      <div className="p-1 text-sm font-semibold truncate">
        {eventInfo.event.title} <br />
        <span className="text-xs text-white-500">
          Réservations: {nbrReservation},<br/> Attente: {nbrAttente}
        </span>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={frLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventContent={renderEventContent}
        nowIndicator={true}
        slotEventOverlap={false}
      />
    </div>
  );
};

export default DailyScheduleCalendar;
