import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Toolbar, IconButton
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axios from 'axios';
import SideBar from './SideBar';
import styled from 'styled-components';

const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
  padding: 0 1rem;
`;

const CategoriePage = () => {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCatId, setCurrentCatId] = useState(null);

  const [formData, setFormData] = useState({
    nom: '',
    subCategories: []
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://102.211.209.131:3011/api/categories');
      setCategories(res.data);
    } catch (error) {
      console.error("Erreur de chargement :", error);
    }
  };

  const handleMainChange = (e) => {
    setFormData({ ...formData, nom: e.target.value });
  };

  const handleSubChange = (index, value) => {
    const updatedSubs = [...formData.subCategories];
    updatedSubs[index].nom = value;
    setFormData({ ...formData, subCategories: updatedSubs });
  };

  const addSubCategory = () => {
    setFormData({
      ...formData,
      subCategories: [...formData.subCategories, { nom: '' }]
    });
  };

  const removeSubCategory = (index) => {
    const updatedSubs = formData.subCategories.filter((_, i) => i !== index);
    setFormData({ ...formData, subCategories: updatedSubs });
  };

  const openAddModal = () => {
    setFormData({ nom: '', subCategories: [] });
    setIsEditMode(false);
    setCurrentCatId(null);
    setOpenModal(true);
  };

  const openEditModal = (cat) => {
    setFormData({
      nom: cat.nom,
      subCategories: cat.subCategories || []
    });
    setCurrentCatId(cat.id);
    setIsEditMode(true);
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        nom: formData.nom,
        subCategories: formData.subCategories.map((sc) => ({
          nom: sc.nom
        }))
      };

      if (isEditMode) {
        await axios.put(`http://102.211.209.131:3011/api/categories/${currentCatId}`, payload);
      } else {
        await axios.post('http://102.211.209.131:3011/api/categories', payload);
      }

      setOpenModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://102.211.209.131:3011/api/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Erreur suppression :', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}
      >
        <Toolbar />
        <Container>
          <Typography variant="h4" gutterBottom>Gestion des Catégories</Typography>
<Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mb: 2 }}>
  <Button variant="contained" color="primary" onClick={openAddModal}>
    Ajouter une catégorie
  </Button>
</Box>

          <Table component={Paper} sx={{ mt: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Sous-catégories</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.id}</TableCell>
                  <TableCell>{cat.nom}</TableCell>
                  <TableCell>
                    <ul>
                      {cat.subCategories?.map((sub) => (
                        <li key={sub.id}>{sub.nom}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => openEditModal(cat)} color="primary">Modifier</Button>
                    <Button onClick={() => handleDelete(cat.id)} color="error">Supprimer</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
            <DialogTitle>{isEditMode ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                margin="dense"
                label="Nom de la catégorie"
                name="nom"
                value={formData.nom}
                onChange={handleMainChange}
              />

              <Typography variant="subtitle1" mt={2}>Sous-catégories</Typography>
              {formData.subCategories.map((sub, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label={`Sous-catégorie ${index + 1}`}
                    value={sub.nom}
                    onChange={(e) => handleSubChange(index, e.target.value)}
                  />
                  <IconButton onClick={() => removeSubCategory(index)}><Delete /></IconButton>
                </Box>
              ))}
              <Button startIcon={<Add />} onClick={addSubCategory}>
                Ajouter une sous-catégorie
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>Annuler</Button>
              <Button onClick={handleSubmit} variant="contained">
                {isEditMode ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default CategoriePage;
