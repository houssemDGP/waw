import axios from 'axios';

const API_URL = 'http://102.211.209.131:3011/'; // adapte à ton backend

// 🟢 Upload un fichier pour un événement
export const uploadImage = async (eventId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/upload/${eventId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🔵 Récupère les images d’un événement
export const getImagesByEvent = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/event/${eventId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🔄 Récupérer tous les événements
export const fetchEvents = async () => {
  try {
    const response = await axios.get("http://102.211.209.131:3011/api/events");
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    throw error;
  }
};
export const fetchEventsByBusinessId = async () => {
  try {
    const businessId = localStorage.getItem("businessId");

    if (!businessId) {
      throw new Error("Aucun businessId trouvé dans le localStorage.");
    }

    const response = await axios.get(`http://102.211.209.131:3011/api/events/business/${businessId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error);
    throw error;
  }
};