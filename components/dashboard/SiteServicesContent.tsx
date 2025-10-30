import React from 'react';
import { User, SiteService, AppDatabase, Offer } from '../../types';

const SiteServicesContent: React.FC<{ user: User, db: AppDatabase, setDb: React.Dispatch<React.SetStateAction<AppDatabase>> }> = ({ user, db, setDb }) => {

    const handleRequestService = (service: SiteService) => {
        const admin = db.users.find(u => u.type === 'admin');
        if (!admin) {
            alert('خطأ: لم يتم العثور على حساب المدير.');
            return;
        }

        const newOffer: Offer = {
            id: `offer_${Date.now()}`,
            fromUserId: user.uid,
            toUserId: admin.uid,
            details: `طلب خدمة الموقع: ${service.title}`,
            price: service.price,
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
                    userId: admin.uid,
                    text: `طلب خدمة جديد من ${user.displayName}: ${service.title}.`,
                    type: 'offer',
                    link: { view: 'offers' },
                    isRead: false,
                    timestamp: 'الآن'
                }
            ]
        }));
        
        alert(`تم إرسال طلبك لخدمة "${service.title}" بنجاح. سيتم التواصل معك قريباً.`);
    };

    return (
        <div className="p-2 sm:p-4">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">خدمات الموقع الرسمية</h2>
                <p className="text-gray-500">خدمات احترافية مقدمة من فريقنا لضمان نجاحك.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {db.siteServices.map(service => (
                    <div key={service.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col text-center items-center">
                        <div className="p-4 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                            <service.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{service.title}</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 flex-grow">{service.description}</p>
                        <p className="text-2xl font-bold text-primary-500 my-4">{service.price.toLocaleString()} د.ج</p>
                        <button onClick={() => handleRequestService(service)} className="w-full px-4 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors">
                            اطلب الخدمة الآن
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SiteServicesContent;
