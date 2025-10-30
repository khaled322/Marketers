import { AppDatabase, User, ServiceListing, Offer, Message, Transaction, Rating, SiteService, Notification, AdCampaign } from '../types';
import { Megaphone, ShieldCheck, Palette, Store, ClipboardCheck } from 'lucide-react';

export const users: User[] = [
    { 
        uid: 'merchant1', 
        displayName: 'تاجر تجريبي', 
        email: 'merchant@example.com', 
        type: 'merchant', 
        status: 'active',
        walletBalance: 50000, 
        badges: ['تاجر موثوق'],
        avgRating: 4.5,
        ratingsReceived: [],
    },
    { 
        uid: 'confirmer1', 
        displayName: 'أمين بوعلام', 
        email: 'confirmer@example.com', 
        type: 'confirmer', 
        status: 'active',
        walletBalance: 12500, 
        photoURL: 'https://picsum.photos/seed/user1/100',
        state: 'الجزائر العاصمة',
        avgRating: 4.9,
        ratingsReceived: [],
    },
    { 
        uid: 'confirmer2', 
        displayName: 'فاطمة الزهراء', 
        email: 'confirmer2@example.com', 
        type: 'confirmer', 
        status: 'active',
        walletBalance: 8000, 
        photoURL: 'https://picsum.photos/seed/user2/100',
        state: 'وهران',
        avgRating: 4.8,
        ratingsReceived: [],
    },
    { 
        uid: 'freelancer1', 
        displayName: 'سارة Creative', 
        email: 'freelancer@example.com', 
        type: 'freelancer', 
        status: 'active',
        walletBalance: 25000, 
        badges: ['مستقل متميز'], 
        photoURL: 'https://picsum.photos/seed/fr1/100',
        skills: ['تصميم صور', 'مونتاج فيديو'],
        avgRating: 4.9,
        ratingsReceived: [],
    },
    { 
        uid: 'freelancer2', 
        displayName: 'علي ميديا', 
        email: 'freelancer2@example.com', 
        type: 'freelancer', 
        status: 'suspended',
        walletBalance: 18000, 
        photoURL: 'https://picsum.photos/seed/fr2/100',
        skills: ['إدارة حملات فيسبوك', 'كتابة محتوى'],
        avgRating: 4.7,
        ratingsReceived: [],
    },
    {
        uid: 'admin1',
        displayName: 'Khaled Admin',
        email: 'admin@example.com',
        type: 'admin',
        status: 'active',
        walletBalance: 999999,
    }
];

export const serviceListings: ServiceListing[] = [
    { id: 'sl1', userId: 'confirmer1', title: 'تأكيد طلبات لولاية الجزائر', category: 'confirmation', description: 'تأكيد احترافي لجميع طلباتكم في ولاية الجزائر العاصمة وضواحيها.', price: 500, priceType: 'per_order', imageUrl: 'https://picsum.photos/seed/s1/400/300' },
    { id: 'sl2', userId: 'confirmer2', title: 'تأكيد طلبات لولاية وهران', category: 'confirmation', description: 'خبرة في تأكيد طلبات مستحضرات التجميل والاكسسوارات.', price: 450, priceType: 'per_order', imageUrl: 'https://picsum.photos/seed/s2/400/300' },
    { id: 'sl3', userId: 'freelancer1', title: 'تصميم صور إعلانية احترافية', category: 'design', description: 'تصميم 5 صور إعلانية جذابة ومناسبة لمنصات التواصل الاجتماعي.', price: 10000, priceType: 'fixed', imageUrl: 'https://picsum.photos/seed/s3/400/300', isPinned: true },
    { id: 'sl4', userId: 'freelancer1', title: 'مونتاج فيديو إعلاني قصير', category: 'video', description: 'مونتاج فيديو قصير (حتى 30 ثانية) لعرض منتجك بشكل احترافي.', price: 15000, priceType: 'fixed', imageUrl: 'https://picsum.photos/seed/s4/400/300' },
    { id: 'sl5', userId: 'freelancer2', title: 'إدارة حملات فيسبوك', category: 'marketing', description: 'إدارة حملة إعلانية على فيسبوك لمدة أسبوع مع تحسين النتائج.', price: 20000, priceType: 'fixed', imageUrl: 'https://picsum.photos/seed/s5/400/300' },
];


export const offers: Offer[] = [
    { id: 'o1', fromUserId: 'merchant1', toUserId: 'confirmer1', serviceId: 'sl1', details: 'تأكيد 20 طلبية لولاية الجزائر', price: 10000, status: 'pending', createdAt: '2024-05-20T10:00:00Z', isRated: false },
    { id: 'o2', fromUserId: 'merchant1', toUserId: 'freelancer1', serviceId: 'sl3', details: 'تصميم 5 صور إعلانية لمنتج جديد', price: 10000, status: 'accepted', createdAt: '2024-05-19T14:00:00Z', isRated: false },
    { id: 'o3', fromUserId: 'merchant1', toUserId: 'confirmer2', details: 'تأكيد طلبات عاجلة لولاية وهران', price: 5000, status: 'completed', createdAt: '2024-05-18T11:00:00Z', isRated: true },
    { id: 'o4', fromUserId: 'confirmer1', toUserId: 'merchant1', details: 'عرض لتأكيد 100 طلبية بسعر خاص', price: 48000, status: 'rejected', createdAt: '2024-05-17T09:00:00Z', isRated: false },
    { id: 'o5', fromUserId: 'merchant1', toUserId: 'freelancer2', serviceId: 'sl5', details: 'إدارة حملة إعلانية لمنتج ساعات', price: 20000, status: 'completed', createdAt: '2024-05-15T16:00:00Z', isRated: false },
];

