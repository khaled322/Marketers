import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { User, DashboardView, AppDatabase, Offer } from '../types';
import { ChevronLeft, Search as SearchIcon, MessageCircle, Send, Users } from 'lucide-react';
import BottomNavBar from '../components/BottomNavBar';
import FloatingChatButton from '../components/FloatingChatButton';
import ChatbotModal from '../components/ChatbotModal';

// Import all the new content components
import HomeFeedContent from '../components/dashboard/HomeFeedContent';
import MarketplaceContent from '../components/dashboard/MarketplaceContent';
import OffersContent from '../components/dashboard/OffersContent';
import NotificationsContent from '../components/dashboard/NotificationsContent';
import MenuContent from '../components/dashboard/MenuContent';
import SettingsContent from '../components/dashboard/SettingsContent';
import StatisticsContent from '../components/dashboard/StatisticsContent';
import SiteServicesContent from '../components/dashboard/SiteServicesContent';
import OfferDetailsPage from '../components/dashboard/OfferDetailsPage';

const SearchContent: React.FC = () => (
    <div className="p-4">
        <div className="relative">
            <input 
                type="text"
                placeholder="ابحث عن أي شيء في المنصة..."
                className="w-full bg-white dark:bg-gray-700 rounded-full py-3 pr-12 pl-4 border dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
            />
            <SearchIcon className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" size={24} />
        </div>
        <div className="text-center mt-16 text-gray-500">
            <Users size={48} className="mx-auto" />
            <p className="mt-4">ابحث عن مستخدمين، خدمات، عروض والمزيد.</p>
        </div>
    </div>
);

