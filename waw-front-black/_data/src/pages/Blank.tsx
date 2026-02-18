import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { clsx } from "clsx";
import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Input from "../components/form/input/InputField";
import TextArea from "../components/form/input/TextArea";
import Select from "../components/form/Select";
import MultiSelect from "../components/form/MultiSelect";
import { MapContainer, TileLayer, Marker } from "react-leaflet"; // add Marker
import "leaflet/dist/leaflet.css";
import LocationSelector from "../components/map/LocationSelector";
import ComponentCard from "../components/common/ComponentCard";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

export default function Blank() {
    const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const multiOptions = [
    { value: "1", text: "Option 1", selected: false },
    { value: "2", text: "Option 2", selected: false },
    { value: "3", text: "Option 3", selected: false },
    { value: "4", text: "Option 4", selected: false },
    { value: "5", text: "Option 5", selected: false },
  ];
  const [position, setPosition] = useState<[number, number]>([36.4, 10.6]); // Default: Hammamet
const [searchQuery, setSearchQuery] = useState("");
const [geoError, setGeoError] = useState<string | null>(null);

const [formData, setFormData] = useState({
  rue: "",
  ville: "",
  pays: "",
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSearch = async () => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        searchQuery
      )}&format=json`
    );
    const data = await res.json();
    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      setPosition([lat, lon]);
      setGeoError(null);
    } else {
      setGeoError("Adresse introuvable.");
    }
  } catch (err) {
    setGeoError("Erreur lors de la recherche.");
  }
};

  const onDrop = (acceptedFiles: File[]) => {
    console.log("Files dropped:", acceptedFiles);
    // Handle file uploads here
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
  });
  const [instagramUrl, setInstagramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [instagramLinks, setInstagramLinks] = useState([]);
  const [youtubeLinks, setYoutubeLinks] = useState([]);

  const addInstagramVideo = (url) => {
    if (url && !instagramLinks.includes(url)) {
      setInstagramLinks([...instagramLinks, url]);
    }
  };

  const addYoutubeVideo = (url) => {
    if (url && !youtubeLinks.includes(url)) {
      setYoutubeLinks([...youtubeLinks, url]);
    }
  };

  const removeInstagramVideo = (url) => {
    setInstagramLinks(instagramLinks.filter((link) => link !== url));
  };

  const removeYoutubeVideo = (url) => {
    setYoutubeLinks(youtubeLinks.filter((link) => link !== url));
  };
     // ======= HORAIRES NORMAUX =======
  const [scheduleRanges, setScheduleRanges] = useState([
    {
      startDate: "",
      endDate: "",
      dailySchedules: [
        {
          startTime: "",
          endTime: "",
          formulas: [{ label: "", price: "", capacity: "" }],
        },
      ],
    },
  ]);

  function addScheduleRange() {
    setScheduleRanges([
      ...scheduleRanges,
      {
        startDate: "",
        endDate: "",
        dailySchedules: [
          { startTime: "", endTime: "", formulas: [{ label: "", price: "", capacity: "" }] },
        ],
      },
    ]);
  }

  function removeScheduleRange(index) {
    if (scheduleRanges.length <= 1) return;
    const copy = [...scheduleRanges];
    copy.splice(index, 1);
    setScheduleRanges(copy);
  }

  function updateScheduleRange(index, field, value) {
    const copy = [...scheduleRanges];
    copy[index][field] = value;
    setScheduleRanges(copy);
  }

  function addDailySchedule(rangeIndex) {
    const copy = [...scheduleRanges];
    copy[rangeIndex].dailySchedules.push({
      startTime: "",
      endTime: "",
      formulas: [{ label: "", price: "", capacity: "" }],
    });
    setScheduleRanges(copy);
  }

  function removeDailySchedule(rangeIndex, scheduleIndex) {
    const copy = [...scheduleRanges];
    if (copy[rangeIndex].dailySchedules.length <= 1) return;
    copy[rangeIndex].dailySchedules.splice(scheduleIndex, 1);
    setScheduleRanges(copy);
  }

  function updateDailySchedule(rangeIndex, scheduleIndex, field, value) {
    const copy = [...scheduleRanges];
    copy[rangeIndex].dailySchedules[scheduleIndex][field] = value;
    setScheduleRanges(copy);
  }

  function addFormula(rangeIndex, scheduleIndex) {
    const copy = [...scheduleRanges];
    copy[rangeIndex].dailySchedules[scheduleIndex].formulas.push({
      label: "",
      price: "",
      capacity: "",
    });
    setScheduleRanges(copy);
  }

  function removeFormula(rangeIndex, scheduleIndex, formulaIndex) {
    const copy = [...scheduleRanges];
    if (copy[rangeIndex].dailySchedules[scheduleIndex].formulas.length <= 1) return;
    copy[rangeIndex].dailySchedules[scheduleIndex].formulas.splice(formulaIndex, 1);
    setScheduleRanges(copy);
  }

  function updateFormula(rangeIndex, scheduleIndex, formulaIndex, field, value) {
    const copy = [...scheduleRanges];
    copy[rangeIndex].dailySchedules[scheduleIndex].formulas[formulaIndex][field] = value;
    setScheduleRanges(copy);
  }

  // ======= HORAIRES EXCEPTIONNELS =======
  const [scheduleRangesExceptionnels, setScheduleRangesExceptionnels] = useState([
    {
      startDate: "",
      endDate: "",
      dailySchedules: [
        {
          startTime: "",
          endTime: "",
          formulas: [{ label: "", price: "", capacity: "" }],
        },
      ],
    },
  ]);

  function addScheduleRangeExcep() {
    setScheduleRangesExceptionnels([
      ...scheduleRangesExceptionnels,
      {
        startDate: "",
        endDate: "",
        dailySchedules: [
          { startTime: "", endTime: "", formulas: [{ label: "", price: "", capacity: "" }] },
        ],
      },
    ]);
  }

  function removeScheduleRangeExcep(index) {
    if (scheduleRangesExceptionnels.length <= 1) return;
    const copy = [...scheduleRangesExceptionnels];
    copy.splice(index, 1);
    setScheduleRangesExceptionnels(copy);
  }

  function updateScheduleRangeExcep(index, field, value) {
    const copy = [...scheduleRangesExceptionnels];
    copy[index][field] = value;
    setScheduleRangesExceptionnels(copy);
  }

  function addDailyScheduleExcep(rangeIndex) {
    const copy = [...scheduleRangesExceptionnels];
    copy[rangeIndex].dailySchedules.push({
      startTime: "",
      endTime: "",
      formulas: [{ label: "", price: "", capacity: "" }],
    });
    setScheduleRangesExceptionnels(copy);
  }

  function removeDailyScheduleExcep(rangeIndex, scheduleIndex) {
    const copy = [...scheduleRangesExceptionnels];
    if (copy[rangeIndex].dailySchedules.length <= 1) return;
    copy[rangeIndex].dailySchedules.splice(scheduleIndex, 1);
    setScheduleRangesExceptionnels(copy);
  }

  function updateDailyScheduleExcep(rangeIndex, scheduleIndex, field, value) {
    const copy = [...scheduleRangesExceptionnels];
    copy[rangeIndex].dailySchedules[scheduleIndex][field] = value;
    setScheduleRangesExceptionnels(copy);
  }

  function addFormulaExcep(rangeIndex, scheduleIndex) {
    const copy = [...scheduleRangesExceptionnels];
    copy[rangeIndex].dailySchedules[scheduleIndex].formulas.push({
      label: "",
      price: "",
      capacity: "",
    });
    setScheduleRangesExceptionnels(copy);
  }

  function removeFormulaExcep(rangeIndex, scheduleIndex, formulaIndex) {
    const copy = [...scheduleRangesExceptionnels];
    if (copy[rangeIndex].dailySchedules[scheduleIndex].formulas.length <= 1) return;
    copy[rangeIndex].dailySchedules[scheduleIndex].formulas.splice(formulaIndex, 1);
    setScheduleRangesExceptionnels(copy);
  }

  function updateFormulaExcep(rangeIndex, scheduleIndex, formulaIndex, field, value) {
    const copy = [...scheduleRangesExceptionnels];
    copy[rangeIndex].dailySchedules[scheduleIndex].formulas[formulaIndex][field] = value;
    setScheduleRangesExceptionnels(copy);
  }


   const [extraLabel, setExtraLabel] = useState("");
  const [extraPrice, setExtraPrice] = useState("");
  const [extras, setExtras] = useState<{ label: string; price: string }[]>([]);

  const addExtra = () => {
    if (!extraLabel.trim()) return alert("Le texte de l'extra est requis");
    if (!extraPrice.trim() || isNaN(Number(extraPrice))) return alert("Prix invalide");

    // Ajouter seulement si label+prix unique (optionnel)
    if (extras.some(e => e.label === extraLabel && e.price === extraPrice)) return;

    setExtras([...extras, { label: extraLabel, price: extraPrice }]);
    setExtraLabel("");
    setExtraPrice("");
  };

  const removeExtra = (index: number) => {
    setExtras(extras.filter((_, i) => i !== index));
  };
  const [inclusLabel, setInclusLabel] = useState("");
  const [inclus, setInclus] = useState<string[]>([]);

  const addInclus = () => {
    const trimmed = inclusLabel.trim();
    if (trimmed && !inclus.includes(trimmed)) {
      setInclus([...inclus, trimmed]);
      setInclusLabel("");
    }
  };

  const removeInclus = (item: string) => {
    setInclus(inclus.filter((inc) => inc !== item));
  };

  function renderScheduleRangeNormal(range, idx) {
    return (
      <div
        key={idx}
        className="mb-6 p-4 border border-gray-300 rounded-lg relative"
      >
        {scheduleRanges.length > 1 && (
          <button
            onClick={() => removeScheduleRange(idx)}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
            aria-label="Supprimer plage"
            title="Supprimer plage"
          >
            <TrashIcon className="w-6 h-6" />
          </button>
        )}
        <div className="mb-3 flex flex-wrap gap-2 items-center">
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

        {range.dailySchedules.map((schedule, scheduleIndex) => (
          <div
            key={scheduleIndex}
            className="mb-4 p-3 border border-gray-200 rounded relative"
          >
            {range.dailySchedules.length > 1 && (
              <button
                onClick={() => removeDailySchedule(idx, scheduleIndex)}
                className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                aria-label="Supprimer horaire"
                title="Supprimer horaire"
              >
                <TrashIcon className="w-5 h-5" />
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

            {schedule.formulas.map((formula, formulaIndex) => (
              <div
                key={formulaIndex}
                className="flex flex-wrap gap-2 items-center mb-2"
              >
                <input
                  type="text"
                  placeholder="Label (ex: Solo)"
                  className="border rounded px-2 py-1 flex-1"
                  value={formula.label}
                  onChange={(e) =>
                    updateFormula(idx, scheduleIndex, formulaIndex, "label", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Prix"
                  className="border rounded px-2 py-1 w-20"
                  value={formula.price}
                  onChange={(e) =>
                    updateFormula(idx, scheduleIndex, formulaIndex, "price", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Capacité"
                  className="border rounded px-2 py-1 w-20"
                  value={formula.capacity}
                  onChange={(e) =>
                    updateFormula(idx, scheduleIndex, formulaIndex, "capacity", e.target.value)
                  }
                />
                {schedule.formulas.length > 1 && (
                  <button
                    onClick={() => removeFormula(idx, scheduleIndex, formulaIndex)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Supprimer formule"
                    title="Supprimer formule"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addFormula(idx, scheduleIndex)}
              className="text-green-600 hover:text-green-800 mb-1"
            >
              <PlusCircleIcon className="w-5 h-5 inline mr-1" />
              Ajouter une formule
            </button>
          </div>
        ))}

        <button
          onClick={() => addDailySchedule(idx)}
          className="w-full py-2 border rounded text-center hover:bg-gray-100"
        >
          Ajouter un horaire quotidien
        </button>
      </div>
    );
  }

  function renderScheduleRangeExceptionnel(range, idx) {
    return (
      <div
        key={idx}
        className="mb-6 p-4 border border-gray-300 rounded-lg relative"
      >
        {scheduleRangesExceptionnels.length > 1 && (
          <button
            onClick={() => removeScheduleRangeExcep(idx)}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
            aria-label="Supprimer plage"
            title="Supprimer plage"
          >
            <TrashIcon className="w-6 h-6" />
          </button>
        )}
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

        {range.dailySchedules.map((schedule, scheduleIndex) => (
          <div
            key={scheduleIndex}
            className="mb-4 p-3 border border-gray-200 rounded relative"
          >
            {range.dailySchedules.length > 1 && (
              <button
                onClick={() => removeDailyScheduleExcep(idx, scheduleIndex)}
                className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                aria-label="Supprimer horaire"
                title="Supprimer horaire"
              >
                <TrashIcon className="w-5 h-5" />
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

            {schedule.formulas.map((formula, formulaIndex) => (
              <div
                key={formulaIndex}
                className="flex flex-wrap gap-2 items-center mb-2"
              >
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
                    aria-label="Supprimer formule"
                    title="Supprimer formule"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addFormulaExcep(idx, scheduleIndex)}
              className="text-green-600 hover:text-green-800 mb-1"
            >
              <PlusCircleIcon className="w-5 h-5 inline mr-1" />
              Ajouter une formule
            </button>
          </div>
        ))}

        <button
          onClick={() => addDailyScheduleExcep(idx)}
          className="w-full py-2 border rounded text-center hover:bg-gray-100"
        >
          Ajouter un horaire quotidien
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Blank Page" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">


            <div>
              <label
      className={clsx(
        twMerge(
          "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400",
        ),
      )}
    >Décrivez votre activité
    </label>          <Input type="text" id="inputTwo" placeholder="Décrivez votre activité" />

              <label
      className={clsx(
        twMerge(
          "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400",
        ),
      )}
    >Description
    </label>   
              <TextArea
            value='Description'
            rows={6}
          />
              <label
      className={clsx(
        twMerge(
          "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400",
        ),
      )}
    >votre activité
    </label>
                    <Select
            options={options}
            placeholder="Select Option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
                        <label
      className={clsx(
        twMerge(
          "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400",
        ),
      )}
    >vos categories et sous categories 
    </label>
          <MultiSelect
            label="Multiple Select Options"
            options={multiOptions}
            defaultSelected={["1", "3"]}
            onChange={(values) => setSelectedValues(values)}
          />
          <p className="sr-only">
            Selected Values: {selectedValues.join(", ")}
          </p>
                    <MultiSelect
            label="Multiple Select Options"
            options={multiOptions}
            defaultSelected={["1", "3"]}
            onChange={(values) => setSelectedValues(values)}
          />
          <p className="sr-only">
            Selected Values: {selectedValues.join(", ")}
          </p>
          <div className="mt-10">
  <h2 className="text-left text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Localisation</h2>

  <div className="mb-4 flex gap-3">
    <Input
      type="text"
      placeholder="Rechercher une ville ou une adresse (ex : Hammamet)"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="flex-1"
    />
    <button
      type="button"
      onClick={handleSearch}
      className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
    >
      Rechercher
    </button>
  </div>

  <div className="h-[300px] mb-4 overflow-hidden rounded-2xl border border-gray-300">
<MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
  <TileLayer
    attribution="&copy; OpenStreetMap contributors"
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={position} />
  <LocationSelector position={position} setPosition={setPosition} setFormData={setFormData} />
</MapContainer>
  </div>

  <Input
    type="text"
    placeholder="Rue / Adresse complète"
    name="rue"
    value={formData.rue}
    onChange={handleChange}
    className="mb-4"
  />
  <Input
    type="text"
    placeholder="Ville"
    name="ville"
    value={formData.ville}
    onChange={handleChange}
    className="mb-4"
  />
  <Input
    type="text"
    placeholder="Pays"
    name="pays"
    value={formData.pays}
    onChange={handleChange}
    className="mb-4"
  />

  {geoError && (
    <p className="text-red-600 mb-2">{geoError}</p>
  )}

{Array.isArray(position) && position.length === 2 && (
  <p className="text-sm text-gray-600 dark:text-gray-300">
    📍 Latitude : {position[0].toFixed(5)} | Longitude : {position[1].toFixed(5)}
  </p>
)}
</div>
    <ComponentCard title="Dropzone">
      <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
        <form
          {...getRootProps()}
          className={`dropzone rounded-xl   border-dashed border-gray-300 p-7 lg:p-10
        ${
          isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        }
      `}
          id="demo-upload"
        >
          {/* Hidden Input */}
          <input {...getInputProps()} />

          <div className="dz-message flex flex-col items-center m-0!">
            {/* Icon Container */}
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                  />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
            </h4>

            <span className=" text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
              Drag and drop your PNG, JPG, WebP, SVG images here or browse
            </span>

            <span className="font-medium underline text-theme-sm text-brand-500">
              Browse File
            </span>
          </div>
        </form>
      </div>
    </ComponentCard>
    <ComponentCard title="Dropzone Vidéo">
  <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
    <form
      {...getRootProps({
        onDrop: (acceptedFiles) => {
          console.log("Videos dropped:", acceptedFiles);
          // You can process or upload the video files here
        },
      })}
      className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
        ${
          isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        }
      `}
    >
      <input
        {...getInputProps({
          accept: {
            "video/mp4": [],
            "video/webm": [],
            "video/ogg": [],
          },
        })}
      />

      <div className="dz-message flex flex-col items-center m-0!">
        <div className="mb-[22px] flex justify-center">
          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <svg
              className="fill-current"
              width="29"
              height="28"
              viewBox="0 0 29 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 9v10l8-5-8-5z" />
            </svg>
          </div>
        </div>
        <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
          {isDragActive ? "Déposez les vidéos ici" : "Glissez & déposez vos vidéos ici"}
        </h4>
        <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
          MP4, WEBM, OGG supportés — vous pouvez aussi cliquer pour sélectionner un fichier.
        </span>
        <span className="font-medium underline text-theme-sm text-brand-500">
          Parcourir les vidéos
        </span>
      </div>
    </form>
  </div>
