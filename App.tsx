// FIX: Correctly import React and its hooks. The incorrect 'aistudio' import and the subsequent incorrect destructuring have been removed.
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/admin/AdminPage';
import CreateAdCampaignPage from './components/dashboard/CreateAdCampaignPage';
import { Theme, User, DashboardView } from './types';
import { initialDb } from './data/mockData';

// This App component now holds the entire application's "database" in its state.
// This simulates a backend and allows all components to interact with the same data source.
const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });

  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'auth' | 'admin_panel' | 'create_ad_campaign' | 'search' | 'messages'>('home');
  const [isLoading, setIsLoading] = useState(true);
  
  // Entire application database state
  const [db, setDb] = useState(initialDb);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    setTimeout(() => {
        setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    const userFromDb = db.users.find(u => u.uid === loggedInUser.uid || u.email?.toLowerCase() === loggedInUser.email?.toLowerCase());
    if (userFromDb) {
      setUser(userFromDb);
      if (userFromDb.type === 'admin') {
        setCurrentPage('admin_panel');
      } else {
        setCurrentPage('dashboard');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const navigateTo = (page: 'home' | 'dashboard' | 'auth' | 'admin_panel' | 'create_ad_campaign' | 'search' | 'messages') => {
    if ((page === 'dashboard' || page === 'admin_panel' || page === 'create_ad_campaign' || page === 'search' || page === 'messages') && !user) {
        setCurrentPage('auth');
    } else {
        setCurrentPage(page);
    }
  };
  
  const renderPage = () => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-800 dark:text-gray-200">
                <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-xl">جاري التحميل...</p>
            </div>
        );
    }

    const getInitialViewForDashboard = (): DashboardView => {
        if (currentPage === 'search') return 'search';
        if (currentPage === 'messages') return 'messages';
        return 'home';
    }

    switch (currentPage) {
      case 'dashboard':
      case 'search':
      case 'messages':
        return user ? (
            <DashboardPage 
                user={user} 
                db={db}
                setDb={setDb}
                onLogout={handleLogout}
                initialView={getInitialViewForDashboard()}
            />
        ) : <AuthPage onLogin={handleLogin} users={db.users} />;
      case 'auth':
        return <AuthPage onLogin={handleLogin} users={db.users} />;
      case 'admin_panel':
        return user?.type === 'admin' ? (
            <AdminPage user={user} db={db} setDb={setDb} onLogout={handleLogout} />
        ) : <HomePage onNavigateToAuth={() => setCurrentPage('auth')} />;
      case 'create_ad_campaign':
         return user ? (
            <CreateAdCampaignPage user={user} db={db} setDb={setDb} onBack={() => navigateTo('dashboard')} />
        ) : <AuthPage onLogin={handleLogin} users={db.users} />;
      case 'home':
      default:
        return <HomePage onNavigateToAuth={() => setCurrentPage('auth')} />;
    }
  };
  
  const userNotifications = user ? db.notifications.filter(n => n.userId === user.uid).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : [];
  
  // Admin panel and Auth page are full-screen
  if (currentPage === 'admin_panel' || currentPage === 'auth') {
    return <div className="h-screen bg-gray-50 dark:bg-gray-900">{renderPage()}</div>;
  }

  const showFooter = !user || (currentPage !== 'dashboard' && currentPage !== 'create_ad_campaign' && currentPage !== 'search' && currentPage !== 'messages');


  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header
        user={user}
        navigateTo={navigateTo}
        currentPage={currentPage}
        theme={theme}
        toggleTheme={toggleTheme}
        notifications={userNotifications}
      />
      <main className="flex-grow flex flex-col overflow-y-auto">
        {renderPage()}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default App;