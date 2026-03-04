"use client";
import Link from 'next/link';
import { Activity, Pill, ShieldCheck, HeartPulse, Stethoscope, Video, Users, Globe, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function LandingPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center py-6 px-12 bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#25418F] flex items-center justify-center text-white">
            <Activity size={24} />
          </div>
          <span className="font-bold text-xl text-slate-800">Lumina Health</span>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-[#25418F]">Home</Link>
          <Link href="#how-it-works" className="hover:text-[#25418F]">How It Works</Link>
        </div>

        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <Link href="/dashboard" className="bg-[#25418F] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-blue-800 transition">Go to Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-[#25418F]">Log In</Link>
              <Link href="/register" className="bg-[#25418F] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-blue-800 transition">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-1">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-[#25418F] text-xs font-bold tracking-wide uppercase border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-[#25418F]"></span>
            Now Available Everywhere
          </div>

          <h1 className="text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            AI-Powered Healthcare for <span className="text-[#25418F]">Everyone</span>
          </h1>

          <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-lg">
            Premium SaaS-level disease prediction and global health accessibility powered by world-class artificial intelligence. Early detection simplified.
          </p>

          <div className="flex gap-4">
            <Link href={isAuthenticated ? "/dashboard" : "/register"} className="bg-[#25418F] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition flex items-center gap-2">
              <Activity size={20} />
              Start Health Check
            </Link>
            <Link href="/chat" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition flex items-center gap-2">
              <MessageCircle size={20} />
              Try AI Chat
            </Link>
          </div>
        </div>

        {/* Hero Illustration / Graphic Placeholder */}
        <div className="relative">
          <div className="w-full max-w-md mx-auto aspect-square bg-gradient-to-br from-blue-100 to-indigo-50 rounded-3xl p-8 border border-white shadow-xl relative shadow-slate-200/50">
            {/* Mock Dashboard Widget */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">Live Analysis</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <HeartPulse className="text-[#25418F] mb-2" size={24} />
                  <h4 className="text-2xl font-bold text-slate-800">72 BPM</h4>
                  <p className="text-xs text-slate-500 font-medium">Heart Rate</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <Activity className="text-emerald-500 mb-2" size={24} />
                  <h4 className="text-2xl font-bold text-slate-800">98.4%</h4>
                  <p className="text-xs text-slate-500 font-medium">AI Accuracy</p>
                </div>
              </div>
            </div>
            {/* Alert Widget */}
            <div className="bg-[#25418F] rounded-2xl p-6 shadow-lg text-white">
              <h3 className="font-bold text-lg mb-1">Health Risk Score</h3>
              <p className="text-blue-200 text-sm mb-4">Based on current symptoms and medical history</p>
              <div className="h-2 w-full bg-blue-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-1/4 rounded-full"></div>
              </div>
              <p className="text-xs font-semibold mt-2 text-blue-100">Low Risk Detection</p>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="how-it-works" className="w-full bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-2xl">
            <h4 className="text-[#25418F] text-sm font-bold tracking-widest uppercase mb-4">Our Methodology</h4>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">Early Detection, Better Outcomes</h2>
            <p className="text-lg text-slate-600 font-medium">Our AI models are trained on diverse datasets to provide accurate risk assessments anywhere, anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-8 border border-slate-200 rounded-3xl bg-slate-50 hover:shadow-lg transition duration-300">
              <div className="w-14 h-14 bg-indigo-100 text-[#25418F] flex items-center justify-center rounded-2xl mb-6">
                <Activity size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Smart Risk Analysis</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Advanced predictive modeling for early disease detection using lightweight neural networks.</p>
            </div>

            <div className="p-8 border border-slate-200 rounded-3xl bg-slate-50 hover:shadow-lg transition duration-300">
              <div className="w-14 h-14 bg-cyan-100 text-cyan-700 flex items-center justify-center rounded-2xl mb-6">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Global Accessibility</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Accessible anywhere via our optimized platform, ensuring healthcare reaches everyone.</p>
            </div>

            <div className="p-8 border border-slate-200 rounded-3xl bg-slate-50 hover:shadow-lg transition duration-300">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 flex items-center justify-center rounded-2xl mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Secure Data Vault</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Enterprise-grade AES-256 encryption for all medical records and diagnostic history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="w-full bg-[#25418F] py-20 text-white text-center">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-12">
          <div>
            <h2 className="text-6xl font-black mb-2 tracking-tighter">5M+</h2>
            <p className="text-blue-200 font-bold uppercase tracking-widest text-sm text-center">Lives Impacted</p>
          </div>
          <div>
            <h2 className="text-6xl font-black mb-2 tracking-tighter">99.8%</h2>
            <p className="text-blue-200 font-bold uppercase tracking-widest text-sm text-center">System Uptime</p>
          </div>
          <div>
            <h2 className="text-6xl font-black mb-2 tracking-tighter">100+</h2>
            <p className="text-blue-200 font-bold uppercase tracking-widest text-sm text-center">Network Hospitals</p>
          </div>
          <div>
            <h2 className="text-6xl font-black mb-2 tracking-tighter">24/7</h2>
            <p className="text-blue-200 font-bold uppercase tracking-widest text-sm text-center">AI Support</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white py-16 px-12 border-t border-slate-200 text-sm font-medium text-slate-500">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#25418F] flex items-center justify-center text-white">
              <Activity size={18} />
            </div>
            <span className="font-bold text-lg text-slate-800">Lumina Health</span>
          </div>
          <p>© 2026 Lumina Health Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