</ComponentCard>
    <div className="space-y-8">
      {/* Instagram Input */}
      <div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="Lien vidéo Instagram"
            className="w-full border px-3 py-2 rounded-md"
          />
          <button
            onClick={() => {
              addInstagramVideo(instagramUrl);
              setInstagramUrl("");
            }}
            className="px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            +
          </button>
        </div>

        {instagramLinks.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Vidéos Instagram :</h3>
            <ul className="space-y-2">
              {instagramLinks.map((link, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 underline break-all"
                  >
                    {link}
                  </a>
                  <button
                    onClick={() => removeInstagramVideo(link)}
                    className="ml-4 text-sm text-red-500 hover:underline"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* YouTube Input */}
      <div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Lien vidéo YouTube"
            className="w-full border px-3 py-2 rounded-md"
          />
          <button
            onClick={() => {
              addYoutubeVideo(youtubeUrl);
              setYoutubeUrl("");
            }}
            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            +
          </button>
        </div>

        {youtubeLinks.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Vidéos YouTube :</h3>
            <ul className="space-y-2">
              {youtubeLinks.map((link, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 underline break-all"
                  >
                    {link}
                  </a>
                  <button
                    onClick={() => removeYoutubeVideo(link)}
                    className="ml-4 text-sm text-red-500 hover:underline"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
<div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Horaires Normaux</h2>
      {scheduleRanges.map(renderScheduleRangeNormal)}
      <button
        onClick={addScheduleRange}
        className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 mb-10"
      >
        Ajouter une plage horaire normale
      </button>

      <h2 className="text-xl font-semibold mb-4">Horaires Exceptionnels</h2>
      {scheduleRangesExceptionnels.map(renderScheduleRangeExceptionnel)}
      <button
        onClick={addScheduleRangeExcep}
        className="w-full py-3 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Ajouter une plage horaire exceptionnelle
      </button>
    </div>
     <div className="space-y-4 max-w-md mx-auto">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Texte de l'extra"
          value={extraLabel}
          onChange={(e) => setExtraLabel(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Prix"
          value={extraPrice}
          onChange={(e) => setExtraPrice(e.target.value)}
          className="w-24 border border-gray-300 rounded px-3 py-2"
          min="0"
          step="0.01"
        />
        <button
          onClick={addExtra}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          aria-label="Ajouter extra"
        >
          +
        </button>
      </div>

      {extras.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Extras ajoutés :</h3>
          <ul className="space-y-2">
            {extras.map(({ label, price }, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
              >
                <div>
                  <span className="font-medium">{label}</span> -{" "}
                  <span className="text-gray-600">{price} €</span>
                </div>
                <button
                  onClick={() => removeExtra(index)}
                  className="text-red-600 hover:underline text-sm"
                  aria-label={`Supprimer extra ${label}`}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    <div className="space-y-4 max-w-md mx-auto">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={inclusLabel}
          onChange={(e) => setInclusLabel(e.target.value)}
          placeholder="Ajouter un inclus"
          className="w-full border px-3 py-2 rounded-md"
        />
        <button
          onClick={addInclus}
          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          +
        </button>
      </div>

      {inclus.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Inclus ajoutés :</h3>
          <ul className="space-y-2">
            {inclus.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md"
              >
                <span>{item}</span>
                <button
                  onClick={() => removeInclus(item)}
                  className="ml-4 text-sm text-red-500 hover:underline"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    <div className="mt-10 space-y-6">
  <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Accessibilité & Options</h2>

  {/* Accessibilité PMR */}
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
      Votre activité est-elle accessible aux personnes à mobilité réduite ?
    </label>
    <div className="flex gap-6">
      <label className="flex items-center gap-2">
        <input type="radio" name="pmr" value="oui" />
        Oui
      </label>
      <label className="flex items-center gap-2">
        <input type="radio" name="pmr" value="non" />
        Non
      </label>
    </div>
  </div>

  {/* Groupes */}
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
      Votre activité est-elle ouverte aux groupes ?
    </label>
    <div className="flex gap-6">
      <label className="flex items-center gap-2">
        <input type="radio" name="groupes" value="oui" />
        Oui
      </label>
      <label className="flex items-center gap-2">
        <input type="radio" name="groupes" value="non" />
        Non
      </label>
    </div>
  </div>

  {/* Animaux */}
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
      Votre activité est-elle ouverte aux animaux ?
    </label>
    <div className="flex gap-6">
      <label className="flex items-center gap-2">
        <input type="radio" name="animaux" value="oui" />
        Oui
      </label>
      <label className="flex items-center gap-2">
        <input type="radio" name="animaux" value="non" />
        Non
      </label>
    </div>
  </div>
</div>
{/* Moyens de paiement */}
<div className="mb-6">
  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
    Quel(s) moyen(s) de paiement acceptez-vous ?
  </label>
  <MultiSelect
    label="Moyens de paiement"
    options={[
      { label: "Espèces", value: "cash" },
      { label: "Carte bancaire", value: "card" },
      { label: "Virement", value: "transfer" },
      { label: "Chèque", value: "cheque" },
    ]}
    defaultSelected={[]}
    onChange={(values) => setSelectedPaymentMethods(values)}
  />
</div>

{/* Langues parlées */}
<div className="mb-6">
  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
    Quelles sont les langues parlées au sein de votre activité ?
  </label>
  <MultiSelect
    label="Langues parlées"
    options={[
      { label: "Français", value: "fr" },
      { label: "Anglais", value: "en" },
      { label: "Arabe", value: "ar" },
      { label: "Allemand", value: "de" },
      { label: "Italien", value: "it" },
    ]}
    defaultSelected={[]}
    onChange={(values) => setSelectedLanguages(values)}
  />
</div>

<div className="mt-10 space-y-6">
  <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Conditions générales</h2>

  {/* Âge minimum */}
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
      Âge minimum requis pour participer à l'activité
    </label>
    <input
      type="number"
      min="0"
      className="w-full border px-3 py-2 rounded-md"
      placeholder="Ex: 10"
    />
  </div>

  {/* Enfants */}
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
      Acceptez-vous les enfants ?
    </label>
    <div className="flex gap-6">
      <label className="flex items-center gap-2">
        <input type="radio" name="enfants" value="oui" />
        Oui
      </label>
      <label className="flex items-center gap-2">
        <input type="radio" name="enfants" value="non" />
        Non
      </label>
    </div>
  </div>

  {/* Bébés */}
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
      Acceptez-vous les bébés ?
    </label>
    <div className="flex gap-6">
      <label className="flex items-center gap-2">
        <input type="radio" name="bebes" value="oui" />
        Oui
      </label>
      <label className="flex items-center gap-2">
        <input type="radio" name="bebes" value="non" />
        Non
      </label>
    </div>
  </div>

  {/* Zone de texte CGV */}
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
      Vos conditions générales de vente (obligatoire pour vendre en ligne)
    </label>
    <textarea
      rows={6}
      className="w-full border px-3 py-2 rounded-md"
      placeholder="Entrez vos conditions générales de vente ici"
    ></textarea>
  </div>
</div>

        </div>
        </div>
      </div>
    </div>
  );
}
