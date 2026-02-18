// AdminManagementPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Select, MenuItem, TextField, IconButton, Tooltip, Paper
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SideBar from './SideBar';
import styled from 'styled-components';
import { Toolbar } from '@mui/material';

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
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get('http://102.211.209.131:3011/api/admins');
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
    await axios.put(`http://102.211.209.131:3011/api/admins/${selectedAdmin.id}`, payload);
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
        status: 'ACTIVE'
      };
      await axios.post('http://102.211.209.131:3011/api/admins', payload);
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
      await axios.put(`http://102.211.209.131:3011/api/admins/${admin.id}`, {
        ...admin,
        status: admin.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
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
          <Typography variant="h4" gutterBottom>Gestion des Administrateurs</Typography>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
    <TextField
      label="Rechercher"
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <Select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      size="small"
      displayEmpty
    >
      <MenuItem value="all">Tous les statuts</MenuItem>
      <MenuItem value="ACTIVE">Actif</MenuItem>
      <MenuItem value="BLOCKED">Bloqué</MenuItem>
    </Select>
  </Box>

  <Button
    variant="contained"
    color="primary"
    onClick={() => setOpenAddDialog(true)}
    sx={{ whiteSpace: 'nowrap' }}
  >
    Ajouter un administrateur
  </Button>
</Box>

          <Table component={Paper} sx={{ mt: 3 }}>
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
  .filter((admin) => {
    const term = searchTerm.toLowerCase();
    return (
      admin.name?.toLowerCase().includes(term) ||
      admin.email?.toLowerCase().includes(term)
    );
  })
  .filter((admin) => {
    if (statusFilter === 'all') return true;
    return admin.status === statusFilter;
  })
  .map((admin) => (                <TableRow key={admin.id}>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.role}</TableCell>
                  <TableCell style={{ color: admin.status === 'ACTIVE' ? 'green' : 'red' }}>
                    {admin.status}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenPermissions(admin)} sx={{ mr: 1 }}>
                      Permissions
                    </Button>
                    <Tooltip title={admin.status === 'ACTIVE' ? 'Bloquer' : 'Débloquer'}>
                      <IconButton onClick={() => toggleStatus(admin)} color={admin.status === 'ACTIVE' ? 'error' : 'success'}>
                        {admin.status === 'ACTIVE' ? <BlockIcon /> : <CheckCircleIcon />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Permissions Dialog */}
          <Dialog open={openPermDialog} onClose={() => setOpenPermDialog(false)} fullWidth maxWidth="sm">
            <DialogTitle>Gérer les permissions : {selectedAdmin?.name}</DialogTitle>
            <DialogContent>
              {MODULES.map((mod) => (
                <Box key={mod} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>{mod}</Typography>
                  <Select
                    fullWidth
                    value={permissionState[mod] || 'NONE'}
                    onChange={(e) => handlePermissionChange(mod, e.target.value)}
                  >
                    {ROLES.map((role) => (
                      <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                  </Select>
                </Box>
              ))}
              <TextField
    fullWidth
    margin="dense"
    label="Email"
    type="email"
    value={editAdminData.email}
    onChange={(e) => setEditAdminData({ ...editAdminData, email: e.target.value })}
  />
  <TextField
    fullWidth
    margin="dense"
    label="Mot de passe (laisser vide pour ne pas changer)"
    type="password"
    value={editAdminData.password}
    onChange={(e) => setEditAdminData({ ...editAdminData, password: e.target.value })}
  />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenPermDialog(false)}>Annuler</Button>
              <Button variant="contained" onClick={handleSavePermissions}>Enregistrer</Button>
            </DialogActions>
          </Dialog>

          {/* Add Admin Dialog */}
          <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="sm">
            <DialogTitle>Ajouter un administrateur</DialogTitle>
            <DialogContent>
              <TextField fullWidth margin="dense" label="Nom" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} />
              <TextField fullWidth margin="dense" label="Email" type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} />
              <TextField fullWidth margin="dense" label="Mot de passe" type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} />
              <TextField fullWidth margin="dense" label="Rôle" value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })} />

              {MODULES.map((mod) => (
                <Box key={mod} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>{mod}</Typography>
                  <Select
                    fullWidth
                    value={newPermissions[mod] || 'NONE'}
                    onChange={(e) => setNewPermissions({ ...newPermissions, [mod]: e.target.value })}
                  >
                    {ROLES.map((role) => (
                      <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                  </Select>
                </Box>
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAddDialog(false)}>Annuler</Button>
              <Button variant="contained" onClick={handleAddAdmin}>Ajouter</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminManagementPage;
