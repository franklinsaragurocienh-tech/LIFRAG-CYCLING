import React, { useState, useEffect, useRef } from 'react';
import { User, Class, Instructor, Advertisement, ChatThread, Review, Pricing, BankAccount, PaymentRecord, Bike, Reward } from './types';
import { sampleUsers, sampleInstructors, sampleClasses, rewards as initialRewards, sampleAdvertisements, sampleChatThread, pricing, initialBankAccounts, samplePayments, generateBikeLayout } from './constants';
import HomeScreen from './components/HomeScreen';
import BookingScreen from './components/BookingScreen';
import PaymentScreen from './components/PaymentScreen';
import ProfileScreen from './components/ProfileScreen';
import ChatScreen from './components/ChatScreen';
import InstructorProfileScreen from './components/InstructorProfileScreen';
import AdminLoginScreen from './components/AdminLoginScreen';
import AdminDashboardScreen from './components/AdminDashboardScreen';
import BottomNav from './components/BottomNav';
import LoginScreen from './components/LoginScreen';
import CreateAccountScreen from './components/CreateAccountScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import QRScannerScreen from './components/QRScannerScreen';
import SplashScreen from './components/SplashScreen';

type View = 'splash' | 'login' | 'createAccount' | 'forgotPassword' | 'home' | 'booking' | 'payment' | 'profile' | 'chat' | 'instructor' | 'adminLogin' | 'adminDashboard' | 'final' | 'qrScanner';
type NavTab = 'home' | 'chat' | 'profile';

