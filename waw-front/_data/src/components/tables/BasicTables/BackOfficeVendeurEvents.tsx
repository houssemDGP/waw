import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import React, { useState , useEffect,useMemo } from 'react';
import { Modal } from "../../ui/modal";
import axios from "axios";
import Badge from "../../ui/badge/Badge";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";  // si tu veux le format français
dayjs.locale("fr");
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import Button from "../../ui/button/Button";
import { Link } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import {
Divider,Grid,
  Typography,IconButton,Box,FormControl ,RadioGroup ,FormControlLabel ,Radio ,Autocomplete ,TextField ,Chip
 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { DateCalendar, PickersDay } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


  const paymentOptions = ['Carte bancaire', 'Espèces', 'Virement', 'Chèque','Autres'];
  const availableServices = ['Animation groupe', 'Location de matériel', 'Rafraîchissements', 'Stand-up Paddle', 'Navette', 'Guide'];
  const availableEquipment = ['Douche', 'Bar', 'Parking privé', 'Piscine', 'WC publics', 'Restaurant', 'Vestiaire', 'Wifi'];
const availableLanguages = [
  'Français',
  'Anglais',
  'Espagnol',
  'Allemand',
  'Italien',
  'Portugais',
  'Néerlandais',
  'Arabe',
  'Chinois (Mandarin)',
  'Japonais',
  'Coréen',
  'Russe',
  'Turc',
  'Hindi',
  'Bengali',
  'Vietnamien',
  'Thaï',
  'Grec',
  'Polonais',
  'Suédois',
  'Norvégien',
  'Danois',
  'Finnois',
  'Tchèque',
  'Roumain',
  'Hongrois',
  'Hébreu',
  'Indonésien',
  'Malais',
  'Swahili',
  'Filipino (Tagalog)',
  'Ukrainien',
  'Persan (Farsi)',
  'Tamoul',
  'Ourdou',
  'Serbe',
  'Croate',
  'Slovaque',
  'Slovène',
  'Bulgare',
  'Lituanien',
  'Letton',
  'Estonien',
  'Islandais',
  'Basque',
  'Catalan',
  'Galicien'
];
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Sélection de position sur la carte + reverse geocoding
const LocationSelector = ({ position, setPosition, setFormData }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      try {
        const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
          params: {
            lat,
            lon: lng,
            format: "json",
            addressdetails: 1,
          },
        });

        const addr = res.data.address || {};
        const rue = res.data.display_name || "";
        const ville = addr.state || addr.state_district || "";
        const pays = addr.country || "";

        setFormData((prev) => ({
          ...prev,
          rue,
          ville,
          pays,
        }));
      } catch (err) {
        console.error("Reverse geocoding error:", err);
      }
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
};
const drawerWidth = 240;
type AdminStatus = "ACTIVE" | "BLOCKED";

