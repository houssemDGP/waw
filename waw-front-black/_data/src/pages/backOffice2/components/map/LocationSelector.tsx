import { Marker, useMapEvents } from "react-leaflet";
import { LatLngLiteral } from "leaflet";
import { useEffect } from "react";

interface LocationSelectorProps {
  position: LatLngLiteral | [number, number];
  setPosition: (pos: LatLngLiteral | [number, number]) => void;
  setFormData?: (data: any) => void;
}

const LocationSelector = ({ position, setPosition, setFormData }: LocationSelectorProps) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const newPosition: [number, number] = [lat, lng];
      setPosition(newPosition);

      if (setFormData) {
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then((res) => res.json())
          .then((data) => {
            setFormData((prev: any) => ({
              ...prev,
              rue: data.display_name || "",
              ville: data.address?.city || data.address?.town || data.address?.village || "",
              pays: data.address?.country || "",
            }));
          })
          .catch((err) => {
            console.error("Erreur reverse geocoding:", err);
          });
      }
    },
  });

  useEffect(() => {
    map.setView(position);
  }, [position, map]);

  return <Marker position={position} />;
};

export default LocationSelector;
