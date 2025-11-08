import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-brand-dark animate-fadeIn">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-brand-primary tracking-wider">LIFRAG</h1>
        <h2 className="text-5xl font-light text-brand-text-secondary tracking-wider">CYCLING</h2>
      </div>
    </div>
  );
};

export default SplashScreen;
