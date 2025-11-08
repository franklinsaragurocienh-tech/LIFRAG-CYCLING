

import { useState, useEffect, useRef, FC, ReactNode, ChangeEvent, FormEvent } from 'react';
import { Instructor, Class, PaymentRecord, Advertisement, Pricing, BankAccount, Bike, ChatThread, Reward, Message, User } from '../types';
import { 
    LogoutIcon, UserGroupIcon, CalendarDaysIcon, BanknotesIcon, MegaphoneIcon, Cog6ToothIcon, 
    ChatBubbleLeftRightIcon, TrophyIcon, PlusIcon, TrashIcon, PencilIcon, KeyIcon, ArrowPathIcon, CreditCardIcon, BuildingLibraryIcon, PaperAirplaneIcon, TicketIcon, BackIcon, QrCodeIcon, MagnifyingGlassIcon
} from './Icons';

// Helper component for section titles
const SectionTitle: FC<{ children: ReactNode }> = ({ children }) => (
  <h2 className="text-xl font-bold mb-4 text-brand-primary border-b border-brand-gray pb-2">{children}</h2>
);

// Component to manage a single editable item
const EditableItem: FC<{
    item: any;
    fields: { key: string; label: string; type: string; options?: any[] }[];
    onSave: (item: any) => void;
    onDelete: (id: any) => void;
}> = ({ item, fields, onSave, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedItem, setEditedItem] = useState(item);

    useEffect(() => {
        setEditedItem(item);
    }, [item]);

    const handleSave = () => {
        onSave(editedItem);
        setIsEditing(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedItem((prev: any) => ({ ...prev, [name]: value }));
    };

    if (isEditing) {
        return (
            <div className="bg-brand-gray p-4 rounded-xl mb-3 space-y-3">
                {fields.map(field => (
                    <div key={field.key}>
                        <label className="text-sm text-brand-text-secondary">{field.label}</label>
                        {field.type === 'textarea' ? (
                             <textarea
                                name={field.key}
                                value={editedItem[field.key]}
                                onChange={handleChange}
                                className="form-input"
                                rows={3}
                            />
                        ) : field.type === 'select' ? (
                            <select name={field.key} value={editedItem[field.key]} onChange={handleChange} className="form-input">
                                {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                name={field.key}
                                value={editedItem[field.key]}
                                onChange={handleChange}
                                className="form-input"
                            />
                        )}
                    </div>
                ))}
                <div className="flex gap-2 justify-end">
                    <button onClick={() => setIsEditing(false)} className="bg-brand-dark text-white py-2 px-4 rounded-lg text-sm">Cancelar</button>
                    <button onClick={handleSave} className="bg-brand-primary text-brand-dark font-bold py-2 px-4 rounded-lg text-sm">Guardar</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-brand-gray p-4 rounded-xl mb-3 flex justify-between items-center">
            <div>
                 {Object.entries(item).map(([key, value]) => {
                    if (key === 'id' || key === 'reviews') return null;
                    if (key === 'avatarUrl' || key === 'mediaUrl' || key === 'thumbnailUrl') {
                        return <img key={key} src={value as string} className="w-10 h-10 rounded-md object-cover inline-block mr-2"/>
                    }
                    return <p key={key} className="text-sm"><strong className="capitalize text-brand-text-secondary">{key}:</strong> {String(value)}</p>
                })}
            </div>
            <div className="flex gap-2">
                <button onClick={() => setIsEditing(true)} className="p-2 text-brand-text-secondary hover:text-brand-primary"><PencilIcon className="w-5 h-5"/></button>
                <button onClick={() => onDelete(item.id)} className="p-2 text-brand-text-secondary hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
            </div>
        </div>
    );
};

const InstructorEditorCard: FC<{
  instructor: Instructor;
  onSave: (instructor: Instructor) => void;
  onDelete: (id: string) => void;
}> = ({ instructor, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInstructor, setEditedInstructor] = useState<Instructor>(instructor);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedInstructor(instructor);
  }, [instructor]);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedInstructor(prev => ({...prev, [name]: value}));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64Url = loadEvent.target?.result as string;
        setEditedInstructor(prev => ({...prev, avatarUrl: base64Url}));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editedInstructor);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedInstructor(instructor);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${instructor.name}?`)) {
        onDelete(instructor.id);
    }
  }

  if (isEditing) {
    return (
      <div className="bg-brand-gray p-4 rounded-xl mb-3 space-y-3">
        <div className="flex items-center gap-4">
          <img src={editedInstructor.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover"/>
          <div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }}/>
            <button onClick={() => fileInputRef.current?.click()} className="bg-brand-dark text-white py-2 px-3 rounded-lg text-sm">Cambiar Foto</button>
            <p className="text-xs text-brand-text-secondary mt-1">Sube una nueva imagen.</p>
          </div>
        </div>
        <div>
          <label className="text-sm text-brand-text-secondary">Nombre</label>
          <input type="text" name="name" value={editedInstructor.name} onChange={handleInputChange} className="form-input"/>
        </div>
        <div>
          <label className="text-sm text-brand-text-secondary">Biografía</label>
          <textarea name="bio" value={editedInstructor.bio} onChange={handleInputChange} className="form-input" rows={3}/>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={handleCancel} className="bg-brand-dark text-white py-2 px-4 rounded-lg text-sm">Cancelar</button>
          <button onClick={handleSave} className="bg-brand-primary text-brand-dark font-bold py-2 px-4 rounded-lg text-sm">Guardar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-gray p-4 rounded-xl mb-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <img src={instructor.avatarUrl} alt={instructor.name} className="w-12 h-12 rounded-full object-cover" />
        <div>
            <p className="font-bold">{instructor.name}</p>
            <p className="text-sm text-brand-text-secondary truncate w-64">{instructor.bio}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setIsEditing(true)} className="p-2 text-brand-text-secondary hover:text-brand-primary"><PencilIcon className="w-5 h-5"/></button>
        <button onClick={handleDeleteClick} className="p-2 text-brand-text-secondary hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
      </div>
    </div>
  );
};


// Manager for Instructors
const InstructorsManager: FC<{ instructors: Instructor[], onInstructorsChange: (i: Instructor[]) => void }> = ({ instructors, onInstructorsChange }) => {
    const handleSave = (updated: Instructor) => onInstructorsChange(instructors.map(i => i.id === updated.id ? updated : i));
    const handleDelete = (id: string) => onInstructorsChange(instructors.filter(i => i.id !== id));
    const handleAdd = () => {
        const newInstructor: Instructor = { id: `instr-${Date.now()}`, name: 'Nuevo Instructor', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80', bio: 'Nueva biografía.', rating: 0, reviews: [] };
        onInstructorsChange([...instructors, newInstructor]);
    };
    return (
        <div>
            <SectionTitle>Gestionar Instructores</SectionTitle>
            {instructors.map(inst => <InstructorEditorCard key={inst.id} instructor={inst} onSave={handleSave} onDelete={handleDelete} />)}
            <button onClick={handleAdd} className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-primary text-brand-dark font-bold py-2 px-4 rounded-lg"><PlusIcon className="w-5 h-5"/> Añadir Instructor</button>
        </div>
    );
};

// Manager for Classes
const ClassesManager: FC<{ classes: Class[], instructors: Instructor[], onClassesChange: (c: Class[]) => void }> = ({ classes, instructors, onClassesChange }) => {
    const handleSave = (updated: Class) => onClassesChange(classes.map(c => c.id === updated.id ? updated : c));
    const handleDelete = (id: number) => onClassesChange(classes.filter(c => c.id !== id));
    const handleAdd = () => {
        const newClass: Class = { id: Date.now(), name: 'Nueva Clase', instructorId: instructors[0]?.id || '', time: '08:00 AM', duration: 45, spotsLeft: 20 };
        onClassesChange([...classes, newClass]);
    };

    const instructorOptions = instructors.map(i => ({ value: i.id, label: i.name }));

    return (
        <div>
            <SectionTitle>Gestionar Clases</SectionTitle>
            {classes.map(cls => <EditableItem key={cls.id} item={cls} fields={[
                { key: 'name', label: 'Nombre', type: 'text' },
                { key: 'instructorId', label: 'Instructor', type: 'select', options: instructorOptions },
                { key: 'time', label: 'Hora', type: 'text' },
                { key: 'duration', label: 'Duración (min)', type: 'number' },
                { key: 'spotsLeft', label: 'Cupos', type: 'number' },
            ]} onSave={handleSave} onDelete={handleDelete} />)}
            <button onClick={handleAdd} className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-primary text-brand-dark font-bold py-2 px-4 rounded-lg"><PlusIcon className="w-5 h-5"/> Añadir Clase</button>
        </div>
    );
};

// Manager for Ads
const AdsManager: FC<{ ads: Advertisement[], onAdsChange: (a: Advertisement[]) => void }> = ({ ads, onAdsChange }) => {
    const handleSave = (updated: Advertisement) => onAdsChange(ads.map(ad => ad.id === updated.id ? updated : ad));
    const handleDelete = (id: number) => onAdsChange(ads.filter(ad => ad.id !== id));
    const handleAdd = () => {
        const newAd: Advertisement = { id: Date.now(), title: 'Nuevo Anuncio', type: 'image', mediaUrl: '', thumbnailUrl: '' };
        onAdsChange([...ads, newAd]);
    };
    return (
        <div>
            <SectionTitle>Gestionar Anuncios</SectionTitle>
            {ads.map(ad => <EditableItem key={ad.id} item={ad} fields={[
                { key: 'title', label: 'Título', type: 'text' },
                { key: 'type', label: 'Tipo', type: 'select', options: [{value: 'image', label: 'Imagen'}, {value: 'video', label: 'Video'}] },
                { key: 'mediaUrl', label: 'URL de Media', type: 'text' },
                { key: 'thumbnailUrl', label: 'URL de Miniatura (para videos)', type: 'text' },
            ]} onSave={handleSave} onDelete={handleDelete} />)}
            <button onClick={handleAdd} className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-primary text-brand-dark font-bold py-2 px-4 rounded-lg"><PlusIcon className="w-5 h-5"/> Añadir Anuncio</button>
        </div>
    );
};

// Manager for Rewards
const RewardsManager: FC<{ rewards: Reward[], onRewardsChange: (r: Reward[]) => void }> = ({ rewards, onRewardsChange }) => {
    const handleSave = (updated: Reward) => onRewardsChange(rewards.map(r => r.id === updated.id ? updated : r));
    const handleDelete = (id: number) => onRewardsChange(rewards.filter(r => r.id !== id));
    const handleAdd = () => {
        const newReward: Reward = { id: Date.now(), title: 'Nueva Recompensa', description: 'Descripción', requiredClasses: 100 };
        onRewardsChange([...rewards, newReward]);
    };
    return (
        <div>
            <SectionTitle>Gestionar Recompensas</SectionTitle>
            {rewards.map(reward => <EditableItem key={reward.id} item={reward} fields={[
                { key: 'title', label: 'Título', type: 'text' },
                { key: 'description', label: 'Descripción', type: 'text' },
                { key: 'requiredClasses', label: 'Clases Requeridas', type: 'number' },
            ]} onSave={handleSave} onDelete={handleDelete} />)}
             <button onClick={handleAdd} className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-primary text-brand-dark font-bold py-2 px-4 rounded-lg"><PlusIcon className="w-5 h-5"/> Añadir Recompensa</button>
        </div>
    );
};

// Manager for Users/Clients
const UsersManager: FC<{ users: User[], onUsersChange: (u: User[]) => void }> = ({ users, onUsersChange }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (userId: string) => {
        const userToDelete = users.find(u => u.id === userId);
        if (window.confirm(`¿Estás seguro de que quieres eliminar la cuenta de ${userToDelete?.name}?`)) {
            onUsersChange(users.filter(u => u.id !== userId));
        }
    };
    
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <SectionTitle>Gestionar Clientes</SectionTitle>
            
            <div className="relative mb-4">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary" />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre o email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input pl-10"
                />
            </div>

            <div className="space-y-3">
                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                    <div key={user.id} className="bg-brand-gray p-3 rounded-xl flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-xs text-brand-text-secondary">{user.email}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(user.id)} className="p-2 text-brand-text-secondary hover:text-red-400">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                )) : (
                  <p className="text-center text-brand-text-secondary py-4">No se encontraron clientes.</p>
                )}
            </div>
        </div>
    );
};


// Manager for Config
const ConfigManager: FC<Pick<AdminDashboardScreenProps, 
    'pricing' | 'onPricingChange' | 'bankAccounts' | 'onBankAccountsChange' | 'bikes' | 'onBikesChange' | 'onBikeCountChange'
>> = (props) => {
    const [tempPricing, setTempPricing] = useState(props.pricing);
    const [bikeCount, setBikeCount] = useState(props.bikes.length);

    const handlePricingChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTempPricing(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
    };
    
    const handleBA_Save = (updated: BankAccount) => props.onBankAccountsChange(props.bankAccounts.map(ba => ba.id === updated.id ? updated : ba));
    const handleBA_Delete = (id: number) => props.onBankAccountsChange(props.bankAccounts.filter(ba => ba.id !== id));
    const handleBA_Add = () => {
        const newBA: BankAccount = { id: Date.now(), bankName: 'Nuevo Banco', identificationType: 'ruc', identificationNumber: '', accountType: 'corriente', accountNumber: '' };
        props.onBankAccountsChange([...props.bankAccounts, newBA]);
    };
    
    const toggleBikeMaintenance = (bikeId: string) => {
        const updatedBikes: Bike[] = props.bikes.map(b => {
            if (b.id === bikeId) {
                return { ...b, status: b.status === 'maintenance' ? 'available' : 'maintenance' };
            }
            return b;
        });
        props.onBikesChange(updatedBikes);
    };

    return (
        <div className="space-y-8">
            <div>
                <SectionTitle>Precios</SectionTitle>
                <div className="bg-brand-gray p-4 rounded-xl space-y-3">
                    <div>
                        <label className="text-sm text-brand-text-secondary">Individual ($)</label>
                        <input type="number" name="individual" value={tempPricing.individual} onChange={handlePricingChange} className="form-input" />
                    </div>
                     <div>
                        <label className="text-sm text-brand-text-secondary">Grupo de 2 (por persona, $)</label>
                        <input type="number" name="group2" value={tempPricing.group2} onChange={handlePricingChange} className="form-input" />
                    </div>
                     <div>
                        <label className="text-sm text-brand-text-secondary">Grupo de 3 (por persona, $)</label>
                        <input type="number" name="group3" value={tempPricing.group3} onChange={handlePricingChange} className="form-input" />
                    </div>
                    <button onClick={() => props.onPricingChange(tempPricing)} className="w-full bg-brand-primary text-brand-dark font-bold py-2 px-4 rounded-lg text-sm">Guardar Precios</button>
                </div>
            </div>
            <div>
                <SectionTitle>Cuentas Bancarias</SectionTitle>
                {props.bankAccounts.map(ba => <EditableItem key={ba.id} item={ba} fields={[
                    { key: 'bankName', label: 'Nombre del Banco', type: 'text' },
                    { key: 'identificationType', label: 'Tipo ID', type: 'select', options: [{value: 'ruc', label: 'RUC'}, {value: 'cédula', label: 'Cédula'}] },
                    { key: 'identificationNumber', label: 'Número ID', type: 'text' },
                    { key: 'accountType', label: 'Tipo Cuenta', type: 'select', options: [{value: 'corriente', label: 'Corriente'}, {value: 'ahorro', label: 'Ahorro'}] },
                    { key: 'accountNumber', label: 'Número Cuenta', type: 'text' },
                ]} onSave={handleBA_Save} onDelete={handleBA_Delete} />)}
                <button onClick={handleBA_Add} className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-primary text-brand-dark font-bold py-2 px-4 rounded-lg"><PlusIcon className="w-5 h-5"/> Añadir Cuenta</button>
            </div>
             <div>
                <SectionTitle>Bicicletas</SectionTitle>
                <div className="bg-brand-gray p-4 rounded-xl">
                    <label className="text-sm text-brand-text-secondary">Número Total de Bicis</label>
                    <div className="flex gap-2">
                        <input type="number" value={bikeCount} onChange={e => setBikeCount(Number(e.target.value))} className="form-input" />
                        <button onClick={() => props.onBikeCountChange(bikeCount)} className="bg-brand-primary text-brand-dark font-bold py-2 px-4 rounded-lg text-sm">Actualizar</button>
                    </div>
                     <h3 className="text-md font-semibold mt-4 mb-2">Estado de Mantenimiento</h3>
                     <div className="grid grid-cols-5 gap-2">
                         {props.bikes.map(bike => (
                             <button key={bike.id} onClick={() => toggleBikeMaintenance(bike.id)}
                                 className={`p-2 rounded-md text-center font-mono ${bike.status === 'maintenance' ? 'bg-red-500 text-white' : 'bg-brand-dark'}`}>
                                 {bike.id}
                             </button>
                         ))}
                     </div>
                </div>
            </div>
        </div>
    );
};

const PaymentsViewer: FC<{ payments: PaymentRecord[], title: string, onBack?: () => void, onAcceptPayment?: (paymentId: string) => void }> = ({ payments, title, onBack, onAcceptPayment }) => (
    <div>
        <div className="flex items-center mb-4">
             {onBack && (
                <button onClick={onBack} className="p-2 -ml-2 mr-4">
                    <BackIcon className="w-6 h-6"/>
                </button>
             )}
            <SectionTitle>{title}</SectionTitle>
        </div>
        <div className="space-y-3">
        {payments.length > 0 ? payments.map(p => (
            <div key={p.id} className="bg-brand-gray p-4 rounded-xl">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold">{p.userName}</p>
                        <p className="text-sm text-brand-text-secondary">{p.className} - {p.date}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg">${p.amount.toFixed(2)}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            p.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                        }`}>{p.status}</span>
                    </div>
                </div>
                 {p.status === 'pending' && onAcceptPayment && (
                    <div className="mt-3 border-t border-brand-light-dark pt-3">
                        <button 
                            onClick={() => onAcceptPayment(p.id)}
                            className="w-full bg-green-500 text-white font-bold py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
                        >
                            Aceptar Pago
                        </button>
                    </div>
                )}
            </div>
        )) : <p className="text-center text-brand-text-secondary py-4">No hay pagos que mostrar.</p>}
        </div>
    </div>
);