dayjs.extend(isSameOrBefore);
function EventDetailModal({ isOpen, onClose, event }) {
  if (!isOpen || !event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] p-6">
      <div className="no-scrollbar relative w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{event.nom}</h2>
        </div>

        {/* Images */}
        {event.imageUrls?.length > 0 && (
          <div className="mb-4 flex gap-2 overflow-x-auto">
            {event.imageUrls.map((url, idx) => (
              <img
                key={idx}
                src={`https://waw.com.tn${url}`}
                alt={`${event.nom} image ${idx + 1}`}
                className="w-32 h-20 object-cover rounded"
              />
            ))}
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="mb-4 text-gray-700 dark:text-gray-300">{event.description}</p>
        )}

        {/* Infos générales */}
        <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div><strong>Ville:</strong> {event.ville || "N/A"}</div>
          <div><strong>Pays:</strong> {event.pays || "N/A"}</div>
          <div><strong>Adresse:</strong> {event.rue || "N/A"}</div>
          <div><strong>Âge minimum:</strong> {event.ageMinimum ?? "N/A"} ans</div>
          <div><strong>Accepte enfants:</strong> {event.accepteEnfants ? "Oui" : "Non"}</div>
          <div><strong>Accepte bébés:</strong> {event.accepteBebes ? "Oui" : "Non"}</div>
          <div><strong>Animaux:</strong> {event.animaux ? "Oui" : "Non"}</div>
          <div><strong>Langues:</strong> {event.languages?.join(", ") || "N/A"}</div>
          <div><strong>Équipements inclus:</strong> {event.includedEquipments?.join(", ") || "N/A"}</div>
          <div><strong>Moyens de paiement:</strong> {event.paymentMethods?.join(", ") || "N/A"}</div>
        </div>

        {/* Non Inclus */}
        {event.nonInclus?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Non Inclus</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {event.nonInclus.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Extras */}
        {event.extras?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Extras</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {event.extras.map((extra, idx) => (
                <li key={idx}>{extra.titre} — {extra.prix} TND</li>
              ))}
            </ul>
          </div>
        )}

        {/* Horaires Normaux */}
        {event.scheduleRanges?.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Horaires Normaux</h3>
            {event.scheduleRanges.map((range, i) => (
              <div key={i} className="mb-3 p-3 border rounded">
                <div><strong>Période:</strong> {range.startDate} au {range.endDate}</div>

                {range.dailySchedules?.map((schedule, j) => (
                  <div key={j} className="ml-4 mt-2">
                    <div className="font-medium">{schedule.startTime} - {schedule.endTime} | Capacité: {schedule.capacity ?? "N/A"} | Attente: {schedule.attende ?? "N/A"} | </div>

                    {/* Formules */}
                    {schedule.formulas?.length > 0 && (
                      <div className="mt-2">
                        <strong>Packs:</strong>
                        <ul className="list-disc list-inside">
                          {schedule.formulas && schedule.formulas.map((f, k) => (
                            <li key={k}>
                              {f.label} — {f.price} TND Nbr: {f.nbr ?? "N/A"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

      </div>
    </Modal>
  );
}


const defaultScheduleRangeExceptions = [
  {
    id: 1,
    startDate: "2025-08-01",
    endDate: "2025-08-01",
    reason: "Exception pour test",
    dailyScheduleExceptions: [
      {
        id: 1,
        startTime: "09:00",
        endTime: "11:00",
        formulas: [
          {
            id: 1,
            label: "Matinée spéciale",
            price: 25,
            capacity: 15
          }
        ]
      }
    ]
  },
  {
    id: 2,
    startDate: "2025-08-15",
    endDate: "2025-08-15",
    reason: "Jour férié",
    dailyScheduleExceptions: [
      {
        id: 2,
        startTime: "14:00",
        endTime: "17:00",
        formulas: [
          {
            id: 2,
            label: "Formule après-midi",
            price: 30,
            capacity: 12
          }
        ]
      }
    ]
  }
];
export default function BackOfficeVendeurEvents() {
  const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
      const businessId = localStorage.getItem("businessId");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`https://waw.com.tn/api/api/events/business/${businessId}`);
        if (!res.ok) throw new Error("Erreur de récupération des événements");
        const data = await res.json();

        // Optionnel : Mapper/adapter les données si nécessaire (exemple simplifié)
        setEvents(data);
      } catch (e: any) {
        setError(e.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);
function getAllDatesBetween(startDate, endDate) {
  if (!startDate || !endDate) return [];
  
  const dates = [];
  let current = new Date(startDate);
  const end = new Date(endDate);
  
  // Limiter à 60 jours maximum pour éviter les crashs
  let safetyCounter = 0;
  
  while (current <= end && safetyCounter < 700) {
    const dateStr = current.toISOString().split('T')[0];
    dates.push(dateStr);
    current.setDate(current.getDate() + 1);
    safetyCounter++;
  }
  
  return dates;
}
function toggleDate(idx, date, selectedExclureDates) {
  const selected = selectedExclureDates || [];
  let newSelected;
  if (selected.includes(date)) {
    newSelected = selected.filter(d => d !== date);
  } else {
    newSelected = [...selected, date];
  }
  updateScheduleRange(idx, "selectedExclureDates", newSelected);
}
function renderScheduleRangeNormalEditable(range, idx, {
  updateScheduleRange,
  removeScheduleRange,
  updateDailySchedule,
  removeDailySchedule,
  updateFormula,
  removeFormula,
  addFormula,

  addDailySchedule,
  scheduleRangesLength,
}) {
  // Définit selectedDays localement, avec fallback
  const selectedDays = Array.isArray(range.selectedDays) ? range.selectedDays : [];

  const toggleDay = (dayValue) => {
    const updated = selectedDays.includes(dayValue)
      ? selectedDays.filter((d) => d !== dayValue)
      : [...selectedDays, dayValue];
    updateScheduleRange(idx, "selectedDays", updated);
  };

  const selectAllDays = () => {
    updateScheduleRange(idx, "selectedDays", WEEK_DAYS.map((d) => d.value));
  };

  const resetDays = () => {
    updateScheduleRange(idx, "selectedDays", []);
  };

  const datesInRange =
    range.startDate && range.endDate
      ? getAllDatesBetween(range.startDate, range.endDate)
      : [];

  return (
     <div key={idx} className="mb-6 p-4 border border-gray-300 rounded-lg relative">


        <button
          onClick={() => removeScheduleRange(idx)}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          aria-label="Supprimer plage"
          title="Supprimer plage"
          type="button"
        >
          Supprimer
        </button>

      {/* Dates de début et fin */}
      <div className="mb-3 mt-5 flex flex-wrap gap-2 items-center">
        <label>
          Du{" "}
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={range.startDate}
            onChange={(e) => updateScheduleRange(idx, "startDate", e.target.value)}
          />
        </label>
        <label>
          au{" "}
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={range.endDate}
            onChange={(e) => updateScheduleRange(idx, "endDate", e.target.value)}
          />
        </label>
      </div>

      {/* Sélection dates à exclure */}
      <div className="mb-3 max-h-40 overflow-auto border rounded p-2">
        <strong>Sélectionnez les dates à exclures:</strong>
        <div className="flex flex-wrap gap-2 mt-1">
          {datesInRange.map(date => (
            <label key={date} className="inline-flex items-center gap-1">
              <input
                type="checkbox"
                checked={range.selectedExclureDates?.includes(date) || false}
                onChange={() => toggleDate(idx, date, range.selectedExclureDates)}
                className="form-checkbox"
              />
              <span>{date}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ✅ Sélection jours */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {WEEK_DAYS.map((day) => (
          <label key={day.value} className="mr-2 flex items-center gap-1">
            <input
              type="checkbox"
              value={day.value}
              checked={selectedDays.includes(day.value)}
              onChange={() => toggleDay(day.value)}
              className="accent-blue-500"
            />
            {day.label}
          </label>
        ))}

        <div className="mt-2 w-full">
          <button
            type="button"
            className="text-sm text-blue-600 underline mr-4"
            onClick={selectAllDays}
          >
            Tous les jours
          </button>
          <button
            type="button"
            className="text-sm text-red-600 underline"
            onClick={resetDays}
          >
            Réinitialiser les jours
          </button>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">Heures</h2>

      {/* ✅ Résumé jours + dates équivalentes */}
{/* ✅ Résumé jours - VERSION SIMPLIFIÉE */}
{range.startDate && range.endDate && selectedDays.length > 0 && (
  <div className="mt-3 text-sm text-gray-700">
    <strong>
      {selectedDays.length === 7
        ? "Tous les jours"
        : selectedDays
            .map((d) => WEEK_DAYS.find((w) => w.value === d)?.label)
            .filter(Boolean)
            .join(", ")}
    </strong>{" "}
    choisis entre le{" "}
    <strong>{dayjs(range.startDate).format("D MMMM YYYY")}</strong> et le{" "}
    <strong>{dayjs(range.endDate).format("D MMMM YYYY")}</strong>
  </div>
)}

      {/* Horaires quotidiens */}
      {range.dailySchedules.map((schedule, scheduleIndex) => (
        <div
          key={scheduleIndex}
          className="mb-4 p-3 border border-gray-200 border-l-0 rounded relative"
        >
          {range.dailySchedules.length > 1 && (
            <button
              onClick={() => removeDailySchedule(idx, scheduleIndex)}
              className="absolute top-1 right-1 text-red-600 hover:text-red-800"
              aria-label="Supprimer horaire"
              title="Supprimer horaire"
              type="button"
            >
              Supprimer
            </button>
          )}
          <div className="flex flex-wrap gap-4 mb-2">
            <label>
              Début{" "}
              <input
                type="time"
                className="border rounded px-2 py-1"
                value={schedule.startTime}
                onChange={(e) =>
                  updateDailySchedule(idx, scheduleIndex, "startTime", e.target.value)
                }
              />
            </label>
            <label>
              Fin{" "}
              <input
                type="time"
                className="border rounded px-2 py-1"
                value={schedule.endTime}
                onChange={(e) =>
                  updateDailySchedule(idx, scheduleIndex, "endTime", e.target.value)
                }
              />
            </label>
          </div>
                    <div className="flex flex-wrap gap-4 mb-2">

            <label>
              libellé{" "}
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                value={schedule.label}
                onChange={(e) =>
                  updateDailySchedule(idx, scheduleIndex, "label", e.target.value)
                }
              />
            </label>    
                      </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                    <label>
              capacité max
              <input
                type="number"
                className="border rounded px-2 py-1 flex-1 w-20"
                value={schedule.capacity}
                                onChange={(e) =>
                  updateDailySchedule(idx, scheduleIndex, "capacity", e.target.value)
                }
              />
            </label>  

                                <label>
              liste d’attente
              <input
                type="number"
                className="border rounded px-2 py-1 flex-1 w-20"
                value={schedule.attende}
                                onChange={(e) =>
                  updateDailySchedule(idx, scheduleIndex, "attende", e.target.value)
                }
              />
            </label>
                      </div>
                              <div className="flex flex-wrap gap-4 mb-2">
                                            <label>
              prix Adulte
              <input
                type="number"
                className="border rounded px-2 py-1 flex-1 w-20"
                value={schedule.prixAdulte}
                                onChange={(e) =>
                  updateDailySchedule(idx, scheduleIndex, "prixAdulte", e.target.value)
                }
              />
            </label>
            {selectedEvent.accepteEnfants && (
                                            <label>
              prix Enfant
              <input
                type="number"
                className="border rounded px-2 py-1 flex-1 w-20"
                value={schedule.prixEnfant}
                                onChange={(e) =>
                  updateDailySchedule(idx, scheduleIndex, "prixEnfant", e.target.value)
                }
              />
            </label>
            )}
            {selectedEvent.accepteBebes && (
                                            <label>
              prix Bebe
              <input
                type="number"
                className="border rounded px-2 py-1 flex-1 w-20"
                value={schedule.prixBebe}
                                onChange={(e) =>
                  updateDailySchedule(idx, scheduleIndex, "prixBebe", e.target.value)
                }
              />
            </label>
            )}

          </div>
      <h2 className="text-xl font-semibold mb-4">Liste des packs</h2>


          {schedule.formulas && schedule.formulas.map((formula, formulaIndex) => (
            <div
              key={formulaIndex}
              className="flex flex-wrap gap-2 items-center mb-2"
            >
                            <label>pack</label>
<div className="flex flex-col mr-2">
  <label className="text-sm font-medium mb-1">Titre de pack</label>
  <input
    type="text"
    className="border rounded px-2 py-1 w-32"
    value={formula.label}
    onChange={(e) =>
      updateFormula(idx, scheduleIndex, formulaIndex, "label", e.target.value)
    }
  />
</div>
<div className="flex flex-col mr-2">
  <label className="text-sm font-medium mb-1">Prix</label>
  <input
    type="number"
    className="border rounded px-2 py-1 w-20"
    value={formula.price}
    onChange={(e) =>
      updateFormula(idx, scheduleIndex, formulaIndex, "price", e.target.value)
    }
  />
</div>

<div className="flex flex-col">
  <label className="text-sm font-medium mb-1">nombre de personnes</label>
  <input
    type="number"
    className="border rounded px-2 py-1 w-20"
    value={formula.nbr}
    onChange={(e) =>
      updateFormula(idx, scheduleIndex, formulaIndex, "nbr", e.target.value)
    }
  />
</div>

                <button
                  onClick={() => removeFormula(idx, scheduleIndex, formulaIndex)}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Supprimer formule"
                  title="Supprimer formule"
                  type="button"
                >
                  ×
                </button>
            </div>
          ))}
          <button
            onClick={() => addFormula(idx, scheduleIndex)}
            className="text-blue-600 hover:text-green-800 mb-1"
            type="button"
          >
            Ajouter un pack
          </button>



        </div>
      ))}
      {/* 

      <button
        onClick={() => addDailySchedule(idx)}
        className="w-full py-2 border rounded text-center hover:bg-gray-100"
        type="button"
      >
        Ajouter un horaire quotidien
      </button>*/}
    </div> 
  );
}
const WEEK_DAYS = [
  { label: "Lun", value: "MONDAY" },
  { label: "Mar", value: "TUESDAY" },
  { label: "Mer", value: "WEDNESDAY" },
  { label: "Jeu", value: "THURSDAY" },
  { label: "Ven", value: "FRIDAY" },
  { label: "Sam", value: "SATURDAY" },
  { label: "Dim", value: "SUNDAY" },
];

const getMatchingDatesInPeriod = (start, end, selectedDays) => {
  if (!start || !end || !selectedDays?.length) return [];

  try {
    const selectedIndices = selectedDays.map((day) =>
      ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(day)
    );

    const results = [];
    let current = dayjs(start);
    const endDate = dayjs(end);

    // Limiter à 365 jours maximum pour éviter les boucles infinies
    const maxDays = 365;
    let dayCount = 0;

    while (current.isSameOrBefore(endDate) && dayCount < maxDays) {
      if (selectedIndices.includes(current.day())) {
        results.push(current.format("D MMMM"));
      }
      current = current.add(1, "day");
      dayCount++;
      
      // Sécurité supplémentaire
      if (dayCount >= maxDays) {
        console.warn('Limite de jours atteinte dans getMatchingDatesInPeriod');
        break;
      }
    }

    return results;
  } catch (error) {
    console.error('Erreur dans getMatchingDatesInPeriod:', error);
    return [];
  }
};
function renderScheduleRangeExceptionnelEditable(
  range,
  idx,
  {
    updateScheduleRangeExcep,
    removeScheduleRangeExcep,
    updateDailyScheduleExcep,
    removeDailyScheduleExcep,
    updateFormulaExcep,
    removeFormulaExcep,
    addFormulaExcep,
    addDailyScheduleExcep,
    scheduleRangesExceptionnelsLength,
  }
) {
  const selectedDays = Array.isArray(range.selectedDays) ? range.selectedDays : [];
  const selectedExclureDates = Array.isArray(range.selectedExclureDates) ? range.selectedExclureDates : [];

  const toggleDay = (dayValue) => {
    const updated = selectedDays.includes(dayValue)
      ? selectedDays.filter((d) => d !== dayValue)
      : [...selectedDays, dayValue];
    updateScheduleRangeExcep(idx, "selectedDays", updated);
  };

  const selectAllDays = () => {
    updateScheduleRangeExcep(idx, "selectedDays", WEEK_DAYS.map((d) => d.value));
  };

  const resetDays = () => {
    updateScheduleRangeExcep(idx, "selectedDays", []);
  };

  // ✅ Dates à exclure
  const datesInRange =
    range.startDate && range.endDate
      ? getAllDatesBetween(range.startDate, range.endDate)
      : [];

  const toggleDateExcep = (date) => {
    const updated = selectedExclureDates.includes(date)
      ? selectedExclureDates.filter((d) => d !== date)
      : [...selectedExclureDates, date];
    updateScheduleRangeExcep(idx, "selectedExclureDates", updated);
  };

  return (
    <div key={idx} className="mb-6 p-4 border border-gray-300 rounded-lg relative">
      {scheduleRangesExceptionnelsLength > 1 && (
        <button
          onClick={() => removeScheduleRangeExcep(idx)}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          title="Supprimer plage"
          type="button"
        >
          Supprimer
        </button>
      )}

      {/* Sélection période */}
      <div className="mb-3 flex flex-wrap gap-2 items-center">
        <label>
          Du{" "}
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={range.startDate}
            onChange={(e) => updateScheduleRangeExcep(idx, "startDate", e.target.value)}
          />
        </label>
        <label>
          au{" "}
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={range.endDate}
            onChange={(e) => updateScheduleRangeExcep(idx, "endDate", e.target.value)}
          />
        </label>
      </div>

      {/* ✅ Sélection dates à exclure */}
      <div className="mb-3 max-h-40 overflow-auto border rounded p-2">
        <strong>Sélectionnez les dates à exclure :</strong>
        <div className="flex flex-wrap gap-2 mt-1">
          {datesInRange.map(date => (
            <label key={date} className="inline-flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedExclureDates.includes(date)}
                onChange={() => toggleDateExcep(date)}
                className="form-checkbox"
              />
              <span>{date}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Jours sélectionnés */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {WEEK_DAYS.map((day) => (
          <label key={day.value} className="mr-2 flex items-center gap-1">
            <input
              type="checkbox"
              value={day.value}
              checked={selectedDays.includes(day.value)}
              onChange={() => toggleDay(day.value)}
              className="accent-blue-500"
            />
            {day.label}
          </label>
        ))}
        <div className="mt-2 w-full">
          <button
            type="button"
            className="text-sm text-blue-600 underline mr-4"
            onClick={selectAllDays}
          >
            Tous les jours
          </button>
          <button
            type="button"
            className="text-sm text-red-600 underline"
            onClick={resetDays}
          >
            Réinitialiser les jours
          </button>
        </div>
      </div>

      {/* Résumé */}
{/* ✅ Résumé jours - VERSION SIMPLIFIÉE */}
{range.startDate && range.endDate && selectedDays.length > 0 && (
  <div className="mt-3 text-sm text-gray-700">
    <strong>
      {selectedDays.length === 7
        ? "Tous les jours"
        : selectedDays
            .map((d) => WEEK_DAYS.find((w) => w.value === d)?.label)
            .filter(Boolean)
            .join(", ")}
    </strong>{" "}
    choisis entre le{" "}
    <strong>{dayjs(range.startDate).format("D MMMM YYYY")}</strong> et le{" "}
    <strong>{dayjs(range.endDate).format("D MMMM YYYY")}</strong>
  </div>
)}

      {/* Horaires + Formules */}
      {range.dailyScheduleExceptions.map((schedule, scheduleIndex) => (
        <div key={scheduleIndex} className="mb-4 p-3 border border-gray-200 rounded relative">
          {range.dailyScheduleExceptions.length > 1 && (
            <button
              onClick={() => removeDailyScheduleExcep(idx, scheduleIndex)}
              className="absolute top-1 right-1 text-red-600 hover:text-red-800"
              title="Supprimer horaire"
              type="button"
            >
              Supprimer
            </button>
          )}

          <div className="flex flex-wrap gap-4 mb-2">
            <label>
              Début{" "}
              <input
                type="time"
                className="border rounded px-2 py-1"
                value={schedule.startTime}
                onChange={(e) =>
                  updateDailyScheduleExcep(idx, scheduleIndex, "startTime", e.target.value)
                }
              />
            </label>
            <label>
              Fin{" "}
              <input
                type="time"
                className="border rounded px-2 py-1"
                value={schedule.endTime}
                onChange={(e) =>
                  updateDailyScheduleExcep(idx, scheduleIndex, "endTime", e.target.value)
                }
              />
            </label>
          
          </div>
          {schedule.formulas && schedule.formulas.map((formula, formulaIndex) => (
            <div key={formulaIndex} className="flex flex-wrap gap-2 items-center mb-2">
              <input
                type="text"
                placeholder="Label (ex: Solo)"
                className="border rounded px-2 py-1 flex-1"
                value={formula.label}
                onChange={(e) =>
                  updateFormulaExcep(idx, scheduleIndex, formulaIndex, "label", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Prix"
                className="border rounded px-2 py-1 w-20"
                value={formula.price}
                onChange={(e) =>
                  updateFormulaExcep(idx, scheduleIndex, formulaIndex, "price", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Capacité"
                className="border rounded px-2 py-1 w-20"
                value={formula.capacity}
                onChange={(e) =>
                  updateFormulaExcep(idx, scheduleIndex, formulaIndex, "capacity", e.target.value)
                }
              />
              {schedule.formulas.length > 1 && (
                <button
                  onClick={() => removeFormulaExcep(idx, scheduleIndex, formulaIndex)}
                  className="text-red-600 hover:text-red-800"
                  title="Supprimer formule"
                  type="button"
                >
                  Supprimer
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => addFormulaExcep(idx, scheduleIndex)}
            className="text-green-600 hover:text-green-800 mb-1"
            type="button"
          >
            Ajouter une formule
          </button>
        </div>
      ))}
      {/* 
      <button
        onClick={() => addDailyScheduleExcep(idx)}
        className="w-full py-2 border rounded text-center hover:bg-gray-100"
        type="button"
      >
        Ajouter un horaire quotidien
      </button>*/}
    </div>
     

  );
}

const cleanScheduleRanges = (ranges) => {
  return ranges.map(range => {
    // Garder l'ID si il existe pour la mise à jour, sinon création
    const cleanedRange = {
      ...(range.id && { id: range.id }), // Inclure l'ID seulement s'il existe
      startDate: range.startDate,
      endDate: range.endDate,
      selectedDays: range.selectedDays || [],
      selectedExclureDates: range.selectedExclureDates || [],
      dailySchedules: range.dailySchedules?.map(daily => {
        const cleanedDaily = {
          ...(daily.id && { id: daily.id }), // Inclure l'ID daily si existe
          startTime: daily.startTime,
          endTime: daily.endTime,
          label: daily.label || "",
          capacity: daily.capacity || 0,
          attende: daily.attende || 0,
          prixAdulte: daily.prixAdulte || 0,
          prixEnfant: daily.prixEnfant || 0,
          prixBebe: daily.prixBebe || 0,
          formulas: daily.formulas?.map(formula => ({
            ...(formula.id && { id: formula.id }), // Inclure l'ID formula si existe
            label: formula.label || "",
            price: Number(formula.price) || 0,
            nbr: Number(formula.nbr) || 0,
          })) || [],
        };
        return cleanedDaily;
      }) || [],
    };
    return cleanedRange;
  });
};
const handleSaveSchedules = async () => {
  try {
    const cleanedData = cleanScheduleRanges(selectedNormalSchedules);
    

    // Send updated event to backend
    const response = await axios.put(
      `https://waw.com.tn/api/api/schedule-ranges/event/${selectedEvent.id}`, 
      cleanedData
    );

    // Update local state
    setEvents((prev) =>
      prev.map((ev) => 
        ev.id === selectedEvent.id 
          ? { ...ev, scheduleRanges: response.data } 
          : ev
      )
    );
    
    setShowNormalModal(false);
    alert('Horaires sauvegardés avec succès!');
    
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    console.error("Détails de l'erreur:", error.response?.data);
    alert('Erreur lors de la sauvegarde des horaires');
  }
};
const handleSaveScheduleExceptions = async () => {
  try {
    await axios.put(
      `https://waw.com.tn/api/api/schedule-range-exceptions/event/${selectedEvent.id}`,
      cleanScheduleRangeExceptions(selectedExceptionSchedules)
    );

    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === selectedEvent.id
          ? { ...ev, selectedExceptionSchedules }
          : ev
      )
    );

    setSelectedEvent((prev) => ({
      ...prev,
      selectedExceptionSchedules,
    }));

setShowExceptionModal(false);
  } catch (error) {
    console.error("Erreur lors de la mise à jour des exceptions :", error);
  }
};
function cleanScheduleRangeExceptions(data) {
  return data.map(range => ({
    // Ne PAS inclure l'id pour forcer création
    startDate: range.startDate,
    endDate: range.endDate,
        selectedDays:range.selectedDays,
selectedExclureDates:range.selectedExclureDates,
    reason: range.reason || null,
    dailyScheduleExceptions: (range.dailyScheduleExceptions || []).map(daily => ({
      // pas d'id non plus ici
      startTime: daily.startTime,
      endTime: daily.endTime,
      formulas: (daily.formulas || []).map(formula => ({
        // idem pas d'id
        label: formula.label || "",
        price: Number(formula.price) || 0,
        capacity: Number(formula.capacity) || 0,
        attende: Number(formula.attende) || 0,
      })),
    })),
  }));
}


  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedEvent2, setSelectedEvent2] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

function handleVoirDetails(event: EventDetail) {
  setSelectedEvent(event);
  setShowDetailModal(true);
}
const navigate = useNavigate();

  const [editEvent, setEditEvent] = useState(null);
const handleEditDetails = (event) => {
    setSelectedEvent2(event);
  navigate(`/vendeur/events/edit/${event.id}`);
};



    const [showNormalModal, setShowNormalModal] = useState(false);
    const [showDetailsModal, setshowDetailsModal] = useState(false);
const [showExceptionModal, setShowExceptionModal] = useState(false);
const [selectedNormalSchedules, setSelectedNormalSchedules] = useState<ScheduleRange[]>([]);
const [selectedExceptionSchedules, setSelectedExceptionSchedules] = useState([]);
const [staticRanges, setStaticRanges] = useState<ScheduleRange[]>([]);
const addScheduleRange = () => {
  setSelectedNormalSchedules((prev) => {
    if (prev.length === 0) {
      // Si rien n'existe, créer un élément vide
      return [
        {
          startDate: "",
          endDate: "",
          dailySchedules: [
            {
              startTime: "",
              endTime: "",
              label: "",
              capacity: 0,
              attende: 0,
              formulas: [{ label: "", price: 0, nbr: 0 }],
            },
          ],
        },
      ];
    }
    
    // Copier profondément le dernier SANS l'ID
    const lastRange = prev[prev.length - 1];
    const newRange = {
      // Ne pas copier l'ID
      startDate: lastRange.startDate || "",
      endDate: lastRange.endDate || "",
      selectedDays: [...(lastRange.selectedDays || [])],
      selectedExclureDates: [...(lastRange.selectedExclureDates || [])],
      dailySchedules: lastRange.dailySchedules?.map(daily => ({
        // Ne pas copier l'ID du dailySchedule
        startTime: daily.startTime || "",
        endTime: daily.endTime || "",
        label: daily.label || "",
        capacity: daily.capacity || 0,
        attende: daily.attende || 0,
        prixAdulte: daily.prixAdulte || 0,
        prixEnfant: daily.prixEnfant || 0,
        prixBebe: daily.prixBebe || 0,
        formulas: daily.formulas?.map(formula => ({
          // Ne pas copier l'ID de la formule
          label: formula.label || "",
          price: formula.price || 0,
          nbr: formula.nbr || 0,
        })) || [{ label: "", price: 0, nbr: 0 }],
      })) || [
        {
          startTime: "",
          endTime: "",
          label: "",
          capacity: 0,
          attende: 0,
          prixAdulte: 0,
          prixEnfant: 0,
          prixBebe: 0,
          formulas: [{ label: "", price: 0, nbr: 0 }],
        },
      ],
    };
    
    return [...prev, newRange];
  });
};
const addScheduleRangeException = () => {
  setSelectedExceptionSchedules((prev) => {
    if (prev.length === 0) {
      return [
        {
          startDate: "",
          endDate: "",
          dailyScheduleExceptions: [
            {
              startTime: "",
              endTime: "",
              formulas: [{ label: "", price: 0, capacity: 0 }],
            },
          ],
        },
      ];
    }
    
    // Copier le dernier SANS l'ID
    const lastRange = prev[prev.length - 1];
    const newRange = {
      // Ne pas copier l'ID
      startDate: lastRange.startDate || "",
      endDate: lastRange.endDate || "",
      selectedDays: [...(lastRange.selectedDays || [])],
      selectedExclureDates: [...(lastRange.selectedExclureDates || [])],
      dailyScheduleExceptions: lastRange.dailyScheduleExceptions?.map(daily => ({
        // Ne pas copier l'ID
        startTime: daily.startTime || "",
        endTime: daily.endTime || "",
        formulas: daily.formulas?.map(formula => ({
          // Ne pas copier l'ID
          label: formula.label || "",
          price: formula.price || 0,
          capacity: formula.capacity || 0,
        })) || [{ label: "", price: 0, capacity: 0 }],
      })) || [
        {
          startTime: "",
          endTime: "",
          formulas: [{ label: "", price: 0, capacity: 0 }],
        },
      ],
    };
    
    return [...prev, newRange];
  });
};
const updateScheduleRange = (idx: number, field: string, value: string) => {
  const updated = [...selectedNormalSchedules];
  updated[idx] = { ...updated[idx], [field]: value };
  setSelectedNormalSchedules(updated);
};

const removeScheduleRange = (idx: number) => {
  const updated = selectedNormalSchedules.filter((_, i) => i !== idx);
  setSelectedNormalSchedules(updated);
};

const updateDailySchedule = (rangeIdx: number, dailyIdx: number, field: string, value: string) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx] = {
    ...updated[rangeIdx].dailySchedules[dailyIdx],
    [field]: value,
  };
  setSelectedNormalSchedules(updated);
};

const removeDailySchedule = (rangeIdx: number, dailyIdx: number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules = updated[rangeIdx].dailySchedules.filter((_, i) => i !== dailyIdx);
  setSelectedNormalSchedules(updated);
};

const updateFormula = (rangeIdx: number, dailyIdx: number, formulaIdx: number, field: string, value: string | number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].formulas[formulaIdx] = {
    ...updated[rangeIdx].dailySchedules[dailyIdx].formulas[formulaIdx],
    [field]: value,
  };
  setSelectedNormalSchedules(updated);
};

const removeFormula = (rangeIdx: number, dailyIdx: number, formulaIdx: number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].formulas = updated[rangeIdx].dailySchedules[dailyIdx].formulas.filter((_, i) => i !== formulaIdx);
  setSelectedNormalSchedules(updated);
};

const addPack = (rangeIdx: number, dailyIdx: number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].packs.push({ label: "",nbr:0, price: 0, capacity: 0 });
  setSelectedNormalSchedules(updated);
};
const updatePack = (rangeIdx: number, dailyIdx: number, formulaIdx: number, field: string, value: string | number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].packs[formulaIdx] = {
    ...updated[rangeIdx].dailySchedules[dailyIdx].packs[formulaIdx],
    [field]: value,
  };
  setSelectedNormalSchedules(updated);
};

const removePack = (rangeIdx: number, dailyIdx: number, formulaIdx: number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].packs = updated[rangeIdx].dailySchedules[dailyIdx].packs.filter((_, i) => i !== formulaIdx);
  setSelectedNormalSchedules(updated);
};

const addFormula = (rangeIdx: number, dailyIdx: number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].formulas.push({ label: "", price: 0, capacity: 0 });
  setSelectedNormalSchedules(updated);
};
const addDailySchedule = (rangeIdx: number) => {
  setSelectedNormalSchedules((prev) => {
    const updated = [...prev];
    const dailySchedules = updated[rangeIdx].dailySchedules;
    if (dailySchedules.length === 0) {
      // Si pas d'horaire existant, ajouter un vide
      dailySchedules.push({
        startTime: "",
        endTime: "",
        label: "",
        capacity: 0,
        attende: 0,
        formulas: [{ label: "", price: 0, capacity: 0, attende: 0 }],
        packs: [{ label: "", nbr: 0, price: 0, capacity: 0, attende: 0 }],
      });
    } else {
      // Copier profondément le dernier horaire
      const lastSchedule = dailySchedules[dailySchedules.length - 1];
      const newSchedule = JSON.parse(JSON.stringify(lastSchedule));
      dailySchedules.push(newSchedule);
    }
    return updated;
  });
};
const updateScheduleRangeExcep = (idx: number, field: string, value: string) => {
  const updated = [...selectedExceptionSchedules];
  updated[idx] = { ...updated[idx], [field]: value };
  setSelectedExceptionSchedules(updated);
};

const removeScheduleRangeExcep = (idx: number) => {
  const updated = selectedExceptionSchedules.filter((_, i) => i !== idx);
  setSelectedExceptionSchedules(updated);
};

const updateDailyScheduleExcep = (
  rangeIdx: number,
  dailyIdx: number,
  field: string,
  value: string
) => {
  const updated = [...selectedExceptionSchedules];
  const dailyList = updated[rangeIdx].dailyScheduleExceptions || [];

  dailyList[dailyIdx] = {
    ...dailyList[dailyIdx],
    [field]: value,
  };

  updated[rangeIdx].dailyScheduleExceptions = dailyList;
  setSelectedExceptionSchedules(updated);
};

const removeDailyScheduleExcep = (rangeIdx: number, dailyIdx: number) => {
  const updated = [...selectedExceptionSchedules];
  updated[rangeIdx].dailyScheduleExceptions = updated[rangeIdx].dailyScheduleExceptions.filter(
    (_, i) => i !== dailyIdx
  );
  setSelectedExceptionSchedules(updated);
};

const updateFormulaExcep = (
  rangeIdx: number,
  dailyIdx: number,
  formulaIdx: number,
  field: string,
  value: string | number
) => {
  const updated = [...selectedExceptionSchedules];
  updated[rangeIdx].dailyScheduleExceptions[dailyIdx].formulas[formulaIdx] = {
    ...updated[rangeIdx].dailyScheduleExceptions[dailyIdx].formulas[formulaIdx],
    [field]: value,
  };
  setSelectedExceptionSchedules(updated);
};

const removeFormulaExcep = (rangeIdx: number, dailyIdx: number, formulaIdx: number) => {
  const updated = [...selectedExceptionSchedules];
  updated[rangeIdx].dailyScheduleExceptions[dailyIdx].formulas = updated[rangeIdx].dailyScheduleExceptions[dailyIdx].formulas.filter(
    (_, i) => i !== formulaIdx
  );
  setSelectedExceptionSchedules(updated);
};

const addFormulaExcep = (rangeIdx: number, dailyIdx: number) => {
  const updated = [...selectedExceptionSchedules];
  updated[rangeIdx].dailyScheduleExceptions[dailyIdx].formulas.push({
    label: "",
    price: 0,
    capacity: 0,
  });
  setSelectedExceptionSchedules(updated);
};

const addDailyScheduleExcep = (rangeIdx: number) => {
  const updated = [...selectedExceptionSchedules];
  if (!updated[rangeIdx].dailyScheduleExceptions) {
    updated[rangeIdx].dailyScheduleExceptions = [];
  }

  updated[rangeIdx].dailyScheduleExceptions.push({
    startTime: "",
    endTime: "",
    formulas: [{ label: "", price: 0, capacity: 0 }],
  });

  setSelectedExceptionSchedules(updated);
};
const handleToggleView = async (id) => {
  try {
    const res = await axios.put(`https://waw.com.tn/api/api/events/view/${id}`);
    const updatedEvent = res.data;

    // Update the events state without reloading
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, view: updatedEvent.view } : event
      )
    );
  } catch (err) {
    console.error('Error updating status', err);
  }
};
const handleToggle = async (id) => {
  try {
    const res = await axios.put(`https://waw.com.tn/api/api/events/status/${id}`);
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
    if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  return (

    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Liste des activités</h2>
<Link to="/vendeur/ajouterevenement">
  <Button>Ajouter une activité</Button>
</Link>
      </div>
    <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]">

      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Titre
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Afficher
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {events.map((event) => (
              <TableRow className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900" key={event.id}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {event.nom}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color={event.active ? "success" : "error"}>
                    {event.active ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color={event.view ? "success" : "error"}>
                    {event.view ? "Affiche" : "non Affiche"}
                  </Badge>
                </TableCell>
<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
  <div className="flex flex-wrap items-center gap-3">
    {/* 👁️ Voir détails */}
    <button
      title="Voir détails"
      onClick={() => handleVoirDetails(event)}
      className="flex items-center gap-1 text-blue-600 hover:underline"
    >
      <VisibilityIcon fontSize="small" />
      <span className="hidden md:inline">Détails</span>
    </button>

    {/* ✏️ Éditer */}
    <button
      title="Éditer"
      onClick={() => handleEditDetails(event)}
      className="flex items-center gap-1 text-blue-600 hover:underline"
    >
      <EditIcon fontSize="small" />
      <span className="hidden md:inline">Éditer</span>
    </button>

    {/* 🕒 Horaires */}
    <button
      title="Voir horaires"
      onClick={() => {
        setSelectedEvent(event);
        setSelectedNormalSchedules(event.scheduleRanges || []);
        setShowNormalModal(true);
      }}
      className="flex items-center gap-1 text-blue-600 hover:underline"
    >
      <AccessTimeIcon fontSize="small" />
      <span className="hidden md:inline">Horaires et Prix</span>
    </button>

    {/* 📆 Exceptions  <button
      title="Voir horaires exceptionnels"
      onClick={() => {
        const fallbackExceptions = defaultScheduleRangeExceptions;
        const exceptions = event.scheduleRangeExceptions?.length
          ? event.scheduleRangeExceptions
          : fallbackExceptions;
        setSelectedEvent(event);
        setSelectedExceptionSchedules(exceptions);
        setShowExceptionModal(true);
      }}
      className="flex items-center gap-1 text-purple-600 hover:underline"
    >
      <EventBusyIcon fontSize="small" />
      <span className="hidden md:inline">Exceptions</span>
    </button>*/}
   

    {/* ✅/❌ Activer / Bloquer */}
    <button
      title={event.active ? "Bloquer" : "Activer"}
      onClick={() => handleToggle(event.id)}
      className="flex items-center gap-1 text-blue-600 hover:underline"
    >
      <PowerSettingsNewIcon fontSize="small" />
      <span className="hidden md:inline">
        {event.active ? "Bloquer" : "Activer"}
      </span>
    </button>
        <button
      title={event.view ? "Ne pas afficher" : "Afficher"}
      onClick={() => handleToggleView(event.id)}
      className="flex items-center gap-1 text-blue-600 hover:underline"
    >
      <PowerSettingsNewIcon fontSize="small" />
      <span className="hidden md:inline">
        {event.view ? "Ne pas afficher" : "Afficher"}
      </span>

    </button>
          {!event.view && (
  <a className="flex items-center gap-1 text-blue-600 hover:underline" href={`https://waw.com.tn/detailsEvent?id=${event.id}`}>
    View Details
  </a>
)}
  </div>

  {/* Modales */}
  {selectedEvent && (
    <EventDetailModal
      isOpen={showDetailModal}
      onClose={() => setShowDetailModal(false)}
      event={selectedEvent}
    />
  )}


</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
<Modal isOpen={showNormalModal} onClose={() => setShowNormalModal(false)} className="max-w-[700px] p-6">
  <div className="no-scrollbar relative w-full max-w-5xl overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 lg:p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white p-1">Dates</h2>
    </div>

    {selectedNormalSchedules.map((range, idx) =>
      renderScheduleRangeNormalEditable(range, idx, {
        updateScheduleRange,
        removeScheduleRange,
        updateDailySchedule,
        removeDailySchedule,
        updateFormula,
        removeFormula,
        addFormula,
        addDailySchedule,
        scheduleRangesLength: selectedNormalSchedules.length,
      })
    )}
     <button
        onClick={addScheduleRange}
        className="mt-4 w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        type="button"
      >
        Ajouter une nouvelle plage complète
      </button>

      {/* Bouton global pour sauvegarder toutes les plages */}
      <button
        onClick={handleSaveSchedules}
        className="mt-4 w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        type="button"
      >
        Sauvegarder les horaires
      </button>
  </div>
</Modal>


{/* Modal Horaires Exceptionnels */}
<Modal isOpen={showExceptionModal} onClose={() => setShowExceptionModal(false)} className="max-w-[700px] p-6">
  <div className="no-scrollbar relative w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Horaires Exceptionnels</h2>
    </div>
{selectedExceptionSchedules.map((range, idx) =>
  renderScheduleRangeExceptionnelEditable(range, idx, {
    updateScheduleRangeExcep,
    removeScheduleRangeExcep,
    updateDailyScheduleExcep,
    removeDailyScheduleExcep,
    updateFormulaExcep,
    removeFormulaExcep,
    addFormulaExcep,
    addDailyScheduleExcep,
    scheduleRangesExceptionnelsLength: selectedExceptionSchedules.length,
  })
)}
     <button
        onClick={addScheduleRangeException}
        className="mt-4 w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        type="button"
      >
        Ajouter une nouvelle plage complète
      </button>

      {/* Bouton global pour sauvegarder toutes les plages */}
      <button
        onClick={handleSaveScheduleExceptions}
        className="mt-4 w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        type="button"
      >
        Sauvegarder les horaires
      </button>

  </div>
</Modal>
    </div>
  </div>
  );
}
