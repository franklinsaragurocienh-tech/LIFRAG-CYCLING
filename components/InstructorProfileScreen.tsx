


import React, { useState } from 'react';
import { Instructor, Review } from '../types';
import { BackIcon, StarIcon } from './Icons';

interface InstructorProfileScreenProps {
  instructor: Instructor;
  onBack: () => void;
  userName: string;
  onSubmitReview: (instructorId: string, review: Review) => void;
}

const InstructorProfileScreen: React.FC<InstructorProfileScreenProps> = ({ instructor, onBack, userName, onSubmitReview }) => {
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = () => {
    if (newRating === 0) return;
    const review: Review = {
      userName,
      rating: newRating,
      comment: newComment,
    };
    onSubmitReview(instructor.id, review);
    setSubmitted(true);
    setTimeout(() => {
        setNewRating(0);
        setNewComment('');
        setHoverRating(0);
        setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="p-6 animate-fadeIn">
      <header className="flex items-center mb-6 relative">
        <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
            <BackIcon className="w-6 h-6 text-brand-text"/>
        </button>
        <h1 className="text-2xl font-bold text-center w-full">Perfil de Instructor</h1>
      </header>

      <div className="text-center mb-6">
        <img src={instructor.avatarUrl} alt={instructor.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-brand-primary" />
        <h2 className="text-2xl font-bold">{instructor.name}</h2>
        <div className="flex items-center justify-center text-lg text-yellow-400 mt-1">
            <StarIcon className="w-5 h-5 mr-1"/>
            <span>{instructor.rating}</span>
        </div>
      </div>
      
      <div className="bg-brand-gray p-4 rounded-xl mb-6">
        <h3 className="font-bold mb-2">Sobre mí</h3>
        <p className="text-brand-text-secondary">{instructor.bio}</p>
      </div>

      <section className="bg-brand-gray p-4 rounded-xl mb-6">
        {submitted ? (
            <div className="text-center py-8">
                <p className="font-semibold text-brand-primary">¡Gracias por tu reseña!</p>
                <p className="text-sm text-brand-text-secondary">Tu opinión nos ayuda a mejorar.</p>
            </div>
        ) : (
          <>
            <h3 className="font-bold mb-4 text-center">Deja tu Reseña</h3>
            <div className="flex justify-center mb-4" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => setNewRating(star)}
                  className="p-1"
                >
                  <StarIcon className={`w-8 h-8 transition-colors ${ (hoverRating || newRating) >= star ? 'text-brand-primary' : 'text-brand-text-secondary'}`} />
                </button>
              ))}
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario (opcional)..."
              className="w-full bg-brand-dark border border-brand-gray rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              rows={3}
            />
            <button 
                onClick={handleSubmitReview}
                disabled={newRating === 0}
                className="w-full mt-4 bg-brand-primary text-brand-dark font-bold py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
                Enviar Calificación
            </button>
          </>
        )}
      </section>

       <div>
        <h3 className="text-xl font-bold mb-4">Reseñas ({instructor.reviews.length})</h3>
        <div className="space-y-4">
          {instructor.reviews.length > 0 ? instructor.reviews.map((review, index) => (
            <div key={index} className="bg-brand-gray p-4 rounded-xl">
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold">{review.userName}</p>
                <div className="flex items-center text-sm text-yellow-400">
                  <StarIcon className="w-4 h-4 mr-1"/>
                  <span>{review.rating}</span>
                </div>
              </div>
              <p className="text-brand-text-secondary text-sm">{review.comment}</p>
            </div>
          )) : (
            <p className="text-brand-text-secondary text-center py-4">Todavía no hay reseñas para {instructor.name}.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default InstructorProfileScreen;