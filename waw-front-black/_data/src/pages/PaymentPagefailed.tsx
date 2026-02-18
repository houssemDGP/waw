import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';



interface PaymentFailedProps {
  orderId?: string;
  orderNumber?: string;
  errorCode?: string;
  errorMessage?: string;
  amount?: number;
}

const PaymentPagefailed: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentFailedProps>({});
  const [isLoading, setIsLoading] = useState(true);
  const [retryUrl, setRetryUrl] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    // Récupérer les données depuis l'URL
    const data: PaymentFailedProps = {
      orderId: searchParams.get('orderId') || undefined,
      orderNumber: searchParams.get('orderNumber') || undefined,
      errorCode: searchParams.get('errorCode') || undefined,
      errorMessage: searchParams.get('errorMessage') || 'Erreur de paiement inconnue',
      amount: searchParams.get('amount') ? parseFloat(searchParams.get('amount')!) : undefined,
    };
    
    setPaymentData(data);
    setIsLoading(false);
    
    // Générer l'URL de réessai si on a l'orderNumber
    if (data.orderNumber) {
      setRetryUrl(`/checkout?order=${data.orderNumber}`);
    }
  }, [location]);

  const getErrorMessage = (errorCode?: string) => {
    switch (errorCode) {
      case '1': return 'Transaction annulée par l\'utilisateur';
      case '2': return 'Fonds insuffisants';
      case '3': return 'Carte refusée';
      case '4': return 'Carte expirée';
      case '5': return 'Problème technique';
      case '6': return 'Délai dépassé';
      case '7': return 'Carte bloquée';
      default: return paymentData.errorMessage || 'Une erreur est survenue lors du paiement';
    }
  };

  const getErrorTips = (errorCode?: string) => {
    switch (errorCode) {
      case '1':
        return 'Vous avez annulé la transaction. Vous pouvez réessayer.';
      case '2':
        return 'Vérifiez le solde de votre carte ou utilisez une autre méthode de paiement.';
      case '3':
        return 'Votre banque a refusé la transaction. Contactez votre banque pour plus d\'informations.';
      case '4':
        return 'Votre carte est expirée. Utilisez une autre carte.';
      case '5':
        return 'Problème technique temporaire. Réessayez dans quelques minutes.';
      case '7':
        return 'Votre carte semble être bloquée. Contactez votre banque.';
      default:
        return 'Veuillez vérifier les informations de votre carte et réessayer.';
    }
  };

  const handleRetryPayment = () => {
    if (retryUrl) {
      navigate(retryUrl);
    } else {
      navigate('/checkout');
    }
  };

  const handleContactSupport = () => {
    // Ouvrir le formulaire de contact ou rediriger
    navigate('/contact');
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
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyse de l'erreur de paiement...</p>
        </div>
      </div>
    );
  }

  const errorMessage = getErrorMessage(paymentData.errorCode);
  const errorTips = getErrorTips(paymentData.errorCode);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 p-8 text-center">
            <div className="inline-block bg-white p-4 rounded-full mb-4">
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Paiement Échoué
            </h1>
            <p className="text-red-100">
              Nous n'avons pas pu traiter votre paiement
            </p>
          </div>

          {/* Contenu */}
          <div className="p-8">
            {/* Message d'erreur principal */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center bg-red-50 text-red-700 px-4 py-2 rounded-full mb-4">
                <span className="font-medium">Transaction non aboutie</span>
              </div>
              <p className="text-xl text-gray-800 font-semibold mb-2">{errorMessage}</p>
              <p className="text-gray-600">{errorTips}</p>
            </div>

            {/* Détails de l'erreur */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Détails techniques
              </h2>
              
              <div className="space-y-3">
                {paymentData.errorCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Code d'erreur</span>
                    <span className="font-mono bg-red-100 text-red-700 px-2 py-1 rounded">
                      {paymentData.errorCode}
                    </span>
                  </div>
                )}
                
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
                
                {paymentData.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant</span>
                    <span className="font-bold text-gray-800">
                      {paymentData.amount.toFixed(3)} TND
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Heure</span>
                  <span>{new Date().toLocaleTimeString('fr-FR')}</span>
                </div>
              </div>
            </div>

            {/* Solutions suggérées */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Solutions possibles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <h4 className="font-bold text-blue-800">Vérifiez votre carte</h4>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Vérifiez la date d'expiration</li>
                    <li>• Vérifiez le code CVC</li>
                    <li>• Assurez-vous que 3D Secure est activé</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <h4 className="font-bold text-green-800">Réessayez</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    Parfois, réessayer après quelques minutes résout le problème.
                  </p>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={handleRetryPayment}
                className="flex items-center justify-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
              >
                Réessayer le paiement
              </button>
              
              <button
                onClick={handleContactSupport}
                className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Contacter le support
              </button>
              
              
              <button
                onClick={handleGoHome}
                className="flex items-center justify-center bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
              >
                Retour à l'accueil
              </button>
            </div>

            {/* Informations de contact */}
            <div className="border-t border-gray-200 pt-6">
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  Besoin d'aide immédiate ?
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:+21612345678"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Appelez le support: +216 12 345 678
                  </a>
                  <br />
                  <a
                    href="mailto:contact@waw.com.tn"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Email: contact@waw.com.tn
                  </a>
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  Heures d'ouverture: Lundi - Vendredi, 9h - 18h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPagefailed;