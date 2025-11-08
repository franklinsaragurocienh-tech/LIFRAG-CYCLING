import React, { useState } from 'react';
import { Class, Pricing, BankAccount } from '../types';
import { BackIcon, CreditCardIcon, BuildingLibraryIcon } from './Icons';

interface PaymentScreenProps {
  classInfo: Class;
  bookingDetails: { bikeIds: string[], partySize: number };
  pricing: Pricing;
  bankAccounts: BankAccount[];
  onBack: () => void;
  onPaymentSuccess: (message?: string) => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ classInfo, bookingDetails, pricing, bankAccounts, onBack, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const { partySize } = bookingDetails;
  
  const getPricePerPerson = () => {
    if (partySize === 1) return pricing.individual;
    if (partySize === 2) return pricing.group2;
    return pricing.group3;
  };

  const totalPrice = getPricePerPerson() * partySize;

  const handleFinalizeBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      onPaymentSuccess();
    } else {
      onPaymentSuccess('Tu reserva está pendiente. Por favor, envía el comprobante por el chat para confirmar.');
    }
  }

  return (
    <div className="p-6 animate-fadeIn h-full flex flex-col">
       <header className="flex items-center mb-6 relative">
        <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
            <BackIcon className="w-6 h-6 text-brand-text"/>
        </button>
        <h1 className="text-2xl font-bold text-center w-full">Pago</h1>
      </header>

      <div className="bg-brand-gray p-4 rounded-xl mb-6">
        <h2 className="text-lg font-bold">Resumen de tu Reserva</h2>
        <div className="mt-2 space-y-1 text-brand-text-secondary">
            <p><strong>Clase:</strong> {classInfo.name}</p>
            <p><strong>Bicis:</strong> {bookingDetails.bikeIds.join(', ')}</p>
            <p><strong>Personas:</strong> {partySize} x ${getPricePerPerson()}</p>
        </div>
        <div className="border-t border-brand-light-dark my-3"></div>
        <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <h3 className="font-bold mb-4 text-lg">Método de Pago</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => setPaymentMethod('card')} className={`flex items-center justify-center py-3 px-4 rounded-lg border-2 transition-colors ${paymentMethod === 'card' ? 'bg-brand-primary text-brand-dark border-brand-primary' : 'bg-brand-gray border-transparent'}`}>
                <CreditCardIcon className="w-5 h-5 mr-2"/>
                <span className="font-semibold">Tarjeta</span>
            </button>
            <button onClick={() => setPaymentMethod('transfer')} className={`flex items-center justify-center py-3 px-4 rounded-lg border-2 transition-colors ${paymentMethod === 'transfer' ? 'bg-brand-primary text-brand-dark border-brand-primary' : 'bg-brand-gray border-transparent'}`}>
                <BuildingLibraryIcon className="w-5 h-5 mr-2"/>
                <span className="font-semibold">Transferencia</span>
            </button>
        </div>
        
        <form onSubmit={handleFinalizeBooking} className="flex-grow flex flex-col">
          {paymentMethod === 'card' ? (
            <div className="space-y-4">
              <div>
                  <label className="text-sm text-brand-text-secondary">Número de Tarjeta</label>
                  <div className="relative">
                      <CreditCardIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary"/>
                      <input type="tel" placeholder="**** **** **** 1234" className="w-full bg-brand-dark border border-brand-gray rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
                  </div>
              </div>
              <div className="flex space-x-4">
                  <div className="w-1/2">
                      <label className="text-sm text-brand-text-secondary">Vencimiento</label>
                      <input type="text" placeholder="MM/YY" className="w-full bg-brand-dark border border-brand-gray rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
                  </div>
                  <div className="w-1/2">
                      <label className="text-sm text-brand-text-secondary">CVC</label>
                      <input type="text" placeholder="123" className="w-full bg-brand-dark border border-brand-gray rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
                  </div>
              </div>
              <div>
                  <label className="text-sm text-brand-text-secondary">Nombre en la Tarjeta</label>
                  <input type="text" placeholder="Alex Morgan" className="w-full bg-brand-dark border border-brand-gray rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
              </div>
            </div>
          ) : (
             <div className="space-y-4">
                {bankAccounts.map((account, index) => (
                    <div key={account.id} className="bg-brand-gray p-4 rounded-xl">
                        <h4 className="font-semibold text-center mb-3 text-brand-primary">Opción {index + 1}: {account.bankName}</h4>
                         <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-brand-text-secondary">Beneficiario:</span>
                                <span className="font-mono text-right">LIFRAG CYCLING</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-brand-text-secondary capitalize">Tipo ID:</span>
                                <span className="font-mono text-right capitalize">{account.identificationType}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-brand-text-secondary">Nro. ID:</span>
                                <span className="font-mono text-right">{account.identificationNumber}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-brand-text-secondary capitalize">Tipo Cuenta:</span>
                                <span className="font-mono text-right capitalize">{account.accountType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-brand-text-secondary">Nro. Cuenta:</span>
                                <span className="font-mono text-right">{account.accountNumber}</span>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="pt-2 text-center text-xs text-brand-text-secondary bg-brand-dark p-2 rounded-md">
                    <strong>Importante:</strong> Envía tu comprobante por el chat para confirmar tu reserva.
                </div>
             </div>
          )}

          <div className="mt-auto pt-4">
              <button 
              type="submit"
              className="w-full bg-brand-primary text-brand-dark font-bold py-4 rounded-full text-lg hover:opacity-90 transition-opacity"
              >
              {paymentMethod === 'card' ? `Pagar $${totalPrice.toFixed(2)}` : 'Finalizar Reserva'}
              </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default PaymentScreen;