import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Box, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";

export default function UserAddressCard({ business }: any) {
  const { isOpen, openModal, closeModal } = useModal();

  // Form state
  const [formData, setFormData] = useState({
    adresse: business.adresse || "",
    ville: business.ville || "",
    pays: business.pays || "",
    latitude: business.latitude || 0,
    longitude: business.longitude || 0,
  });
    const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  const LocationSelector = ({ position, setPosition, setFormData }) => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        try {
          const res = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
              params: { lat, lon: lng, format: "json", addressdetails: 1 },
            }
          );
          const addr = res.data.address || {};
          const adresse = res.data.display_name || "";
          const ville = addr.state || addr.state_district || "";
          const pays = addr.country || "";
          setFormData((prev) => ({ ...prev, adresse, ville, pays }));
        } catch (err) {
          console.error("Reverse geocoding error:", err);
        }
      },
    });
    return position ? <Marker position={position} icon={markerIcon} /> : null;
  };
  const [position, setPosition] = useState<[number, number]>([
    business.latitude || 0,
    business.longitude || 0,
  ]);
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    // Update position when modal opens
    setPosition([formData.latitude, formData.longitude]);
  }, [isOpen]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedData = { ...formData, latitude: position[0], longitude: position[1] };

      const data = new FormData();
      Object.keys(updatedData).forEach((key) => data.append(key, updatedData[key]));

      const response = await axios.put(
        `https://waw.com.tn/api/api/business/${business.id}`,
        data,
      { headers: { "Content-Type": "application/json" } }
      );

      console.log("Utilisateur mis à jour :", response.data);
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setGeoError("Impossible de mettre à jour les informations.");
    }
  };

  return (
    <>
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold">Adresse</h4>
                          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Pays
              </p>
            <p>{business.pays}</p>
                                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Pays
              </p>
            <p>{business.ville}</p>
                                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Adresse complet
              </p>
            <p>{business.adresse}</p>
          </div>

                  <div className="flex flex-col gap-2">

          <Button
  onClick={openModal}
  size="sm"
  className="bg-gradient-to-r from-[#181AD6] to-[#FF7900] text-white"
>
 Modifier l'adresse
</Button>
</div>
      </div>
</div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="p-6 bg-white rounded-2xl dark:bg-gray-900">
          <h4 className="text-2xl font-semibold mb-4">Modifier l'adresse</h4>

          <Box sx={{ height: 300, mb: 4 }}>
            <MapContainer center={position} zoom={13} style={{ height: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationSelector
                position={position}
                setPosition={setPosition}
                setFormData={setFormData}
              />
            </MapContainer>
          </Box>

          <Input
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            placeholder="Rue / Adresse complète"
            required
            className="mb-3"
          />
          <Input
            name="ville"
            value={formData.ville}
            onChange={handleChange}
            placeholder="Ville"
            required
            className="mb-3"
          />
          <Input
            name="pays"
            value={formData.pays}
            onChange={handleChange}
            placeholder="Pays"
            required
            className="mb-3"
          />

          {geoError && <Typography color="error">{geoError}</Typography>}
          <Typography variant="body2" className="mb-3">
            📍 {position[0]} | {position[1]}
          </Typography>

          <div className="flex justify-end gap-3">
            <Button size="sm" variant="outline" onClick={closeModal}>Fermer</Button>
            <Button size="sm" onClick={handleSave}>Sauvegarder</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
