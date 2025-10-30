import React, { useMemo } from 'react';
import { User, AppDatabase } from '../../types';
import { PlusCircle, MoreHorizontal, MessageCircle, Briefcase } from 'lucide-react';

const PostInput: React.FC<{user: User}> = ({ user }) => (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow flex items-center space-x-3 space-x-reverse">
        <img src={user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.displayName}`} alt="avatar" className="w-10 h-10 rounded-full" />
        <button className="flex-grow text-right bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            {user.type === 'merchant' ? 'ما الخدمة التي تبحث عنها؟' : 'شارك خدمة جديدة...'}
        </button>
    </div>
);


const FeedItemCard: React.FC<{item: any, db: AppDatabase}> = ({ item, db }) => {
    const user = db.users.find(u => u.uid === item.userId);
    if (!user) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 flex items-start justify-between">
                <div>
                    <p className="font-bold">{user.displayName}</p>
                    <p className="text-xs text-gray-500">أضاف خدمة جديدة · منذ 3 ساعات</p>
                </div>
                <button><MoreHorizontal className="text-gray-500" /></button>
            </div>
            <div className="px-4 pb-4">
                <p className="font-semibold text-lg">{item.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
            </div>
            <div className="px-4 py-3 flex justify-between items-center text-gray-600 dark:text-gray-400 border-t dark:border-gray-700">
                 <span className="font-bold text-primary-500 text-lg">{item.price} د.ج</span>
                 <div className="flex space-x-4 space-x-reverse">
                    <button className="flex items-center space-x-1 space-x-reverse hover:text-primary-500"><MessageCircle size={20} /> <span className="text-sm font-semibold">تواصل</span></button>
                    <button className="flex items-center space-x-1 space-x-reverse hover:text-primary-500"><Briefcase size={20} /> <span className="text-sm font-semibold">اطلب</span></button>
                 </div>
            </div>
        </div>
    );
}

const HomeFeedContent: React.FC<{ user: User, db: AppDatabase, setDb: React.Dispatch<React.SetStateAction<AppDatabase>> }> = ({ user, db, setDb }) => {
    const feedItems = useMemo(() => {
        return [...db.serviceListings].sort(() => 0.5 - Math.random());
    }, [db.serviceListings]);

    return (
        <div className="p-2 sm:p-4 space-y-4 max-w-2xl mx-auto">
            <PostInput user={user} />
            {feedItems.map(item => <FeedItemCard key={item.id} item={item} db={db} />)}
        </div>
    );
};

export default HomeFeedContent;