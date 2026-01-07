// AdminManagementPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Select, MenuItem, TextField, IconButton, Tooltip, Paper, Toolbar,FormControl,InputLabel
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SideBar from './SideBar';
import styled from 'styled-components';

const MODULES = ['events', 'users', 'banners', 'categories', 'activites', 'reservations'];
const ROLES = ['VIEW', 'EDITOR'];

const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
  padding: 0 1rem;
`;

const AdminManagementPage = () => {
  const [adminList, setAdminList] = useState([]);
  const [openPermDialog, setOpenPermDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [permissionState, setPermissionState] = useState({});
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [newPermissions, setNewPermissions] = useState({});
  const [editAdminData, setEditAdminData] = useState({ email: '', password: '' });
const [selectedDetails, setSelectedDetails] = useState(null);
const [openDetailDialog, setOpenDetailDialog] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get('http://102.211.209.131:3011/api/business');
      setAdminList(res.data);
    } catch (err) {
      console.error('Erreur lors du chargement des admins', err);
    }
  };

  const handleOpenPermissions = (admin) => {
    setSelectedAdmin(admin);
    setPermissionState({
      events: admin.events || 'NONE',
      users: admin.users || 'NONE',
      banners: admin.banners || 'NONE',
      categories: admin.categories || 'NONE',
      activites: admin.activites || 'NONE',
      reservations: admin.reservations || 'NONE',
    });
    setEditAdminData({ email: admin.email || '', password: '' });
    setOpenPermDialog(true);
  };

  const handlePermissionChange = (module, value) => {
    setPermissionState(prev => ({ ...prev, [module]: value }));
  };

  const handleSavePermissions = async () => {
    try {
      const payload = {
        ...selectedAdmin,
        ...permissionState,
        email: editAdminData.email,
      };
      if (editAdminData.password) {
        payload.password = editAdminData.password;
      }
      await axios.put(`http://102.211.209.131:3011/api/business/${selectedAdmin.id}`, payload);
      fetchAdmins();
      setOpenPermDialog(false);
    } catch (err) {
      console.error('Erreur mise à jour permissions', err);
    }
  };

  const handleAddAdmin = async () => {
    try {
      const payload = {
        ...newAdmin,
        ...newPermissions,
        active: true
      };
      await axios.post('http://102.211.209.131:3011/api/business', payload);
      fetchAdmins();
      setOpenAddDialog(false);
      setNewAdmin({ name: '', email: '', password: '' });
      setNewPermissions({});
    } catch (err) {
      console.error('Erreur ajout admin', err);
    }
  };

const toggleStatus = async (admin) => {
  try {
    await axios.put(`http://102.211.209.131:3011/api/business/${admin.id}/active`, {
      active: !admin.active
    });
    fetchAdmins();
  } catch (err) {
    console.error('Erreur changement de statut', err);
  }
};

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Toolbar />
        <Container>
          <Typography variant="h4" gutterBottom>Gestion des business</Typography>
            <TextField
  label="Rechercher un compte"
  variant="outlined"
  size="small"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  sx={{ mb: 2 }}
/>
<FormControl sx={{ minWidth: 150, mb: 2, ml: 2 }} size="small">

  <InputLabel>Statut</InputLabel>
  <Select
    value={statusFilter}
    label="Statut"
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <MenuItem value="all">Tous</MenuItem>
    <MenuItem value="active">Actif</MenuItem>
    <MenuItem value="inactive">Non actif</MenuItem>
  </Select>
</FormControl>
          <Table component={Paper}>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adminList
  .filter((admin) =>
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )    .filter((admin) => {
    if (statusFilter === 'active') return admin.active === true;
    if (statusFilter === 'inactive') return admin.active === false;
    return true;
  }).map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.nom}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.role}</TableCell>
                  <TableCell style={{ color: admin.active ? 'green' : 'red' }}>
                    {admin.active ? 'Actif' : 'Bloqué'}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={admin.active ? 'Bloquer' : 'Débloquer'}>
                      <IconButton onClick={() => toggleStatus(admin)} color={admin.active ? 'error' : 'success'}>
                        {admin.active ? <BlockIcon /> : <CheckCircleIcon />}
                      </IconButton>
                    </Tooltip>
                    <Button
  size="small"
  variant="outlined"
  onClick={() => {
    setSelectedDetails(admin);
    setOpenDetailDialog(true);
  }}
  sx={{ mr: 1 }}
>
  Voir détails
</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Container>
      </Box>

      {/* Dialog ajout admin */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Ajouter un administrateur</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nom"
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Email"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
            margin="dense"
          />
          {MODULES.map((mod) => (
            <Box key={mod} sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>{mod}</Typography>
              <Select
                fullWidth
                value={newPermissions[mod] || 'NONE'}
                onChange={(e) => setNewPermissions(prev => ({ ...prev, [mod]: e.target.value }))}
              >
                <MenuItem value="NONE">Aucun</MenuItem>
                {ROLES.map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Annuler</Button>
          <Button onClick={handleAddAdmin} variant="contained">Ajouter</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog permissions */}
      <Dialog open={openPermDialog} onClose={() => setOpenPermDialog(false)}>
        <DialogTitle>Modifier les permissions</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email"
            value={editAdminData.email}
            onChange={(e) => setEditAdminData(prev => ({ ...prev, email: e.target.value }))}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Nouveau mot de passe"
            type="password"
            value={editAdminData.password}
            onChange={(e) => setEditAdminData(prev => ({ ...prev, password: e.target.value }))}
            margin="dense"
          />
          {MODULES.map((mod) => (
            <Box key={mod} sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>{mod}</Typography>
              <Select
                fullWidth
                value={permissionState[mod] || 'NONE'}
                onChange={(e) => handlePermissionChange(mod, e.target.value)}
              >
                <MenuItem value="NONE">Aucun</MenuItem>
                {ROLES.map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPermDialog(false)}>Annuler</Button>
          <Button onClick={handleSavePermissions} variant="contained">Enregistrer</Button>
        </DialogActions>
      </Dialog>
      <Dialog
  open={openDetailDialog}
  onClose={() => setOpenDetailDialog(false)}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>Détails du compte</DialogTitle>
  <DialogContent dividers>
    {selectedDetails && (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography><strong>Nom:</strong> {selectedDetails.nom}</Typography>
        <Typography><strong>Email:</strong> {selectedDetails.email}</Typography>
        <Typography><strong>Téléphone:</strong> {selectedDetails.phone}</Typography>
        <Typography><strong>Adresse:</strong> {selectedDetails.adresse}</Typography>
        <Typography><strong>Ville:</strong> {selectedDetails.ville}</Typography>
        <Typography><strong>Pays:</strong> {selectedDetails.pays}</Typography>
        <Typography><strong>Description:</strong> {selectedDetails.description}</Typography>
        <Typography><strong>RNE:</strong> {selectedDetails.rne}</Typography>
        <Typography><strong>Raison Sociale:</strong> {selectedDetails.rs}</Typography>
        <Typography><strong>Latitude:</strong> {selectedDetails.latitude}</Typography>
        <Typography><strong>Longitude:</strong> {selectedDetails.longitude}</Typography>
        <Typography><strong>Type:</strong> {selectedDetails.type}</Typography>
        <Typography><strong>Créé le:</strong> {new Date(selectedDetails.creationDate).toLocaleString()}</Typography>
      </Box>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDetailDialog(false)}>Fermer</Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default AdminManagementPage;
