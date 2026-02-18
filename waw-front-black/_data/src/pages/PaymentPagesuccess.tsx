import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';



interface PaymentSuccessProps {
  orderId?: string;
  orderNumber?: string;
  amount?: number;
  transactionDate?: string;
  approvalCode?: string;
}

const PaymentPagesuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentSuccessProps>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    // Récupérer les données depuis l'URL
    const data: PaymentSuccessProps = {
      orderId: searchParams.get('orderId') || undefined,
      orderNumber: searchParams.get('reservationId') || undefined,
      amount: searchParams.get('amount') ? parseFloat(searchParams.get('amount')!) : undefined,
      transactionDate: searchParams.get('date') || new Date().toLocaleDateString('fr-FR'),
      approvalCode: searchParams.get('approvalCode') || undefined,
    };
    
    // Simuler un chargement
    setTimeout(() => {
      setPaymentData(data);
      setIsLoading(false);
      
 
    }, 1500);
  }, [location]);



const downloadVoucher = async () => {
const response = await fetch(`https://waw.com.tn/api/api/reservations/voucher2/${paymentData.orderNumber}/${paymentData.orderId}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});


  if (!response.ok) {
    alert('Erreur lors du téléchargement du voucher');
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'voucher_reservation.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewOrder = () => {
    if (paymentData.orderNumber) {
      navigate(`/orders/${paymentData.orderNumber}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de votre paiement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="inline-block bg-white p-4 rounded-full mb-4">
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Paiement Réussi !
            </h1>
            <p className="text-green-100">
              Merci pour votre achat. Votre commande a été confirmée.
            </p>
          </div>

          {/* Contenu */}
          <div className="p-8">
            {/* Message de confirmation */}
            <div className="mb-8 text-center">
              <p className="text-gray-600 mb-4">
                Nous avons bien reçu votre paiement. Vous recevrez un email de confirmation sous peu.
              </p>
              <div className="inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full">
                <span className="font-medium">Transaction approuvée</span>
              </div>
            </div>

            {/* Détails de la transaction */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Détails de la transaction
              </h2>
              
              <div className="space-y-3">
                {paymentData.orderNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Numéro de commande</span>
                    <span className="font-semibold">{paymentData.orderNumber}</span>
                  </div>
                )}
                
                {paymentData.orderId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID Transaction</span>
                    <span className="font-mono text-sm">{paymentData.orderId}</span>
                  </div>
                )}
                
                {paymentData.approvalCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Code d'approbation</span>
                    <span className="font-semibold">{paymentData.approvalCode}</span>
                  </div>
                )}
                
                {paymentData.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant payé</span>
                    <span className="font-bold text-green-600 text-lg">
                      {paymentData.amount.toFixed(3)} TND
                    </span>
                  </div>
                )}
                
                {paymentData.transactionDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span>{paymentData.transactionDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Étapes suivantes */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Prochaines étapes
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span>Vous recevrez un email de confirmation</span>
                </li>
              </ul>
            </div>

            {/* Boutons d'action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <button
                onClick={downloadVoucher}
                className="flex items-center justify-center bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Télécharger le voucher
              </button>
              

              
              <button
                onClick={handleGoHome}
                className="flex items-center justify-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
              >
                Retour à l'accueil
              </button>
            </div>

            {/* Message de support */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                Des questions ? Contactez notre service client au{' '}
                <a href="tel:+21612345678" className="text-blue-600 hover:underline">
                  +216 12 345 678
                </a>{' '}
                ou par email à{' '}
                <a href="mailto:support@waw.com.tn" className="text-blue-600 hover:underline">
                  support@waw.com.tn
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPagesuccess;