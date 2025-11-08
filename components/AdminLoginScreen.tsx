import React, { useState } from 'react';
import { BackIcon, EyeIcon, EyeSlashIcon } from './Icons';

interface AdminLoginScreenProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

const ADMIN_PASSWORD = 'admin123'; // Hardcoded for this example

const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onBack, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError('');
      onLoginSuccess();
    } else {
      setError('Contraseña incorrecta. Inténtalo de nuevo.');
      setPassword('');
    }
  };

  return (
    <div className="p-6 animate-fadeIn h-full flex flex-col">
      <header className="flex items-center mb-6 relative">
        <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
          <BackIcon className="w-6 h-6 text-brand-text" />
        </button>
        <h1 className="text-2xl font-bold text-center w-full">Acceso de Administrador</h1>
      </header>
      
      <div className="flex-grow flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <p className="text-center text-brand-text-secondary mb-6">Ingresa la contraseña para acceder al panel de administración.</p>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full bg-brand-dark border border-brand-gray rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-text"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full mt-6 bg-brand-primary text-brand-dark font-bold py-3 rounded-full text-lg hover:opacity-90 transition-opacity"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginScreen;