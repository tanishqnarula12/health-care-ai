"use client";
import DashboardLayout from '../../components/DashboardLayout';
import { Activity, Heart, Moon, Zap, Send } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHealthStore } from '../../store/useHealthStore';

export default function SymptomCheckerPage() {
    const router = useRouter();
    const { vitals, updateVitals } = useHealthStore();

    const [formData, setFormData] = useState({
        bloodOxygen: vitals.bloodOxygen,
        restingHeartRate: vitals.restingHeartRate,
        sleepHours: vitals.sleepHours,
        sleepMinutes: vitals.sleepMinutes,
        activityScore: vitals.activityScore,
        symptoms: ''
    });

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAnalyzing(true);

        try {
            const response = await fetch('http://localhost:5000/api/symptoms/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer DUMMY_TOKEN' // Auth mock
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                console.error("AI Analysis failed to fetch.");
            } else {
                const data = await response.json();

                // Update React Global State with AI values 
                updateVitals({
                    bloodOxygen: formData.bloodOxygen,
                    restingHeartRate: formData.restingHeartRate,
                    sleepHours: formData.sleepHours,
                    sleepMinutes: formData.sleepMinutes,
                    activityScore: formData.activityScore,
                    healthRiskScore: data.risk_score ? data.risk_score.toString() : '50'
                });
            }
        } catch (error) {
            console.error("AI Connection Error:", error);
        } finally {
            setIsAnalyzing(false);
            router.push('/dashboard');
        }
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-extrabold text-[#1E293B]">Health Data Input</h1>
                <div className="flex gap-4">
                    <span className="bg-[#25418F] text-white px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-full">
                        Manual Entry Mode
                    </span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <div className="mb-8 border-b border-slate-100 pb-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Log Your Remote Vitals</h2>
                    <p className="text-sm font-medium text-slate-500">
                        Enter your current physical measurements to instantly update your Dashboard and allow the AI to generate a new Health Risk Score.
                    </p>
                </div>

                {isAnalyzing ? (
                    <div className="py-24 flex flex-col items-center justify-center">
                        <Activity size={48} className="text-[#25418F] animate-pulse mb-6" />
                        <h3 className="text-2xl font-black text-slate-800 mb-2">Analyzing Vitals...</h3>
                        <p className="text-slate-500 font-medium">Please wait while the AI processes your data.</p>
                        <div className="w-64 h-2 bg-slate-100 rounded-full mt-6 overflow-hidden relative">
                            <div className="absolute top-0 bottom-0 left-0 bg-[#25418F] animate-[pulse_2s_ease-in-out_infinite] w-full origin-left"></div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Blood Oxygen */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 tracking-wider mb-4 uppercase">
                                    <Activity size={16} className="text-[#25418F]" /> Blood Oxygen (%)
                                </label>
                                <input
                                    type="number"
                                    name="bloodOxygen"
                                    value={formData.bloodOxygen}
                                    onChange={handleChange}
                                    placeholder="e.g., 98"
                                    className="w-full text-2xl font-black text-slate-800 bg-transparent border-b-2 border-slate-200 focus:border-[#25418F] focus:outline-none transition pb-2 placeholder:text-slate-300"
                                />
                            </div>

                            {/* Resting Heart Rate */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 tracking-wider mb-4 uppercase">
                                    <Heart size={16} className="text-[#25418F]" /> Resting Heart Rate (BPM)
                                </label>
                                <input
                                    type="number"
                                    name="restingHeartRate"
                                    value={formData.restingHeartRate}
                                    onChange={handleChange}
                                    placeholder="e.g., 72"
                                    className="w-full text-2xl font-black text-slate-800 bg-transparent border-b-2 border-slate-200 focus:border-[#25418F] focus:outline-none transition pb-2 placeholder:text-slate-300"
                                />
                            </div>

                            {/* Sleep Duration */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 tracking-wider mb-4 uppercase">
                                    <Moon size={16} className="text-[#25418F]" /> Sleep Duration
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="number"
                                            name="sleepHours"
                                            value={formData.sleepHours}
                                            onChange={handleChange}
                                            placeholder="Hours"
                                            className="w-full text-2xl font-black text-slate-800 bg-transparent border-b-2 border-slate-200 focus:border-[#25418F] focus:outline-none transition pb-2 placeholder:text-slate-300"
                                        />
                                        <span className="absolute right-0 bottom-3 text-sm font-bold text-slate-400">h</span>
                                    </div>
                                    <div className="flex-1 relative">
                                        <input
                                            type="number"
                                            name="sleepMinutes"
                                            value={formData.sleepMinutes}
                                            onChange={handleChange}
                                            placeholder="Mins"
                                            className="w-full text-2xl font-black text-slate-800 bg-transparent border-b-2 border-slate-200 focus:border-[#25418F] focus:outline-none transition pb-2 placeholder:text-slate-300"
                                        />
                                        <span className="absolute right-0 bottom-3 text-sm font-bold text-slate-400">m</span>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Score */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 tracking-wider mb-4 uppercase">
                                    <Zap size={16} className="text-[#25418F]" /> Activity Score (1-100)
                                </label>
                                <input
                                    type="number"
                                    name="activityScore"
                                    value={formData.activityScore}
                                    onChange={handleChange}
                                    placeholder="e.g., 85"
                                    className="w-full text-2xl font-black text-slate-800 bg-transparent border-b-2 border-slate-200 focus:border-[#25418F] focus:outline-none transition pb-2 placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* Additional Text Input for Symptoms */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <label className="block text-xs font-bold text-slate-500 tracking-wider mb-4 uppercase">
                                Describe Additional Symptoms
                            </label>
                            <textarea
                                name="symptoms"
                                value={formData.symptoms}
                                onChange={handleChange}
                                placeholder="E.g., I have been feeling a mild headache since morning..."
                                className="w-full h-32 p-4 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:border-[#25418F] focus:outline-none transition resize-none shadow-inner"
                            ></textarea>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-[#25418F] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-800 transition flex items-center gap-3"
                            >
                                Process Data & Update Dashboard <Send size={18} />
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </DashboardLayout>
    );
}
