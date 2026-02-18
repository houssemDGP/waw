import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import React, { useState } from 'react';
import { Modal } from "../../ui/modal";

import Badge from "../../ui/badge/Badge";

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

// Define the table data using the interface
const tableData: Order[] = [
  {
    id: 1,
    user: "",
    projectName: "Agency Website",
    team: "",
    budget: "3.9K",
    status: "Active",
    scheduleRanges: [
      {
        startDate: "2025-07-24",
        endDate: "2025-07-26",
        dailySchedules: [
          {
            startTime: "10:00",
            endTime: "13:00",
            formulas: [
              { label: "Enfant", price: 10, capacity: 15 },
              { label: "Adulte", price: 25, capacity: 10 },
            ],
          },
        ],
      },
    ],
    scheduleRangeExceptions: [
      {
        startDate: "2025-07-24",
        endDate: "2025-07-26",
        dailySchedules: [
          {
            startTime: "10:00",
            endTime: "13:00",
            formulas: [
              { label: "Enfant", price: 10, capacity: 15 },
              { label: "Adulte", price: 25, capacity: 10 },
            ],
          },
        ],
      },
    ],
  },
];

const staticRanges = [
  {
    startDate: "2025-07-24",
    endDate: "2025-07-26",
    dailySchedules: [
      {
        startTime: "10:00",
        endTime: "13:00",
        formulas: [
          { label: "Enfant", price: 10, capacity: 15 },
          { label: "Adulte", price: 25, capacity: 10 },
        ],
      },
    ],
  },
  {
    startDate: "2025-07-28",
    endDate: "2025-07-30",
    dailySchedules: [
      {
        startTime: "15:00",
        endTime: "18:00",
        formulas: [
          { label: "Famille", price: 60, capacity: 5 },
        ],
      },
    ],
  },
];


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
  return (
    <div key={idx} className="mb-6 p-4 border border-gray-300 rounded-lg relative">
      {scheduleRangesLength > 1 && (
        <button
          onClick={() => removeScheduleRange(idx)}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          aria-label="Supprimer plage"
          title="Supprimer plage"
          type="button"
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
              type="button"
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
                  type="button"
                >
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addFormula(idx, scheduleIndex)}
            className="text-green-600 hover:text-green-800 mb-1"
            type="button"
          >
            Ajouter une formule
          </button>
        </div>
      ))}

      <button
        onClick={() => addDailySchedule(idx)}
        className="w-full py-2 border rounded text-center hover:bg-gray-100"
        type="button"
      >
        Ajouter un horaire quotidien
      </button>
    </div>
  );
}

