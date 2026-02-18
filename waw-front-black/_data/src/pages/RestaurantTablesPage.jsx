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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  CircularProgress,
  Switch,
  FormControlLabel as MuiFormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Badge from "../components/ui/badge/Badge";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Input from "../components/form/input/InputField";

export default function RestaurantTablesPage() {
  const { restaurantId, placeId } = useParams();
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    tableNumber: "",
    name: "",
    minCapacity: 2,
    maxCapacity: 4,
    pricePerPerson: "",
    pricePerPersonEnfant: "",
    pricePerPersonBebe: "",
    tableType: "NORMAL",
    isActive: true,
    placeId: placeId ? parseInt(placeId) : "",
  });

  // Table types
  const tableTypes = [
    { value: "NORMAL", label: "Normal" },
    { value: "VIP", label: "VIP" },
    { value: "FAMILY", label: "Famille" },
    { value: "COUPLE", label: "Couple" },
    { value: "BUSINESS", label: "Affaires" },
  ];

  // Age categories
  const ageCategories = [
    { label: "Adulte (≥ 12 ans)", field: "pricePerPerson", key: "adult" },
    { label: "Enfant (3-11 ans)", field: "pricePerPersonEnfant", key: "enfant" },
    { label: "Bébé (0-2 ans)", field: "pricePerPersonBebe", key: "bebe" },
  ];
  const [openBulkDialog, setOpenBulkDialog] = useState(false);

  const createEmptyBulkTable = () => ({
    tableNumber: "",
    name: "",
    minCapacity: 2,
    maxCapacity: 4,
    pricePerPerson: "",
    pricePerPersonEnfant: "",
    pricePerPersonBebe: "",
    tableType: "NORMAL",
    isActive: true,
    placeId: placeId ? parseInt(placeId) : "",
  });

  const [bulkTables, setBulkTables] = useState([createEmptyBulkTable()]);
  const updateBulk = (i, field, value) => {
    const updated = [...bulkTables];
    updated[i][field] = value;
    setBulkTables(updated);
  };

  const duplicateBulk = (i) => {
    setBulkTables([...bulkTables, { ...bulkTables[i] }]);
  };

  const addBulk = () => {
    setBulkTables([...bulkTables, createEmptyBulkTable()]);
  };

  const removeBulk = (i) => {
    setBulkTables(bulkTables.filter((_, index) => index !== i));
  };
  const handleBulkSubmit = async () => {
    for (let i = 0; i < bulkTables.length; i++) {
      const table = bulkTables[i];

      if (!table.tableNumber || table.tableNumber.trim() === "") {
        alert(`Le numéro de table est obligatoire pour la table #${i + 1}`);
        return;
      }

      if (!table.pricePerPerson || table.pricePerPerson === "") {
        alert(`Le prix pour les adultes (≥ 12 ans) est obligatoire pour la table #${i + 1}`);
        return;
      }
    }
    try {
      for (const table of bulkTables) {
        await axios.post(
          "https://waw.com.tn/api/api/restaurant-tables",
          {
            ...table,
            place: { id: table.placeId },
            restaurant: { id: parseInt(restaurantId) },
          }
        );
      }

      fetchData();
      setOpenBulkDialog(false);
    } catch (err) {
      alert("Erreur lors de l'ajout multiple");
    }
  };

  // Fetch data
  useEffect(() => {
    fetchData();
  }, [restaurantId, placeId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch tables
      let tablesUrl;
      if (placeId) {
        tablesUrl = `https://waw.com.tn/api/api/restaurant-tables/place/${placeId}`;
      } else {
        tablesUrl = `https://waw.com.tn/api/api/restaurant-tables/restaurant/${restaurantId}`;
      }

      const [tablesRes, placesRes] = await Promise.all([
        axios.get(tablesUrl),
        axios.get(`https://waw.com.tn/api/api/restaurant-places/restaurant/${restaurantId}`)
      ]);

      setTables(tablesRes.data);
      setPlaces(placesRes.data);
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
  const handleOpenDialog = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        tableNumber: table.tableNumber || "",
        name: table.name || "",
        minCapacity: table.minCapacity || 2,
        maxCapacity: table.maxCapacity || 4,
        pricePerPerson: table.pricePerPerson || "",
        pricePerPersonEnfant: table.pricePerPersonEnfant || "",
        pricePerPersonBebe: table.pricePerPersonBebe || "",
        tableType: table.tableType || "NORMAL",
        isActive: table.isActive !== undefined ? table.isActive : true,
        placeId: table.place?.id || (placeId ? parseInt(placeId) : ""),
      });
    } else {
      setEditingTable(null);
      setFormData({
        tableNumber: "",
        name: "",
        minCapacity: 2,
        maxCapacity: 4,
        pricePerPerson: "",
        pricePerPersonEnfant: "",
        pricePerPersonBebe: "",
        tableType: "NORMAL",
        isActive: true,
        placeId: placeId ? parseInt(placeId) : "",
      });
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTable(null);
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      if (!formData.tableNumber || formData.tableNumber.trim() === "") {
        alert("Le numéro de table est obligatoire !");
        return;
      }

      if (!formData.pricePerPerson || formData.pricePerPerson === "") {
        alert("Le prix pour les adultes (≥ 12 ans) est obligatoire !");
        return;
      }
      if (formData.minCapacity > formData.maxCapacity) {
        alert("La capacité minimale ne peut pas être supérieure à la capacité maximale");
        return;
      }

      if (!formData.placeId) {
        alert("Veuillez sélectionner un lieu");
        return;
      }

      // Format price data (empty string becomes null for backend)
      const formatPrice = (value) => value === "" || value === null ? null : parseFloat(value);

      const tableData = {
        ...formData,
        pricePerPerson: formatPrice(formData.pricePerPerson),
        pricePerPersonEnfant: formatPrice(formData.pricePerPersonEnfant),
        pricePerPersonBebe: formatPrice(formData.pricePerPersonBebe),
        place: { id: formData.placeId },
        restaurant: { id: parseInt(restaurantId) }
      };

      let response;
      if (editingTable) {
        response = await axios.put(
          `https://waw.com.tn/api/api/restaurant-tables/${editingTable.id}`,
          tableData
        );
        setTables(tables.map(t => t.id === editingTable.id ? response.data : t));
      } else {
        response = await axios.post(
          `https://waw.com.tn/api/api/restaurant-tables`,
          tableData
        );
        setTables([...tables, response.data]);
      }

      handleCloseDialog();
    } catch (err) {
      console.error("Error saving table:", err);
      alert("Erreur: " + (err.response?.data || err.message));
    }
  };

  // Delete table
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette table ?")) {
      try {
        await axios.delete(`https://waw.com.tn/api/api/restaurant-tables/${id}`);
        setTables(tables.filter(t => t.id !== id));
      } catch (err) {
        console.error("Error deleting table:", err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  // Toggle active status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const response = await axios.put(
        `https://waw.com.tn/api/api/restaurant-tables/${id}/toggle-active`
      );
      setTables(tables.map(t => t.id === id ? response.data : t));
    } catch (err) {
      console.error("Error toggling active:", err);
    }
  };

  // Go back to places
  const handleBackToPlaces = () => {
    navigate(`/vendeur/restaurant/${restaurantId}/places`);
  };

  // Get place name by ID
  const getPlaceName = (placeId) => {
    const place = places.find(p => p.id === placeId);
    return place ? place.name : "Inconnu";
  };

  // Format price display
  const formatPriceDisplay = (price) => {
    if (price === null || price === undefined || price === "") return "-";
    return `${parseFloat(price).toFixed(2)} TND`;
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
      <PageBreadcrumb pageTitle="Gestion des tables" />
      <PageMeta title="Gestion des tables" description="Gérer les tables du restaurant" />

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            {placeId && (
              <IconButton onClick={handleBackToPlaces} className="text-white">
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h4" className="text-white">
              {placeId
                ? `Tables - ${getPlaceName(parseInt(placeId))}`
                : "Toutes les tables"
              }
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={() => handleOpenDialog()}
          >
            Ajouter une table
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenBulkDialog(true)}
          >
            Ajouter plusieurs tables
          </Button>

        </div>

        {/* Info card */}
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <Typography variant="body2" className="text-blue-700 dark:text-blue-300">
            💡 Configuration des prix par catégorie d'âge :
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>Adulte</strong> : Personnes de 12 ans et plus</li>
              <li><strong>Enfant</strong> : Personnes de 3 à 11 ans</li>
              <li><strong>Bébé</strong> : Personnes de 0 à 2 ans</li>
            </ul>
            Les prix seront utilisés pour calculer le total des réservations.
          </Typography>
        </div>

        {/* Tables Table */}
        <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03] shadow">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-200 dark:border-gray-700">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Table
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Capacité
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Prix Adulte
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Prix Enfant
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Prix Bébé
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Type
                  </TableCell>
                  {!placeId && (
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                      Lieu
                    </TableCell>
                  )}
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Statut
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                {tables.map((table) => (
                  <TableRow key={table.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      <div className="font-medium">{table.tableNumber}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{table.name}</div>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className="text-center">
                        <div className="font-medium">
                          {table.minCapacity} - {table.maxCapacity} pers.
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className={`font-medium ${table.pricePerPerson ? 'text-green-600' : 'text-gray-400'}`}>
                        {formatPriceDisplay(table.pricePerPerson)}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className={`font-medium ${table.pricePerPersonEnfant ? 'text-blue-600' : 'text-gray-400'}`}>
                        {formatPriceDisplay(table.pricePerPersonEnfant)}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className={`font-medium ${table.pricePerPersonBebe ? 'text-purple-600' : 'text-gray-400'}`}>
                        {formatPriceDisplay(table.pricePerPersonBebe)}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <Chip
                        label={table.tableType}
                        size="small"
                        color={
                          table.tableType === "VIP" ? "warning" :
                            table.tableType === "FAMILY" ? "success" :
                              "default"
                        }
                      />
                    </TableCell>

                    {!placeId && (
                      <TableCell className="px-4 py-3">
                        <Chip
                          label={table.place?.name || "Inconnu"}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    )}

                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Badge size="sm" color={table.isActive ? "success" : "error"}>
                          {table.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <MuiFormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={table.isActive}
                              onChange={() => handleToggleActive(table.id, table.isActive)}
                            />
                          }
                          label=""
                        />
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(table)}
                          title="Éditer"
                          className="text-green-600 hover:text-green-800"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => handleDelete(table.id)}
                          title="Supprimer"
                          className="text-red-600 hover:text-red-800"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {tables.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={placeId ? 8 : 9} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        <Typography variant="body1" className="text-gray-500 mb-2">
                          Aucune table configurée
                        </Typography>
                        <Typography variant="body2" className="text-gray-400">
                          {placeId
                            ? "Ajoutez des tables à ce lieu"
                            : "Ajoutez des tables à vos lieux"
                          }
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
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingTable ? "Modifier la table" : "Ajouter une nouvelle table"}
          </DialogTitle>

          <DialogContent>
            <div className="space-y-4 pt-4">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Numéro de table *
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: T1, VIP-1"
                      value={formData.tableNumber}
                      onChange={(e) => handleFormChange("tableNumber", e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                </Grid>

                <Grid item xs={6}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Nom
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: Table famille, Table VIP"
                      value={formData.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Capacité minimale *
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={formData.minCapacity}
                      onChange={(e) => handleFormChange("minCapacity", parseInt(e.target.value) || 1)}
                      className="w-full"
                      required
                    />
                  </div>
                </Grid>

                <Grid item xs={6}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Capacité maximale *
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={formData.maxCapacity}
                      onChange={(e) => handleFormChange("maxCapacity", parseInt(e.target.value) || 1)}
                      className="w-full"
                      required
                    />
                  </div>
                </Grid>
              </Grid>

              {/* Price section with 3 columns */}
              <Typography variant="subtitle1" className="font-medium mt-4 mb-2">
                Prix par catégorie d'âge (TND)
              </Typography>

              <Grid container spacing={2}>
                {ageCategories.map((category) => (
                  <Grid item xs={4} key={category.key}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                        {category.label}
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData[category.field]}
                        onChange={(e) => handleFormChange(category.field, e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Type de table</InputLabel>
                    <Select
                      value={formData.tableType}
                      onChange={(e) => handleFormChange("tableType", e.target.value)}
                      label="Type de table"
                    >
                      {tableTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {!placeId && (
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Lieu *</InputLabel>
                      <Select
                        value={formData.placeId}
                        onChange={(e) => handleFormChange("placeId", e.target.value)}
                        label="Lieu"
                        required
                      >
                        <MenuItem value="">
                          <em>Sélectionner un lieu</em>
                        </MenuItem>
                        {places
                          .filter(place => place.isActive)
                          .map((place) => (
                            <MenuItem key={place.id} value={place.id}>
                              {place.name} ({place.isOutdoor ? 'Extérieur' : 'Intérieur'})
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>

              <MuiFormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleFormChange("isActive", e.target.checked)}
                  />
                }
                label="Table active"
              />
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingTable ? "Modifier" : "Créer"}
            </Button>
          </DialogActions>
        </Dialog>
        {/* ================= BULK TABLE DIALOG ================= */}

        <Dialog
          open={openBulkDialog}
          onClose={() => setOpenBulkDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Ajout multiple de tables</DialogTitle>

          <DialogContent>

            {bulkTables.map((table, index) => (
              <div key={index} className="border rounded-lg p-4 mb-6">

                <Typography variant="subtitle1" className="mb-3 font-medium">
                  Table #{index + 1}
                </Typography>

                {/* Table number + name + capacity */}
                <Grid container spacing={2}>

                  <Grid item xs={3}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de table *
                    </label>
                    <Input
                      placeholder="Ex: T1, VIP-1"
                      value={table.tableNumber}
                      onChange={(e) =>
                        updateBulk(index, "tableNumber", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <Input
                      placeholder="Ex: Table VIP"
                      value={table.name}
                      onChange={(e) =>
                        updateBulk(index, "name", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacité min *
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={table.minCapacity}
                      onChange={(e) =>
                        updateBulk(index, "minCapacity", parseInt(e.target.value) || 1)
                      }
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacité max *
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={table.maxCapacity}
                      onChange={(e) =>
                        updateBulk(index, "maxCapacity", parseInt(e.target.value) || 1)
                      }
                    />
                  </Grid>

                </Grid>

                {/* Prices */}
                <Typography variant="subtitle2" className="mt-4 mb-2 font-medium">
                  Prix par catégorie d'âge (TND)
                </Typography>

                <Grid container spacing={2}>
                  {ageCategories.map((category) => (
                    <Grid item xs={4} key={category.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {category.label}
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={table[category.field]}
                        onChange={(e) =>
                          updateBulk(index, category.field, e.target.value)
                        }
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Type + place */}
                <Grid container spacing={2} className="mt-4">

                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Type de table</InputLabel>
                      <Select
                        value={table.tableType}
                        onChange={(e) =>
                          updateBulk(index, "tableType", e.target.value)
                        }
                        label="Type de table"
                      >
                        {tableTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {!placeId && (
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Lieu *</InputLabel>
                        <Select
                          value={table.placeId}
                          onChange={(e) =>
                            updateBulk(index, "placeId", e.target.value)
                          }
                          label="Lieu"
                        >
                          {places
                            .filter((p) => p.isActive)
                            .map((place) => (
                              <MenuItem key={place.id} value={place.id}>
                                {place.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                </Grid>

                {/* Active switch */}
                <MuiFormControlLabel
                  control={
                    <Switch
                      checked={table.isActive}
                      onChange={(e) =>
                        updateBulk(index, "isActive", e.target.checked)
                      }
                    />
                  }
                  label="Table active"
                  className="mt-3"
                />

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => duplicateBulk(index)}>
                    Dupliquer
                  </Button>

                  {bulkTables.length > 1 && (
                    <Button color="error" onClick={() => removeBulk(index)}>
                      Supprimer
                    </Button>
                  )}
                </div>

              </div>
            ))}

            <Button variant="outlined" onClick={addBulk}>
              ➕ Ajouter une table
            </Button>

          </DialogContent>


          <DialogActions>
            <Button onClick={() => setOpenBulkDialog(false)}>
              Annuler
            </Button>

            <Button
              variant="contained"
              onClick={handleBulkSubmit}
            >
              Enregistrer tout
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    </>
  );
}