const MessagesContent: React.FC<{ user: User; db: AppDatabase }> = ({ user, db }) => {
    const conversations = useMemo(() => {
        return db.offers
            .filter(offer => 
                (offer.fromUserId === user.uid || offer.toUserId === user.uid) && 
                ['accepted', 'delivered', 'modification_requested'].includes(offer.status)
            )
            .map(offer => {
                const otherUserId = offer.fromUserId === user.uid ? offer.toUserId : offer.fromUserId;
                const otherUser = db.users.find(u => u.uid === otherUserId);
                const conversationId = [user.uid, otherUserId].sort().join('_');
                const lastMessage = db.messages[conversationId]?.messages.slice(-1)[0];
                return { offer, otherUser, lastMessage };
            })
            .filter(c => c.otherUser);
    }, [db.offers, db.users, user.uid, db.messages]);

    const [activeConversation, setActiveConversation] = useState(null);

    if (activeConversation) {
        // Chat view
        const otherUser = activeConversation.otherUser;
        const conversationId = [user.uid, otherUser.uid].sort().join('_');
        const messages = db.messages[conversationId]?.messages || [];

        return (
            <div className="flex flex-col h-full">
                <div className="p-3 border-b dark:border-gray-700 flex items-center space-x-3 space-x-reverse">
                    <button onClick={() => setActiveConversation(null)}><ChevronLeft/></button>
                    <img src={otherUser.photoURL} className="w-10 h-10 rounded-full" alt={otherUser.displayName}/>
                    <h3 className="font-bold">{otherUser.displayName}</h3>
                </div>
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.map(msg => (
                         <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === user.uid ? 'justify-end' : ''}`}>
                             <div className={`max-w-[70%] p-3 rounded-lg ${msg.senderId === user.uid ? 'bg-primary-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'}`}>
                                 <p>{msg.text}</p>
                             </div>
                         </div>
                    ))}
                </div>
                <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                     <div className="relative">
                        <input type="text" placeholder="اكتب رسالتك..." className="w-full bg-gray-100 dark:bg-gray-700 rounded-full py-2 pr-4 pl-12 border-transparent focus:ring-2 focus:ring-primary-500"/>
                        <button className="absolute left-1 top-1/2 -translate-y-1/2 bg-primary-500 text-white rounded-full p-2"><Send size={18}/></button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-2 sm:p-4">
            <h2 className="text-2xl font-bold mb-4 px-2">الرسائل</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                {conversations.length > 0 ? conversations.map(({ offer, otherUser, lastMessage }) => (
                    <button key={offer.id} onClick={() => setActiveConversation({offer, otherUser})} className="w-full text-right flex items-center p-3 border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <img src={otherUser.photoURL} className="w-12 h-12 rounded-full ml-3" alt={otherUser.displayName}/>
                        <div className="flex-grow">
                            <h3 className="font-bold">{otherUser.displayName}</h3>
                            <p className="text-sm text-gray-500 truncate">{lastMessage ? lastMessage.text : `محادثة بخصوص: ${offer.details}`}</p>
                        </div>
                    </button>
                )) : (
                    <div className="text-center p-8 text-gray-500">
                        <MessageCircle size={40} className="mx-auto" />
                        <p className="mt-3">لا توجد محادثات. تبدأ المحادثة عند قبول عرض.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

interface DashboardPageProps {
    user: User;
    db: AppDatabase;
    setDb: React.Dispatch<React.SetStateAction<AppDatabase>>;
    onLogout: () => void;
    initialView: DashboardView;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, db, setDb, onLogout, initialView }) => {
    const [viewState, setViewState] = useState<{ view: DashboardView; params?: any; previousView?: DashboardView }>({ view: initialView || 'home' });

    useEffect(() => {
        if(initialView) {
            setViewState(prevState => ({ ...prevState, view: initialView }));
        }
    }, [initialView]);

    const { view: currentView, params, previousView } = viewState;
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    const setCurrentView = (view: DashboardView, params: any = null) => {
        setViewState(prevState => ({
            view,
            params,
            previousView: view !== prevState.view ? prevState.view : prevState.previousView,
        }));
    };

    const handleBack = () => {
        setCurrentView(previousView || 'home');
    };

    const viewsWithoutNav: DashboardView[] = ['settings', 'wallet', 'statistics', 'site_services', 'my_services', 'offer_details'];
    const isSubView = viewsWithoutNav.includes(currentView);
    
    const viewTitles: Record<DashboardView, string> = {
        home: "الرئيسية",
        marketplace: "السوق",
        offers: "العروض",
        notifications: "الإشعارات",
        menu: "القائمة",
        settings: "الإعدادات والمحفظة",
        wallet: "المحفظة",
        statistics: "الإحصائيات",
        site_services: "خدمات الموقع",
        my_services: "خدماتي",
        messages: "الرسائل",
        search: "البحث",
        offer_details: "تفاصيل العرض",
        create_ad_campaign: "إنشاء حملة إعلانية",
        admin_panel: "لوحة التحكم"
    };
    
    const renderContent = () => {
        switch (currentView) {
            case 'marketplace':
                return <MarketplaceContent user={user} db={db} setDb={setDb} />;
            case 'offers':
                 return <OffersContent user={user} db={db} setDb={setDb} onNavigateToDetails={(offerId) => setCurrentView('offer_details', { offerId })} />;
            case 'notifications':
                 const userNotifications = db.notifications.filter(n => n.userId === user.uid).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                return <NotificationsContent notifications={userNotifications} db={db} onNavigate={(view, params) => setCurrentView(view, params)} />;
            case 'menu':
                return <MenuContent user={user} onLogout={onLogout} setCurrentView={setCurrentView} />;
            case 'settings':
            case 'wallet': // Both can be handled by SettingsContent's tabs
            case 'my_services':
                return <SettingsContent user={user} db={db} setDb={setDb} initialTab={currentView} />;
            case 'statistics':
                return <StatisticsContent user={user} db={db} />;
            case 'site_services':
                return <SiteServicesContent user={user} db={db} setDb={setDb} />;
            case 'offer_details':
                return <OfferDetailsPage offerId={params?.offerId} user={user} db={db} setDb={setDb} onBack={handleBack} />;
            case 'search':
                return <SearchContent />;
            case 'messages':
                return <MessagesContent user={user} db={db} />;
            case 'home':
            default:
                return <HomeFeedContent user={user} db={db} setDb={setDb} />;
        }
    };

    return (
        <div className="flex flex-col flex-grow h-full bg-gray-100 dark:bg-black">
           {isSubView && (
                <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-md h-14 flex items-center px-4">
                    <button onClick={handleBack} className="p-2 text-gray-600 dark:text-gray-300">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-lg font-bold mx-auto pr-8">{viewTitles[currentView]}</h2>
                </div>
           )}
            <main className={`flex-grow overflow-y-auto ${isSubView ? 'pb-2' : 'pb-16'}`}> 
                {renderContent()}
            </main>
            
            {!isSubView && (
                <BottomNavBar 
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    unreadNotifications={db.notifications.filter(n => n.userId === user.uid && !n.isRead).length}
                    unreadMessages={0}
                />
            )}
             <FloatingChatButton onClick={() => setIsChatbotOpen(!isChatbotOpen)} isOpen={isChatbotOpen} />
             <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
        </div>
    );
};

export default DashboardPage;