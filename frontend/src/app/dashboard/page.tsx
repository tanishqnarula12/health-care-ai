"use client";
import DashboardLayout from '../../components/DashboardLayout';
import { Activity, Droplet, Heart, Moon, Zap, Download, X } from 'lucide-react';
import { useHealthStore } from '../../store/useHealthStore';
import { useState } from 'react';
import jsPDF from 'jspdf';

export default function DashboardPage() {
    const { vitals } = useHealthStore();
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(37, 65, 143); // #25418F
        doc.text("Lumina Health - Medical Analysis Report", 20, 20);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        const date = new Date().toLocaleString();
        doc.text(`Generated: ${date}`, 20, 30);

        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        doc.setTextColor(30, 41, 59); // slate-800
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Patient Vitals Summary", 20, 48);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Blood Oxygen: ${vitals.bloodOxygen || 'N/A'}%`, 20, 58);
        doc.text(`Resting Heart Rate: ${vitals.restingHeartRate || 'N/A'} BPM`, 20, 68);
        doc.text(`Sleep Duration: ${vitals.sleepHours || '0'}h ${vitals.sleepMinutes || '0'}m`, 20, 78);
        doc.text(`Activity Score: ${vitals.activityScore || 'N/A'}/100`, 20, 88);

        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(37, 65, 143);
        doc.text(`Overall Risk Score: ${vitals.healthRiskScore || 'Pending'}/100`, 20, 108);

        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text("AI Analysis Notes:", 20, 122);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);

        let notes = "Awaiting complete data to generate comprehensive AI analysis.";
        if (vitals.healthRiskScore) {
            const risk = parseInt(vitals.healthRiskScore);
            if (risk > 60) {
                notes = "Higher than normal health risk detected. Please review cardiovascular activity and oxygenation.\nWe highly recommend scheduling a consultation with a registered specialist.";
            } else if (risk > 30) {
                notes = "Moderate health risk. Vitals show general stability but indicate room for improvement.\nConsider increasing activity duration and aiming for a standardized 8-hour sleep cycle.";
            } else {
                notes = "Low health risk. Current vitals reflect a healthy baseline. Maintain current lifestyle choices and\ncontinue periodic monitoring to ensure continued wellbeing.";
            }
        }

        const splitNotes = doc.splitTextToSize(notes, 170);
        doc.text(splitNotes, 20, 132);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("Generated securely by Lumina Health AI • Not a substitute for medical advice.", 20, 280);

        doc.save("lumina-health-analysis.pdf");
    };
    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-extrabold text-[#1E293B]">Dashboard</h1>
                <div className="flex gap-4">
                    <input type="text" placeholder="Search health records, symptoms, or docs..." className="bg-white border border-slate-200 px-4 py-2 w-80 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#25418F]/20 transition" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Risk Score Card */}
                <div className="lg:col-span-2 bg-[#25418F] p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-blue-900/20">

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h2 className="text-xl font-bold mb-1">Overall Health Risk Score</h2>
                                <p className="text-sm font-medium text-blue-200">
                                    {vitals.healthRiskScore ? "Updated just now based on your inputs" : "Updated 2 hours ago based on recent vitals"}
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm font-bold tracking-wide">
                                {vitals.healthRiskScore ? "Analysis Complete" : "Pending Analysis"}
                            </div>
                        </div>

                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-7xl font-black">{vitals.healthRiskScore || '__'}</span>
                            <span className="text-2xl font-bold text-blue-200 mb-2">/ 100</span>
                        </div>

                        <p className="text-blue-100 font-medium max-w-md mb-8 leading-relaxed">
                            {vitals.healthRiskScore
                                ? "Your risk score represents a consolidated metric of your current vitals and symptoms."
                                : "Awaiting data. Please complete an AI symptom check or log your remote clinic vitals to generate a personalized health risk score."}
                        </p>

                        <div className="flex gap-4">
                            <button onClick={() => setIsAnalysisOpen(true)} className="bg-white text-[#25418F] px-6 py-3 rounded-xl font-bold shadow hover:bg-slate-50 transition">View Full Analysis</button>
                            <button onClick={generatePDF} className="bg-blue-800 text-white px-6 py-3 rounded-xl font-bold shadow hover:bg-blue-700 transition border border-blue-600 flex items-center gap-2">
                                <Download size={18} /> Download PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* AI Suggestions / Sidebar widget */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[#25418F]">
                            <Activity size={18} />
                        </div>
                        AI Suggestions
                    </h3>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 italic text-slate-500 text-sm">
                        No AI suggestions available yet. Log data to receive insights.
                    </div>

                    <button className="w-full mt-auto py-3 border-2 border-dashed border-slate-200 text-slate-400 font-bold text-sm rounded-2xl hover:bg-slate-50 transition">+</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-center shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 tracking-wider">BLOOD OXYGEN</span>
                        <Activity size={18} className="text-[#25418F]" />
                    </div>
                    <span className="text-3xl font-black text-slate-800">{vitals.bloodOxygen || '__'}%</span>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-center shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 tracking-wider">RESTING HEART</span>
                        <Heart size={18} className="text-[#25418F]" />
                    </div>
                    <span className="text-3xl font-black text-slate-800">{vitals.restingHeartRate || '__'} <span className="text-lg font-bold text-slate-500">BPM</span></span>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-center shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 tracking-wider">SLEEP DURATION</span>
                        <Moon size={18} className="text-[#25418F]" />
                    </div>
                    <span className="text-3xl font-black text-slate-800">
                        {vitals.sleepHours || '__'}h {vitals.sleepMinutes || '__'}m
                    </span>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-center shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 tracking-wider">ACTIVITY SCORE</span>
                        <Zap size={18} className="text-[#25418F]" />
                    </div>
                    <span className="text-3xl font-black text-slate-800">{vitals.activityScore || '__'}</span>
                </div>
            </div>

            {/* Full Analysis Modal */}
            {isAnalysisOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-black text-[#1E293B] flex items-center gap-3">
                                <Activity className="text-[#25418F]" /> In-Depth AI Analysis
                            </h3>
                            <button onClick={() => setIsAnalysisOpen(false)} className="text-slate-400 hover:text-slate-700 transition p-2 bg-white rounded-full shadow-sm">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto space-y-8">
                            {/* Card 1 */}
                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <h4 className="text-sm font-bold text-[#25418F] uppercase tracking-widest mb-2 relative z-10">Cardiovascular Health</h4>
                                <p className="text-slate-700 font-medium leading-relaxed relative z-10">
                                    {(vitals.restingHeartRate && parseInt(vitals.restingHeartRate) > 90) ?
                                        "Your resting heart rate is slightly elevated compared to optimal metrics. Consider deep breathing exercises and reducing caffeine intake." :
                                        "Heart rate maintains an excellent baseline. This indicates good cardiovascular foundation and stress resilience."}
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-widest mb-2 relative z-10">Oxygenation & Respiratory</h4>
                                <p className="text-slate-700 font-medium leading-relaxed relative z-10">
                                    {vitals.bloodOxygen ? `Current oxygen saturation is at ${vitals.bloodOxygen}%. ` : "No recent data. "}
                                    {(vitals.bloodOxygen && parseInt(vitals.bloodOxygen) < 95) ?
                                        "Levels indicate mild hypoxemia. Strongly consider fresh air circulation and light aerobic activity." :
                                        "Levels are within healthy physiological limits, ensuring optimal cognitive function and energy."}
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <h4 className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-2 relative z-10">Recovery & Activity</h4>
                                <p className="text-slate-700 font-medium leading-relaxed relative z-10">
                                    {(vitals.sleepHours && parseInt(vitals.sleepHours) < 6) ?
                                        "Inadequate sleep duration detected. Reduced REM cycles are likely impacting daytime activity scores." :
                                        "Good sleep duration noted. Rest-to-activity balance seems optimized for long-term health."}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button onClick={generatePDF} className="bg-[#25418F] text-white px-6 py-3 rounded-xl font-bold shadow hover:bg-blue-800 transition flex items-center gap-2">
                                <Download size={18} /> Export Full Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
