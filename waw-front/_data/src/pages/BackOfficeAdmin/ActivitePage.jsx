import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Toolbar
} from '@mui/material';
import axios from 'axios';
import SideBar from './SideBar';
import styled from 'styled-components';

const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
  padding: 0 1rem;
`;

const ActivitePage = () => {
  const [activites, setActivites] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentActiviteId, setCurrentActiviteId] = useState(null);

  const [formData, setFormData] = useState({
    titre: '',
  });

  useEffect(() => {
    fetchActivites();
  }, []);

  const fetchActivites = async () => {
    try {
      const res = await axios.get('http://102.211.209.131:3011/api/activites');
      setActivites(res.data);
    } catch (error) {
      console.error("Erreur chargement activités :", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setFormData({ titre: '' });
    setIsEditMode(false);
    setCurrentActiviteId(null);
    setOpenModal(true);
  };

  const openEditModal = (activite) => {
    setFormData({
      titre: activite.titre,
    });
    setCurrentActiviteId(activite.id);
    setIsEditMode(true);
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await axios.put(`http://102.211.209.131:3011/api/activites/${currentActiviteId}`, {
          titre: formData.titre,
        });
      } else {
        await axios.post('http://102.211.209.131:3011/api/activites', {
          titre: formData.titre,
        });
      }

      setOpenModal(false);
      fetchActivites();
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://102.211.209.131:3011/api/activites/${id}`);
      fetchActivites();
    } catch (error) {
      console.error('Erreur suppression activité :', error);
            alert('Vous pouvez pas supprimer cette activite');

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
          <Typography variant="h4" gutterBottom>Gestion des Activités</Typography>

<Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mb: 2 }}>
          <Button variant="contained" color="primary" onClick={openAddModal}>
            Ajouter une activité
          </Button>
</Box>

          <Table component={Paper} sx={{ mt: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Titre</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activites.map((activite) => (
                <TableRow key={activite.id}>
                  <TableCell>{activite.id}</TableCell>
                  <TableCell>{activite.titre}</TableCell>
                  <TableCell>
                    <Button onClick={() => openEditModal(activite)} color="primary" sx={{ mr: 1 }}>
                      Modifier
                    </Button>
                    <Button onClick={() => handleDelete(activite.id)} color="error">
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
            <DialogTitle>{isEditMode ? 'Modifier l\'activité' : 'Ajouter une activité'}</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                margin="dense"
                label="Titre"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
              />
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

export default ActivitePage;
