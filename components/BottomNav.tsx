import React from 'react';
import { HomeIcon, ChatIcon, ProfileIcon } from './Icons';

type NavTab = 'home' | 'chat' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  hasUnreadMessages: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate, hasUnreadMessages }) => {
  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Inicio' },
    { id: 'chat', icon: ChatIcon, label: 'Chat' },
    { id: 'profile', icon: ProfileIcon, label: 'Perfil' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-brand-gray border-t border-brand-light-dark shadow-lg">
      <div className="flex justify-around max-w-lg mx-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`relative flex flex-col items-center justify-center w-full py-3 transition-colors ${
              activeTab === item.id ? 'text-brand-primary' : 'text-brand-text-secondary hover:text-brand-text'
            }`}
          >
            {item.id === 'chat' && hasUnreadMessages && (
              <span className="absolute top-2 right-[calc(50%-20px)] w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-brand-gray"></span>
            )}
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;