import React, { useState, useMemo } from 'react';
import { User, Offer, AppDatabase, Rating, ServiceCategory } from '../../types';
import { Filter, Star, CheckCircle, XCircle, Send, CornerDownLeft, Check, ArrowDown, ArrowUp } from 'lucide-react';

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; widthClass?: string }> = ({ isOpen, onClose, title, children, widthClass = 'max-w-md' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4" onClick={onClose}>
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${widthClass} p-6 relative`} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <XCircle size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
                {children}
            </div>
        </div>
    );
};

const StarRating: React.FC<{ rating: number; onRatingChange?: (rating: number) => void; size?: number; readonly?: boolean }> = ({ rating, onRatingChange, size = 20, readonly = false }) => {
    const [hoverRating, setHoverRating] = useState(0);
    return (
        <div className="flex items-center space-x-1 space-x-reverse">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    className={`transition-colors ${!readonly ? 'cursor-pointer' : ''} ${
                        (hoverRating || rating) >= star ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
                    }`}
                    onClick={() => !readonly && onRatingChange?.(star)}
                    onMouseEnter={() => !readonly && setHoverRating(star)}
                    onMouseLeave={() => !readonly && setHoverRating(0)}
                />
            ))}
        </div>
    );
};

const OfferCard: React.FC<{
    offer: Offer;
    currentUser: User;
    db: AppDatabase;
    onUpdateOffer: (offerId: string, newStatus: Offer['status']) => void;
    onRateOffer: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
    onNavigateToDetails: (offerId: string) => void;
}> = ({ offer, currentUser, db, onUpdateOffer, onRateOffer, onNavigateToDetails }) => {
    const otherUser = db.users.find(u => u.uid === (offer.fromUserId === currentUser.uid ? offer.toUserId : offer.fromUserId));
    const isMyOffer = offer.fromUserId === currentUser.uid;
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const statusMap = {
        pending: { text: 'قيد الانتظار', color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900' },
        accepted: { text: 'مقبول', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900' },
        rejected: { text: 'مرفوض', color: 'text-red-500 bg-red-100 dark:bg-red-900' },
        completed: { text: 'مكتمل', color: 'text-green-500 bg-green-100 dark:bg-green-900' },
        cancelled: { text: 'ملغى', color: 'text-gray-500 bg-gray-100 dark:bg-gray-700' },
        delivered: { text: 'تم التسليم', color: 'text-purple-500 bg-purple-100 dark:bg-purple-900' },
        modification_requested: { text: 'طلب تعديل', color: 'text-orange-500 bg-orange-100 dark:bg-orange-900' },
    };

    const handleRatingSubmit = () => {
        onRateOffer({ offerId: offer.id, fromUserId: currentUser.uid, toUserId: otherUser!.uid, stars: rating, comment });
        setIsRatingModalOpen(false);
    }
    
    const renderActions = () => {
        if (offer.status === 'pending' && !isMyOffer) {
            return (
                <>
                    <button onClick={(e) => {e.stopPropagation(); onUpdateOffer(offer.id, 'accepted')}} className="flex-1 px-3 py-2 text-sm bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 flex items-center justify-center gap-1"><CheckCircle size={16}/> قبول</button>
                    <button onClick={(e) => {e.stopPropagation(); onUpdateOffer(offer.id, 'rejected')}} className="flex-1 px-3 py-2 text-sm bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 flex items-center justify-center gap-1"><XCircle size={16}/> رفض</button>
                </>
            );
        }
        if (offer.status === 'accepted' && !isMyOffer) {
            return <button onClick={(e) => {e.stopPropagation(); onUpdateOffer(offer.id, 'delivered')}} className="w-full px-3 py-2 text-sm bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 flex items-center justify-center gap-1"><Send size={16}/> تسليم العمل</button>;
        }
        if (offer.status === 'delivered' && isMyOffer) {
             return (
                <>
                    <button onClick={(e) => {e.stopPropagation(); onUpdateOffer(offer.id, 'completed')}} className="flex-1 px-3 py-2 text-sm bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 flex items-center justify-center gap-1"><Check size={16}/> قبول التسليم</button>
                    <button onClick={(e) => {e.stopPropagation(); onUpdateOffer(offer.id, 'modification_requested')}} className="flex-1 px-3 py-2 text-sm bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 flex items-center justify-center gap-1"><CornerDownLeft size={16}/> طلب تعديل</button>
                </>
            );
        }
         if (offer.status === 'modification_requested' && !isMyOffer) {
            return <p className="text-sm text-center text-orange-500">العميل طلب تعديلات. يرجى التواصل وتسليم العمل مجدداً.</p>;
        }
        if (offer.status === 'completed' && isMyOffer && !offer.isRated) {
            return <button onClick={(e) => {e.stopPropagation(); setIsRatingModalOpen(true)}} className="w-full px-3 py-2 text-sm bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-1"><Star size={16}/> تقييم الخدمة</button>;
        }
        return <p className="text-sm text-center text-gray-500">لا توجد إجراءات متاحة حالياً.</p>;
    };

    if (!otherUser) return null;

    return (
        <>
            <div onClick={() => onNavigateToDetails(offer.id)} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-3 cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3 space-x-reverse">
                         <img className="w-12 h-12 rounded-full" src={otherUser.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${otherUser.displayName}`} alt={otherUser.displayName || 'User'} />
                         <div>
                            <p className="text-sm text-gray-500">{isMyOffer ? 'إلى:' : 'من:'} <span className="font-bold text-gray-800 dark:text-gray-100">{otherUser.displayName}</span></p>
                             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusMap[offer.status].color}`}>{statusMap[offer.status].text}</span>
                         </div>
                    </div>
                     <p className="text-lg font-bold text-primary-500">{offer.price} د.ج</p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{offer.details}</p>
                <div className="flex gap-2 pt-2 border-t dark:border-gray-700">
                    {renderActions()}
                </div>
            </div>
            <Modal isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)} title={`تقييم ${otherUser.displayName}`}>
                <div className="flex flex-col items-center">
                    <p className="mb-4">ما هو تقييمك للخدمة المقدمة؟</p>
                    <StarRating rating={rating} onRatingChange={setRating} size={32} />
                    <textarea 
                        className="w-full p-2 border rounded mt-4 dark:bg-gray-700 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                        rows={3}
                        placeholder="أضف تعليقاً (اختياري)..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                    <button onClick={handleRatingSubmit} className="w-full mt-4 bg-primary-600 text-white font-bold py-2 px-4 rounded hover:bg-primary-700">
                        إرسال التقييم
                    </button>
                </div>
            </Modal>
        </>
    );
};


const OffersContent: React.FC<{ user: User, db: AppDatabase, setDb: React.Dispatch<React.SetStateAction<AppDatabase>>, onNavigateToDetails: (offerId: string) => void }> = ({ user, db, setDb, onNavigateToDetails }) => {
    const [typeFilter, setTypeFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const serviceCategories = useMemo(() => {
        const categories = new Set(db.offers
            .map(offer => db.serviceListings.find(s => s.id === offer.serviceId)?.category)
            .filter(Boolean) as ServiceCategory[]);
        return ['all', ...Array.from(categories)];
    }, [db.offers, db.serviceListings]);

    const getCategoryLabel = (cat: string) => {
        // FIX: Added 'development' to the labels object to match the ServiceCategory type.
        const labels: { [key in ServiceCategory | 'all']: string } = {
            all: 'كل الأنواع',
            confirmation: 'تأكيد',
            design: 'تصميم',
            video: 'مونتاج',
            marketing: 'تسويق',
            writing: 'كتابة',
            development: 'تطوير',
        };
        return labels[cat as keyof typeof labels] || cat;
    }

    const filteredOffers = useMemo(() => {
        let userOffers = db.offers.filter(o => o.fromUserId === user.uid || o.toUserId === user.uid);
        
        if (typeFilter === 'incoming') {
            userOffers = userOffers.filter(o => o.toUserId === user.uid);
        } else if (typeFilter === 'outgoing') {
            userOffers = userOffers.filter(o => o.fromUserId === user.uid);
        }

        if (categoryFilter !== 'all') {
            userOffers = userOffers.filter(offer => {
                if (!offer.serviceId) return false;
                const service = db.serviceListings.find(s => s.id === offer.serviceId);
                return service?.category === categoryFilter;
            });
        }
        
        return userOffers.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [db.offers, user.uid, typeFilter, categoryFilter, db.serviceListings]);
    
    const handleUpdateOffer = (offerId: string, newStatus: Offer['status']) => {
        setDb(prevDb => ({
            ...prevDb,
            offers: prevDb.offers.map(o => o.id === offerId ? { ...o, status: newStatus } : o)
        }));
    };
    
    const handleRateOffer = (rating: Omit<Rating, 'id' | 'createdAt'>) => {
        const newRating: Rating = {
            ...rating,
            id: `rating_${Date.now()}`,
            createdAt: new Date().toISOString()
        };

        setDb(prevDb => {
            const updatedUsers = prevDb.users.map(u => {
                if (u.uid === rating.toUserId) {
                    const existingRatings = u.ratingsReceived || [];
                    const newRatings = [...existingRatings, newRating];
                    const newAvgRating = newRatings.reduce((acc, r) => acc + r.stars, 0) / newRatings.length;
                    return { ...u, ratingsReceived: newRatings, avgRating: parseFloat(newAvgRating.toFixed(1)) };
                }
                return u;
            });

            return {
                ...prevDb,
                ratings: [...prevDb.ratings, newRating],
                offers: prevDb.offers.map(o => o.id === rating.offerId ? { ...o, isRated: true } : o),
                users: updatedUsers
            };
        });
    };

    const typeFilterOptions: {label: string, value: 'all' | 'incoming' | 'outgoing'}[] = [
        {label: 'الكل', value: 'all'},
        {label: 'الواردة', value: 'incoming'},
        {label: 'الصادرة', value: 'outgoing'},
    ];

    return (
        <div className="p-2 sm:p-4">
             <div className="mb-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md space-y-2">
                <div className="flex space-x-2 space-x-reverse rounded-lg bg-gray-100 dark:bg-gray-900 p-1">
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
                 {serviceCategories.length > 2 && (
                    <div className="flex space-x-2 space-x-reverse rounded-lg bg-gray-100 dark:bg-gray-900 p-1">
                        {serviceCategories.map(cat => (
                            <button 
                                key={cat} 
                                onClick={() => setCategoryFilter(cat)}
                                className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md whitespace-nowrap transition-colors ${categoryFilter === cat ? 'bg-primary-500 text-white shadow' : 'bg-transparent text-gray-700 dark:text-gray-200'}`}
                            >
                                {getCategoryLabel(cat)}
                            </button>
                        ))}
                    </div>
                )}
             </div>
             <div className="space-y-4">
                {filteredOffers.length > 0 ? (
                    filteredOffers.map(offer => <OfferCard key={offer.id} offer={offer} currentUser={user} db={db} onUpdateOffer={handleUpdateOffer} onRateOffer={handleRateOffer} onNavigateToDetails={onNavigateToDetails} />)
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">لا توجد عروض تطابق هذا الفلتر.</p>
                    </div>
                )}
             </div>
        </div>
    );
};

export default OffersContent;