import React, { useState, useMemo } from 'react';
import { User, AppDatabase, Offer, ServiceListing } from '../../types';
import { Search, Filter, X as CloseIcon, Send, Star, Briefcase, Award, CheckBadgeIcon, Bookmark } from 'lucide-react';

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; widthClass?: string }> = ({ isOpen, onClose, title, children, widthClass = 'max-w-md' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4" onClick={onClose}>
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${widthClass} p-6 relative`} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <CloseIcon size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
                {children}
            </div>
        </div>
    );
};


const UserCard: React.FC<{ user: User, service: ServiceListing, onSendOffer: (user: User) => void }> = ({ user, service, onSendOffer }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col group">
         <div className="relative">
            <img className="h-40 w-full object-cover" src={service.imageUrl} alt={service.title} />
             {service.isPinned && <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1 rounded-full"><Bookmark size={16}/></div>}
         </div>
        <div className="p-4 flex-grow flex flex-col">
            <div className="flex items-start space-x-3 space-x-reverse">
                <img className="w-12 h-12 rounded-full mt-1" src={user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.displayName}`} alt={user.displayName || 'User'} />
                <div className="flex-1">
                     <h3 className="font-bold text-md text-gray-900 dark:text-white leading-tight">{service.title}</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">{user.displayName}</p>
                </div>
            </div>
             <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <Star size={16} className="text-yellow-400 fill-current ml-1" />
                <span className="font-semibold">{user.avgRating?.toFixed(1) || 'جديد'}</span>
                <span className="mx-2">|</span>
                <span className="font-semibold">{user.ratingsReceived?.length || 0} تقييمات</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 h-10 overflow-hidden">{service.description}</p>
            
            <div className="mt-auto pt-3">
                 <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary-500">{service.price.toLocaleString()} د.ج</span>
                    <button onClick={() => onSendOffer(user)} className="px-4 py-2 text-sm bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors">
                        إرسال عرض
                    </button>
                 </div>
            </div>
        </div>
    </div>
);


