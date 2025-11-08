import React, { useState } from 'react';
import { BackIcon, EnvelopeIcon } from './Icons';

interface ForgotPasswordScreenProps {
  onBackToLogin: () => void;
  onRequestSuccess: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onBackToLogin, onRequestSuccess }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger an email sending service
    onRequestSuccess();
  };

  return (
    <div className="p-6 animate-fadeIn h-full flex flex-col">
      <header className="flex items-center mb-6 relative">
        <button onClick={onBackToLogin} className="absolute left-0 p-2 -ml-2">
          <BackIcon className="w-6 h-6 text-brand-text" />
        </button>
        <h1 className="text-2xl font-bold text-center w-full">Recuperar Contraseña</h1>
      </header>

      <div className="flex-grow flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
          <p className="text-center text-brand-text-secondary mb-8">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          <div>
            <label className="text-sm text-brand-text-secondary">Correo Electrónico</label>
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-brand-light-dark border border-brand-gray rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-8 bg-brand-primary text-brand-dark font-bold py-3 rounded-full text-lg hover:opacity-90 transition-opacity"
          >
            Enviar Enlace
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;