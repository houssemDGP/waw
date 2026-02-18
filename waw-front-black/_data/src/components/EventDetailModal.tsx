import React from "react";
import { Modal } from "./ui/modal";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any; // Typage précis à adapter selon ta structure
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-6">
      <div className="no-scrollbar relative w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{event.nom}</h2>
        </div>
        {/* Images */}
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {event.imageUrls?.map((url: string, idx: number) => (
            <img
              key={idx}
              src={`http://102.211.209.131:3011${url}`}
              alt={`${event.nom} image ${idx + 1}`}
              className="w-32 h-20 object-cover rounded"
            />
          ))}
        </div>
        {/* Description */}
        <p className="mb-4 text-gray-700 dark:text-gray-300">{event.description}</p>
        {/* Infos générales */}
        <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div><strong>Ville:</strong> {event.ville}</div>
          <div><strong>Pays:</strong> {event.pays}</div>
          <div><strong>Adresse:</strong> {event.rue}</div>
          <div><strong>Âge minimum:</strong> {event.ageMinimum} ans</div>
          <div><strong>Accepte enfants:</strong> {event.accepteEnfants ? "Oui" : "Non"}</div>
          <div><strong>Accepte bébés:</strong> {event.accepteBebes ? "Oui" : "Non"}</div>
          <div><strong>Animaux:</strong> {event.animaux ? "Oui" : "Non"}</div>
          <div><strong>Langues:</strong> {event.languages?.join(", ")}</div>
          <div><strong>Équipements inclus:</strong> {event.includedEquipments?.join(", ")}</div>
          <div><strong>Moyens de paiement:</strong> {event.paymentMethods?.join(", ")}</div>
        </div>
        {/* Extras */}
        {event.extras?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Extras</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {event.extras.map((extra: any) => (
                <li key={extra.id}>{extra.label} — {extra.price}€</li>
              ))}
            </ul>
          </div>
        )}
        {/* Horaires */}
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Horaires Normaux</h3>
          {event.scheduleRanges?.map((range: any, i: number) => (
            <div key={i} className="mb-3 p-3 border rounded">
              <div><strong>Période:</strong> {range.startDate} au {range.endDate}</div>
              {range.dailySchedules?.map((schedule: any, j: number) => (
                <div key={j} className="ml-4">
                  <div>{schedule.startTime} - {schedule.endTime}</div>
                  <ul className="list-disc list-inside">
                    {schedule.formulas?.map((formula: any, k: number) => (
                      <li key={k}>{formula.label}: {formula.price}€ (Capacité: {formula.capacity ?? "N/A"})</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default EventDetailModal;
