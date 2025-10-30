import React, { useState } from 'react';
import { User, UserType } from '../types';
import { Briefcase, ShoppingBag, UserCheck, CheckCircle } from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: User) => void;
  users: User[];
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, users }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<UserType>('merchant'); // for sign up
  const [loginUserType, setLoginUserType] = useState<UserType>('merchant'); // for sign in
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const typeDescriptions = {
      merchant: 'انضم كتاجر وابدأ بتوسيع مبيعاتك والوصول إلى أفضل المؤكدين والمستقلين.',
      confirmer: 'استغل مهاراتك في تأكيد الطلبات وحقق دخلاً إضافياً. انضم لشبكتنا الآن.',
      freelancer: 'قدم خدماتك الإبداعية في التصميم والمونتاج وإدارة الحملات لأكبر التجار في الجزائر.',
  };

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // --- MOCK AUTHENTICATION LOGIC ---
    setTimeout(() => {
      // Special admin login
      if (email === 'Khaled' && password === 'Khaled') {
          const adminUser = users.find(u => u.type === 'admin');
          if (adminUser) {
              onLogin(adminUser);
              setIsLoading(false);
              return;
          }
      }

      if (isLogin) {
        const foundUser = users.find(u => 
            u.email?.toLowerCase() === email.toLowerCase() &&
            u.type === loginUserType
        );

        if (foundUser && password === 'password') { // Simplified password check
            onLogin(foundUser);
        } else {
          setError('البيانات غير صحيحة أو نوع الحساب غير مطابق.');
        }
      } else {
        if (!name || !email || !password) {
            setError('الرجاء ملء جميع الحقول.');
        } else {
            const mockUser: User = {
                uid: `mock_${Date.now()}`,
                email,
                displayName: name,
                type: userType,
                walletBalance: 0,
                ratingsReceived: [],
                avgRating: 0,
            };
            // In a real app, this would add the user to the DB. Here we just log them in.
            onLogin(mockUser);
        }
      }
      setIsLoading(false);
    }, 1500);
  };
  
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
        const mockUser = users.find(u => u.type === 'merchant');
        if (mockUser) onLogin(mockUser);
        setIsLoading(false);
    }, 1000);
  };


  return (
    <div className="min-h-full flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl lg:grid lg:grid-cols-2 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        
        <div className="p-8 sm:p-12 flex flex-col justify-center order-2 lg:order-1">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {isLogin ? 'أهلاً بعودتك!' : 'انضم إلى النخبة'}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {isLogin ? 'سجل الدخول للمتابعة إلى حسابك.' : 'أنشئ حساباً جديداً وابدأ رحلتك نحو النجاح.'}
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleAuthAction}>
                {!isLogin && (
                  <>
                    <div>
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 tracking-wide mb-2 block">اختر نوع حسابك:</label>
                      <div className="space-y-3">
                        <UserTypeCard type='merchant' label="تاجر" description={typeDescriptions.merchant} icon={ShoppingBag} selectedType={userType} onSelect={setUserType} />
                        <UserTypeCard type='confirmer' label="مؤكد طلبات" description={typeDescriptions.confirmer} icon={UserCheck} selectedType={userType} onSelect={setUserType} />
                        <UserTypeCard type='freelancer' label="مستقل" description={typeDescriptions.freelancer} icon={Briefcase} selectedType={userType} onSelect={setUserType} />
                      </div>
                    </div>

                    <div>
                      <input id="name" name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)}
                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                        placeholder="الاسم الكامل"
                      />
                    </div>
                  </>
                )}
                {isLogin && (
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 tracking-wide block">
                            تسجيل الدخول كـ:
                        </label>
                        <div className="flex space-x-2 space-x-reverse rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
                            <button type="button" onClick={() => setLoginUserType('merchant')} className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${loginUserType === 'merchant' ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow' : 'bg-transparent text-gray-600 dark:text-gray-300'}`}>
                                تاجر
                            </button>
                            <button type="button" onClick={() => setLoginUserType('confirmer')} className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${loginUserType === 'confirmer' ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow' : 'bg-transparent text-gray-600 dark:text-gray-300'}`}>
                                مؤكد
                            </button>
                            <button type="button" onClick={() => setLoginUserType('freelancer')} className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${loginUserType === 'freelancer' ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow' : 'bg-transparent text-gray-600 dark:text-gray-300'}`}>
                                مستقل
                            </button>
                        </div>
                    </div>
                )}
                <div>
                  <input id="email-address" name="email" type="text" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder={isLogin ? "اسم المستخدم أو البريد الإلكتروني" : "البريد الإلكتروني"}
                  />
                </div>
                <div>
                  <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="كلمة المرور"
                  />
                </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <div>
                <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 transition-colors">
                  {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (isLogin ? 'تسجيل الدخول' : 'إنشاء حساب')
                  }
                </button>
              </div>
            </form>
            <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div><span className="flex-shrink mx-4 text-xs text-gray-500 dark:text-gray-400">أو تابع بواسطة</span><div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div>
                 <button type="button" onClick={handleGoogleSignIn} disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors">
                    <svg className="w-5 h-5 ml-2" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 74.3C309 93.5 280.7 80 248 80c-73.2 0-132.3 59.2-132.3 132S174.8 384 248 384c87.3 0 114.3-64.8 118.9-97.3H248v-95.6h236.3c2.4 12.8 3.7 26.4 3.7 40.5z"></path></svg>
                    Google
                 </button>
            </div>
            <div className="text-sm text-center mt-6">
              <a onClick={() => setIsLogin(!isLogin)} className="font-medium text-primary-600 hover:text-primary-500 cursor-pointer">
                {isLogin ? 'ليس لديك حساب؟ قم بإنشاء واحد' : 'هل لديك حساب بالفعل؟ سجل الدخول'}
              </a>
            </div>
        </div>

        <div className="hidden lg:block relative order-1 lg:order-2">
             <img src="https://picsum.photos/seed/authpro/800/1200" className="absolute inset-0 w-full h-full object-cover" alt="Marketers Hub" />
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
             <div className="relative p-12 flex flex-col justify-end h-full text-white">
                <h1 className="text-4xl font-bold leading-snug">
                  منصتك المتكاملة<br/>للتجارة الإلكترونية في الجزائر
                </h1>
                <p className="mt-4 text-lg text-gray-200">
                  كل ما يحتاجه التاجر الإلكتروني في مكان واحد: مؤكدون، مستقلون، خدمات إعلانية، والمزيد.
                </p>
             </div>
        </div>

      </div>
    </div>
  );
};

const UserTypeCard: React.FC<{type: UserType, label: string, description: string, icon: React.ElementType, selectedType: UserType, onSelect: (type: UserType) => void}> = ({ type, label, description, icon: Icon, selectedType, onSelect }) => {
    const isSelected = selectedType === type;
    return (
        <button 
            type="button" 
            onClick={() => onSelect(type)} 
            className={`w-full p-4 border-2 rounded-lg flex items-center space-x-4 space-x-reverse transition-all duration-200 ${isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}
        >
            <div className={`p-2 rounded-full ${isSelected ? 'bg-primary-100 dark:bg-primary-900/50' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <Icon className={`h-6 w-6 ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
            </div>
            <div className="text-right flex-grow">
                <span className="font-bold text-gray-900 dark:text-white">{label}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            {isSelected && <CheckCircle className="mr-auto text-primary-500" size={20} />}
        </button>
    );
}

export default AuthPage;