const ChatManager: FC<{ thread: ChatThread, onThreadChange: (t: ChatThread) => void }> = ({ thread, onThreadChange }) => {
    const [reply, setReply] = useState('');
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [thread.messages]);

    const handleSend = () => {
        if (!reply.trim()) return;
        const newMessage: Message = { id: `m-admin-${Date.now()}`, sender: 'admin', text: reply, timestamp: new Date() };
        const updatedThread = { ...thread, messages: [...thread.messages, newMessage], unread: false };
        onThreadChange(updatedThread);
        setReply('');
    };
    
    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSend();
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

        <div className="h-[70vh] flex flex-col bg-brand-dark rounded-xl overflow-hidden shadow-2xl">
            {/* Chat Header */}
            <div className="bg-brand-gray p-3 flex items-center shadow-md z-10">
                <p className="font-bold text-lg text-brand-text">{thread.userName}</p>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 bg-brand-dark space-y-4">
                {thread.messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-2 rounded-xl text-sm break-words relative ${
                        msg.sender === 'admin' 
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
                        <p>{msg.text}</p>
                        <span className="text-xs opacity-70 float-right mt-1 ml-2">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleFormSubmit} className="bg-brand-gray p-3 flex items-center gap-2">
                 <input 
                    type="text" 
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Escribe una respuesta..."
                    className="flex-grow bg-brand-dark rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                />
                <button type="submit" className="p-3 bg-brand-primary rounded-full hover:bg-opacity-90 transition-opacity disabled:opacity-50" disabled={!reply.trim()}>
                    <PaperAirplaneIcon className="w-5 h-5 text-brand-dark"/>
                </button>
            </form>
        </div>
      </>
    );
};

