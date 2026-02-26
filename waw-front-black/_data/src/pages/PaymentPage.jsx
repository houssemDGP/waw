import React, { useState } from "react";
import axios from "axios";

const PaymentPage = () => {
  // État pour les champs utilisateur
  const [amount, setAmount] = useState(10000); // en unités mineures
  const [description, setDescription] = useState("Paiement de test");
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [phoneNumber, setPhoneNumber] = useState("22777777");
  const [email, setEmail] = useState("john.doe@gmail.com");

  // Style commun pour tous les champs
  const inputStyle = {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "8px",
    width: "250px",
    outline: "none",
  };

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(
        "https://waw.com.tn/api/payments/init",
        {
          amount: amount * 1000,
          description,
          firstName,
          lastName,
          phoneNumber,
          email,
          orderId: "commande_" + Date.now(),
        }
      );

      if (data.payUrl) {
        window.location.href = data.payUrl;
      } else {
        alert("Aucun lien de paiement retourné");
        console.log(data);
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation du paiement :", error.response?.data || error.message);
      alert("Échec de l'initialisation du paiement");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Démo de Paiement Konnect (React)</h2>
      
      <div style={{ marginBottom: "10px" }}>
        <label>Montant (TND) : </label>
        <input
          type="number"
          value={amount} // affiché en TND
          onChange={(e) => setAmount(Number(e.target.value))}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Description : </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Prénom : </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Nom : </label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Numéro de téléphone : </label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Email : </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
      </div>

      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          borderRadius: "4px",
          border: "none",
          backgroundColor: "#007BFF",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Payer maintenant
      </button>
    </div>
  );
};

export default PaymentPage;