const MarketplaceContent: React.FC<{ user: User, db: AppDatabase, setDb: React.Dispatch<React.SetStateAction<AppDatabase>> }> = ({ user, db, setDb }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'confirmer' | 'freelancer'>('all');
    const [stateFilter, setStateFilter] = useState('all');
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [offerDetails, setOfferDetails] = useState('');
    const [offerPrice, setOfferPrice] = useState('');

    const availableStates = useMemo(() => {
        const states = new Set(db.users.filter(u => u.type === 'confirmer' && u.state).map(u => u.state as string));
        return ['all', ...Array.from(states)];
    }, [db.users]);

    const rankedServiceListings = useMemo(() => {
        const userRankMap = new Map<string, number>();
        db.users.forEach(u => {
            const rank = (u.avgRating || 0) * 10 + (u.ratingsReceived?.length || 0);
            userRankMap.set(u.uid, rank);
        });

        return db.serviceListings
            .map(service => ({ service, user: db.users.find(u => u.uid === service.userId) }))
            .filter(({ user }) => user && (user.type === 'confirmer' || user.type === 'freelancer'))
            .filter(({ service, user }) => {
                 if (typeFilter !== 'all' && user?.type !== typeFilter) return false;
                 if (typeFilter === 'confirmer' && stateFilter !== 'all' && user?.state !== stateFilter) return false;
                 if (searchTerm && (!user?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) && !service.title.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
                 return true;
            })
            .sort((a, b) => {
                const isAPinned = a.service.isPinned;
                const isBPinned = b.service.isPinned;
                if (isAPinned && !isBPinned) return -1;
                if (!isAPinned && isBPinned) return 1;

                const rankA = userRankMap.get(a.user!.uid) || 0;
                const rankB = userRankMap.get(b.user!.uid) || 0;
                return rankB - rankA;
            });
    }, [db.users, db.serviceListings, searchTerm, typeFilter, stateFilter]);

    const pinnedServices = rankedServiceListings.filter(item => item.service.isPinned);
    const regularServices = rankedServiceListings.filter(item => !item.service.isPinned);


    const handleSendOfferClick = (targetUser: User) => {
        setSelectedUser(targetUser);
        setIsOfferModalOpen(true);
    };

    const handleOfferSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !offerDetails || !offerPrice) return;

        const newOffer: Offer = {
            id: `offer_${Date.now()}`,
            fromUserId: user.uid,
            toUserId: selectedUser.uid,
            details: offerDetails,
            price: parseFloat(offerPrice),
            status: 'pending',
            createdAt: new Date().toISOString(),
            isRated: false
        };

        setDb(prevDb => ({
            ...prevDb,
            offers: [...prevDb.offers, newOffer],
            notifications: [
                ...prevDb.notifications,
                {
                    id: `notif_${Date.now()}`,
                    userId: selectedUser.uid,
                    text: `لقد تلقيت عرضًا جديدًا من ${user.displayName}.`,
                    type: 'offer',
                    link: { view: 'offers', params: { offerId: newOffer.id } },
                    isRead: false,
                    timestamp: 'الآن'
                }
            ]
        }));

        setIsOfferModalOpen(false);
        setOfferDetails('');
        setOfferPrice('');
        setSelectedUser(null);
    };

    const typeFilterOptions: {label: string, value: 'all' | 'confirmer' | 'freelancer'}[] = [
        {label: 'الكل', value: 'all'},
        {label: 'مؤكدون', value: 'confirmer'},
        {label: 'مستقلون', value: 'freelancer'},
    ];
    
    return (
        <div className="p-2 sm:p-4">
             <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md mb-4 sticky top-0 z-10">
                <div className="relative">
                    <input 
                        type="text"
                        placeholder="ابحث عن خدمة أو مستقل..."
                        className="w-full bg-gray-100 dark:bg-gray-700 rounded-full py-2 pr-10 pl-4 border-transparent focus:ring-2 focus:ring-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <div className="mt-3 flex space-x-2 space-x-reverse rounded-lg bg-gray-100 dark:bg-gray-900 p-1">
                    {typeFilterOptions.map(opt => (
                        <button 
                            key={opt.value} 
                            onClick={() => setTypeFilter(opt.value)}
                            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md whitespace-nowrap transition-colors ${typeFilter === opt.value ? 'bg-primary-500 text-white shadow' : 'bg-transparent text-gray-700 dark:text-gray-200'}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                {typeFilter === 'confirmer' && (
                    <div className="mt-3">
                         <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg py-2 px-3 border-transparent focus:ring-2 focus:ring-primary-500">
                            {availableStates.map(state => <option key={state} value={state}>{state === 'all' ? 'كل الولايات' : state}</option>)}
                        </select>
                    </div>
                )}
             </div>

            <div className="space-y-6">
                 <div>
                    <h2 className="text-xl font-bold mb-3 px-2">خدمات المنصة</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {db.siteServices.map(service => (
                            <div key={service.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col text-center items-center">
                                <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full mb-3">
                                    <service.icon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                                </div>
                                <h3 className="text-md font-bold text-gray-900 dark:text-white">{service.title}</h3>
                                <p className="text-2xl font-bold text-primary-500 my-2">{service.price.toLocaleString()} د.ج</p>
                                <button className="w-full mt-2 px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                    اطلب الخدمة
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {pinnedServices.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-3 px-2">خدمات مميزة</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pinnedServices.map(({service, user}) => user && <UserCard key={service.id} user={user} service={service} onSendOffer={handleSendOfferClick} />)}
                        </div>
                    </div>
                )}
                
                <div>
                    <h2 className="text-xl font-bold mb-3 px-2">جميع الخدمات</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {regularServices.map(({service, user}) => user && <UserCard key={service.id} user={user} service={service} onSendOffer={handleSendOfferClick} />)}
                    </div>
                </div>
            </div>
             <Modal isOpen={isOfferModalOpen} onClose={() => setIsOfferModalOpen(false)} title={`إرسال عرض إلى ${selectedUser?.displayName}`}>
                <form onSubmit={handleOfferSubmit}>
                    <textarea 
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                        rows={4}
                        placeholder="تفاصيل العرض..."
                        value={offerDetails}
                        onChange={(e) => setOfferDetails(e.target.value)}
                        required
                    ></textarea>
                    <input 
                        type="number"
                        className="w-full p-2 border rounded mt-2 dark:bg-gray-700 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="السعر (د.ج)"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full mt-4 bg-primary-600 text-white font-bold py-2 px-4 rounded hover:bg-primary-700">
                        إرسال
                    </button>
                </form>
             </Modal>
        </div>
    );
};

export default MarketplaceContent;