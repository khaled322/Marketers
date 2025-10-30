import React from 'react';
import { Notification, AppDatabase, DashboardView } from '../../types';
import { Bell } from 'lucide-react';

interface NotificationsContentProps {
    notifications: Notification[];
    db: AppDatabase;
    onNavigate: (view: DashboardView, params?: any) => void;
}

const NotificationsContent: React.FC<NotificationsContentProps> = ({ notifications, db, onNavigate }) => (
    <div className="p-2 sm:p-4">
        <h2 className="text-2xl font-bold mb-4 px-2">الإشعارات</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            {notifications.length > 0 ? (
                notifications.map(notif => {
                    const fromUser = db.users.find(u => notif.text.includes(u.displayName || ''));
                    const handleNotificationClick = () => {
                        if (notif.link.view === 'offers' && notif.link.params?.offerId) {
                            onNavigate('offer_details', { offerId: notif.link.params.offerId });
                        } else {
                            onNavigate(notif.link.view, notif.link.params);
                        }
                    };
                    return (
                        <button key={notif.id} onClick={handleNotificationClick} className={`w-full text-right block p-4 border-b dark:border-gray-700 last:border-b-0 cursor-pointer ${!notif.isRead ? 'bg-primary-50 dark:bg-primary-900/40' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                            <div className="flex items-start space-x-3 space-x-reverse">
                                {fromUser ? 
                                  <img src={fromUser.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${fromUser.displayName}`} alt="avatar" className="w-12 h-12 rounded-full" />
                                  : <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white"><Bell size={24}/></div>
                                }
                                <div className="flex-grow">
                                    <p className="text-sm">{notif.text}</p>
                                    <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                                </div>
                                {!notif.isRead && <span className="flex-shrink-0 h-3 w-3 mt-1 bg-primary-500 rounded-full"></span>}
                            </div>
                        </button>
                    );
                })
            ) : (
                <p className="text-center py-8 text-gray-500">لا توجد إشعارات جديدة.</p>
            )}
        </div>
    </div>
);

export default NotificationsContent;