function renderScheduleRangeExceptionnelEditable(range, idx, {
  updateScheduleRangeExcep,
  removeScheduleRangeExcep,
  updateDailyScheduleExcep,
  removeDailyScheduleExcep,
  updateFormulaExcep,
  removeFormulaExcep,
  addFormulaExcep,
  addDailyScheduleExcep,
  scheduleRangesExceptionnelsLength,
}) {
  return (
    <div key={idx} className="mb-6 p-4 border border-gray-300 rounded-lg relative">
      {scheduleRangesExceptionnelsLength > 1 && (
        <button
          onClick={() => removeScheduleRangeExcep(idx)}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          aria-label="Supprimer plage"
          title="Supprimer plage"
          type="button"
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
        <div key={scheduleIndex} className="mb-4 p-3 border border-gray-200 rounded relative">
          {range.dailySchedules.length > 1 && (
            <button
              onClick={() => removeDailyScheduleExcep(idx, scheduleIndex)}
              className="absolute top-1 right-1 text-red-600 hover:text-red-800"
              aria-label="Supprimer horaire"
              title="Supprimer horaire"
              type="button"
            >
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
                  type="button"
                >
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

      <button
        onClick={() => addDailyScheduleExcep(idx)}
        className="w-full py-2 border rounded text-center hover:bg-gray-100"
        type="button"
      >
        Ajouter un horaire quotidien
      </button>
    </div>
  );
}


export default function BackOfficeVendeurEvents() {

  const [showNormalModal, setShowNormalModal] = useState(false);
const [showExceptionModal, setShowExceptionModal] = useState(false);
const [selectedNormalSchedules, setSelectedNormalSchedules] = useState<ScheduleRange[]>([]);
const [selectedExceptionSchedules, setSelectedExceptionSchedules] = useState([]);
const [staticRanges, setStaticRanges] = useState<ScheduleRange[]>([]);
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

const addFormula = (rangeIdx: number, dailyIdx: number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].formulas.push({ label: "", price: 0, capacity: 0 });
  setSelectedNormalSchedules(updated);
};

const addDailySchedule = (rangeIdx: number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules.push({
    startTime: "",
    endTime: "",
    formulas: [{ label: "", price: 0, capacity: 0 }],
  });
  setSelectedNormalSchedules(updated);
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

const updateDailyScheduleExcep = (rangeIdx: number, dailyIdx: number, field: string, value: string) => {
  const updated = [...selectedExceptionSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx] = {
    ...updated[rangeIdx].dailySchedules[dailyIdx],
    [field]: value,
  };
  setSelectedExceptionSchedules(updated);
};

const removeDailyScheduleExcep = (rangeIdx: number, dailyIdx: number) => {
  const updated = [...selectedExceptionSchedules];
  updated[rangeIdx].dailySchedules = updated[rangeIdx].dailySchedules.filter((_, i) => i !== dailyIdx);
  setSelectedExceptionSchedules(updated);
};

const updateFormulaExcep = (rangeIdx: number, dailyIdx: number, formulaIdx: number, field: string, value: string | number) => {
  const updated = [...selectedExceptionSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].formulas[formulaIdx] = {
    ...updated[rangeIdx].dailySchedules[dailyIdx].formulas[formulaIdx],
    [field]: value,
  };
  setSelectedExceptionSchedules(updated);
};

const removeFormulaExcep = (rangeIdx: number, dailyIdx: number, formulaIdx: number) => {
  const updated = [...selectedExceptionSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].formulas = updated[rangeIdx].dailySchedules[dailyIdx].formulas.filter((_, i) => i !== formulaIdx);
  setSelectedExceptionSchedules(updated);
};

const addFormulaExcep = (rangeIdx: number, dailyIdx: number) => {
  const updated = [...selectedExceptionSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].formulas.push({ label: "", price: 0, capacity: 0 });
  setSelectedExceptionSchedules(updated);
};

const addDailyScheduleExcep = (rangeIdx: number) => {
  const updated = [...selectedExceptionSchedules];
  updated[rangeIdx].dailySchedules.push({
    startTime: "",
    endTime: "",
    formulas: [{ label: "", price: 0, capacity: 0 }],
  });
  setSelectedExceptionSchedules(updated);
};

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.map((order) => (
              <TableRow key={order.id}>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.projectName}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      order.status === "Active"
                        ? "success"
                        : order.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
  <div className="flex items-center gap-3">
    {/* Voir détails */}
    <button
      title="Voir détails"
      onClick={() => handleVoirDetails(order)}
      className="hover:text-blue-600 transition"
    >
      👁️
    </button>

<button
  className="text-blue-600 hover:underline mr-2"
  onClick={() => {
    setSelectedNormalSchedules(order.scheduleRanges || []);
    setShowNormalModal(true);
  }}
>
  Voir horaires
</button>
<button
  className="text-purple-600 hover:underline"
  onClick={() => {
setSelectedExceptionSchedules(order.scheduleRangeExceptions || []);
    setShowExceptionModal(true);
  }}
>
  Voir horaires exceptionnels
</button>


    {/* Toggle statut (Active/Inactive) */}
    <button
      title="Changer statut"
      onClick={() => toggleStatus(order.id)}
      className="hover:text-red-500 transition"
    >
      {order.status === "Active" ? "✅" : "❌"}
    </button>
  </div>
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
<Modal isOpen={showNormalModal} onClose={() => setShowNormalModal(false)} className="max-w-[90%] max-h-[90vh] m-4">
  <div className="no-scrollbar relative w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Horaires Normaux</h2>
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
  </div>
</Modal>


{/* Modal Horaires Exceptionnels */}
<Modal isOpen={showExceptionModal} onClose={() => setShowExceptionModal(false)} className="max-w-[90%] max-h-[90vh] m-4">
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


  </div>
</Modal>
    </div>
  );
}
