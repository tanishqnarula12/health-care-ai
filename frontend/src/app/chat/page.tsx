"use client";
import DashboardLayout from '../../components/DashboardLayout';
import { Plus, MessageSquare, Activity, Settings, LogOut, Send, Mic, Paperclip } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';

export default function ChatPage() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleSignOut = () => {
        logout();
        router.push('/');
    };

    const setLanguage = (lang: string) => {
        const value = lang === 'en' ? '/en/en' : '/en/hi';
        document.cookie = `googtrans=${value}; path=/`;
        document.cookie = `googtrans=${value}; domain=${window.location.hostname}; path=/`;
        window.location.reload();
    };
    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Custom Sidebar for Chat */}
            <div className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col justify-between p-6">
                <div>
                    <button className="w-full bg-[#25418F] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:bg-blue-800 transition mb-8">
                        <Plus size={18} /> New Consultation
                    </button>

                    <h4 className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase mb-4">Recent Chats</h4>
                    <div className="space-y-2 mb-8">
                        <div className="text-xs text-slate-400 font-medium italic p-2 rounded-xl text-center">
                            No recent consultations found.
                        </div>
                    </div>

                    <h4 className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase mb-4">Health Metrics</h4>
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Blood Pressure</span>
                            <span className="text-[10px] font-bold text-slate-400">Pending</span>
                        </div>
                        <div>
                            <span className="text-2xl font-black text-slate-800">--/--</span>
                            <span className="text-[10px] font-bold text-slate-400 ml-1">mmHg</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-6">
                    <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-3 w-full p-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition">
                        <Settings size={18} /> Settings
                    </button>
                    <button onClick={handleSignOut} className="flex items-center gap-3 w-full p-2 text-sm font-bold text-red-500 hover:text-red-700 transition">
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[url('/chat-bg-pattern-placeholder.png')] bg-repeat">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-4xl mx-auto w-full">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#25418F] flex items-center justify-center shrink-0 text-white shadow-sm">
                            A
                        </div>
                        <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-slate-200 text-slate-700 font-medium shadow-sm w-full">
                            <p className="mb-4">Hello! I'm Aura, your medical assistant. I can help analyze your symptoms and suggest early care steps.</p>
                            <p>To get started, please describe any symptoms you are experiencing or tell me about your health concern.</p>

                            <div className="flex gap-3 mt-4">
                                <button className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-[#25418F] bg-slate-50 hover:bg-slate-100 transition">Common Flu Symptoms</button>
                                <button className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-[#25418F] bg-slate-50 hover:bg-slate-100 transition">Check Heart Health</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-slate-200 flex justify-center">
                    <div className="w-full max-w-4xl relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
                            <div className="w-px h-4 bg-transparent"></div>
                            <button className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2 hover:text-[#25418F] transition">
                                <Paperclip size={14} /> Add Reports
                            </button>
                        </div>

                        <input type="text" placeholder="Type your symptoms here..." className="w-full py-5 pl-80 pr-24 rounded-2xl border border-slate-300 bg-white font-medium text-slate-800 shadow-sm focus:border-[#25418F] focus:outline-none transition" />

                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
                            <button className="w-10 h-10 bg-[#25418F] text-white rounded-xl flex items-center justify-center hover:bg-blue-800 transition shadow-md"><Send size={18} /></button>
                        </div>

                        <p className="text-center text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-4">AI Advice is for information only. Consult a doctor for medical diagnosis.</p>
                    </div>
                </div>
            </div>

            {isSettingsOpen && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
                        <button onClick={() => setIsSettingsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition p-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Settings size={20} className="text-[#25418F]" /> System Settings
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Language & Region</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setLanguage('en')} className="py-3 px-4 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:border-[#25418F] hover:text-[#25418F] transition focus:border-[#25418F] focus:text-[#25418F] bg-white">
                                        English
                                    </button>
                                    <button onClick={() => setLanguage('hi')} className="py-3 px-4 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:border-[#25418F] hover:text-[#25418F] transition focus:border-[#25418F] focus:text-[#25418F] bg-white text-sm">
                                        हिन्दी (Hindi)
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-3 italic">Changes will reload the system.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
