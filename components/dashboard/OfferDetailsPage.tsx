import React from 'react';
import { User, Offer, AppDatabase, Rating, ServiceListing } from '../../types';

const OfferDetailsPage: React.FC<{ 
    offerId: string;
    user: User;
    db: AppDatabase;
    setDb: React.Dispatch<React.SetStateAction<AppDatabase>>;
    onBack: () => void;
}> = ({ offerId, user, db, setDb, onBack }) => {
    
    const offer = db.offers.find(o => o.id === offerId);
    
    if (!offer) {
        return <div className="p-4 text-center text-red-500">لم يتم العثور على العرض.</div>;
    }

    const otherUser = db.users.find(u => u.uid === (offer.fromUserId === user.uid ? offer.toUserId : offer.fromUserId));
    const service = offer.serviceId ? db.serviceListings.find(s => s.id === offer.serviceId) : null;
    const isMyOffer = offer.fromUserId === user.uid;

    const statusMap = {
        pending: { text: 'قيد الانتظار', color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900' },
        accepted: { text: 'مقبول', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900' },
        rejected: { text: 'مرفوض', color: 'text-red-500 bg-red-100 dark:bg-red-900' },
        completed: { text: 'مكتمل', color: 'text-green-500 bg-green-100 dark:bg-green-900' },
        cancelled: { text: 'ملغى', color: 'text-gray-500 bg-gray-100 dark:bg-gray-700' },
        delivered: { text: 'تم التسليم', color: 'text-purple-500 bg-purple-100 dark:bg-purple-900' },
        modification_requested: { text: 'طلب تعديل', color: 'text-orange-500 bg-orange-100 dark:bg-orange-900' },
    };

    const handleUpdateOffer = (newStatus: Offer['status']) => {
        setDb(prevDb => ({
            ...prevDb,
            offers: prevDb.offers.map(o => o.id === offerId ? { ...o, status: newStatus } : o)
        }));
    };
    
    if (!otherUser) {
        return <div className="p-4 text-center text-red-500">لم يتم العثور على المستخدم الآخر.</div>;
    }

    const renderActions = () => {
         // FIX: Replaced JSX.Element with React.ReactNode to resolve the "Cannot find namespace 'JSX'" error.
         const actionButtons: { [key in Offer['status']]?: React.ReactNode | null } = {
            pending: !isMyOffer ? (
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleUpdateOffer('accepted')} className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg">قبول</button>
                    <button onClick={() => handleUpdateOffer('rejected')} className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg">رفض</button>
                </div>
            ) : null,
            accepted: !isMyOffer ? (
                <button onClick={() => handleUpdateOffer('delivered')} className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg">تسليم العمل</button>
            ) : null,
             delivered: isMyOffer ? (
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleUpdateOffer('completed')} className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg">تأكيد الاستلام</button>
                    <button onClick={() => handleUpdateOffer('modification_requested')} className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg">طلب تعديل</button>
                </div>
            ) : null,
            completed: isMyOffer && !offer.isRated ? (
                 <button className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg">تقييم الخدمة</button>
            ) : null,
         };
         
         return actionButtons[offer.status] || <p className="text-sm text-center text-gray-500">لا توجد إجراءات متاحة حالياً.</p>;
    }

    return (
        <div className="p-2 sm:p-4 space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">تفاصيل العرض</h3>
                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusMap[offer.status].color}`}>{statusMap[offer.status].text}</span>
                </div>
                <div className="mt-4 border-t dark:border-gray-700 pt-4 space-y-2 text-gray-700 dark:text-gray-300">
                    <p><strong className="font-semibold text-gray-900 dark:text-white">التفاصيل:</strong> {offer.details}</p>
                    <p><strong className="font-semibold text-gray-900 dark:text-white">السعر:</strong> <span className="text-primary-500 font-bold">{offer.price.toLocaleString()} د.ج</span></p>
                    <p><strong className="font-semibold text-gray-900 dark:text-white">تاريخ الإنشاء:</strong> {new Date(offer.createdAt).toLocaleDateString()}</p>
                    {service && <p><strong className="font-semibold text-gray-900 dark:text-white">متعلق بخدمة:</strong> {service.title}</p>}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                 <h3 className="font-bold text-lg mb-2">{isMyOffer ? "مقدم الخدمة" : "صاحب العرض"}</h3>
                 <div className="flex items-center space-x-3 space-x-reverse">
                    <img className="w-14 h-14 rounded-full" src={otherUser.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${otherUser.displayName}`} alt={otherUser.displayName || 'User'} />
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">{otherUser.displayName}</p>
                        <p className="text-sm text-gray-500">{otherUser.type}</p>
                    </div>
                 </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                 <h3 className="font-bold text-lg mb-3">الإجراءات المتاحة</h3>
                 {renderActions()}
            </div>
        </div>
    );
};

export default OfferDetailsPage;