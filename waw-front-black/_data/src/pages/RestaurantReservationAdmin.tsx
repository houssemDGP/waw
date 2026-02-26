import { useState, useRef, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal } from "../components/ui/modal/ModalCalender";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
import frLocale from '@fullcalendar/core/locales/fr';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField, FormLabel, FormControlLabel, Select
} from '@mui/material';
import {
  Button,
  Popper,
  Paper,
  ClickAwayListener, Link,
  Stack,
  Box, MenuList, MenuItem, Typography, FormControl, Radio,
  RadioGroup, FormHelperText, IconButton
} from "@mui/material";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Types pour les réservations Ramadan
interface RamadanReservation {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  reservationType: "IFTAR" | "SUHOOR" | "DINNER" | "BREAKFAST";
  specialRequests: string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  createdAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  restaurant: {
    id: number;
    name: string;
    address: string;
  };
  table: {
    id: number;
    tableNumber: string;
    capacity: number;
  };
  business: {
    id: number;
    name: string;
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  extendedProps: {
    status: string;
    customerName: string;
    originalReservation: RamadanReservation;
    restaurantName: string;
    numberOfGuests: number;
    reservationType: string;
  };
}

interface DateReservations {
  date: string;
  reservations: RamadanReservation[];
  count: number;
}

const statusColorMap: Record<string, string> = {
  CONFIRMED: "success",
  PENDING: "warning",
  COMPLETED: "blue",
  CANCELLED: "danger",
  NO_SHOW: "gray",
};

const RestaurantReservationAdmin: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<RamadanReservation | null>(null);
  const [dateReservations, setDateReservations] = useState<DateReservations | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isDateModalOpen, openModal: openDateModal, closeModal: closeDateModal } = useModal();

  // Charger les réservations Ramadan
  useEffect(() => {


    const fetchRamadanReservations = async () => {
      try {
        const response = await axios.get<RamadanReservation[]>(
          `https://waw.com.tn/api/ramadan-reservations`
        );
        console.log(response.data);
        const fcEvents: CalendarEvent[] = response.data.map((reservation) => {
          // Combiner date et heure pour créer un objet Date
          const startDateTime = dayjs(`${reservation.reservationDate}T${reservation.reservationTime}`).toISOString();
          
          // Ajouter 2 heures pour la durée par défaut
          const endDateTime = dayjs(startDateTime).add(2, 'hours').toISOString();

          const eventTitle = `${reservation.customerName} - ${reservation.restaurant?.name || "Restaurant"} (${reservation.numberOfGuests} pers)`;

          return {
            id: `ramadan-${reservation.id}`,
            title: eventTitle,
            start: startDateTime,
            end: endDateTime,
            allDay: false,
            display: "block",
            extendedProps: {
              status: reservation.status,
              customerName: reservation.customerName,
              originalReservation: reservation,
              restaurantName: reservation.restaurant?.name || "N/A",
              numberOfGuests: reservation.numberOfGuests,
              reservationType: reservation.reservationType,
            },
          };
        });

        setEvents(fcEvents);
        console.log("Ramadan reservations loaded:", fcEvents.length);
      } catch (error) {
        console.error("Error fetching Ramadan reservations:", error);
      }
    };

    fetchRamadanReservations();
  }, []);

  // Gérer les paramètres d'URL pour ouvrir une réservation spécifique
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reservationId = urlParams.get('reservationId');
    
    if (reservationId && events.length > 0) {
      const reservationIdNum = parseInt(reservationId);
      const event = events.find(ev => {
        const eventReservationId = ev.extendedProps.originalReservation?.id;
        return eventReservationId === reservationIdNum;
      });
      
      if (event) {
        setSelectedReservation(event.extendedProps.originalReservation);
        openModal();
        
        // Nettoyer l'URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [events, openModal]);

  const handleEventClick = (clickInfo: any) => {
    setSelectedReservation(clickInfo.event.extendedProps.originalReservation);
    openModal();
  };

  const handleDateClick = (info: any) => {
    const clickedDate = dayjs(info.date).format("YYYY-MM-DD");
    const reservationsForDate = events
      .filter(event => dayjs(event.start).format("YYYY-MM-DD") === clickedDate)
      .map(event => event.extendedProps.originalReservation);
    
    if (reservationsForDate.length > 0) {
      setDateReservations({
        date: clickedDate,
        reservations: reservationsForDate,
        count: reservationsForDate.length
      });
      openDateModal();
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const status = eventInfo.event.extendedProps.status?.toUpperCase();
    const color = statusColorMap[status] || "primary";
    
    const colorBgMap: Record<string, string> = {
      success: "bg-green-500",
      warning: "bg-yellow-400",
      blue: "bg-blue-400",
      danger: "bg-red-500",
      gray: "bg-gray-500",
      primary: "bg-blue-500",
    };

    return (
      <div
        className={`flex flex-col p-1 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full`}
        style={{ width: "100%", height: "100%" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-1 gap-1">
          <span
            className={`py-0.5 text-xs font-semibold text-white rounded ${colorBgMap[color]}`}
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
        <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
          {eventInfo.event.extendedProps.reservationType}
        </div>
      </div>
    );
  };

  const dayCellContent = (args: any) => {
    const dateStr = dayjs(args.date).format("YYYY-MM-DD");
    const reservationCount = events.filter(event => 
      dayjs(event.start).format("YYYY-MM-DD") === dateStr
    ).length;

    return (
      <div className="fc-daygrid-day-frame relative">
        <div className="fc-daygrid-day-number">
          {args.dayNumberText}
          {reservationCount > 0 && (
            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
              <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {reservationCount}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleChangeStatus = async (reservation: RamadanReservation, newStatus: string) => {
    if (!reservation || !reservation.id) {
      console.error("Impossible de changer le statut : réservation ou ID manquant.");
      return;
    }

    const customerName = reservation.customerName || "Client inconnu";

    if (!window.confirm(`Êtes-vous sûr de vouloir changer le statut de ${customerName} à ${newStatus} ?`)) {
      return;
    }

    try {
      const url = `https://waw.com.tn/api/ramadan-reservations/${reservation.id}/status`;
      const response = await axios.put(url, { status: newStatus });
      console.log(`Statut mis à jour avec succès pour la réservation ID ${reservation.id}:`, response.data);
      closeModal();
      window.location.reload();
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour du statut :", err);
      alert("Erreur lors de la mise à jour du statut. Veuillez réessayer.");
    }
  };

  const downloadVoucher = async (reservation: RamadanReservation) => {
    try {
      const response = await fetch(
        `https://waw.com.tn/api/ramadan-reservations/${reservation.id}/voucher`,
        { method: 'GET' }
      );

      if (!response.ok) {
        alert('Erreur lors du téléchargement du voucher');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voucher_ramadan_${reservation.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Erreur lors du téléchargement du voucher');
    }
  };

  const exportDateReservationsPDF = async (dateReservations: DateReservations) => {
    try {
      const exportData = {
        date: dateReservations.date,
        reservations: dateReservations.reservations.map(res => ({
          customerName: res.customerName,
          customerEmail: res.customerEmail,
          customerPhone: res.customerPhone,
          reservationDate: res.reservationDate,
          reservationTime: res.reservationTime,
          numberOfGuests: res.numberOfGuests,
          reservationType: res.reservationType,
          specialRequests: res.specialRequests,
          totalPrice: res.totalPrice,
          status: res.status,
          restaurantName: res.restaurant?.name || "N/A",
          tableNumber: res.table?.tableNumber || "N/A"
        }))
      };

      const response = await fetch('https://waw.com.tn/api/ramadan-reservations/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_reservations_ramadan_${dateReservations.date}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erreur export PDF:', error);
      alert('Erreur lors de l\'export PDF');
    }
  };

  // États pour les filtres
  const [activityFilter, setActivityFilter] = useState("");
  const [clientName, setClientName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // États pour la sélection multiple
  const [selectedReservations, setSelectedReservations] = useState<RamadanReservation[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  // États pour les colonnes d'export
  const [exportColumns, setExportColumns] = useState({
    customer: true,
    email: true,
    telephone: true,
    restaurant: true,
    table: false,
    date: true,
    time: true,
    guests: true,
    type: true,
    status: true,
    total: true
  });

  // Filtrer les événements
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesActivity = activityFilter
        ? event.extendedProps.restaurantName?.toLowerCase().includes(activityFilter.toLowerCase())
        : true;
      const matchesClient = clientName
        ? event.extendedProps.customerName?.toLowerCase().includes(clientName.toLowerCase())
        : true;
      const matchesStatus = statusFilter ? event.extendedProps.status === statusFilter : true;
      return matchesActivity && matchesClient && matchesStatus;
    });
  }, [events, activityFilter, clientName, statusFilter]);

  // Fonctions pour la sélection multiple
  const handleReservationSelect = (e: React.ChangeEvent<HTMLInputElement>, reservation: RamadanReservation, index: number) => {
    const isChecked = e.target.checked;
    
    if (isChecked) {
      setSelectedReservations(prev => [...prev, reservation]);
    } else {
      setSelectedReservations(prev => prev.filter(r => r.id !== reservation.id));
    }
  };

  const handleSelectAll = () => {
    if (allSelected || !dateReservations) {
      setSelectedReservations([]);
      setAllSelected(false);
    } else {
      setSelectedReservations([...dateReservations.reservations]);
      setAllSelected(true);
    }
  };

  const handleDeselectAll = () => {
    setSelectedReservations([]);
    setAllSelected(false);
  };

  // Fonctions pour les colonnes d'export
  const toggleExportColumn = (column: string) => {
    setExportColumns(prev => ({
      ...prev,
      [column]: !(prev as any)[column]
    }));
  };

  const selectAllColumns = () => {
    setExportColumns({
      customer: true,
      email: true,
      telephone: true,
      restaurant: true,
      table: true,
      date: true,
      time: true,
      guests: true,
      type: true,
      status: true,
      total: true
    });
  };

  const deselectAllColumns = () => {
    setExportColumns({
      customer: false,
      email: false,
      telephone: false,
      restaurant: false,
      table: false,
      date: false,
      time: false,
      guests: false,
      type: false,
      status: false,
      total: false
    });
  };

  const countSelectedColumns = () => {
    return Object.values(exportColumns).filter(Boolean).length;
  };

  const getColumnLabel = (column: string) => {
    const labels: Record<string, string> = {
      customer: 'Client',
      email: 'Email',
      telephone: 'Téléphone',
      restaurant: 'Restaurant',
      table: 'Table',
      date: 'Date',
      time: 'Heure',
      guests: 'Invités',
      type: 'Type',
      status: 'Statut',
      total: 'Total'
    };
    return labels[column] || column;
  };

  // Export CSV
  const exportToCSV = (data: any[]) => {
    if (data.length === 0) {
      alert("Aucune donnée à exporter");
      return;
    }
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.map(header => `"${header}"`).join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      )
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob(["\uFEFF" + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `reservations_ramadan_${dayjs().format('DD-MM-YYYY_HH-mm')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    alert(`Export réussi ! ${data.length} réservation(s) exportée(s)`);
  };

  // Export PDF avec jspdf
  const exportToPDF = (data: any[]) => {
    if (data.length === 0) {
      alert("Aucune donnée à exporter");
      return;
    }

    import('jspdf').then((jsPDFModule) => {
      import('jspdf-autotable').then((autoTableModule) => {
        const { jsPDF } = jsPDFModule;
        const autoTable = autoTableModule.default;
        
        const doc = new jsPDF('landscape');
        
        const title = `Réservations Ramadan`;
        doc.setFontSize(16);
        doc.text(title, 14, 15);
        
        doc.setFontSize(10);
        doc.text(`Total: ${data.length} réservation(s)`, 14, 25);
        doc.text(`Date d'export: ${dayjs().format('DD/MM/YYYY HH:mm')}`, 14, 30);
        
        const headers = Object.keys(data[0]);
        const tableData = data.map(row => {
          return headers.map(header => row[header]);
        });
        
        autoTable(doc, {
          head: [headers],
          body: tableData,
          startY: 35,
          theme: 'grid',
          styles: {
            fontSize: 8,
            cellPadding: 2,
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          }
        });
        
        doc.save(`reservations_ramadan_${dayjs().format('DD-MM-YYYY_HH-mm')}.pdf`);
        alert(`Export PDF réussi ! ${data.length} réservation(s) exportée(s)`);
      }).catch(error => {
        console.error('Erreur jspdf-autotable:', error);
        alert('Erreur lors de l\'export PDF');
      });
    }).catch(error => {
      console.error('Erreur jsPDF:', error);
      alert('Erreur lors de l\'export PDF');
    });
  };

  // Export des réservations sélectionnées
  const exportSelectedReservationsWithColumns = (reservations: RamadanReservation[]) => {
    const filteredData = reservations.map(reservation => {
      const data: any = {};
      
      if (exportColumns.customer) {
        data.client = reservation.customerName;
      }
      if (exportColumns.email) {
        data.email = reservation.customerEmail;
      }
      if (exportColumns.telephone) {
        data.telephone = reservation.customerPhone;
      }
      if (exportColumns.restaurant) {
        data.restaurant = reservation.restaurant?.name || "N/A";
      }
      if (exportColumns.table) {
        data.table = reservation.table?.tableNumber || "N/A";
      }
      if (exportColumns.date) {
        data.date = reservation.reservationDate;
      }
      if (exportColumns.time) {
        data.heure = reservation.reservationTime;
      }
      if (exportColumns.guests) {
        data.invites = reservation.numberOfGuests;
      }
      if (exportColumns.type) {
        data.type = reservation.reservationType;
      }
      if (exportColumns.status) {
        data.statut = reservation.status;
      }
      if (exportColumns.total) {
        data.total = `${reservation.totalPrice || 0} TND`;
      }
      
      return data;
    });
    
    exportToCSV(filteredData);
  };

  return (
    <>
      <PageMeta title="Calendrier des Réservations Ramadan" description="Calendrier affichant les réservations Ramadan" />
      <div className="rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="center"
          flexWrap="wrap"
          sx={{
            width: "100%",
            mb: 2,
            px: { xs: 2, sm: 2 },
            py: { xs: 1, sm: 1 },
          }}
        >
          <TextField
            placeholder="Restaurant"
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            size="small"
            sx={{ 
              minWidth: 150, 
              borderRadius: "20px", 
              width: { xs: "100%", sm: "auto" } 
            }}
          />

          <TextField
            placeholder="Nom client"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            size="small"
            sx={{ 
              minWidth: 150, 
              borderRadius: "20px", 
              width: { xs: "100%", sm: "auto" } 
            }}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            size="small"
            sx={{ 
              minWidth: 150,
              width: { xs: "100%", sm: "auto" },
              backgroundColor: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.87)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
                borderWidth: '2px',
              },
              '& .MuiSelect-select': {
                padding: '8.5px 14px',
              }
            }}
            renderValue={(selected) => {
              if (!selected) {
                return <span style={{ color: 'rgba(0, 0, 0, 0.54)' }}>Tous les statuts</span>;
              }
              return selected === "PENDING" ? "En attente" :
                     selected === "CONFIRMED" ? "Confirmé" :
                     selected === "CANCELLED" ? "Annulé" :
                     selected === "COMPLETED" ? "Terminé" :
                     selected === "NO_SHOW" ? "No Show" : selected;
            }}
          >
            <MenuItem value="">Tous les statuts</MenuItem>
            <MenuItem value="PENDING">En attente</MenuItem>
            <MenuItem value="CONFIRMED">Confirmé</MenuItem>
            <MenuItem value="CANCELLED">Annulé</MenuItem>
            <MenuItem value="COMPLETED">Terminé</MenuItem>
            <MenuItem value="NO_SHOW">No Show</MenuItem>
          </Select>
        </Stack>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
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
          dateClick={handleDateClick}
          dayCellContent={dayCellContent}
          nowIndicator={true}
          slotEventOverlap={false}
        />
      </div>

      {/* Modal pour les détails d'une réservation */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 sm:p-10">
        {selectedReservation ? (
          <div className="text-white space-y-6">
            <h2 className="text-2xl font-bold border-b border-gray-600 pb-2 mb-4">
              Réservation Ramadan de {selectedReservation.customerName}
            </h2>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg border-b border-gray-600 pb-1">Informations Client</h3>
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Nom :</strong> {selectedReservation.customerName}</p>
                <p><strong>Email :</strong> {selectedReservation.customerEmail}</p>
                <p><strong>Téléphone :</strong> {selectedReservation.customerPhone}</p>
                <p><strong>Date de création :</strong> {dayjs(selectedReservation.createdAt).format("DD/MM/YYYY HH:mm")}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg border-b border-gray-600 pb-1">Détails de la Réservation</h3>
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Restaurant :</strong> {selectedReservation.restaurant?.name}</p>
                <p><strong>Table :</strong> {selectedReservation.table?.tableNumber} ({selectedReservation.table?.capacity} pers)</p>
                <p><strong>Date :</strong> {selectedReservation.reservationDate}</p>
                <p><strong>Heure :</strong> {selectedReservation.reservationTime}</p>
                <p><strong>Nombre d'invités Adultes:</strong> {selectedReservation.numberOfGuests}</p>
                                <p><strong>Nombre d'invités Enfants :</strong> {selectedReservation.numberOfGuestsEnfant}</p>
                                <p><strong>Nombre d'invités Bebes :</strong> {selectedReservation.numberOfGuestsBebe}</p>

                <p><strong>Type :</strong> {selectedReservation.reservationType}</p>
                <p><strong>Statut :</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    selectedReservation.status === "CONFIRMED" ? "bg-green-500" :
                    selectedReservation.status === "PENDING" ? "bg-yellow-500" :
                    selectedReservation.status === "CANCELLED" ? "bg-red-500" :
                    selectedReservation.status === "COMPLETED" ? "bg-blue-500" : "bg-gray-500"
                  }`}>
                    {selectedReservation.status}
                  </span>
                </p>
                <p><strong>Prix total :</strong> {selectedReservation.totalPrice || 0} TND</p>
              </div>
              
              {selectedReservation.specialRequests && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg border-b border-gray-600 pb-1">Demandes spéciales</h3>
                  <p className="bg-gray-800 p-3 rounded">{selectedReservation.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Changer le Statut</label>
                <select
                  value={selectedReservation.status}
                  onChange={(e) => handleChangeStatus(selectedReservation, e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-md p-2"
                >
                  <option value="PENDING">En attente</option>
                  <option value="CONFIRMED">Confirmé</option>
                  <option value="CANCELLED">Annulé</option>
                  <option value="COMPLETED">Terminé</option>
                  <option value="NO_SHOW">No Show</option>
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

      {/* Modal pour les réservations d'une date */}
      <Modal isOpen={isDateModalOpen} onClose={closeDateModal} className="max-w-[90%] p-1 sm:p-10" isFullscreen={true}>
        {dateReservations && (
          <div className="text-white space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-4">
              <h2 className="text-2xl font-bold">
                Réservations Ramadan du {dayjs(dateReservations.date).format("DD/MM/YYYY")}
              </h2>
              <div className="flex items-center gap-2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  {dateReservations.count} réservation(s)
                </span>
                
                {/* Bouton pour sélectionner les colonnes */}
                <div className="relative group">
                  <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold">
                    <span>Sélection colonnes</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Menu déroulant pour sélectionner les colonnes */}
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="p-3">
                      <h3 className="font-semibold mb-2 text-white">Colonnes à exporter</h3>
                      <div className="space-y-2">
                        {Object.entries(exportColumns).map(([column, isSelected]) => (
                          <label key={column} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleExportColumn(column)}
                              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                            />
                            <span>{getColumnLabel(column)}</span>
                          </label>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700">
                        <button
                          onClick={selectAllColumns}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          Tout sélectionner
                        </button>
                        <button
                          onClick={deselectAllColumns}
                          className="text-sm text-gray-400 hover:text-gray-300"
                        >
                          Tout désélectionner
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bouton pour exporter les réservations sélectionnées */}
                {selectedReservations.length > 0 && (
                  <button
                    onClick={() => exportSelectedReservationsWithColumns(selectedReservations)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    <span>Exporter {selectedReservations.length} sélectionné(s)</span>
                    <span className="text-xs bg-green-700 px-2 py-1 rounded">
                      {countSelectedColumns()} colonne(s)
                    </span>
                  </button>
                )}
                
                <button
                  onClick={() => exportDateReservationsPDF(dateReservations)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Exporter PDF Détaillé
                </button>
              </div>
            </div>

            {/* Afficher les colonnes sélectionnées */}
            {countSelectedColumns() > 0 && (
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-300">Colonnes à exporter :</span>
                  {Object.entries(exportColumns)
                    .filter(([_, isSelected]) => isSelected)
                    .map(([column]) => (
                      <span key={column} className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                        {getColumnLabel(column)}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Actions de sélection */}
            <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span>Tout sélectionner</span>
                </label>
                {selectedReservations.length > 0 && (
                  <button
                    onClick={handleDeselectAll}
                    className="text-gray-300 hover:text-white text-sm underline"
                  >
                    Tout désélectionner
                  </button>
                )}
              </div>
              {selectedReservations.length > 0 && (
                <div className="text-blue-400 font-medium">
                  {selectedReservations.length} réservation(s) sélectionnée(s)
                </div>
              )}
            </div>

            {/* Tableau des réservations */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-800">
                  <tr>
                    <th className="p-3 text-left w-12">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="p-3 text-left">Client</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Téléphone</th>
                    <th className="p-3 text-left">Restaurant</th>
                    <th className="p-3 text-left">Table</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Heure</th>
                    <th className="p-3 text-left">Invités</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Statut</th>
                    <th className="p-3 text-left">Total</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dateReservations.reservations.map((reservation, index) => (
                    <tr key={reservation.id} className="border-b border-gray-600 hover:bg-gray-700">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedReservations.some(r => r.id === reservation.id)}
                          onChange={(e) => handleReservationSelect(e, reservation, index)}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">{reservation.customerName}</td>
                      <td className="p-3">{reservation.customerEmail}</td>
                      <td className="p-3">{reservation.customerPhone}</td>
                      <td className="p-3">{reservation.restaurant?.name || "N/A"}</td>
                      <td className="p-3">{reservation.table?.tableNumber || "N/A"}</td>
                      <td className="p-3">{reservation.reservationDate}</td>
                      <td className="p-3">{reservation.reservationTime}</td>
                      <td className="p-3">{reservation.numberOfGuests}</td>
                      <td className="p-3">{reservation.reservationType}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          reservation.status === "CONFIRMED" ? "bg-green-500" :
                          reservation.status === "PENDING" ? "bg-yellow-500" :
                          reservation.status === "CANCELLED" ? "bg-red-500" :
                          reservation.status === "COMPLETED" ? "bg-blue-500" : "bg-gray-500"
                        }`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="p-3">{reservation.totalPrice || 0} TND</td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setSelectedReservation(reservation);
                            closeDateModal();
                            openModal();
                          }}
                          className="text-blue-400 hover:text-blue-300 underline text-sm"
                        >
                          Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RestaurantReservationAdmin;