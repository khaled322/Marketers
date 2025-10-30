import React from 'react';
import { Home, ShoppingBag, Briefcase, Bell, Menu as MenuIcon } from 'lucide-react';
import { DashboardView } from '../types';

interface BottomNavBarProps {
    currentView: DashboardView;
    setCurrentView: (view: DashboardView) => void;
    unreadNotifications: number;
    unreadMessages: number;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, setCurrentView, unreadNotifications, unreadMessages }) => {
    const navItems = [
        { view: 'home' as DashboardView, icon: Home, label: 'الرئيسية' },
        { view: 'marketplace' as DashboardView, icon: ShoppingBag, label: 'السوق' },
        { view: 'offers' as DashboardView, icon: Briefcase, label: 'العروض' },
        { view: 'notifications' as DashboardView, icon: Bell, label: 'الإشعارات', badge: unreadNotifications },
        { view: 'menu' as DashboardView, icon: MenuIcon, label: 'القائمة' },
    ];

    const isActive = (view: DashboardView) => {
        if (view === 'menu' && ['settings', 'statistics', 'wallet', 'my_services', 'site_services'].includes(currentView)) {
            return true;
        }
        return currentView === view;
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around h-16 z-40">
            {navItems.map(item => (
                <button 
                    key={item.view} 
                    onClick={() => setCurrentView(item.view)} 
                    className="flex flex-col items-center justify-center w-full text-gray-500 dark:text-gray-400"
                >
                    <div className="relative">
                        <item.icon size={24} className={`transition-colors ${isActive(item.view) ? 'text-primary-500' : ''}`} />
                         {item.badge && item.badge > 0 && (
                            <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
                               {item.badge}
                            </span>
                         )}
                    </div>
                    <span className={`text-xs mt-1 transition-colors ${isActive(item.view) ? 'text-primary-500 font-bold' : ''}`}>{item.label}</span>
                    {isActive(item.view) && <div className="absolute top-0 w-12 h-1 bg-primary-500 rounded-b-full"></div>}
                </button>
            ))}
        </nav>
    );
};

export default BottomNavBar;