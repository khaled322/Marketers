import React from 'react';
import { User, DashboardView } from '../../types';
import { Settings, CreditCard, BarChart2, ShoppingBag, Briefcase, LogOut, ChevronLeft } from 'lucide-react';

const MenuContent: React.FC<{ user: User, onLogout: () => void, setCurrentView: (view: DashboardView) => void }> = ({ user, onLogout, setCurrentView }) => {
    const menuItems = [
        { view: 'settings' as DashboardView, label: 'الإعدادات والمحفظة', icon: Settings },
        { view: 'statistics' as DashboardView, label: 'الإحصائيات', icon: BarChart2 },
        { view: 'site_services' as DashboardView, label: 'خدمات الموقع', icon: ShoppingBag },
        { view: 'my_services' as DashboardView, label: 'خدماتي', icon: Briefcase, condition: user.type === 'confirmer' || user.type === 'freelancer' },
    ];

    return (
        <div className="p-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-3 space-x-reverse mb-4">
                <img src={user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.displayName}`} alt="avatar" className="w-12 h-12 rounded-full" />
                <div>
                    <h3 className="font-bold text-lg">{user.displayName}</h3>
                    <p className="text-sm text-gray-500">عرض الملف الشخصي</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                {menuItems.map(item => (
                    (!item.condition || item.condition) && (
                        <button key={item.view} onClick={() => setCurrentView(item.view)} className="w-full flex items-center p-4 text-right border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                           <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full mr-3">
                            <item.icon size={20} className="text-gray-700 dark:text-gray-200" />
                           </div>
                           <span className="font-semibold">{item.label}</span>
                           <ChevronLeft size={20} className="mr-auto text-gray-400" />
                        </button>
                    )
                ))}
            </div>
            
            <div className="mt-4">
                <button onClick={onLogout} className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center p-4 text-right hover:bg-gray-50 dark:hover:bg-gray-700 text-red-500">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full mr-3">
                        <LogOut size={20} />
                    </div>
                    <span className="font-semibold">تسجيل الخروج</span>
                </button>
            </div>
        </div>
    );
}

export default MenuContent;
