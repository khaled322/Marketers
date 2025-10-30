import React, { useState } from 'react';
import { User, AppDatabase, Transaction, ServiceListing, DashboardView } from '../../types';
import { Edit, Trash, PlusCircle, CreditCard, User as UserIcon, Briefcase, Save, XCircle } from 'lucide-react';

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

const ProfileTab: React.FC<{ user: User, setDb: React.Dispatch<React.SetStateAction<AppDatabase>> }> = ({ user, setDb }) => {
    const [displayName, setDisplayName] = useState(user.displayName || '');
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        setDb(prevDb => ({
            ...prevDb,
            users: prevDb.users.map(u => u.uid === user.uid ? { ...u, displayName } : u)
        }));
        setIsEditing(false);
    };
    
    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4 space-x-reverse">
                <img src={user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.displayName}`} alt="avatar" className="w-20 h-20 rounded-full" />
                <div className="flex-grow">
                    {isEditing ? (
                        <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full text-2xl font-bold p-1 border-b-2 dark:bg-gray-700 dark:border-gray-500 focus:outline-none focus:border-primary-500" />
                    ) : (
                        <h3 className="text-2xl font-bold">{user.displayName}</h3>
                    )}
                    <p className="text-gray-500">{user.email}</p>
                </div>
            </div>
             <div className="flex justify-end gap-2">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="px-4 py-2 text-sm bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 flex items-center gap-2"><Save size={16} /> حفظ</button>
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600">إلغاء</button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 flex items-center gap-2"><Edit size={16} /> تعديل</button>
                )}
            </div>
        </div>
    );
};

const WalletTab: React.FC<{ user: User, db: AppDatabase }> = ({ user, db }) => {
    const userTransactions = db.transactions; // In real app, filter by user ID
    return (
        <div className="space-y-4">
            <div className="bg-primary-500 text-white p-6 rounded-lg shadow-lg">
                <p className="text-sm opacity-80">الرصيد الحالي</p>
                <p className="text-4xl font-bold">{user.walletBalance.toLocaleString()} د.ج</p>
            </div>
            <div>
                <h4 className="font-bold text-lg mb-2">سجل المعاملات</h4>
                <div className="space-y-2">
                    {userTransactions.map(t => (
                        <div key={t.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div>
                                <p className="font-semibold">{t.description}</p>
                                <p className="text-xs text-gray-500">{t.date}</p>
                            </div>
                            <p className={`font-bold ${t.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>{t.amount.toLocaleString()} د.ج</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MyServicesTab: React.FC<{ user: User, db: AppDatabase, setDb: React.Dispatch<React.SetStateAction<AppDatabase>> }> = ({ user, db, setDb }) => {
    const myServices = db.serviceListings.filter(s => s.userId === user.uid);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState<ServiceListing | null>(null);

    const handleOpenModal = (service: ServiceListing | null = null) => {
        setServiceToEdit(service);
        setIsModalOpen(true);
    };

    const handleSaveService = (service: Omit<ServiceListing, 'id' | 'userId'>) => {
        setDb(prevDb => {
            if (serviceToEdit) { // Editing existing
                return { ...prevDb, serviceListings: prevDb.serviceListings.map(s => s.id === serviceToEdit.id ? { ...s, ...service } : s) };
            } else { // Adding new
                const newService: ServiceListing = { ...service, id: `service_${Date.now()}`, userId: user.uid };
                return { ...prevDb, serviceListings: [...prevDb.serviceListings, newService] };
            }
        });
        setIsModalOpen(false);
    };
    
    const handleDeleteService = (serviceId: string) => {
        if(window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
            setDb(prevDb => ({
                ...prevDb,
                serviceListings: prevDb.serviceListings.filter(s => s.id !== serviceId)
            }));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-lg">خدماتي المعروضة</h4>
                <button onClick={() => handleOpenModal()} className="px-4 py-2 text-sm bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 flex items-center gap-2"><PlusCircle size={16} /> إضافة خدمة</button>
            </div>
            {myServices.length > 0 ? (
                <div className="space-y-3">
                    {myServices.map(s => (
                        <div key={s.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{s.title}</p>
                                <p className="text-sm text-gray-500">{s.price.toLocaleString()} د.ج</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleOpenModal(s)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full"><Edit size={18}/></button>
                                <button onClick={() => handleDeleteService(s.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full"><Trash size={18}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : <p className="text-center text-gray-500 py-4">لم تقم بإضافة أي خدمات بعد.</p>}
            <ServiceFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveService} service={serviceToEdit} />
        </div>
    );
};

const ServiceFormModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (service: any) => void, service: ServiceListing | null }> = ({ isOpen, onClose, onSave, service }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    
    React.useEffect(() => {
        setTitle(service?.title || '');
        setDescription(service?.description || '');
        setPrice(service?.price.toString() || '');
    }, [service]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, description, price: parseFloat(price), category: 'confirmation', priceType: 'per_order', imageUrl: service?.imageUrl || 'https://picsum.photos/seed/new_service/400/300' });
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={service ? "تعديل الخدمة" : "إضافة خدمة جديدة"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="عنوان الخدمة" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                <textarea placeholder="وصف الخدمة" value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" rows={4}></textarea>
                <input type="number" placeholder="السعر (د.ج)" value={price} onChange={e => setPrice(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                 <button type="submit" className="w-full mt-4 bg-primary-600 text-white font-bold py-2 px-4 rounded hover:bg-primary-700">
                    حفظ
                </button>
            </form>
        </Modal>
    );
}

const SettingsContent: React.FC<{ user: User, db: AppDatabase, setDb: React.Dispatch<React.SetStateAction<AppDatabase>>, initialTab: DashboardView }> = ({ user, db, setDb, initialTab }) => {
    
    type Tab = 'profile' | 'wallet' | 'my_services';
    
    const getInitialTab = (): Tab => {
        if (initialTab === 'wallet') return 'wallet';
        if (initialTab === 'my_services' && (user.type === 'confirmer' || user.type === 'freelancer')) return 'my_services';
        return 'profile';
    };

    const [activeTab, setActiveTab] = useState<Tab>(getInitialTab());

    const tabs: {id: Tab, label: string, icon: React.ElementType}[] = [
        {id: 'profile', label: 'الملف الشخصي', icon: UserIcon},
        {id: 'wallet', label: 'المحفظة', icon: CreditCard},
    ];

    if (user.type === 'confirmer' || user.type === 'freelancer') {
        tabs.push({id: 'my_services', label: 'خدماتي', icon: Briefcase});
    }

    return (
        <div className="p-2 sm:p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="border-b dark:border-gray-700 flex">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 px-2 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === tab.id ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                           <tab.icon size={18} /> {tab.label}
                        </button>
                    ))}
                </div>
                 <div className="p-4">
                    {activeTab === 'profile' && <ProfileTab user={user} setDb={setDb} />}
                    {activeTab === 'wallet' && <WalletTab user={user} db={db} />}
                    {activeTab === 'my_services' && <MyServicesTab user={user} db={db} setDb={setDb} />}
                </div>
            </div>
        </div>
    );
};

export default SettingsContent;
