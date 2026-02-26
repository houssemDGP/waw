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
  user?: {
    nom: string;
    prenom: string;
    mail: string;
  };
  telephone?: string;
  paymentMethods?: string;
  nbrAdulte?: number;
  nbrEnfant?: number;
  nbrBebe?: number;
  reservationFormulas?: any[];
  extrasReservation?: any[];
  total?: number;
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

interface DateReservations {
  date: string;
  reservations: Reservation[];
  count: number;
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
  const [dateReservations, setDateReservations] = useState<DateReservations | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isDateModalOpen, openModal: openDateModal, closeModal: closeDateModal } = useModal();
  const businessId = localStorage.getItem("businessId");

  // Add this useEffect to handle URL parameters
  useEffect(() => {
    // Check if URL has reservationId parameter when component mounts or events change
    const urlParams = new URLSearchParams(window.location.search);
    const reservationId = urlParams.get('reservationId');
    
    console.log("🔍 Checking URL for reservationId:", reservationId);
    console.log("📊 Current events count:", events.length);
    
    if (reservationId && events.length > 0) {
      const reservationIdNum = parseInt(reservationId);
      console.log("🎯 Looking for reservation ID:", reservationIdNum);
      
      // Find the reservation in events
      const event = events.find(ev => {
        const eventReservationId = ev.extendedProps.originalReservation?.id;
        console.log("🔎 Checking event:", ev.id, "reservation ID:", eventReservationId);
        return eventReservationId === reservationIdNum;
      });
      
      if (event) {
        console.log("✅ Found reservation, opening modal");
        setSelectedReservation(event.extendedProps.originalReservation);
        setSelectedEvent(event.extendedProps.originalEvent);
        openModal();
        
        // Clean URL - remove the parameter
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        console.log("🧹 Cleaned URL");
      } else {
        console.log("❌ Reservation not found in events");
      }
    }
  }, [events, openModal]); // Run when events change or modal function changes

  const openReservationModal = (reservationId: number) => {
    // Find the reservation in events
    const event = events.find(ev => ev.id === `res-${reservationId}`);
    if (event) {
      setSelectedReservation(event.extendedProps.originalReservation);
      setSelectedEvent(event.extendedProps.originalEvent);
      openModal();
    }
  };

  useEffect(() => {
    (window as any).openReservationModal = openReservationModal;
  }, [events]);
  useEffect(() => {
    axios
      .get<ApiEvent[]>(`https://waw.com.tn/api/events/business/${businessId}`)
      .then(({ data }) => {
        const fcEvents: CalendarEvent[] = [];

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

  const handleDateClick = (info: any) => {
    const clickedDate = dayjs(info.date).format("YYYY-MM-DD");
    const reservationsForDate = events
      .filter(event => dayjs(event.start).format("YYYY-MM-DD") === clickedDate)
      .map(event => event.extendedProps);
      console.log(reservationsForDate);
      deselectAllColumns();
      handleDeselectAll();

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
      orange: "bg-orange-400",
      danger: "bg-red-500",
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
      const url = `https://waw.com.tn/api/reservations/${reservation.id}/status?newStatus=${newStatus}`;
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
        `https://waw.com.tn/api/reservations/voucher/${reservation.id}`,
        { method: 'POST' }
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


const exportDateReservationsPDF = async (dateReservations: DateReservations) => {
  try {
    const exportData = {
      date: dateReservations.date,
      reservations: dateReservations.reservations.map(res => ({
        nomClient: res.nomClient || "N/A",
        commentaire:res.commentaire || "N/A",
        email: res.user?.mail || res.email || "N/A",
        telephone: res.telephone || "N/A",
        paymentMethods: res.paymentMethods || "N/A",
        eventName: res.extendedProps?.originalEvent?.nom || "N/A",
        status: res.status || "N/A",
        date: res.date ? dayjs(res.date).format("DD/MM/YYYY") : "N/A",
        startTime: res.dailyScheduleReservation?.startTime || "N/A",
        endTime: res.dailyScheduleReservation?.endTime || "N/A",
        nbrAdulte: res.nbrAdulte || 0,
        nbrEnfant: res.nbrEnfant || 0,
        nbrBebe: res.nbrBebe || 0,
        reservationFormulas: res.reservationFormulas?.map((rf: any) => ({
          nbr: rf.nbr || 0,
          label: rf.formula?.label || "Pack",
          price: rf.formula?.price || 0,
          capacity: rf.formula?.nbr || 0
        })) || [],
        extrasReservation: res.extrasReservation?.map((er: any) => ({
          nbr: er.nbr || 0,
          titre: er.titre || "Extra",
          prix: er.prix || 0
        })) || [],
        total: res.total || 0
      }))
    };

    const response = await fetch('https://waw.com.tn/api/reservations/export-pdf-detailed', {
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
    a.download = `rapport_reservations_${dateReservations.date}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Erreur export PDF:', error);
    alert('Erreur lors de l\'export PDF');
  }
};

const exportDateReservationsDetailed = (dateReservations: DateReservations) => {
  // Créer un CSV très détaillé avec toutes les informations
  const detailedData = [
    // En-têtes détaillés
    [
      "CLIENT", "EMAIL", "TÉLÉPHONE", "MOYEN PAIEMENT", 
      "ÉVÉNEMENT", "STATUT", "DATE", "HEURE DÉBUT", "HEURE FIN",
      "ADULTES", "ENFANTS", "BÉBÉS", 
      "PACKS (DÉTAILS)", "EXTRAS (DÉTAILS)", "TOTAL TND"
    ],
    
    // Données pour chaque réservation
    ...dateReservations.reservations.map(res => {
      // Formater les packs en détail
      const packsDetailed = res.reservationFormulas?.map((rf: any, index: number) => 
        `Pack ${index + 1}: ${rf.nbr || 0}x ${rf.formula?.label || 'Pack'} - ${rf.formula?.price || 0}TND/pers (${rf.formula?.nbr || 0} pers)`
      ).join(' | ') || "Aucun pack";

      // Formater les extras en détail
      const extrasDetailed = res.extrasReservation?.map((er: any, index: number) => 
        `Extra ${index + 1}: ${er.nbr || 0}x ${er.titre || 'Extra'} - ${er.prix || 0}TND`
      ).join(' | ') || "Aucun extra";

      return [
        // Informations client
        res.nomClient || "Non spécifié",
        res.user?.mail || res.email || "Non spécifié",
        res.telephone || "Non spécifié",
        res.paymentMethods || "Non spécifié",
        
        // Informations réservation
        res.extendedProps?.originalEvent?.nom || "Non spécifié",
        res.status || "Non spécifié",
        res.date ? dayjs(res.date).format("DD/MM/YYYY") : "Non spécifié",
        res.dailyScheduleReservation?.startTime || "Non spécifié",
        res.dailyScheduleReservation?.endTime || "Non spécifié",
        
        // Participants
        res.nbrAdulte || 0,
        res.nbrEnfant || 0,
        res.nbrBebe || 0,
        
        // Packs et extras détaillés
        packsDetailed,
        extrasDetailed,
        
        // Total
        `${res.total || 0} TND`
      ];
    })
  ];

  // Créer le contenu CSV
  const csvContent = detailedData.map(row => 
    row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")
  ).join("\n");

  // Ajouter un en-tête descriptif
  const fullCsvContent = `RÉSERVATIONS DU ${dayjs(dateReservations.date).format("DD/MM/YYYY")}\nTotal: ${dateReservations.count} réservation(s)\n\n${csvContent}`;

  // Télécharger le fichier
  const blob = new Blob(["\uFEFF" + fullCsvContent], { 
    type: "text/csv;charset=utf-8;" 
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reservations_detaillees_${dateReservations.date}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

  const [inputValue, setInputValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activityFilter, setActivityFilter] = useState("");
  const [clientName, setClientName] = useState("");
// États pour gérer les réservations sélectionnées
const [selectedReservations, setSelectedReservations] = useState([]);
const [allSelected, setAllSelected] = useState(false);
// Fonction pour gérer la sélection d'une réservation
const handleReservationSelect = (e, reservation, index) => {
  const isChecked = e.target.checked;
  
  if (isChecked) {
    // Ajouter la réservation avec son index
    setSelectedReservations(prev => [...prev, { ...reservation, _index: index }]);
  } else {
    // Retirer la réservation par index
    setSelectedReservations(prev => prev.filter(r => r._index !== index));
  }
};

// Fonction pour sélectionner/désélectionner toutes les réservations
const handleSelectAll = () => {
  if (allSelected) {
    setSelectedReservations([]);
    setAllSelected(false);
  } else {
    // Ajouter toutes les réservations avec leurs index
    const allReservationsWithIndex = dateReservations.reservations.map((reservation, index) => ({
      ...reservation,
      _index: index
    }));
    setSelectedReservations(allReservationsWithIndex);
    setAllSelected(true);
  }
};

// Fonction pour tout désélectionner
const handleDeselectAll = () => {
  setSelectedReservations([]);
  setAllSelected(false);
};

// État pour les colonnes à exporter
const [exportColumns, setExportColumns] = useState({
  client: false,
  email: true,
  telephone: false,
  paiement: false,
  evenement: false,
  statut: false,
  heure: false,
  adultes: false,
  enfants: false,
  bebes: false,
  listePacks: false,
  total: true
});

// Basculer une colonne
const toggleExportColumn = (column) => {
  setExportColumns(prev => ({
    ...prev,
    [column]: !prev[column]
  }));
};

// Sélectionner toutes les colonnes
const selectAllColumns = () => {
  setExportColumns({
    client: true,
    email: true,
    telephone: true,
    paiement: true,
    evenement: true,
    statut: true,
    heure: true,
    adultes: true,
    enfants: true,
    bebes: true,
    listePacks: true,
    total: true
  });
};

// Désélectionner toutes les colonnes
const deselectAllColumns = () => {
  setExportColumns({
    client: false,
    email: false,
    telephone: false,
    paiement: false,
    evenement: false,
    statut: false,
    heure: false,
    adultes: false,
    enfants: false,
    bebes: false,
    listePacks: false,
    total: false
  });
};

// Compter les colonnes sélectionnées
const countSelectedColumns = () => {
  return Object.values(exportColumns).filter(Boolean).length;
};

// Obtenir le libellé d'une colonne
const getColumnLabel = (column) => {
  const labels = {
    client: 'Client',
    email: 'Email',
    telephone: 'Téléphone',
    paiement: 'Paiement',
    evenement: 'Événement',
    statut: 'Statut',
    heure: 'Heure',
    adultes: 'Adultes',
    enfants: 'Enfants',
    bebes: 'Bébés',
    listePacks: 'Liste packs',
    total: 'Total'
  };
  return labels[column] || column;
};

// Formater les packs pour l'export
const formatPacksForExport = (reservation) => {
  if (!reservation.reservationFormulas || reservation.reservationFormulas.length === 0) {
    return "Aucun pack";
  }
  
  return reservation.reservationFormulas
    .map(formula => {
      const quantity = formula.nbr || 1;
      const packName = formula.formula?.nom || "Pack";
      const price = formula.formula?.price ? `${formula.formula.price} TND` : "";
      const persons = formula.formula?.nbr ? `pour ${formula.formula.nbr} pers` : "";
      
      return `${quantity} × ${packName} ${price} ${persons}`.trim();
    })
    .join('; ');
};

// Exporter les réservations sélectionnées avec les colonnes choisies
const exportSelectedReservationsWithColumns = (reservations) => {

  console.log(reservations);
  // Filtrer les données selon les colonnes sélectionnées
  const filteredData = reservations.map(reservation1 => {
    const data = {};
    const reservation = reservation1.originalReservation;
      data.date = reservation1.originalReservation.date || "N/A";

    if (exportColumns.client) {
      data.client = reservation.nomClient || "N/A";
    }
    if (exportColumns.email) {
      data.email = reservation.user?.mail || reservation.email || "N/A";
    }
    if (exportColumns.telephone) {
      data.telephone = reservation.telephone || "N/A";
    }
    if (exportColumns.paiement) {
      data.paiement = reservation.paymentMethods || "N/A";
    }
    if (exportColumns.evenement) {
      data.evenement = reservation1.originalEvent?.nom || "N/A";
    }
    if (exportColumns.statut) {
      data.statut = reservation.status || "N/A";
    }
    if (exportColumns.heure) {
      data.heure = reservation.dailyScheduleReservation ? 
        `${reservation.dailyScheduleReservation.startTime} - ${reservation.dailyScheduleReservation.endTime}` : 
        "N/A";
    }
    if (exportColumns.adultes) {
      data.adultes = reservation.nbrAdulte || 0;
    }
    if (exportColumns.enfants) {
      data.enfants = reservation.nbrEnfant || 0;
    }
    if (exportColumns.bebes) {
      data.bebes = reservation.nbrBebe || 0;
    }
    if (exportColumns.listePacks) {
      data.listePacks = formatPacksForExport(reservation);
    }
    if (exportColumns.total) {
      data.total = reservation.total ? `${reservation.total} TND` : "N/A";
    }
    
    return data;
  });
  
  console.log("Données filtrées pour l'export:", filteredData);
 exportToPDF(filteredData);

};

// Fonction pour exporter en CSV
const exportToCSV = (data) => {
  if (data.length === 0) {
    alert("Aucune donnée à exporter");
    return;
  }
  
  // Créer les en-têtes
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.map(header => `"${header}"`).join(','), // En-têtes avec guillemets
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Échapper les guillemets et les virgules dans les chaînes
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    )
  ];
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `reservations_${dayjs().format('DD-MM-YYYY_HH-mm')}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  alert(`Export réussi ! ${data.length} réservation(s) exportée(s) avec ${headers.length} colonne(s)`);
};
const exportToPDF = (data) => {
  if (data.length === 0) {
    alert("Aucune donnée à exporter");
    return;
  }

  // Importer jsPDF et autoTable dynamiquement
  import('jspdf').then((jsPDFModule) => {
    import('jspdf-autotable').then((autoTableModule) => {
      const { jsPDF } = jsPDFModule;
      const autoTable = autoTableModule.default;
      
      // Créer un nouveau document PDF
      const doc = new jsPDF('landscape');
      
      // Titre du document
      const title = `Réservations`;
      doc.setFontSize(16);
      doc.text(title, 14, 15);
      
      // Informations sur l'export
      doc.setFontSize(10);
      doc.text(`Total: ${data.length} réservation(s)`, 14, 25);
      doc.text(`Date d'export: ${dayjs().format('DD/MM/YYYY HH:mm')}`, 14, 30);
      
      // Préparer les données pour la table
      const headers = Object.keys(data[0]);
      const tableData = data.map(row => {
        return headers.map(header => row[header]);
      });
      
      // Créer la table
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
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          // Vous pouvez personnaliser la largeur de chaque colonne ici
        },
        margin: { top: 35 },
        didDrawPage: function (data) {
          // Footer
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.text(
            `Page ${data.pageNumber} sur ${pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          );
        }
      });
      
      // Sauvegarder le PDF
      doc.save(`reservations_table_${dayjs().format('DD-MM-YYYY_HH-mm')}.pdf`);
      
      alert(`Export PDF réussi ! ${data.length} réservation(s) exportée(s)`);
    }).catch(error => {
      console.error('Erreur lors du chargement de jspdf-autotable:', error);
      alert('Erreur lors de l\'export PDF. Veuillez vérifier que la bibliothèque est installée.');
    });
  }).catch(error => {
    console.error('Erreur lors du chargement de jsPDF:', error);
    alert('Erreur lors de l\'export PDF. Veuillez vérifier que la bibliothèque est installée.');
  });
};
  const filteredEvents = useMemo(() => {
    console.log(events);
    return events.filter((event) => {
      const matchesActivity = activityFilter
        ? event.extendedProps.originalEvent.nom?.toLowerCase().includes(activityFilter.toLowerCase())
        : true;
      const matchesClient = clientName
        ? event.extendedProps.clientName?.toLowerCase().includes(clientName.toLowerCase())
        : true;
      const matchesStatus = statusFilter ? event.extendedProps.status === statusFilter : true;
      return matchesActivity && matchesClient && matchesStatus;
    });
  }, [events, activityFilter, clientName, statusFilter]);

  return (
    <>
      <PageMeta title="Calendrier des Réservations" description="Calendrier affichant les réservations" />
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
    placeholder="Activité"
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
      return selected === "LIST_ATTENTE" ? "Liste d'attente" :
             selected === "EN_ATTENTE" ? "En attente" :
             selected === "CONFIRMER" ? "Confirmé" :
             selected === "ANNULER" ? "Annulé" : selected;
    }}
  >
    <MenuItem value="">Tous les statuts</MenuItem>
    <MenuItem value="LIST_ATTENTE">Liste d'attente</MenuItem>
    <MenuItem value="EN_ATTENTE">En attente</MenuItem>
    <MenuItem value="CONFIRMER">Confirmé</MenuItem>
    <MenuItem value="ANNULER">Annulé</MenuItem>
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
        {selectedReservation && selectedEvent ? (
          <div className="text-white space-y-6">
            <h2 className="text-2xl font-bold border-b border-gray-600 pb-2 mb-4">
              Réservation de {selectedReservation.nomClient || "Client inconnu"}
            </h2>

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

            <div className="space-y-2">
              <h3 className="font-semibold text-lg border-b border-gray-600 pb-1">Détails de la Réservation</h3>
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Événement :</strong> {selectedEvent.nom}</p>
                <p><strong>Statut :</strong> {selectedReservation.status}</p>
                <p><strong>Date :</strong> {selectedReservation.date ? dayjs(selectedReservation.date).format("DD/MM/YYYY") : "N/A"}</p>
                <p><strong>Heure :</strong> {selectedReservation.dailyScheduleReservation ? `${selectedReservation.dailyScheduleReservation.startTime} - ${selectedReservation.dailyScheduleReservation.endTime}` : "N/A"}</p>
                <p><strong>Nombre d'adulte(s) : </strong> {selectedReservation.nbrAdulte}</p>
                <p><strong>Nombre d'enfant(s) : </strong> {selectedReservation.nbrEnfant}</p>
                <p><strong>Nombre de bebe(s) : </strong> {selectedReservation.nbrBebe}</p>
              </div>
              
              {selectedReservation.reservationFormulas && selectedReservation.reservationFormulas.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg border-b border-gray-600 pb-1">Liste packs</h3>
                  {selectedReservation.reservationFormulas.map((reservationFormula, index) => (
                    <p key={index} className="font-semibold">
                      {reservationFormula.nbr || "N/A"} * {reservationFormula.formula?.price} TND pour {reservationFormula.formula?.nbr} personne(s)
                    </p>
                  ))}
                </div>
              )}

              {selectedReservation.extrasReservation && selectedReservation.extrasReservation.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg border-b border-gray-600 pb-1">Liste extras</h3>
                  {selectedReservation.extrasReservation.map((extraReservation, index) => (
                    <p key={index} className="font-semibold">
                      {extraReservation.nbr || "N/A"} * {extraReservation.prix || "N/A"} TND {extraReservation.titre || "N/A"}
                    </p>
                  ))}
                  <p><strong>Total : </strong> {selectedReservation.total} TND</p>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Details</label>
                <p>{selectedReservation.commentaire}</p>
              </div>
            </div>
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
<Modal isOpen={isDateModalOpen} onClose={closeDateModal} className="max-w-[90%] p-1 sm:p-10" isFullscreen={true}>
  {dateReservations && (
    <div className="text-white space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-4">
        <h2 className="text-2xl font-bold">
          Réservations du {dayjs(dateReservations.date).format("DD/MM/YYYY")}
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
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportColumns.client}
                      onChange={() => toggleExportColumn('client')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                    <span>Client</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportColumns.email}
                      onChange={() => toggleExportColumn('email')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportColumns.telephone}
                      onChange={() => toggleExportColumn('telephone')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                    <span>Téléphone</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportColumns.paiement}
                      onChange={() => toggleExportColumn('paiement')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                    <span>Paiement</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportColumns.evenement}
                      onChange={() => toggleExportColumn('evenement')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                    <span>Événement</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportColumns.statut}
                      onChange={() => toggleExportColumn('statut')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                    <span>Statut</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportColumns.heure}
                      onChange={() => toggleExportColumn('heure')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                    <span>Heure</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportColumns.adultes}
                      onChange={() => toggleExportColumn('adultes')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                    <span>Adultes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportColumns.enfants}
                      onChange={() => toggleExportColumn('enfants')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                    <span>Enfants</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportColumns.bebes}
                      onChange={() => toggleExportColumn('bebes')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                    <span>Bébés</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportColumns.listePacks}
                      onChange={() => toggleExportColumn('listePacks')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                    <span>Liste packs</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportColumns.total}
                      onChange={() => toggleExportColumn('total')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                    <span>Total</span>
                  </label>
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
          
          {/* Bouton pour exporter les réservations sélectionnées avec colonnes choisies */}
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
              <th className="p-3 text-left">Paiement</th>
              <th className="p-3 text-left">Événement</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Heure</th>
              <th className="p-3 text-left">Adultes</th>
              <th className="p-3 text-left">Enfants</th>
              <th className="p-3 text-left">Bébés</th>
              <th className="p-3 text-left">Liste packs</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dateReservations.reservations.map((reservation, index) => (
              <tr key={index} className="border-b border-gray-600 hover:bg-gray-700">
<td className="p-3">
  <input
    type="checkbox"
    checked={selectedReservations.some((r, idx) => idx === index)}
    onChange={(e) => handleReservationSelect(e, reservation, index)}
    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
  />
</td>
                <td className="p-3">{reservation.originalReservation.nomClient || "N/A"}</td>
                <td className="p-3">{reservation.originalReservation.user?.mail || reservation.email || "N/A"}</td>
                <td className="p-3">{reservation.originalReservation.telephone || "N/A"}</td>
                <td className="p-3">{reservation.originalReservation.paymentMethods || "N/A"}</td>
                <td className="p-3">{reservation.originalEvent?.nom || "N/A"}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    reservation.originalReservation.status === "CONFIRMER" ? "bg-green-500" :
                    reservation.originalReservation.status === "EN_ATTENTE" ? "bg-yellow-500" :
                    reservation.originalReservation.status === "LIST_ATTENTE" ? "bg-orange-500" :
                    reservation.originalReservation.status === "ANNULER" ? "bg-red-500" : "bg-blue-500"
                  }`}>
                    {reservation.originalReservation.status}
                  </span>
                </td>
                <td className="p-3">
                  {reservation.originalReservation.dailyScheduleReservation ? 
                    `${reservation.originalReservation.dailyScheduleReservation.startTime} - ${reservation.originalReservation.dailyScheduleReservation.endTime}` : 
                    "N/A"
                  }
                </td>
                <td className="p-3">{reservation.originalReservation.nbrAdulte || 0}</td>
                <td className="p-3">{reservation.originalReservation.nbrEnfant || 0}</td>
                <td className="p-3">{reservation.originalReservation.nbrBebe || 0}</td>
                <td className="p-3">
                  {reservation.originalReservation.reservationFormulas && reservation.originalReservation.reservationFormulas.length > 0 ? (
                    <div className="space-y-1 max-w-xs">
                      {reservation.originalReservation.reservationFormulas.map((formula, idx) => (
                        <div key={idx} className="text-xs bg-gray-700 p-1 rounded">
                          {formula.nbr || 1} × {formula.formula?.nom || "Pack"} 
                          {formula.formula?.price && ` (${formula.formula.price} TND)`}
                          {formula.formula?.nbr && ` pour ${formula.formula.nbr} pers.`}
                        </div>
                      ))}
                    </div>
                  ) : (
                    "Aucun pack"
                  )}
                </td>
                <td className="p-3">{reservation.originalReservation.total || "N/A"} TND</td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      setSelectedReservation(reservation.originalReservation);
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

export default Calendar;