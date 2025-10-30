import React, { useMemo } from 'react';
import { User, AppDatabase, Offer } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, ShoppingCart, Percent, CheckCircle } from 'lucide-react';


const StatisticsContent: React.FC<{ user: User, db: AppDatabase }> = ({ user, db }) => {
    const userOffers = db.offers.filter(o => o.toUserId === user.uid || o.fromUserId === user.uid);

    const stats = useMemo(() => {
        const completed = userOffers.filter(o => o.status === 'completed');
        const totalEarnings = completed.filter(o => o.toUserId === user.uid).reduce((sum, o) => sum + o.price, 0);
        const totalSpending = completed.filter(o => o.fromUserId === user.uid).reduce((sum, o) => sum + o.price, 0);
        const successRate = userOffers.length > 0 ? (completed.length / userOffers.length) * 100 : 0;
        return {
            completedOffers: completed.length,
            totalEarnings,
            totalSpending,
            successRate
        };
    }, [userOffers, user.uid]);

    const chartData = useMemo(() => {
         return [
            { name: 'يناير', أرباح: 4000, إنفاق: 2400 },
            { name: 'فبراير', أرباح: 3000, إنفاق: 1398 },
            { name: 'مارس', أرباح: stats.totalEarnings, إنفاق: stats.totalSpending },
            { name: 'أبريل', أرباح: 2780, إنفاق: 3908 },
            { name: 'مايو', أرباح: 1890, إنفاق: 4800 },
        ];
    }, [stats]);

    const pieData = [
        { name: 'مكتملة', value: stats.completedOffers },
        { name: 'قيد الانتظار', value: userOffers.filter(o=>o.status === 'pending').length },
        { name: 'مقبولة', value: userOffers.filter(o=>o.status === 'accepted').length },
        { name: 'مرفوضة', value: userOffers.filter(o=>o.status === 'rejected').length },
    ];
    const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444'];
    
    const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, color: string }> = ({ icon: Icon, title, value, color }) => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4 space-x-reverse">
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="text-white" size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    );
    
    return (
        <div className="p-2 sm:p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={DollarSign} title={user.type === 'merchant' ? 'إجمالي الإنفاق' : 'إجمالي الأرباح'} value={`${user.type === 'merchant' ? stats.totalSpending : stats.totalEarnings} د.ج`} color="bg-green-500" />
                <StatCard icon={ShoppingCart} title="العروض المكتملة" value={stats.completedOffers.toString()} color="bg-blue-500" />
                <StatCard icon={Percent} title="نسبة النجاح" value={`${stats.successRate.toFixed(1)}%`} color="bg-yellow-500" />
                <StatCard icon={CheckCircle} title="مجموع العروض" value={userOffers.length.toString()} color="bg-purple-500" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-4">الأداء الشهري</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis dataKey="name" tick={{ fill: 'rgb(156 163 175)'}} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'rgb(156 163 175)'}} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', color: 'white', borderRadius: '0.5rem' }} />
                            <Legend />
                            <Bar dataKey="أرباح" fill="#10B981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="إنفاق" fill="#EF4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                     <h3 className="font-bold mb-4">حالة العروض</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', color: 'white', borderRadius: '0.5rem' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StatisticsContent;
