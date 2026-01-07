import React, { useState } from 'react';
import styled from 'styled-components';
import { Rating, Avatar, LinearProgress, Box } from '@mui/material';

// Styled Components
const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
`;

const SectionTitle = styled.h2`
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 25px;
`;

const ReviewSummary = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;

const AverageBox = styled.div`
  flex: 1;
  min-width: 200px;
  text-align: center;
  border-right: 1px solid #eee;
  padding-right: 30px;

  h1 {
    font-size: 48px;
    color: #F8BF20;
    margin: 0;
  }

  span {
    display: block;
    margin-top: 5px;
    font-size: 15px;
    color: #666;
  }
`;

const BreakdownBox = styled.div`
  flex: 2;
  min-width: 250px;

  .bar {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    color: #444;
  }

  .progress {
    flex: 1;
    margin: 0 10px;
  }
`;

const ReviewCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  background: #fdfdfd;
  margin-bottom: 15px;
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  .info {
    margin-left: 10px;
    font-size: 14px;
    color: #555;
  }

  .date {
    font-size: 12px;
    color: #999;
  }
`;

const Form = styled.form`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
`;

const Textarea = styled.textarea`
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
  min-height: 100px;
`;

const SubmitButton = styled.button`
  background-color: #4c71c2;
  color: white;
  padding: 12px 16px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: fit-content;

  &:hover {
    background-color: #3b5db4;
  }
`;

const AvisVoyageurs = () => {
  const [reviews, setReviews] = useState([
    {
      name: "Sophie Dupont",
      country: "France",
      avatar: "/imgs/avatars/user1.jpg",
      rating: 5,
      comment: "Une journée inoubliable ! Guide passionné, lieux magiques comme El Jem et la Médina de Kairouan.",
      date: "15 Juin 2025"
    },
    {
      name: "Ahmed Ben Youssef",
      country: "Tunisie",
      avatar: "/imgs/avatars/user2.jpg",
      rating: 4.5,
      comment: "Très bon circuit, voiture confortable, les arrêts étaient bien choisis. À refaire !",
      date: "10 Juin 2025"
    }
  ]);

  const [form, setForm] = useState({
    name: '',
    country: '',
    comment: '',
    rating: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const newReview = {
      ...form,
      avatar: '/imgs/avatars/default.jpg',
      date: formattedDate
    };

    setReviews([newReview, ...reviews]);
    setForm({ name: '', country: '', comment: '', rating: 0 });
  };

  return (
    <Container>
      <SectionTitle>Avis des voyageurs</SectionTitle>

      {/* Résumé */}
      <ReviewSummary>
        <AverageBox>
          <h1>4,8</h1>
          <Rating value={4.8} precision={0.1} readOnly />
          <span>d'après 305 avis</span>
          <span style={{ fontSize: '12px', color: '#888' }}>Viator & Tripadvisor</span>
        </AverageBox>

        <BreakdownBox>
          {[5, 4, 3, 2, 1].map((star, i) => {
            const counts = [269, 23, 8, 3, 2];
            const percent = (counts[i] / 305) * 100;
            return (
              <div key={star} className="bar">
                {star} ★
                <LinearProgress
                  className="progress"
                  variant="determinate"
                  value={percent}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: "#eee",
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#F8BF20'
                    }
                  }}
                />
                {counts[i]}
              </div>
            );
          })}
        </BreakdownBox>
      </ReviewSummary>

      {/* Liste des avis */}
      {reviews.map((r, i) => (
        <ReviewCard key={i}>
          <ReviewHeader>
            <Avatar src={r.avatar} />
            <div className="info">
              <strong>{r.name}</strong> – {r.country} <br />
              <span className="date">{r.date}</span>
            </div>
          </ReviewHeader>
          <Rating value={r.rating} precision={0.5} readOnly />
          <p>{r.comment}</p>
        </ReviewCard>
      ))}

      {/* Formulaire */}
      <Form onSubmit={handleSubmit}>
        <SectionTitle>Laisser un avis</SectionTitle>
        <Input
          type="text"
          placeholder="Nom complet"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Pays"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          required
        />
        <Textarea
          placeholder="Votre commentaire"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          required
        />
        <Box>
          <Rating
            name="rating"
            value={form.rating}
            precision={0.5}
            onChange={(e, newValue) => setForm({ ...form, rating: newValue })}
          />
        </Box>
        <SubmitButton type="submit">Soumettre l'avis</SubmitButton>
      </Form>
    </Container>
  );
};

export default AvisVoyageurs;
