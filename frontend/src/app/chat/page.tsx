"use client";
import DashboardLayout from '../../components/DashboardLayout';
import { Plus, MessageSquare, Activity, Settings, LogOut, Send, Mic, Paperclip, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { useHealthStore } from '../../store/useHealthStore';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatPage() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const vitals = useHealthStore((state) => state.vitals);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const initialMessage: Message = {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm Aura, your medical assistant. I can help analyze your symptoms and suggest early care steps. To get started, please describe any symptoms you are experiencing or tell me about your health concern."
    };

    const [messages, setMessages] = useState<Message[]>([initialMessage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

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

    const handleSend = async (text: string = inputValue) => {
        if (!text.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text.trim()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Call the real Gemini AI Backend
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer DUMMY_TOKEN' // Auth mock since we are running without real auth
                },
                body: JSON.stringify({
                    message: text.trim(),
                    recentVitals: vitals
                })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response || "I cannot reach the AI service right now."
            };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error("AI Chat Error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I encountered an error trying to connect to the medical AI. Please ensure the backend is running."
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    const resetChat = () => {
        setMessages([initialMessage]);
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Custom Sidebar for Chat */}
            <div className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col justify-between p-6 shrink-0 z-10 hidden md:flex">
                <div>
                    <button onClick={resetChat} className="w-full bg-[#25418F] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:bg-blue-800 transition mb-8">
                        <Plus size={18} /> New Consultation
                    </button>

                    <h4 className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase mb-4">Recent Chats</h4>
                    <div className="space-y-3 mb-8">
                        <div className="text-xs text-slate-400 font-medium italic p-4 rounded-xl text-center bg-slate-50 border border-slate-100">
                            No saved consultations found.
                        </div>
                    </div>

                    <h4 className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase mb-4">Health Metrics</h4>
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col hover:border-[#25418F] transition cursor-default">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Activity size={12} /> Blood Pressure</span>
                            {vitals.bloodPressureSys ? (
                                <span className="text-[10px] font-bold text-emerald-500">Active</span>
                            ) : (
                                <span className="text-[10px] font-bold text-slate-400">Pending</span>
                            )}
                        </div>
                        <div>
                            <span className="text-2xl font-black text-slate-800">
                                {vitals.bloodPressureSys ? `${vitals.bloodPressureSys}/${vitals.bloodPressureDia}` : '--/--'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 ml-1">mmHg</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-6">
                    <button onClick={() => router.push('/dashboard')} className="flex items-center gap-3 w-full p-2 text-sm font-bold text-slate-600 hover:text-[#25418F] transition">
                        <Activity size={18} /> Back to Dashboard
                    </button>
                    <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-3 w-full p-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition">
                        <Settings size={18} /> Settings
                    </button>
                    <button onClick={handleSignOut} className="flex items-center gap-3 w-full p-2 text-sm font-bold text-red-500 hover:text-red-700 transition">
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[url('/chat-bg-pattern-placeholder.png')] bg-repeat relative">

                {/* Mobile Header (Shows when Sidebar is hidden) */}
                <div className="md:hidden bg-white p-4 border-b border-slate-200 flex justify-between items-center z-10 shadow-sm">
                    <div className="font-black text-[#25418F]">AURA AI</div>
                    <button onClick={() => router.push('/dashboard')} className="text-sm font-bold text-slate-600 px-3 py-1 bg-slate-100 rounded-lg">Dashboard</button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 max-w-4xl mx-auto w-full pb-32">

                    {messages.map((msg, index) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'assistant' ? 'bg-[#25418F] text-white' : 'bg-white border border-slate-200 text-[#25418F]'}`}>
                                {msg.role === 'assistant' ? 'A' : <User size={20} />}
                            </div>
                            <div className={`p-5 rounded-2xl text-sm md:text-base font-medium shadow-sm max-w-[85%] ${msg.role === 'assistant' ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' : 'bg-[#25418F] text-white rounded-tr-none'}`}>
                                <p className="leading-relaxed">{msg.content}</p>

                                {/* Only show quick actions on the very first assistant message if it's the only one */}
                                {msg.role === 'assistant' && index === 0 && messages.length === 1 && (
                                    <div className="flex flex-wrap gap-2 md:gap-3 mt-4">
                                        <button onClick={() => handleSend("I have common flu symptoms")} className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-slate-200 text-xs font-bold text-[#25418F] bg-slate-50 hover:bg-slate-100 transition whitespace-nowrap">Common Flu Symptoms</button>
                                        <button onClick={() => handleSend("Can you check my heart health?")} className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-slate-200 text-xs font-bold text-[#25418F] bg-slate-50 hover:bg-slate-100 transition whitespace-nowrap">Check Heart Health</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#25418F] flex items-center justify-center shrink-0 text-white shadow-sm">
                                A
                            </div>
                            <div className="bg-white p-5 py-6 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    )}

                    {/* Invisible div to track bottom of scroll */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Fixed Input Area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-white via-white to-transparent flex justify-center pb-8 border-t md:border-t-0 border-slate-100">
                    <div className="w-full max-w-4xl relative">
                        <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 md:gap-4">
                            <div className="hidden md:block w-px h-4 bg-transparent"></div>
                            <button className="p-2 md:p-0 text-slate-400 hover:text-[#25418F] transition flex items-center md:gap-2">
                                <Paperclip size={18} /> <span className="hidden md:inline text-[10px] font-bold tracking-widest uppercase">Attach</span>
                            </button>
                        </div>

                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your symptoms here..."
                            className="w-full py-4 md:py-5 pl-12 md:pl-28 pr-16 md:pr-24 rounded-full md:rounded-2xl border border-slate-300 bg-white font-medium text-sm md:text-base text-slate-800 shadow-lg focus:border-[#25418F] focus:outline-none transition"
                        />

                        <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 flex items-center">
                            <button
                                onClick={() => handleSend()}
                                disabled={!inputValue.trim() || isTyping}
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition shadow-md ${!inputValue.trim() || isTyping ? 'bg-slate-100 text-slate-400' : 'bg-[#25418F] text-white hover:bg-blue-800'}`}>
                                <Send size={18} className="ml-1" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Disclaimer - Hidden on mobile, overlapping input on desktop */}
                <p className="absolute bottom-2 left-0 right-0 text-center text-[8px] md:text-[10px] text-slate-400 font-bold tracking-widest uppercase z-10">AI Advice is for information only. Consult a doctor for medical diagnosis.</p>

            </div>

            {isSettingsOpen && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
                        <button onClick={() => setIsSettingsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition p-2 bg-slate-50 rounded-full">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
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
