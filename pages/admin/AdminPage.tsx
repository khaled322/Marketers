import React, { useState } from 'react';
import { User, AppDatabase, ServiceListing, UserType, SiteService } from '../../types';
import { 
    LayoutDashboard, Users, Briefcase, ShoppingBag, CreditCard, LogOut, Settings, BarChart2,
    MoreVertical, Edit, Trash2, PlusCircle, Save, XCircle, Pin, PinOff, Megaphone
} from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string; }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex items-center space-x-4 space-x-reverse">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="text-white" size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC<{db: AppDatabase}> = ({ db }) => {
    const totalEarnings = db.offers
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.price, 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="إجمالي المستخدمين" value={db.users.length} icon={Users} color="bg-blue-500" />
            <StatCard title="إجمالي الخدمات" value={db.serviceListings.length} icon={Briefcase} color="bg-purple-500" />
            <StatCard title="إجمالي العروض" value={db.offers.length} icon={CreditCard} color="bg-green-500" />
            <StatCard title="الأرباح المكتملة" value={`${totalEarnings.toLocaleString()} د.ج`} icon={BarChart2} color="bg-yellow-500" />
        </div>
    );
};

const AdminUsers: React.FC<{db: AppDatabase; setDb: React.Dispatch<React.SetStateAction<AppDatabase>>}> = ({ db, setDb }) => {
    
    const handleUserTypeChange = (uid: string, newType: UserType) => {
        setDb(prevDb => ({
            ...prevDb,
            users: prevDb.users.map(u => u.uid === uid ? {...u, type: newType} : u)
        }));
    };

    return (
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">المستخدم</th>
                        <th scope="col" className="px-6 py-3">البريد الإلكتروني</th>
                        <th scope="col" className="px-6 py-3">نوع الحساب</th>
                        <th scope="col" className="px-6 py-3">الرصيد</th>
                    </tr>
                </thead>
                <tbody>
                    {db.users.map(user => (
                        <tr key={user.uid} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.displayName}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">
                                <select 
                                    value={user.type} 
                                    onChange={(e) => handleUserTypeChange(user.uid, e.target.value as UserType)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                >
                                    <option value="merchant">merchant</option>
                                    <option value="confirmer">confirmer</option>
                                    <option value="freelancer">freelancer</option>
                                    <option value="admin">admin</option>
                                </select>
                            </td>
                             <td className="px-6 py-4">{user.walletBalance.toLocaleString()} د.ج</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AdminServices: React.FC<{db: AppDatabase, setDb: React.Dispatch<React.SetStateAction<AppDatabase>>}> = ({ db, setDb }) => {
    const togglePin = (serviceId: string) => {
        setDb(prevDb => ({
            ...prevDb,
            serviceListings: prevDb.serviceListings.map(s => 
                s.id === serviceId ? { ...s, isPinned: !s.isPinned } : s
            )
        }));
    };
    const deleteService = (serviceId: string) => {
        if(window.confirm('هل أنت متأكد من حذف هذه الخدمة نهائياً؟')) {
            setDb(prevDb => ({
                ...prevDb,
                serviceListings: prevDb.serviceListings.filter(s => s.id !== serviceId)
            }));
        }
    };
    return (
        <div className="space-y-3">
            {db.serviceListings.map(service => {
                const user = db.users.find(u => u.uid === service.userId);
                return (
                    <div key={service.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{service.title}</p>
                            <p className="text-sm text-gray-500">بواسطة: {user?.displayName || 'غير معروف'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <button onClick={() => togglePin(service.id)} className={`p-2 rounded-full ${service.isPinned ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                {service.isPinned ? <PinOff size={18} /> : <Pin size={18} />}
                            </button>
                             <button onClick={() => deleteService(service.id)} className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-800">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
const AdminOffers: React.FC<{db: AppDatabase}> = ({ db }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
             <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th className="px-6 py-3">من</th>
                    <th className="px-6 py-3">إلى</th>
                    <th className="px-6 py-3">التفاصيل</th>
                    <th className="px-6 py-3">السعر</th>
                    <th className="px-6 py-3">الحالة</th>
                </tr>
            </thead>
            <tbody>
                {db.offers.map(offer => {
                    const fromUser = db.users.find(u => u.uid === offer.fromUserId);
                    const toUser = db.users.find(u => u.uid === offer.toUserId);
                    return (
                         <tr key={offer.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                             <td className="px-6 py-4">{fromUser?.displayName}</td>
                             <td className="px-6 py-4">{toUser?.displayName}</td>
                             <td className="px-6 py-4 max-w-xs truncate">{offer.details}</td>
                             <td className="px-6 py-4">{offer.price} د.ج</td>
                             <td className="px-6 py-4">{offer.status}</td>
                         </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
);

const AdminSiteServices: React.FC<{db: AppDatabase, setDb: React.Dispatch<React.SetStateAction<AppDatabase>>}> = ({ db, setDb }) => {
    // Basic CRUD for site services
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState<Partial<SiteService> | null>(null);

    const handleSave = (serviceData: Partial<SiteService>) => {
        setDb(prevDb => {
            if (serviceData.id) {
                // Update
                return { ...prevDb, siteServices: prevDb.siteServices.map(s => s.id === serviceData.id ? {...s, ...serviceData} : s) };
            } else {
                // Create
                const newService: SiteService = {
                    id: `ss_${Date.now()}`,
                    title: serviceData.title || '',
                    description: serviceData.description || '',
                    price: serviceData.price || 0,
                    provider: 'Admin',
                    category: 'general',
                    icon: Megaphone, // Default icon
                };
                return { ...prevDb, siteServices: [...prevDb.siteServices, newService] };
            }
        });
        setIsModalOpen(false);
        setCurrentService(null);
    };

    const handleDelete = (id: string) => {
        if(window.confirm('هل أنت متأكد؟')) {
            setDb(prevDb => ({...prevDb, siteServices: prevDb.siteServices.filter(s => s.id !== id)}));
        }
    };

    return (
        <div>
            <button onClick={() => { setCurrentService({}); setIsModalOpen(true); }} className="mb-4 bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"><PlusCircle size={18}/> إضافة خدمة جديدة</button>
            <div className="space-y-3">
                {db.siteServices.map(service => (
                    <div key={service.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{service.title} - <span className="text-primary-500">{service.price.toLocaleString()} د.ج</span></p>
                            <p className="text-sm text-gray-500">{service.description}</p>
                        </div>
                        <div className="flex gap-2">
                             <button onClick={() => { setCurrentService(service); setIsModalOpen(true); }} className="p-2 rounded-full hover:bg-gray-200"><Edit size={18}/></button>
                             <button onClick={() => handleDelete(service.id)} className="p-2 rounded-full text-red-500 hover:bg-red-100"><Trash2 size={18}/></button>
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && <SiteServiceModal service={currentService} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

const SiteServiceModal: React.FC<{service: any, onSave: (data: any) => void, onClose: () => void}> = ({ service, onSave, onClose }) => {
    const [data, setData] = useState(service);
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md space-y-4">
                <h3 className="text-lg font-bold">{service.id ? 'تعديل الخدمة' : 'خدمة جديدة'}</h3>
                <input type="text" placeholder="العنوان" value={data.title || ''} onChange={e => setData({...data, title: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700"/>
                <textarea placeholder="الوصف" value={data.description || ''} onChange={e => setData({...data, description: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700"/>
                <input type="number" placeholder="السعر" value={data.price || ''} onChange={e => setData({...data, price: parseFloat(e.target.value)})} className="w-full p-2 border rounded dark:bg-gray-700"/>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg">إلغاء</button>
                    <button onClick={() => onSave(data)} className="px-4 py-2 bg-primary-500 text-white rounded-lg">حفظ</button>
                </div>
            </div>
        </div>
    );
};


const AdminPage: React.FC<{ user: User; db: AppDatabase; setDb: React.Dispatch<React.SetStateAction<AppDatabase>>; onLogout: () => void; }> = ({ user, db, setDb, onLogout }) => {
    const [view, setView] = useState('dashboard');

    const views = {
        dashboard: { label: 'لوحة التحكم', icon: LayoutDashboard, component: <AdminDashboard db={db} /> },
        users: { label: 'المستخدمون', icon: Users, component: <AdminUsers db={db} setDb={setDb} /> },
        services: { label: 'خدمات المستخدمين', icon: Briefcase, component: <AdminServices db={db} setDb={setDb} /> },
        site_services: { label: 'خدمات الموقع', icon: ShoppingBag, component: <AdminSiteServices db={db} setDb={setDb} /> },
        offers: { label: 'العروض', icon: CreditCard, component: <AdminOffers db={db} /> },
    };

    return (
       <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
                <div className="p-6 text-2xl font-bold text-primary-500 border-b dark:border-gray-700">
                    لوحة التحكم
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    {Object.entries(views).map(([key, { label, icon: Icon }]) => (
                        <button key={key} onClick={() => setView(key)} className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors ${view === key ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                            <Icon size={20} />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>
                 <div className="p-4 border-t dark:border-gray-700">
                     <button onClick={onLogout} className="w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors">
                         <LogOut size={20} />
                         <span>تسجيل الخروج</span>
                     </button>
                 </div>
            </aside>
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">{views[view as keyof typeof views].label}</h1>
                    <div className="flex items-center space-x-3 space-x-reverse">
                        <span className="font-semibold">{user.displayName}</span>
                        <img src={user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.displayName}`} className="w-10 h-10 rounded-full" alt="admin avatar"/>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-6">
                    {views[view as keyof typeof views].component}
                </div>
            </main>
       </div>
    );
};

export default AdminPage;