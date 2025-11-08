
import React, { useState, useMemo } from 'react';
import { Class, Instructor, Bike, Pricing } from '../types';
import { BackIcon, ClockIcon, Cog6ToothIcon } from './Icons';

interface BookingScreenProps {
  classInfo: Class;
  instructor: Instructor;
  pricing: Pricing;
  bikes: Bike[];
  onBikesChange: (bikes: Bike[]) => void;
  onBack: () => void;
  onConfirm: (bikeIds: string[], partySize: number) => void;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ classInfo, instructor, pricing, bikes, onBikesChange, onBack, onConfirm }) => {
  const [selectedBikes, setSelectedBikes] = useState<string[]>([]);
  
  const handleSelectBike = (bikeId: string) => {
    const bike = bikes.find(b => b.id === bikeId);
    if (!bike || bike.status === 'taken' || bike.status === 'maintenance') return;

    const isSelected = selectedBikes.includes(bikeId);
    let newSelectedBikes = [...selectedBikes];

    if (isSelected) {
      newSelectedBikes = newSelectedBikes.filter(id => id !== bikeId);
    } else {
      if (selectedBikes.length < 3) {
        newSelectedBikes.push(bikeId);
      } else {
        return;
      }
    }
    
    setSelectedBikes(newSelectedBikes);
    
    onBikesChange(
        bikes.map(b => {
            if (b.status === 'taken' || b.status === 'maintenance') return b;
            if (newSelectedBikes.includes(b.id)) {
                return { ...b, status: 'selected' };
            }
            return { ...b, status: 'available' };
        })
    );
  };
  
  const totalPrice = useMemo(() => {
    const count = selectedBikes.length;
    if (count === 1) return pricing.individual;
    if (count === 2) return pricing.group2 * 2;
    if (count === 3) return pricing.group3 * 3;
    return 0;
  }, [selectedBikes, pricing]);

  const partySize = selectedBikes.length;

  const bikeLayout = useMemo(() => {
    const layout = [];
    const bikeIds = bikes.map(b => b.id);
    let i = 0;
    const rowPatterns = [4, 3, 4, 3, 4];
    let patternIndex = 0;
    
    while (i < bikeIds.length) {
      const rowSize = rowPatterns[patternIndex % rowPatterns.length] || 4; // fallback to 4
      layout.push(bikeIds.slice(i, i + rowSize));
      i += rowSize;
      patternIndex++;
    }
    return layout;
  }, [bikes]);


  return (
    <div className="p-6 animate-fadeIn h-full flex flex-col">
      <header className="flex items-center mb-6 relative">
        <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
            <BackIcon className="w-6 h-6 text-brand-text"/>
        </button>
        <h1 className="text-2xl font-bold text-center w-full">Reservar Clase</h1>
      </header>

      <div className="bg-brand-gray p-4 rounded-xl mb-6">
        <h2 className="text-xl font-bold text-brand-primary">{classInfo.name}</h2>
        <p className="text-brand-text-secondary">con {instructor.name}</p>
        <div className="flex items-center text-sm text-brand-text-secondary mt-2">
            <ClockIcon className="w-4 h-4 mr-2" />
            <span>{classInfo.time} - {classInfo.duration} min</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-2">
            <h3 className="font-bold text-lg">Selecciona tus Bicis</h3>
            <span className="text-sm font-medium text-brand-text-secondary">{partySize} / 3 seleccionadas</span>
        </div>
        <div className="bg-brand-gray p-4 rounded-xl">
            <div className="bg-brand-primary text-brand-dark text-center py-1 rounded-md mb-4 font-semibold">Instructor</div>
            <div className="space-y-2 flex flex-col items-center">
              {bikeLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-2">
                  {row.map(bikeId => {
                    const bike = bikes.find(b => b.id === String(bikeId));
                    if (!bike) return <div key={bikeId} className="w-14 h-10" />;

                    const statusClasses = {
                      available: 'bg-brand-dark hover:border-brand-primary',
                      taken: 'bg-brand-text-secondary cursor-not-allowed',
                      selected: 'bg-brand-primary text-brand-dark border-brand-primary',
                      maintenance: 'bg-red-900/50 border-red-500 cursor-not-allowed',
                    };

                    return (
                      <button 
                        key={bike.id} 
                        onClick={() => handleSelectBike(bike.id)} 
                        disabled={bike.status === 'taken' || bike.status === 'maintenance'}
                        className={`w-14 h-10 rounded-md border-2 border-transparent transition-colors flex items-center justify-center font-semibold ${statusClasses[bike.status]}`}
                      >
                        {bike.status === 'maintenance' ? <Cog6ToothIcon className="w-6 h-6 text-red-300"/> : bike.id}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-center mb-4 text-xl">
            <span className="text-brand-text-secondary">Total:</span>
            <span className="font-bold text-2xl">${totalPrice.toFixed(2)}</span>
        </div>
        <button 
          onClick={() => partySize > 0 && onConfirm(selectedBikes, partySize)} 
          disabled={partySize === 0}
          className="w-full bg-brand-primary text-brand-dark font-bold py-4 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {partySize > 0 ? `Confirmar ${partySize} Bici(s)` : 'Selecciona una Bici'}
        </button>
      </div>
    </div>
  );
};

export default BookingScreen;