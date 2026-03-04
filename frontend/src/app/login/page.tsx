"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate a network request / authentication
        setTimeout(() => {
            login({ id: 'user_' + Math.random().toString(36).substr(2, 9), name: email.split('@')[0] || 'User', email });
            setIsLoading(false);
            router.push('/dashboard');
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="flex flex-col items-center w-full max-w-md p-8">

                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#25418F] flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-900/20">
                        <Activity size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Lumina Health</h1>
                    <p className="text-slate-500 font-medium mt-1">Welcome back to your health portal</p>
                </div>

                <div className="w-full bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] font-medium text-slate-800 outline-none focus:border-[#25418F] focus:ring-1 focus:ring-[#25418F] transition"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2 items-center">
                                <label className="block text-sm font-bold text-slate-800">Password</label>
                                <Link href="#" className="text-xs font-bold text-[#25418F] hover:underline">Forgot Password?</Link>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] font-medium text-slate-800 outline-none focus:border-[#25418F] focus:ring-1 focus:ring-[#25418F] transition"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#25418F] focus:ring-[#25418F]" />
                            <span className="text-sm font-medium text-slate-700">Remember this device</span>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 mt-2 bg-[#25418F] text-white rounded-xl font-bold shadow-md hover:bg-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-slate-600">
                        Don't have an account? <Link href="/register" className="text-[#25418F] font-bold hover:underline">Sign Up</Link>
                    </p>
                </div>

                <div className="mt-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest flex gap-4">
                    <Link href="#" className="hover:text-slate-600">Privacy Policy</Link>
                    <Link href="#" className="hover:text-slate-600">Terms of Service</Link>
                    <Link href="#" className="hover:text-slate-600">Help Center</Link>
                </div>
                <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    © 2026 Lumina Health Inc. Secure SaaS Environment.
                </p>

            </div>
        </div>
    );
}