export const messages: { [conversationId: string]: { participants: string[], messages: Message[] } } = {
  'merchant1_freelancer1': {
    participants: ['merchant1', 'freelancer1'],
    messages: [
      { id: 'm4', senderId: 'merchant1', text: 'أهلاً سارة، بخصوص تصميم الصور، متى يمكن أن تكون جاهزة؟', timestamp: 'أمس', isRead: false },
       { id: 'm5', senderId: 'freelancer1', text: 'أهلاً بك، ستكون جاهزة غداً مساءً إن شاء الله.', timestamp: 'اليوم', isRead: true },
    ]
  }
};

export const transactions: Transaction[] = [
    { id: 't1', date: '2023-10-26', description: 'دفع خدمة تصميم لـ سارة Creative', amount: -10000, status: 'completed', type: 'payment' },
    { id: 't2', date: '2023-10-25', description: 'إيداع في المحفظة', amount: 50000, status: 'completed', type: 'deposit' },
    { id: 't3', date: '2023-10-24', description: 'سحب أرباح', amount: -20000, status: 'pending', type: 'withdrawal' },
    { id: 't4', date: '2023-10-22', description: 'أرباح من تاجر تجريبي', amount: 5000, status: 'completed', type: 'earning' },
];

export const ratings: Rating[] = [
    { id: 'r1', offerId: 'o3', fromUserId: 'merchant1', toUserId: 'confirmer2', stars: 5, comment: 'خدمة ممتازة وسريعة، شكراً جزيلاً!', createdAt: '2024-05-18T18:00:00Z' }
];

export const siteServices: SiteService[] = [
    { id: 'ss1', title: 'إدارة الحملات الإعلانية', description: 'خبراء في إدارة حملاتك على فيسبوك وجوجل لتحقيق أفضل النتائج.', provider: 'Expert Ads', icon: Megaphone, price: 30000, category: 'إدارة حملات' },
    { id: 'ss2', title: 'خدمات إبداعية', description: 'مصممون ومحررو فيديو لإنشاء محتوى إعلاني جذاب لمنتجاتك.', provider: 'Creative Studio', icon: Palette, price: 15000, category: 'خدمات إبداعية' },
    { id: 'ss3', title: 'إنشاء متجر إلكتروني', description: 'احصل على متجر إلكتروني احترافي ومتكامل لبيع منتجاتك.', provider: 'Store Builders', icon: Store, price: 80000, category: 'تطوير متاجر' },
    { id: 'ss4', title: 'خدمة تأكيد الطلبيات', description: 'فريق متخصص لرفع نسبة تأكيد طلباتك وتقليل المرتجعات.', provider: 'Confirmex', icon: ClipboardCheck, price: 25000, category: 'تأكيد طلبات' },
];

export const notifications: Notification[] = [
    { id: 'n1', userId: 'confirmer1', text: 'عرض جديد من "تاجر تجريبي" لتأكيد مجموعة طلبات.', type: 'offer', link: { view: 'offers', params: { offerId: 'o1' } }, isRead: false, timestamp: 'منذ 5 دقائق' },
    { id: 'n2', userId: 'merchant1', text: 'وافق "أمين بوعلام" على عرضك.', type: 'offer', link: { view: 'offers', params: { offerId: 'o1' } }, isRead: false, timestamp: 'منذ 15 دقيقة' },
    { id: 'n3', userId: 'freelancer1', text: 'رسالة جديدة من "تاجر تجريبي".', type: 'message', link: { view: 'messages' }, isRead: true, timestamp: 'منذ ساعة' },
    { id: 'n4', userId: 'merchant1', text: 'تم إكمال طلبك من طرف "فاطمة الزهراء". يمكنك الآن تقييم الخدمة.', type: 'system', link: { view: 'offers', params: { offerId: 'o3' } }, isRead: true, timestamp: 'بالأمس' },
];

export const adCampaigns: AdCampaign[] = [
    { id: 'ac1', userId: 'merchant1', name: 'حملة ساعات العيد', description: 'أفضل الساعات بأفضل الأسعار لمناسبة العيد.', imageUrl: 'https://picsum.photos/seed/ad1/400/300', status: 'running', createdAt: '2024-05-18T11:00:00Z' },
    { id: 'ac2', userId: 'merchant1', name: 'حملة العطور الصيفية', description: 'عطور منعشة للصيف.', imageUrl: 'https://picsum.photos/seed/ad2/400/300', status: 'completed', createdAt: '2024-04-10T11:00:00Z' },
    { id: 'ac3', userId: 'merchant1', name: 'مراجعة تصميم جديد', description: 'تصميم جديد لمنتج حقائب اليد.', status: 'pending_review', createdAt: '2024-05-20T11:00:00Z' }
];


export const initialDb: AppDatabase = {
    users,
    serviceListings,
    offers,
    messages,
    transactions,
    ratings,
    siteServices,
    notifications,
    adCampaigns,
};

// Update users with their calculated initial ratings
initialDb.users = initialDb.users.map(u => {
    const userRatings = initialDb.ratings.filter(r => r.toUserId === u.uid);
    if(userRatings.length === 0) return { ...u, ratingsReceived: [], avgRating: 0 };
    
    const avgRating = userRatings.reduce((acc, r) => acc + r.stars, 0) / userRatings.length;
    return {
        ...u,
        ratingsReceived: userRatings,
        avgRating: parseFloat(avgRating.toFixed(1))
    };
});