const ADMIN_INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function App() {
  const [view, setView] = useState<View>('splash');
  const [navTab, setNavTab] = useState<NavTab>('home');
  
  const [usersData, setUsersData] = useState<User[]>(sampleUsers);
  const [currentUser, setCurrentUser] = useState<User>(sampleUsers[0]); // Default to first user

  const [instructors, setInstructors] = useState<Instructor[]>(sampleInstructors);
  const [classes, setClasses] = useState<Class[]>(sampleClasses);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(sampleAdvertisements);
  const [chatThread, setChatThread] = useState<ChatThread>(sampleChatThread);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [payments, setPayments] = useState<PaymentRecord[]>(samplePayments);
  const [appPricing, setAppPricing] = useState<Pricing>(pricing);
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const [loginMessage, setLoginMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);
  
  // State for booking flow
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [bookingDetails, setBookingDetails] = useState<{ bikeIds: string[], partySize: number } | null>(null);
  const [finalMessage, setFinalMessage] = useState({ title: '', message: '' });
  
  // Bike layout state
  const [bikes, setBikes] = useState<Bike[]>(() => generateBikeLayout(20));
  
  // Ref for admin inactivity timer
  const adminTimeoutRef = useRef<number | null>(null);

  const resetToHome = () => {
    setView('home');
    setNavTab('home');
    setSelectedClass(null);
    setBookingDetails(null);
    // Reset bike statuses except for maintenance
    setBikes(currentBikes => currentBikes.map(b => b.status === 'maintenance' ? b : { ...b, status: 'available' }));
  };
  
  const handleUserLogin = () => {
    setLoginMessage(null);
    setView('home');
    setNavTab('home');
  };
  
  const handleAccountCreationSuccess = () => {
    setLoginMessage({ type: 'success', text: '¡Cuenta creada! Ya puedes iniciar sesión.' });
    setView('login');
  };
  
  const handlePasswordResetSuccess = () => {
    setLoginMessage({ type: 'info', text: 'Si tu correo existe, recibirás un enlace de recuperación.' });
    setView('login');
  };

  // Admin Inactivity Logout Logic
  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

    const logoutAdmin = () => {
      console.log('Admin session timed out due to inactivity.');
      setView('profile'); 
    };

    const resetTimer = () => {
      if (adminTimeoutRef.current) {
        clearTimeout(adminTimeoutRef.current);
      }
      adminTimeoutRef.current = window.setTimeout(logoutAdmin, ADMIN_INACTIVITY_TIMEOUT);
    };

    if (view === 'adminDashboard') {
      resetTimer(); // Start the timer when admin logs in
      events.forEach(event => window.addEventListener(event, resetTimer));
    }

    // Cleanup function
    return () => {
      if (adminTimeoutRef.current) {
        clearTimeout(adminTimeoutRef.current);
      }
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [view]); // Rerun this effect whenever the view changes

  // Splash screen timer
  useEffect(() => {
    if (view === 'splash') {
      const timer = setTimeout(() => {
        setView('login');
      }, 2500); // Wait 2.5 seconds on splash screen
      return () => clearTimeout(timer);
    }
  }, [view]);

  useEffect(() => {
    if (view === 'final') {
      const timer = setTimeout(() => {
        resetToHome();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handleSelectClass = (cls: Class) => {
    setSelectedClass(cls);
    setView('booking');
  };
  
  const handleSelectInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setView('instructor');
  };

  const handleBookingConfirm = (bikeIds: string[], partySize: number) => {
    setBookingDetails({ bikeIds, partySize });
    setView('payment');
  };

  const handlePaymentSuccess = (message?: string) => {
    setFinalMessage({
      title: '¡Reserva Exitosa!',
      message: message || 'Tu clase ha sido confirmada. ¡Prepárate para pedalear!'
    });
    // Mark bikes as taken
    if(bookingDetails) {
        setBikes(currentBikes => currentBikes.map(b => bookingDetails.bikeIds.includes(b.id) ? {...b, status: 'taken'} : b));
    }
    setView('final');
  };

  const handleNavigate = (tab: NavTab) => {
    setNavTab(tab);
    setView(tab);
  };
  
  const handleSubmitReview = (instructorId: string, review: Review) => {
    setInstructors(prev => prev.map(inst => {
      if (inst.id === instructorId) {
        const newReviews = [...inst.reviews, review];
        const newRating = newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length;
        return { ...inst, reviews: newReviews, rating: parseFloat(newRating.toFixed(1)) };
      }
      return inst;
    }));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsersData(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  
  const handleBikeCountChange = (count: number) => {
    setBikes(generateBikeLayout(count));
  };
  
  const handleBackToLogin = () => {
    setLoginMessage(null);
    setView('login');
  };

  const renderContent = () => {
    switch (view) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <LoginScreen onLoginSuccess={handleUserLogin} onNavigateToCreateAccount={() => setView('createAccount')} onNavigateToForgotPassword={() => setView('forgotPassword')} message={loginMessage} />;
      case 'createAccount':
        return <CreateAccountScreen onBackToLogin={handleBackToLogin} onCreateSuccess={handleAccountCreationSuccess} />;
      case 'forgotPassword':
        return <ForgotPasswordScreen onBackToLogin={handleBackToLogin} onRequestSuccess={handlePasswordResetSuccess} />;
      case 'home':
        return <HomeScreen user={currentUser} classes={classes} instructors={instructors} advertisements={advertisements} onSelectClass={handleSelectClass} onSelectInstructor={handleSelectInstructor} />;
      case 'booking':
        if (selectedClass) {
          const instructor = instructors.find(i => i.id === selectedClass.instructorId);
          if (instructor) {
            // Fix: Added missing onBack prop to BookingScreen.
            return <BookingScreen classInfo={selectedClass} instructor={instructor} pricing={appPricing} bikes={bikes} onBikesChange={setBikes} onBack={() => setView('home')} onConfirm={handleBookingConfirm} />;
          }
        }
        return null; // or some fallback
      case 'payment':
        if (selectedClass && bookingDetails) {
          return <PaymentScreen classInfo={selectedClass} bookingDetails={bookingDetails} pricing={appPricing} bankAccounts={bankAccounts} onBack={() => setView('booking')} onPaymentSuccess={handlePaymentSuccess} />;
        }
        return null; // fallback
      case 'instructor':
        if (selectedInstructor) {
          return <InstructorProfileScreen instructor={selectedInstructor} onBack={() => setView('home')} userName={currentUser.name} onSubmitReview={handleSubmitReview} />;
        }
        return null;
      case 'chat':
        return <ChatScreen thread={chatThread} onThreadChange={setChatThread} />;
      case 'profile':
        return <ProfileScreen user={currentUser} rewards={rewards} onUpdateUser={handleUpdateUser} onNavigateToAdmin={() => setView('adminLogin')} onLogout={() => setView('login')} />;
      case 'adminLogin':
        return <AdminLoginScreen onBack={() => setView('profile')} onLoginSuccess={() => setView('adminDashboard')} />;
      case 'adminDashboard':
        return <AdminDashboardScreen
          instructors={instructors}
          classes={classes}
          payments={payments}
          ads={advertisements}
          pricing={appPricing}
          bankAccounts={bankAccounts}
          bikes={bikes}
          chatThread={chatThread}
          rewards={rewards}
          users={usersData}
          onInstructorsChange={setInstructors}
          onClassesChange={setClasses}
          onPaymentsChange={setPayments}
          onAdsChange={setAdvertisements}
          onPricingChange={setAppPricing}
          onBankAccountsChange={setBankAccounts}
          onBikesChange={setBikes}
          onBikeCountChange={handleBikeCountChange}
          onChatThreadChange={setChatThread}
          onRewardsChange={setRewards}
          onUsersChange={setUsersData}
          onNavigateToQRScanner={() => setView('qrScanner')}
          onExit={() => setView('profile')}
        />;
      case 'qrScanner':
        return <QRScannerScreen onBack={() => setView('adminDashboard')} />;
      case 'final':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-fadeIn">
            <h1 className="text-3xl font-bold mb-4 text-brand-primary">{finalMessage.title}</h1>
            <p className="text-brand-text-secondary">{finalMessage.message}</p>
          </div>
        );
      default:
        return <LoginScreen onLoginSuccess={handleUserLogin} onNavigateToCreateAccount={() => setView('createAccount')} onNavigateToForgotPassword={() => setView('forgotPassword')} />;
    }
  };

  const showNav = ['home', 'chat', 'profile'].includes(view);

  return (
    <div className="bg-brand-dark text-brand-text h-screen w-screen font-sans flex flex-col max-w-lg mx-auto shadow-2xl relative">
      <main className={`flex-grow overflow-y-auto ${showNav ? 'pb-20' : ''}`}>
        {renderContent()}
      </main>
      {showNav && (
        <BottomNav activeTab={navTab} onNavigate={handleNavigate} hasUnreadMessages={chatThread.unread} />
      )}
    </div>
  );
}

export default App;