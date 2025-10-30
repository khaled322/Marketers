import React from 'react';
import { Sun, Moon, Search, MessageCircle, Plus, Shield, Bell } from 'lucide-react';
import { Theme, User, Notification } from '../types';

interface HeaderProps {
  user: User | null;
  navigateTo: (page: 'home' | 'dashboard' | 'auth' | 'admin_panel' | 'create_ad_campaign' | 'search' | 'messages') => void;
  currentPage: string;
  theme: Theme;
  toggleTheme: () => void;
  notifications: Notification[];
}

const Header: React.FC<HeaderProps> = ({ user, navigateTo, currentPage, theme, toggleTheme, notifications }) => {

  const handleLogoClick = () => {
    if (user) {
      navigateTo('dashboard');
    } else {
      navigateTo('home');
    }
  }
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const isDashboard = ['dashboard', 'search', 'messages'].includes(currentPage);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 onClick={handleLogoClick} className="text-2xl font-bold text-primary-600 dark:text-primary-400 cursor-pointer">
              مركز المسوقين
            </h1>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            {isDashboard && user && (
                <>
                    <button onClick={() => navigateTo('create_ad_campaign')} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Create ad campaign">
                        <Plus size={24} />
                    </button>
                    <button onClick={() => navigateTo('search')} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Search">
                        <Search size={24} />
                    </button>
                    <button onClick={() => navigateTo('messages')} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Messages">
                        <MessageCircle size={24} />
                    </button>
                     <button className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 relative" aria-label="Notifications">
                        <Bell size={24} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                </>
            )}
            {user?.type === 'admin' && (
                 <button onClick={() => navigateTo('admin_panel')} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Admin Panel">
                    <Shield size={24} />
                </button>
            )}
             <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;