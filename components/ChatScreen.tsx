
import React, { useState, useRef, useEffect } from 'react';
import { ChatThread, Message } from '../types';
import { PaperAirplaneIcon, PhotoIcon } from './Icons';

interface ChatScreenProps {
  thread: ChatThread;
  onThreadChange: (thread: ChatThread) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ thread, onThreadChange }) => {
  const [newMessage, setNewMessage] = useState('');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Mark as read when component mounts
    if (thread.unread) {
      const timer = setTimeout(() => onThreadChange({ ...thread, unread: false }), 500);
      return () => clearTimeout(timer);
    }
  }, []); // Run only once

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages]);

  const handleSend = (text: string, attachmentUrl?: string) => {
    if (text.trim() === '' && !attachmentUrl) return;

    const message: Message = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date(),
    };

    if (attachmentUrl) {
      message.attachment = { type: 'image', url: attachmentUrl };
    }

    const updatedThread = { ...thread, messages: [...thread.messages, message], unread: false };
    onThreadChange(updatedThread);
    setNewMessage('');
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(newMessage);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64Url = loadEvent.target?.result as string;
        handleSend('', base64Url);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow selecting the same file again
    e.target.value = '';
  };

  return (
    <>
      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center animate-fadeIn"
          onClick={() => setFullscreenImage(null)}
        >
          <img src={fullscreenImage} alt="Fullscreen view" className="max-w-full max-h-full object-contain" />
        </div>
      )}

      <div className="p-6 h-full flex flex-col">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Chat con Admin</h1>
          <p className="text-brand-text-secondary">Resuelve tus dudas directamente con nosotros.</p>
        </header>
        
        <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2">
          {thread.messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-2 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-brand-primary text-brand-dark rounded-br-none' 
                  : 'bg-brand-gray text-brand-text rounded-bl-none'
              }`}>
                {msg.attachment?.url && (
                  <img 
                    src={msg.attachment.url} 
                    alt="Adjunto" 
                    className={`rounded-lg cursor-pointer ${msg.text ? 'mb-2' : ''}`}
                    onClick={() => setFullscreenImage(msg.attachment?.url ?? null)}
                  />
                )}
                {msg.text && <p className="text-sm px-2 py-1">{msg.text}</p>}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleFormSubmit} className="mt-auto flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
          <button type="button" onClick={handleAttachClick} className="p-3 bg-brand-gray rounded-full hover:bg-opacity-80 transition-colors">
            <PhotoIcon className="w-6 h-6 text-brand-text-secondary"/>
          </button>
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-grow bg-brand-gray rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <button type="submit" className="p-3 bg-brand-primary rounded-full hover:bg-opacity-90 transition-opacity disabled:opacity-50" disabled={!newMessage.trim()}>
            <PaperAirplaneIcon className="w-6 h-6 text-brand-dark"/>
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatScreen;