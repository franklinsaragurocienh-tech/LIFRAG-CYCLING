import React, { useState } from 'react';
import { Class, Instructor, User, Advertisement } from '../types';
import { ClockIcon, PlayIcon } from './Icons';

interface HomeScreenProps {
  user: User;
  classes: Class[];
  instructors: Instructor[];
  advertisements: Advertisement[];
  onSelectClass: (cls: Class) => void;
  onSelectInstructor: (instructor: Instructor) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user, classes, instructors, advertisements, onSelectClass, onSelectInstructor }) => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const getInstructor = (id: string) => instructors.find(i => i.id === id);
  const videoAd = advertisements.find(ad => ad.type === 'video');

  return (
    <div className="p-6 animate-fadeIn">
      <header className="flex items-center justify-between mb-8">
        <div>
          <p className="text-md text-brand-text-secondary">Bienvenido,</p>
          <h1 className="text-3xl font-bold">{user.name}</h1>
        </div>
        <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full border-2 border-brand-primary object-cover" />
      </header>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Clases para Hoy</h2>
        <div className="space-y-4">
          {classes.map(cls => {
            const instructor = getInstructor(cls.instructorId);
            return (
              <div key={cls.id} className="bg-brand-gray p-4 rounded-xl flex items-center justify-between">
                <div 
                  className="flex items-center cursor-pointer group"
                  onClick={() => instructor && onSelectInstructor(instructor)}
                >
                  <img src={instructor?.avatarUrl} alt={instructor?.name} className="w-12 h-12 rounded-full mr-4 transition-transform group-hover:scale-105 object-cover" />
                  <div>
                    <h3 className="font-semibold">{cls.name}</h3>
                    <p className="text-sm text-brand-text-secondary group-hover:text-brand-primary transition-colors">con {instructor?.name}</p>
                    <div className="flex items-center text-xs text-brand-text-secondary mt-1">
                      <ClockIcon className="w-4 h-4 mr-1"/>
                      <span>{cls.time} - {cls.duration} min</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => onSelectClass(cls)}
                  className="bg-brand-primary text-brand-dark font-bold py-2 px-4 rounded-full text-sm hover:opacity-90 transition-opacity"
                >
                  Reservar
                </button>
              </div>
            );
          })}
        </div>
      </section>
      
      {videoAd && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Novedades</h2>
          <div key={videoAd.id} className="w-full aspect-video rounded-xl overflow-hidden bg-brand-gray relative shadow-lg">
            {playingVideo === videoAd.id ? (
              <video
                src={videoAd.mediaUrl}
                className="w-full h-full object-cover"
                autoPlay
                controls
                onEnded={() => setPlayingVideo(null)}
                onPause={() => setPlayingVideo(null)}
              />
            ) : (
              <div className="w-full h-full cursor-pointer group" onClick={() => setPlayingVideo(videoAd.id)}>
                <img src={videoAd.thumbnailUrl || videoAd.mediaUrl} alt={videoAd.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity opacity-75 group-hover:opacity-100">
                  <PlayIcon className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white font-semibold text-lg drop-shadow-md">{videoAd.title}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomeScreen;