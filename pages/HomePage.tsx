import React from 'react';
import { Target, Users, TrendingUp, ShieldCheck, Megaphone, Palette, Video } from 'lucide-react';
import { ConfirmerProfile, AdAccount, SiteService, FreelancerProfile } from '../types';
import { initialDb } from '../data/mockData';

interface HomePageProps {
  onNavigateToAuth: () => void;
}

const mockConfirmers: ConfirmerProfile[] = initialDb.users
    .filter(u => u.type === 'confirmer')
    .slice(0, 3)
    .map(u => ({
        id: u.uid,
        name: u.displayName || 'مؤكد',
        avatarUrl: u.photoURL || `https://picsum.photos/seed/${u.uid}/100`,
        rating: u.avgRating || 5,
        specialties: initialDb.serviceListings.filter(s => s.userId === u.uid).map(s => s.title.split(' لولاية')[0]),
        ratePerOrder: initialDb.serviceListings.find(s => s.userId === u.uid)?.price || 500,
        state: u.state || 'غير محدد'
    }));


const mockFreelancers: FreelancerProfile[] = initialDb.users
    .filter(u => u.type === 'freelancer')
    .slice(0, 3)
    .map(u => ({
        id: u.uid,
        name: u.displayName || 'مستقل',
        avatarUrl: u.photoURL || `https://picsum.photos/seed/${u.uid}/100`,
        rating: u.avgRating || 5,
        skills: u.skills || [],
        description: initialDb.serviceListings.find(s => s.userId === u.uid)?.description || 'مستقل مبدع وجاهز لخدمتك.'
    }));

const mockAdAccounts: AdAccount[] = [
    { id: 'acc1', platform: 'Facebook', name: 'حساب إعلاني موثوق', spendingLimit: 500, price: 15000, imageUrl: 'https://picsum.photos/seed/fb/400/300' },
    { id: 'acc2', platform: 'Google', name: 'حساب Google Ads جاهز', spendingLimit: 1000, price: 25000, imageUrl: 'https://picsum.photos/seed/google/400/300' },
    { id: 'acc3', platform: 'TikTok', name: 'حساب TikTok للشركات', spendingLimit: 300, price: 12000, imageUrl: 'https://picsum.photos/seed/tiktok/400/300' },
];

const services: SiteService[] = initialDb.siteServices;

const Section: React.FC<{ id: string; title: string; children: React.ReactNode; className?: string }> = ({ id, title, children, className = '' }) => (
    <section id={id} className={`py-12 md:py-20 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center mb-10 text-gray-900 dark:text-white">{title}</h2>
            {children}
        </div>
    </section>
);

const Hero: React.FC<{ onNavigateToAuth: () => void; }> = ({ onNavigateToAuth }) => (
    <div className="relative text-center py-20 md:py-32 bg-gray-100 dark:bg-gray-800">
        <div
            className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-5"
            style={{ backgroundImage: "url('https://picsum.photos/seed/hero/1200/800')" }}
        ></div>
        <div className="relative container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight animate-fade-in-down">
                منصتك المتكاملة للتجارة الإلكترونية في الجزائر
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 animate-fade-in-up">
                كل ما يحتاجه التاجر الإلكتروني في مكان واحد: مؤكدون، مستقلون، خدمات إعلانية، والمزيد.
            </p>
            <div className="mt-8 flex justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <button onClick={onNavigateToAuth} className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-transform transform hover:scale-105">
                    ابدأ الآن مجانًا
                </button>
                <a href="#services" className="px-8 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-transform transform hover:scale-105">
                    اكتشف الخدمات
                </a>
            </div>
        </div>
    </div>
);

const ConfirmerCard: React.FC<{ confirmer: ConfirmerProfile }> = ({ confirmer }) => (
     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transform transition-all hover:-translate-y-2 duration-300">
        <div className="p-6">
            <div className="flex items-center space-x-4 space-x-reverse">
                <img className="w-16 h-16 rounded-full" src={confirmer.avatarUrl} alt={confirmer.name} />
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{confirmer.name}</h3>
                    <div className="flex items-center mt-1 text-yellow-400">
                        <span>{confirmer.rating.toFixed(1)}</span>
                        <svg className="w-4 h-4 fill-current ml-1" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">الاختصاصات:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {confirmer.specialties.map(spec => <span key={spec} className="px-2 py-1 text-xs bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full">{spec}</span>)}
                </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{confirmer.ratePerOrder} د.ج / طلبية</span>
                <button className="px-4 py-2 text-sm bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                    تواصل
                </button>
            </div>
        </div>
    </div>
);

const FreelancerCard: React.FC<{ freelancer: FreelancerProfile }> = ({ freelancer }) => (
     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transform transition-all hover:-translate-y-2 duration-300">
        <div className="p-6">
            <div className="flex items-center space-x-4 space-x-reverse">
                <img className="w-16 h-16 rounded-full" src={freelancer.avatarUrl} alt={freelancer.name} />
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{freelancer.name}</h3>
                    <div className="flex items-center mt-1 text-yellow-400">
                        <span>{freelancer.rating.toFixed(1)}</span>
                        <svg className="w-4 h-4 fill-current ml-1" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">المهارات:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {freelancer.skills.map(skill => <span key={skill} className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">{skill}</span>)}
                </div>
            </div>
             <p className="text-sm text-gray-700 dark:text-gray-300 mt-4 h-10 overflow-hidden">{freelancer.description}</p>
            <div className="mt-6 flex justify-end items-center">
                <button className="px-4 py-2 text-sm bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                    اطلب خدمة
                </button>
            </div>
        </div>
    </div>
);

const ServiceCard: React.FC<{ service: SiteService }> = ({ service }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl p-8 text-center transform transition-all hover:-translate-y-2 duration-300">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 mb-6">
            <service.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{service.title}</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{service.description}</p>
        <div className="mt-6 flex justify-between items-center w-full">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{service.price.toLocaleString()} د.ج</span>
            <button className="px-4 py-2 text-sm bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                اطلب الآن
            </button>
        </div>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigateToAuth }) => {
    return (
        <>
            <Hero onNavigateToAuth={onNavigateToAuth}/>

            <Section id="services" title="خدماتنا الرسمية" className="bg-gray-50 dark:bg-gray-900">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map(service => <ServiceCard key={service.id} service={service} />)}
                </div>
            </Section>
            
            <Section id="confirmers" title="أبرز المؤكدين">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockConfirmers.map(confirmer => <ConfirmerCard key={confirmer.id} confirmer={confirmer} />)}
                </div>
            </Section>

            <Section id="freelancers" title="مستقلون مبدعون" className="bg-gray-50 dark:bg-gray-900">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockFreelancers.map(freelancer => <FreelancerCard key={freelancer.id} freelancer={freelancer} />)}
                </div>
            </Section>
        </>
    );
};

export default HomePage;
