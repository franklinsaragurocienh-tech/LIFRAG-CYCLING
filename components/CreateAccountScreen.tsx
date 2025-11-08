import React, { useState } from 'react';
import { BackIcon, UserIcon, EnvelopeIcon, LockClosedIcon } from './Icons';

interface CreateAccountScreenProps {
  onBackToLogin: () => void;
  onCreateSuccess: () => void;
}

const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({ onBackToLogin, onCreateSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    // Add more validation here (e.g., password strength)
    setError('');
    onCreateSuccess();
  };

  return (
    <div className="p-6 animate-fadeIn h-full flex flex-col">
      <header className="flex items-center mb-6 relative">
        <button onClick={onBackToLogin} className="absolute left-0 p-2 -ml-2">
          <BackIcon className="w-6 h-6 text-brand-text" />
        </button>
        <h1 className="text-2xl font-bold text-center w-full">Crear Cuenta</h1>
      </header>

      <div className="flex-grow flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-6">
          <div>
            <label className="text-sm text-brand-text-secondary">Nombre Completo</label>
            <div className="relative">
              <UserIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full bg-brand-light-dark border border-brand-gray rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>
          </div>
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
          <div>
            <label className="text-sm text-brand-text-secondary">Confirmar Contraseña</label>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-light-dark border border-brand-gray rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full mt-6 bg-brand-primary text-brand-dark font-bold py-3 rounded-full text-lg hover:opacity-90 transition-opacity"
          >
            Crear Cuenta
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountScreen;