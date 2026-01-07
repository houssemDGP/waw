import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, Toolbar, TextField, Button
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

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  const [filters, setFilters] = useState({
    email: '',
    actionName: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://102.211.209.131:3011/api/logs');
      setLogs(res.data);
      setFilteredLogs(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des logs :", error);
    }
  };

  const applyFilters = () => {
    let results = [...logs];

    if (filters.email) {
      results = results.filter(log =>
        log.actionMail?.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    if (filters.actionName) {
      results = results.filter(log =>
        log.actionName?.toLowerCase().includes(filters.actionName.toLowerCase())
      );
    }

    if (filters.startDate) {
      results = results.filter(log =>
        new Date(log.date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      results = results.filter(log =>
        new Date(log.date) <= new Date(filters.endDate)
      );
    }

    setFilteredLogs(results);
  };

  const clearFilters = () => {
    setFilters({
      email: '',
      actionName: '',
      startDate: '',
      endDate: ''
    });
    setFilteredLogs(logs);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />

      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Toolbar />
        <Container>
          <Typography variant="h4" gutterBottom>Journal des Actions (Logs)</Typography>

          {/* Filtres */}
          <FiltersContainer>
            <TextField
              label="Email"
              name="email"
              value={filters.email}
              onChange={handleChange}
              size="small"
            />
            <TextField
              label="Action (contient PUT, POST, GET...)"
              name="actionName"
              value={filters.actionName}
              onChange={handleChange}
              size="small"
              style={{ minWidth: 200 }}
            />
            <TextField
              label="Date début"
              name="startDate"
              type="date"
              value={filters.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="Date fin"
              name="endDate"
              type="date"
              value={filters.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <Button onClick={applyFilters} variant="contained" color="primary">
              Filtrer
            </Button>
            <Button onClick={clearFilters} variant="outlined" color="secondary">
              Réinitialiser
            </Button>
          </FiltersContainer>

          {/* Tableau */}
          <Table component={Paper} sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom Action</TableCell>
                <TableCell>IP</TableCell>
                <TableCell>Mail</TableCell>
                <TableCell>Date</TableCell>
                             <TableCell>Contenu</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.id}</TableCell>
                  <TableCell>{log.actionName}</TableCell>
                  <TableCell>{log.actionIp}</TableCell>
                  <TableCell>{log.actionMail}</TableCell>
                                    <TableCell>{new Date(log.date).toLocaleString()}</TableCell>

                  <TableCell>{log.actionSend}</TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">Aucun log trouvé</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Container>
      </Box>
    </Box>
  );
};

export default LogsPage;
