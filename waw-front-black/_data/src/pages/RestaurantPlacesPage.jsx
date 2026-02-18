import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  IconButton,
  Box,
  CircularProgress,
  Switch,
  FormControlLabel as MuiFormControlLabel,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Badge from "../components/ui/badge/Badge";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Input from "../components/form/input/InputField";
import TextArea from "../components/form/input/TextArea";

export default function RestaurantPlacesPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isOutdoor: false,
    hasAc: true,
    hasHeating: false,
    isSmokingAllowed: false,
    isActive: true,
  });

  // Fetch places
  useEffect(() => {
    fetchPlaces();
  }, [restaurantId]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://waw.com.tn/api/api/restaurant-places/restaurant/${restaurantId}`
      );
      setPlaces(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Open dialog for creating/editing
  const handleOpenDialog = (place = null) => {
    if (place) {
      setEditingPlace(place);
      setFormData({
        name: place.name || "",
        description: place.description || "",
        isOutdoor: place.isOutdoor || false,
        hasAc: place.hasAc !== undefined ? place.hasAc : true,
        hasHeating: place.hasHeating || false,
        isSmokingAllowed: place.isSmokingAllowed || false,
        isActive: place.isActive !== undefined ? place.isActive : true,
      });
    } else {
      setEditingPlace(null);
      setFormData({
        name: "",
        description: "",
        isOutdoor: false,
        hasAc: true,
        hasHeating: false,
        isSmokingAllowed: false,
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlace(null);
  };

  // Submit form
  const handleSubmit = async () => {

    console.log(parseInt(restaurantId));
    try {
      const placeData = {
        ...formData,
        restaurant: { id: parseInt(restaurantId) }
      };
    console.log(placeData);

      let response;
      if (editingPlace) {
        response = await axios.put(
          `https://waw.com.tn/api/api/restaurant-places/${editingPlace.id}`,
          placeData
        );
        setPlaces(places.map(p => p.id === editingPlace.id ? response.data : p));
      } else {
        response = await axios.post(
          `https://waw.com.tn/api/api/restaurant-places`,
          placeData
        );
        setPlaces([...places, response.data]);
      }

      handleCloseDialog();
    } catch (err) {
      console.error("Error saving place:", err);
      alert("Erreur: " + (err.response?.data || err.message));
    }
  };

  // Delete place
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce lieu ?")) {
      try {
        await axios.delete(`https://waw.com.tn/api/api/restaurant-places/${id}`);
        setPlaces(places.filter(p => p.id !== id));
      } catch (err) {
        console.error("Error deleting place:", err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  // Toggle active status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const response = await axios.put(
        `https://waw.com.tn/api/api/restaurant-places/${id}/toggle-active`
      );
      setPlaces(places.map(p => p.id === id ? response.data : p));
    } catch (err) {
      console.error("Error toggling active:", err);
    }
  };

  // View tables for this place
const handleViewTables = (placeId) => {
  const currentPath = window.location.pathname;
  
  if (currentPath.startsWith('/admin')) {
    navigate(`/admin/restaurant/${restaurantId}/places/${placeId}/tables`);
  } else if (currentPath.startsWith('/vendeur')) {
    navigate(`/vendeur/restaurant/${restaurantId}/places/${placeId}/tables`);
  } else {
    // Fallback or default
    navigate(`/vendeur/restaurant/${restaurantId}/places/${placeId}/tables`);
  }
};

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <CircularProgress />
    </div>
  );

  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <Typography color="error">Erreur: {error}</Typography>
      </div>
    </div>
  );

  return (
    <>
      <PageBreadcrumb pageTitle="Gestion des lieux" />
      <PageMeta title="Gestion des lieux" description="Gérer les lieux du restaurant" />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="text-black">
            Lieux du restaurant
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={() => handleOpenDialog()}
          >
            Ajouter un lieu
          </Button>
        </div>

        {/* Places Table */}
        <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03] shadow">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-200 dark:border-gray-700">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Nom
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Type
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Équipements
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Statut
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                {places.map((place) => (
                  <TableRow key={place.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      <div className="font-medium">{place.name}</div>
                      {place.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {place.description.length > 50 
                            ? place.description.substring(0, 50) + "..."
                            : place.description}
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell className="px-4 py-3">
                      <Chip
                        label={place.isOutdoor ? "Extérieur" : "Intérieur"}
                        color={place.isOutdoor ? "success" : "primary"}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {place.hasAc && <Chip label="Climatisé" size="small" variant="outlined" />}
                        {place.hasHeating && <Chip label="Chauffage" size="small" variant="outlined" />}
                        {place.isSmokingAllowed && <Chip label="Fumeur" size="small" variant="outlined" />}
                      </div>
                    </TableCell>
                    
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Badge size="sm" color={place.isActive ? "success" : "error"}>
                          {place.isActive ? "Actif" : "Inactif"}
                        </Badge>
                        <MuiFormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={place.isActive}
                              onChange={() => handleToggleActive(place.id, place.isActive)}
                            />
                          }
                          label=""
                        />
                      </div>
                    </TableCell>
                    
                    <TableCell className="px-4 py-3">
<div className="flex items-center gap-2">
  {/* Voir les tables */}
  <button
    onClick={() => handleViewTables(place.id)}
    className="group flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-blue-50 transition-all"
  >
    <VisibilityIcon 
      fontSize="small" 
      className="text-blue-500 group-hover:text-blue-700" 
    />
    <span className="text-sm font-medium text-blue-600 group-hover:text-blue-800">
      Tables
    </span>
  </button>
  
  {/* Éditer */}
  <button
    onClick={() => handleOpenDialog(place)}
    className="group flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-green-50 transition-all"
  >
    <EditIcon 
      fontSize="small" 
      className="text-green-500 group-hover:text-green-700" 
    />
    <span className="text-sm font-medium text-green-600 group-hover:text-green-800">
      Éditer
    </span>
  </button>
  
  {/* Supprimer */}
  <button
    onClick={() => handleDelete(place.id)}
    className="group flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-red-50 transition-all"
  >
    <DeleteIcon 
      fontSize="small" 
      className="text-red-500 group-hover:text-red-700" 
    />
    <span className="text-sm font-medium text-red-600 group-hover:text-red-800">
      Supprimer
    </span>
  </button>
</div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {places.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <Typography variant="body1" className="text-gray-500 mb-2">
                          Aucun lieu configuré
                        </Typography>
                        <Typography variant="body2" className="text-gray-400">
                          Commencez par ajouter votre premier lieu (salle, terrasse, etc.)
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Dialog for creating/editing */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingPlace ? "Modifier le lieu" : "Ajouter un nouveau lieu"}
          </DialogTitle>
          
          <DialogContent>
            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Nom du lieu *
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Terrasse, Salle principale, Salon privé"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Description
                </label>
                <TextArea
                  placeholder="Description du lieu..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Typography variant="body2" className="mb-2 text-black">Type de lieu</Typography>
                <RadioGroup
                  row
                  value={formData.isOutdoor}
                  onChange={(e) => handleFormChange("isOutdoor", e.target.value === "true")}
                >
                  <FormControlLabel value={true} control={<Radio />} label="Extérieur" />
                  <FormControlLabel value={false} control={<Radio />} label="Intérieur" />
                </RadioGroup>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <MuiFormControlLabel
                  control={
                    <Switch
                      checked={formData.hasAc}
                      onChange={(e) => handleFormChange("hasAc", e.target.checked)}
                    />
                  }
                  label="Climatisation"
                />
                
                <MuiFormControlLabel
                  control={
                    <Switch
                      checked={formData.hasHeating}
                      onChange={(e) => handleFormChange("hasHeating", e.target.checked)}
                    />
                  }
                  label="Chauffage"
                />
                
                <MuiFormControlLabel
                  control={
                    <Switch
                      checked={formData.isSmokingAllowed}
                      onChange={(e) => handleFormChange("isSmokingAllowed", e.target.checked)}
                    />
                  }
                  label="Fumeur autorisé"
                />
                
                <MuiFormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => handleFormChange("isActive", e.target.checked)}
                    />
                  }
                  label="Actif"
                />
              </div>
            </div>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingPlace ? "Modifier" : "Créer"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}