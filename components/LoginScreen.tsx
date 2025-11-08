

import React, { useState } from 'react';
import { EnvelopeIcon, LockClosedIcon } from './Icons';

// Fix: Add missing props to handle navigation and messages.
interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToCreateAccount: () => void;
  onNavigateToForgotPassword: () => void;
  message?: { type: 'success' | 'info'; text: string } | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onNavigateToCreateAccount, onNavigateToForgotPassword, message }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLoginSuccess();
    }
  };

  return (
    <div className="p-6 animate-fadeIn h-full flex flex-col justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand-primary tracking-wider">LIFRAG</h1>
        <h2 className="text-4xl font-light text-brand-text-secondary tracking-wider">CYCLING</h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-6">
        {/* Fix: Display incoming messages */}
        {message && (
            <div className={`text-center p-3 rounded-lg text-sm mb-4 ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}`}>
                {message.text}
            </div>
        )}
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
        <div>
          <label className="text-sm text-brand-text-secondary">Contraseña</label>
          <div className="relative">
            <LockClosedIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-brand-light-dark border border-brand-gray rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-brand-primary text-brand-dark font-bold py-3 rounded-full text-lg hover:opacity-90 transition-opacity"
        >
          Ingresar
        </button>
      </form>
      
      {/* Fix: Use buttons with onClick handlers for navigation */}
      <div className="text-center mt-8 text-sm text-brand-text-secondary">
        <button onClick={onNavigateToForgotPassword} className="hover:text-brand-primary transition-colors">¿Olvidaste tu contraseña?</button>
        <span className="mx-2">|</span>
        <button onClick={onNavigateToCreateAccount} className="hover:text-brand-primary transition-colors">Crear cuenta</button>
      </div>
    </div>
  );
};

export default LoginScreen;