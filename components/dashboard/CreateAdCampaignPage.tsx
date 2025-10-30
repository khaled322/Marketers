import React, { useState, useMemo } from 'react';
import { User, AppDatabase, AdCampaign } from '../../types';
import { ChevronLeft, PlusCircle, Image as ImageIcon, Link, Bot, Loader } from 'lucide-react';
import { generateTextWithImage } from '../../services/geminiService';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to convert blob to base64"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const CreateAdCampaignPage: React.FC<{ user: User; db: AppDatabase; setDb: React.Dispatch<React.SetStateAction<AppDatabase>>; onBack: () => void; }> = ({ user, db, setDb, onBack }) => {
    const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

    const [campaignName, setCampaignName] = useState('');
    const [description, setDescription] = useState('');
    const [adLink, setAdLink] = useState('');
    const [postLink, setPostLink] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGenerateAI = async () => {
        if (!imageFile) {
            alert("يرجى تحميل صورة المنتج أولاً.");
            return;
        }
        setIsGenerating(true);
        try {
            const base64Image = await blobToBase64(imageFile);
            const prompt = "أنت خبير تسويق في الجزائر. استنادًا إلى صورة المنتج هذه، قم بإنشاء عنوان جذاب للحملة الإعلانية ووصف قصير ومقنع للمنتج. اجعل النص بالدارجة الجزائرية ومناسبًا لفيسبوك.";
            const response = await generateTextWithImage(prompt, base64Image, imageFile.type);
            
            // The response should be a valid JSON string now
            const parsed = JSON.parse(response);

            setCampaignName(parsed.name || '');
            setDescription(parsed.description || '');

        } catch (error) {
            console.error("AI generation failed:", error);
            alert("فشل إنشاء المحتوى بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCampaign: AdCampaign = {
            id: `ad_${Date.now()}`,
            userId: user.uid,
            name: campaignName,
            description,
            adLink,
            postLink,
            imageUrl: imagePreview || undefined,
            status: 'pending_review',
            createdAt: new Date().toISOString()
        };
        setDb(prev => ({...prev, adCampaigns: [...prev.adCampaigns, newCampaign]}));
        // Reset form
        setCampaignName('');
        setDescription('');
        setAdLink('');
        setPostLink('');
        setImageFile(null);
        setImagePreview(null);
        setActiveTab('manage');
    };

    const userCampaigns = useMemo(() => {
        return db.adCampaigns.filter(ad => ad.userId === user.uid)
            .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [db.adCampaigns, user.uid]);
    
    const statusMap = {
        pending_review: { text: 'قيد المراجعة', color: 'bg-yellow-500' },
        approved: { text: 'موافق عليه', color: 'bg-blue-500' },
        rejected: { text: 'مرفوض', color: 'bg-red-500' },
        running: { text: 'جاري', color: 'bg-green-500' },
        completed: { text: 'مكتمل', color: 'bg-gray-500' },
    };

    return (
        <div className="flex flex-col h-full">
            <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-md h-14 flex items-center px-4">
                <button onClick={onBack} className="p-2 text-gray-600 dark:text-gray-300">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-lg font-bold mx-auto pr-8">مدير الحملات الإعلانية</h2>
            </div>
            <div className="p-2 sm:p-4 flex-grow overflow-y-auto">
                 <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md mb-4 flex">
                    <button onClick={() => setActiveTab('create')} className={`flex-1 py-2 text-center rounded-md font-semibold ${activeTab === 'create' ? 'bg-primary-500 text-white' : ''}`}>إنشاء حملة</button>
                    <button onClick={() => setActiveTab('manage')} className={`flex-1 py-2 text-center rounded-md font-semibold ${activeTab === 'manage' ? 'bg-primary-500 text-white' : ''}`}>إدارة الحملات</button>
                </div>

                {activeTab === 'create' && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">صورة المنتج</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        {imagePreview ? <img src={imagePreview} alt="preview" className="mx-auto h-24 w-auto"/> : <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />}
                                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500">
                                                <span>تحميل ملف</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                            </label>
                                            <p className="pl-1">أو اسحب وأفلت</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <button type="button" onClick={handleGenerateAI} disabled={!imageFile || isGenerating} className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-primary-500 hover:from-purple-600 hover:to-primary-600 disabled:opacity-50">
                                {isGenerating ? <Loader className="animate-spin" size={20} /> : <Bot size={20} />}
                                <span>إنشاء المحتوى بالذكاء الاصطناعي</span>
                            </button>
                            
                            <div>
                               <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">اسم الحملة</label>
                               <input type="text" id="campaignName" value={campaignName} onChange={e => setCampaignName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                            </div>
                             <div>
                               <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">الوصف</label>
                               <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                            </div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">إرسال للمراجعة</button>
                        </form>
                    </div>
                )}
                
                {activeTab === 'manage' && (
                    <div className="space-y-3">
                        {userCampaigns.length > 0 ? userCampaigns.map(ad => (
                             <div key={ad.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md flex items-center space-x-3 space-x-reverse">
                                {ad.imageUrl && <img src={ad.imageUrl} alt={ad.name} className="w-16 h-16 rounded-md object-cover" />}
                                <div className="flex-grow">
                                    <p className="font-bold">{ad.name}</p>
                                    <p className="text-xs text-gray-500">{new Date(ad.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs text-white rounded-full ${statusMap[ad.status].color}`}>{statusMap[ad.status].text}</span>
                             </div>
                        )) : <p className="text-center text-gray-500 py-8">لا توجد حملات إعلانية بعد.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateAdCampaignPage;