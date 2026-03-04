"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Stethoscope, MessageSquare, ScrollText, FileText, Globe, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const menu = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'Symptom Checker', icon: Stethoscope, href: '/symptom-checker' },
        { name: 'AI Chat Assistant', icon: MessageSquare, href: '/chat' },
        { name: 'Health Logs', icon: ScrollText, href: '/logs' },
        { name: 'Medical Reports', icon: FileText, href: '/reports' },
    ];

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
        <>
            <div className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col justify-between p-6">
                <div>
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-8 h-8 rounded-lg bg-[#25418F] flex items-center justify-center text-white">
                            <Stethoscope size={20} />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight text-slate-800">Lumina Health</h1>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {menu.map((item) => (
                            <Link key={item.name} href={item.href}>
                                <div
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === item.href
                                        ? 'bg-[#25418F] text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <item.icon size={18} />
                                    {item.name}
                                </div>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="text-xs font-bold text-[#25418F] mb-1">PRO PLAN</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Early prediction AI enabled for 12 months.
                        </p>
                    </div>

                    <div className="space-y-2 border-t border-slate-100 pt-6">
                        <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
                            <Settings size={18} /> Settings
                        </button>
                        <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition">
                            <LogOut size={18} /> Sign Out
                        </button>
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
        </>
    );
};

export default Sidebar;
