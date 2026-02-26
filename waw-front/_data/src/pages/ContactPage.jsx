import React, { useState } from 'react';
import styled from 'styled-components';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Paper
} from '@mui/material';
import { Send, Email, Phone, LocationOn } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

// Styled components
const ContactContainer = styled(Container)`
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const ContactPaper = styled(Paper)`
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: #181AD6;
  border-radius: 50%;
  color: white;
`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitStatus('loading');
      
      const response = await fetch('https://waw.com.tn/api/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (response.ok) {
        setSubmitStatus('success');
        setAlertMessage(result.message);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        setAlertMessage(result.message || 'Erreur lors de l\'envoi du message');
      }
      
    } catch (error) {
      setSubmitStatus('error');
      setAlertMessage('Erreur de connexion. Veuillez réessayer.');
      console.error('Error sending contact form:', error);
    }
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <ContactContainer maxWidth="lg">
        <ContactPaper elevation={3}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Contactez-nous
          </Typography>
          
          <ContactGrid>
            {/* Formulaire de contact */}
            <div>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Envoyez-nous un message
              </Typography>
              
              <ContactForm onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nom complet"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="Sujet"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  variant="outlined"
                />
                
                {submitStatus === 'success' && (
                  <Alert severity="success">
                    {alertMessage}
                  </Alert>
                )}
                
                {submitStatus === 'error' && (
                  <Alert severity="error">
                    {alertMessage}
                  </Alert>
                )}
                
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitStatus === 'loading'}
                  sx={{
                    py: 1.5,
                    px: 3,
                    fontSize: '1.1rem',
                    mt: 2,
                    bgcolor: '#181AD6',
                    '&:hover': {
                      bgcolor: '#1517C0',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  {submitStatus === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
                </Button>
              </ContactForm>
            </div>
            
            {/* Informations de contact */}
            <ContactInfo>
              <Typography variant="h5" gutterBottom>
                Nos coordonnées
              </Typography>
              
              <InfoItem>
                <IconWrapper>
                  <Email />
                </IconWrapper>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Email
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    contact@waw.com.tn
                  </Typography>
                </Box>
              </InfoItem>
              
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Nous vous répondrons dans les plus brefs délais.
                </Typography>
              </Box>
            </ContactInfo>
          </ContactGrid>
        </ContactPaper>
      </ContactContainer>
      <Footer />
    </>
  );
};

export default ContactPage;