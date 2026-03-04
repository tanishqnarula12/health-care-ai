"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ShieldCheck, Globe, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network request
        setTimeout(() => {
            login({ id: 'user_' + Math.random().toString(36).substr(2, 9), name, email });
            setIsLoading(false);
            router.push('/dashboard');
        }, 800);
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#F8FAFC]">
            {/* Left Form Side */}
            <div className="p-12 lg:p-24 flex flex-col justify-center">
                <div className="mb-12">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#25418F] flex items-center justify-center text-white">
                            <Activity size={24} />
                        </div>
                        <span className="font-bold text-xl text-slate-800">Lumina Health</span>
                    </Link>
                </div>

                <h1 className="text-4xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Create your account</h1>
                <p className="text-slate-500 font-medium mb-10 text-lg">Start your journey toward proactive healthcare today.</p>

                <form className="space-y-6 max-w-sm" onSubmit={handleRegister}>
                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full p-4 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 outline-none focus:border-[#25418F] focus:ring-1 focus:ring-[#25418F] transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full p-4 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 outline-none focus:border-[#25418F] focus:ring-1 focus:ring-[#25418F] transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-4 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 outline-none focus:border-[#25418F] focus:ring-1 focus:ring-[#25418F] transition"
                        />
                        <p className="text-xs text-slate-400 mt-2 font-medium">Must be at least 8 characters with a number and a symbol.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-[#25418F] text-white rounded-xl font-bold shadow-md hover:bg-blue-800 transition flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-500 max-w-sm mt-6 font-medium">
                    By clicking "Create Account", you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>. Lumina Health is HIPAA compliant.
                </p>

                <p className="mt-8 text-sm font-medium text-slate-600">
                    Already have an account? <Link href="/login" className="text-[#25418F] font-bold">Log in</Link>
                </p>
            </div>

            {/* Right Info Side */}
            <div className="bg-white p-12 lg:p-24 flex flex-col justify-center border-l border-slate-100">
                <div className="max-w-md mx-auto">
                    <div className="inline-flex py-1.5 px-3 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-6 border border-emerald-100 flex items-center gap-2">
                        <ShieldCheck size={14} />
                        Advanced Health Monitoring
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-10 leading-tight">Empowering individuals through AI.</h2>

                    <div className="space-y-10">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-indigo-50 text-[#25418F] rounded-2xl flex items-center justify-center shrink-0">
                                <Activity size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-800 mb-1">Early Prediction</h4>
                                <p className="text-slate-600 font-medium">Our AI models identify subtle health shifts, allowing for proactive care before symptoms even appear.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center shrink-0">
                                <Globe size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-800 mb-1">Global Accessibility</h4>
                                <p className="text-slate-600 font-medium">Get specialist-level insights anywhere anytime via our powerful AI platform.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-800 mb-1">Your Data, Secured</h4>
                                <p className="text-slate-600 font-medium">Top-tier encryption ensures your personal health records remain private and under your control.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
