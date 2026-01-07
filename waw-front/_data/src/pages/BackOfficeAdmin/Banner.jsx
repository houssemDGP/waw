import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Checkbox, FormControlLabel
} from '@mui/material';
import {

  Toolbar,
 
} from "@mui/material";
import axios from 'axios';
import SideBar from "./SideBar";
import styled from 'styled-components';

const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
  padding: 0 1rem;
`;

const BannerPage = () => {
  const [banners, setBanners] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBannerId, setCurrentBannerId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    active: true,
    image: null,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const res = await axios.get('http://102.211.209.131:3011/api/banners');
    setBanners(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const openAddModal = () => {
    setFormData({ title: '', description: '', active: true, image: null });
    setIsEditMode(false);
    setCurrentBannerId(null);
    setOpenModal(true);
  };

  const openEditModal = (banner) => {
    setFormData({
      title: banner.title,
      description: banner.description,
      active: banner.active,
      image: null, // Remplacera si modifiée
    });
    setCurrentBannerId(banner.id);
    setIsEditMode(true);
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('active', formData.active);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (isEditMode) {
        await axios.put(`http://102.211.209.131:3011/api/banners/${currentBannerId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('http://102.211.209.131:3011/api/banners', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setOpenModal(false);
      fetchBanners();
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://102.211.209.131:3011/api/banners/${id}`);
    fetchBanners();
  };

  return (
        <Box sx={{ display: "flex" }}>
      <SideBar />

      {/* Main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
      >
        <Toolbar />
    <Container>

      <Typography variant="h4" gutterBottom>Gestion des Bannières</Typography>
<Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mb: 2 }}>
      <Button variant="contained" color="primary" onClick={openAddModal}>Ajouter une bannière</Button>

</Box>
      <Table component={Paper} sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Titre</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>
                <img
                  src={`http://102.211.209.131:3011${banner.imageUrl}`}
                  alt=""
                  width="100"
                />
              </TableCell>
              <TableCell>{banner.title}</TableCell>
              <TableCell>{banner.description}</TableCell>
              <TableCell>{banner.active ? 'Oui' : 'Non'}</TableCell>
              <TableCell>
                <Button onClick={() => openEditModal(banner)} color="primary">Modifier</Button>
                <Button onClick={() => handleDelete(banner.id)} color="error">Supprimer</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isEditMode ? 'Modifier la bannière' : 'Ajouter une bannière'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth margin="dense" label="Titre" name="title"
            value={formData.title} onChange={handleChange}
          />
          <TextField
            fullWidth margin="dense" label="Description" name="description"
            value={formData.description} onChange={handleChange}
          />
          <FormControlLabel
            control={<Checkbox checked={formData.active} onChange={handleChange} name="active" />}
            label="Active"
          />
          <input type="file" accept="image/*" onChange={handleChange} name="image" />
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

    </Box>  );
};

export default BannerPage;
