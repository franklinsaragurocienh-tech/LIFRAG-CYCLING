// Fix: Implement the ProfileScreen component.
import React, { useState, useRef, useEffect } from 'react';
import { User, Reward } from '../types';
import { TrophyIcon, Cog6ToothIcon, LogoutIcon, PencilIcon } from './Icons';

interface ProfileScreenProps {
  user: User;
  rewards: Reward[];
  onNavigateToAdmin: () => void;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, rewards, onNavigateToAdmin, onLogout, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Sync local state if the user prop changes from outside
    setEditedUser(user);
  }, [user]);

  const nextReward = rewards.find(r => r.requiredClasses > user.classesCompleted);
  const progressPercentage = nextReward ? (user.classesCompleted / nextReward.requiredClasses) * 100 : 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64Url = loadEvent.target?.result as string;
        setEditedUser(prev => ({ ...prev, avatarUrl: base64Url }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user); // Revert changes
    setIsEditing(false);
  };

  return (
    <div className="p-6 animate-fadeIn">
      <header className="text-center mb-8">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <img src={isEditing ? editedUser.avatarUrl : user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full border-4 border-brand-primary object-cover" />
          {isEditing && (
            <>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
              <button 
                onClick={handleUploadClick}
                className="absolute bottom-0 right-0 bg-brand-primary text-brand-dark rounded-full p-1.5 hover:bg-opacity-90 transition-opacity"
                aria-label="Cambiar foto"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
        {isEditing ? (
          <div className="space-y-3">
             <input
              type="text"
              name="name"
              value={editedUser.name}
              onChange={handleInputChange}
              className="form-input text-3xl font-bold text-center bg-transparent border-0 ring-0 focus:ring-0 focus:border-b-2 p-0"
            />
             <input
              type="text"
              name="level"
              value={editedUser.level}
              onChange={handleInputChange}
              className="form-input text-md text-brand-text-secondary text-center bg-transparent border-0 ring-0 focus:ring-0 focus:border-b-2 p-0"
            />
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-md text-brand-text-secondary">{user.level}</p>
          </>
        )}
      </header>

      <section className="bg-brand-gray p-4 rounded-xl mb-6">
        <h2 className="text-lg font-semibold mb-3 text-center">Mi Progreso</h2>
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-brand-text-secondary">Clases Completadas</span>
          <span className="font-bold">{user.classesCompleted}</span>
        </div>
        
        {nextReward && (
          <>
            <div className="w-full bg-brand-dark rounded-full h-2.5 my-2">
              <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className="text-xs text-brand-text-secondary text-right">
              Siguiente recompensa: {nextReward.title} ({user.classesCompleted}/{nextReward.requiredClasses})
            </div>
          </>
        )}
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">Recompensas</h2>
        <div className="space-y-3">
          {rewards.map(reward => {
            const isUnlocked = user.classesCompleted >= reward.requiredClasses;
            return (
              <div key={reward.id} className={`flex items-center p-4 rounded-xl transition-opacity ${isUnlocked ? 'bg-brand-gray' : 'bg-brand-gray opacity-50'}`}>
                <div className={`p-3 rounded-full mr-4 ${isUnlocked ? 'bg-brand-primary text-brand-dark' : 'bg-brand-dark text-brand-text-secondary'}`}>
                  <TrophyIcon className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className={`font-bold ${isUnlocked ? 'text-brand-text' : 'text-brand-text-secondary'}`}>{reward.title}</h3>
                  <p className="text-sm text-brand-text-secondary">{reward.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      
      <section>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleCancel} className="w-full text-center p-3 rounded-lg bg-brand-gray hover:bg-opacity-80 transition-colors font-semibold">
                Cancelar
              </button>
              <button onClick={handleSave} className="w-full text-center p-3 rounded-lg bg-brand-primary text-brand-dark hover:bg-opacity-90 transition-colors font-bold">
                Guardar Cambios
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button onClick={() => setIsEditing(true)} className="w-full flex items-center text-left p-4 rounded-lg bg-brand-gray hover:bg-opacity-80 transition-colors">
                <PencilIcon className="w-6 h-6 mr-3 text-brand-text-secondary"/>
                <span className="font-semibold">Editar Perfil</span>
              </button>
              <button onClick={onNavigateToAdmin} className="w-full flex items-center text-left p-4 rounded-lg bg-brand-gray hover:bg-opacity-80 transition-colors">
                <Cog6ToothIcon className="w-6 h-6 mr-3 text-brand-text-secondary"/>
                <span className="font-semibold">Panel de Administrador</span>
              </button>
              <button onClick={onLogout} className="w-full flex items-center text-left p-4 rounded-lg bg-brand-gray hover:bg-opacity-80 transition-colors">
                <LogoutIcon className="w-6 h-6 mr-3 text-red-400"/>
                <span className="font-semibold text-red-400">Cerrar Sesión</span>
              </button>
            </div>
          )}
      </section>
    </div>
  );
};

export default ProfileScreen;