const PasswordManager: FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (currentPassword !== 'admin123') {
            setError('La contraseña actual es incorrecta.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Las nuevas contraseñas no coinciden.');
            return;
        }
        if (newPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        // In a real app, you would make an API call here.
        // For this example, we'll just simulate success.
        console.log('Password changed successfully!');
        setSuccess('¡Contraseña actualizada correctamente!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div>
            <SectionTitle>Cambiar Contraseña</SectionTitle>
            <form onSubmit={handleSubmit} className="bg-brand-gray p-4 rounded-xl space-y-4">
                <div>
                    <label className="text-sm text-brand-text-secondary">Contraseña Actual</label>
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="form-input" required />
                </div>
                <div>
                    <label className="text-sm text-brand-text-secondary">Nueva Contraseña</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="form-input" required />
                </div>
                <div>
                    <label className="text-sm text-brand-text-secondary">Confirmar Nueva Contraseña</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="form-input" required />
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                {success && <p className="text-green-400 text-sm text-center">{success}</p>}
                <button type="submit" className="w-full bg-brand-primary text-brand-dark font-bold py-2 px-4 rounded-lg">
                    Actualizar Contraseña
                </button>
            </form>
        </div>
    );
};

const OccupiedBikesViewer: FC<{ bikes: Bike[], onBack: () => void }> = ({ bikes, onBack }) => {
    const occupiedBikes = bikes.filter(b => b.status === 'taken');

    return (
        <div>
            <div className="flex items-center mb-4">
                <button onClick={onBack} className="p-2 -ml-2 mr-4">
                    <BackIcon className="w-6 h-6"/>
                </button>
                <SectionTitle>Bicicletas Ocupadas</SectionTitle>
            </div>
            {occupiedBikes.length > 0 ? (
                <div className="grid grid-cols-5 gap-2 bg-brand-gray p-4 rounded-xl">
                    {occupiedBikes.map(bike => (
                        <div key={bike.id} className="p-3 rounded-md text-center font-mono bg-brand-primary text-brand-dark">
                            {bike.id}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-brand-text-secondary py-4 bg-brand-gray rounded-xl">No hay bicicletas ocupadas en este momento.</p>
            )}
        </div>
    );
};

interface AdminDashboardScreenProps {
  instructors: Instructor[];
  classes: Class[];
  payments: PaymentRecord[];
  ads: Advertisement[];
  pricing: Pricing;
  bankAccounts: BankAccount[];
  bikes: Bike[];
  chatThread: ChatThread;
  rewards: Reward[];
  users: User[];
  onInstructorsChange: (instructors: Instructor[]) => void;
  onClassesChange: (classes: Class[]) => void;
  onPaymentsChange: (payments: PaymentRecord[]) => void;
  onAdsChange: (ads: Advertisement[]) => void;
  onPricingChange: (pricing: Pricing) => void;
  onBankAccountsChange: (accounts: BankAccount[]) => void;
  onBikesChange: (bikes: Bike[]) => void;
  onBikeCountChange: (count: number) => void;
  onChatThreadChange: (thread: ChatThread) => void;
  onRewardsChange: (rewards: Reward[]) => void;
  onUsersChange: (users: User[]) => void;
  onNavigateToQRScanner: () => void;
  onExit: () => void;
}

type AdminTab = 'instructors' | 'classes' | 'payments' | 'ads' | 'config' | 'chat' | 'rewards' | 'security' | 'users';
type AdminView = 'dashboard' | 'todaysIncome' | 'pendingReservations' | 'occupiedBikes';

const AdminDashboardScreen: FC<AdminDashboardScreenProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [view, setView] = useState<AdminView>('dashboard');

  useEffect(() => {
    // Mark chat as read when opening the chat tab
    if(activeTab === 'chat' && props.chatThread.unread) {
        props.onChatThreadChange({...props.chatThread, unread: false});
    }
  }, [activeTab, props.chatThread.unread]);

  const tabs: { id: AdminTab; label: string; icon: FC<any> }[] = [
    { id: 'users', label: 'Clientes', icon: UserGroupIcon },
    { id: 'instructors', label: 'Instructores', icon: UserGroupIcon },
    { id: 'classes', label: 'Clases', icon: CalendarDaysIcon },
    { id: 'payments', label: 'Pagos', icon: BanknotesIcon },
    { id: 'ads', label: 'Anuncios', icon: MegaphoneIcon },
    { id: 'rewards', label: 'Recompensas', icon: TrophyIcon },
    { id: 'chat', label: 'Chat', icon: ChatBubbleLeftRightIcon },
    { id: 'config', label: 'Config', icon: Cog6ToothIcon },
    { id: 'security', label: 'Seguridad', icon: KeyIcon },
  ];
  
  const handleAcceptPayment = (paymentId: string) => {
    const updatedPayments = props.payments.map(p => 
        p.id === paymentId ? { ...p, status: 'completed' as const } : p
    );
    props.onPaymentsChange(updatedPayments);
  };

  const renderContent = () => {
    switch (activeTab) {
        case 'users': return <UsersManager users={props.users} onUsersChange={props.onUsersChange} />;
        case 'instructors': return <InstructorsManager instructors={props.instructors} onInstructorsChange={props.onInstructorsChange} />;
        case 'classes': return <ClassesManager classes={props.classes} instructors={props.instructors} onClassesChange={props.onClassesChange} />;
        case 'ads': return <AdsManager ads={props.ads} onAdsChange={props.onAdsChange} />;
        case 'rewards': return <RewardsManager rewards={props.rewards} onRewardsChange={props.onRewardsChange} />;
        case 'payments': return <PaymentsViewer payments={props.payments} title="Historial de Pagos Completo" />;
        case 'chat': return <ChatManager thread={props.chatThread} onThreadChange={props.onChatThreadChange} />;
        case 'config': return <ConfigManager {...props} />;
        case 'security': return <PasswordManager />;
        default: return null;
    }
  };
  
    const today = new Date().toISOString().split('T')[0];
    const todaysPayments = props.payments.filter(p => p.date === today && p.status === 'completed');
    const todaysRevenue = todaysPayments.reduce((sum, p) => sum + p.amount, 0);
    const pendingReservations = props.payments.filter(p => p.status === 'pending').length;
    const bikesInUse = props.bikes.filter(b => b.status === 'taken').length;

    if (view === 'todaysIncome') {
        return (
            <div className="p-6 animate-fadeIn h-full flex flex-col bg-brand-dark">
                 <PaymentsViewer 
                    payments={todaysPayments} 
                    title="Ingresos de Hoy"
                    onBack={() => setView('dashboard')}
                />
            </div>
        );
    }
    
    if (view === 'pendingReservations') {
        const pendingPayments = props.payments.filter(p => p.status === 'pending');
        return (
            <div className="p-6 animate-fadeIn h-full flex flex-col bg-brand-dark">
                 <PaymentsViewer 
                    payments={pendingPayments} 
                    title="Reservas Pendientes"
                    onBack={() => setView('dashboard')}
                    onAcceptPayment={handleAcceptPayment}
                />
            </div>
        );
    }

    if (view === 'occupiedBikes') {
        return (
            <div className="p-6 animate-fadeIn h-full flex flex-col bg-brand-dark">
                 <OccupiedBikesViewer
                    bikes={props.bikes}
                    onBack={() => setView('dashboard')}
                />
            </div>
        );
    }


  return (
    <div className="p-6 animate-fadeIn h-full flex flex-col bg-brand-dark">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Panel de Admin</h1>
        <button onClick={props.onExit} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-semibold">
          <LogoutIcon className="w-6 h-6" />
          Salir
        </button>
      </header>

      {/* Today's Statistics */}
      <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-brand-text-secondary">Estadísticas de Hoy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Revenue */}
              <button 
                onClick={() => setView('todaysIncome')}
                className="bg-brand-gray p-4 rounded-xl flex items-center text-left hover:bg-brand-light-dark transition-colors"
              >
                  <div className="p-3 rounded-full bg-green-500/20 mr-4">
                      <BanknotesIcon className="w-6 h-6 text-green-400"/>
                  </div>
                  <div>
                      <p className="text-sm text-brand-text-secondary">Ingresos de Hoy</p>
                      <p className="text-2xl font-bold">${todaysRevenue.toFixed(2)}</p>
                  </div>
              </button>
              {/* Pending */}
              <button 
                onClick={() => setView('pendingReservations')}
                className="bg-brand-gray p-4 rounded-xl flex items-center text-left hover:bg-brand-light-dark transition-colors"
              >
                   <div className="p-3 rounded-full bg-yellow-500/20 mr-4">
                      <TicketIcon className="w-6 h-6 text-yellow-400"/>
                  </div>
                  <div>
                      <p className="text-sm text-brand-text-secondary">Reservas Pendientes</p>
                      <p className="text-2xl font-bold">{pendingReservations}</p>
                  </div>
              </button>
              {/* Bikes in use */}
              <button 
                onClick={() => setView('occupiedBikes')}
                className="bg-brand-gray p-4 rounded-xl flex items-center text-left hover:bg-brand-light-dark transition-colors"
              >
                   <div className="p-3 rounded-full bg-blue-500/20 mr-4">
                      <Cog6ToothIcon className="w-6 h-6 text-blue-400"/>
                  </div>
                  <div>
                      <p className="text-sm text-brand-text-secondary">Bicicletas Ocupadas</p>
                      <p className="text-2xl font-bold">{bikesInUse}</p>
                  </div>
              </button>
          </div>
      </section>

      {/* New QR Scanner Button */}
      <section className="mb-6">
          <button
              onClick={props.onNavigateToQRScanner}
              className="w-full bg-brand-light-dark p-4 rounded-xl flex items-center justify-center text-left hover:bg-brand-gray transition-colors font-semibold"
          >
              <QrCodeIcon className="w-6 h-6 mr-3 text-brand-primary"/>
              Escanear QR para Check-in
          </button>
      </section>


      <div className="mb-6 border-b border-brand-gray">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto -mb-px pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-2 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex items-center gap-2 relative ${
                activeTab === tab.id
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-brand-text-secondary hover:text-brand-text hover:border-brand-light-dark'
              }`}
            >
              {tab.id === 'chat' && props.chatThread.unread && (
                  <span className="absolute top-2 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
              <tab.icon className="w-5 h-5"/>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="flex-grow overflow-y-auto pr-2">
         {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboardScreen;