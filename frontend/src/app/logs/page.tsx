"use client";
import DashboardLayout from '../../components/DashboardLayout';
import { Activity, Thermometer, Clock, AlertTriangle, Plus, X, Heart, Droplet, Zap } from 'lucide-react';
import { useHealthStore } from '../../store/useHealthStore';
import { useState } from 'react';

export default function LogsPage() {
    const { vitals, logs, addLog, updateVitals } = useHealthStore();
    const [isAddLogOpen, setIsAddLogOpen] = useState(false);
    const [logType, setLogType] = useState<'Vitals' | 'Symptoms'>('Vitals');
    const [filter, setFilter] = useState<'All' | 'Vitals' | 'Symptoms'>('All');

    // Form state
    const [description, setDescription] = useState('');
    const [bpSys, setBpSys] = useState(vitals.bloodPressureSys);
    const [bpDia, setBpDia] = useState(vitals.bloodPressureDia);
    const [hr, setHr] = useState(vitals.restingHeartRate);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let newVitals = {};
        if (logType === 'Vitals') {
            newVitals = {
                bloodPressureSys: bpSys,
                bloodPressureDia: bpDia,
                restingHeartRate: hr,
            };
            updateVitals(newVitals);
        }

        addLog({
            type: logType,
            description: description || (logType === 'Vitals' ? 'Routine vitals check' : 'General symptom update'),
            vitals: newVitals
        });

        setIsAddLogOpen(false);
        setDescription('');
    };

    const filteredLogs = logs.filter(log => filter === 'All' || log.type === filter);

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-extrabold text-[#1E293B]">Health Logs</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4 text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-widest">Average Daily Vitals</span>
                        <Activity size={18} className="text-[#25418F]" />
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-4xl font-black text-slate-800 block mb-1">
                                {vitals.bloodPressureSys ? `${vitals.bloodPressureSys}/${vitals.bloodPressureDia}` : '--/--'}
                            </span>
                            <span className="text-xs font-bold text-slate-400 uppercase">Blood Pressure</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-black text-slate-800 block mb-1">{vitals.restingHeartRate ? `${vitals.restingHeartRate} BPM` : '-- BPM'}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">Resting Heart</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="w-20 h-20 rounded-full border-4 border-emerald-100 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-50 rounded-full"></div>
                        <span className="font-black text-emerald-600 relative z-10 text-xl">{logs.length}</span>
                    </div>
                    <div className="ml-6 flex-1">
                        <h3 className="font-bold text-slate-800 text-lg mb-1 flex items-center gap-2">
                            Active Tracking
                        </h3>
                        <p className="text-sm font-semibold text-slate-500">{logs.length} logs recorded in total</p>
                    </div>
                </div>

                <div onClick={() => setIsAddLogOpen(true)} className="bg-[#25418F] p-6 rounded-3xl text-white shadow-xl shadow-blue-900/20 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-800 transition group relative overflow-hidden">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                        <Plus size={24} />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Log New Entry</h3>
                    <p className="text-xs font-medium text-blue-200">
                        {logs.length > 0 ? `Last entry: ${new Date(logs[0].date).toLocaleDateString()}` : "Start tracking today"}
                    </p>
                </div>
            </div>

            <div className="mb-6 flex justify-between items-center text-sm font-bold text-slate-400 tracking-wider">
                <h2>TIMELINE ENTRIES</h2>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                    <button onClick={() => setFilter('All')} className={`px-4 py-2 rounded-lg font-bold transition ${filter === 'All' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>All Logs</button>
                    <button onClick={() => setFilter('Vitals')} className={`px-4 py-2 rounded-lg font-bold transition ${filter === 'Vitals' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>Vitals</button>
                    <button onClick={() => setFilter('Symptoms')} className={`px-4 py-2 rounded-lg font-bold transition ${filter === 'Symptoms' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>Symptoms</button>
                </div>
            </div>

            <div className="space-y-4">
                {filteredLogs.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-3xl border-dashed">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                            <Activity size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">No logs recorded yet</h3>
                        <p className="text-slate-500 font-medium max-w-sm">Tap the "Log New Entry" button above to start tracking your vitals and symptoms.</p>
                    </div>
                ) : (
                    filteredLogs.map(log => (
                        <div key={log.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex gap-6 shadow-sm hover:shadow transition items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${log.type === 'Vitals' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                                {log.type === 'Vitals' ? <Heart size={20} /> : <AlertTriangle size={20} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <h4 className="font-bold text-slate-800 text-lg">{log.type} Check-in</h4>
                                    <span className="text-xs font-bold text-slate-400">{new Date(log.date).toLocaleString()}</span>
                                </div>
                                <p className="text-slate-600 font-medium text-sm">{log.description}</p>

                                {log.vitals && log.type === 'Vitals' && (
                                    <div className="flex gap-4 mt-3">
                                        {log.vitals.bloodPressureSys && (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full"><Droplet size={12} /> BP: {log.vitals.bloodPressureSys}/{log.vitals.bloodPressureDia}</span>
                                        )}
                                        {log.vitals.restingHeartRate && (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full"><Activity size={12} /> HR: {log.vitals.restingHeartRate} BPM</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Log Modal */}
            {isAddLogOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-black text-[#1E293B] flex items-center gap-3">
                                <Plus className="text-[#25418F]" /> Create New Log
                            </h3>
                            <button onClick={() => setIsAddLogOpen(false)} className="text-slate-400 hover:text-slate-700 transition p-2 bg-white rounded-full shadow-sm">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Log Type</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setLogType('Vitals')}
                                        className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition flex justify-center items-center gap-2 ${logType === 'Vitals' ? 'border-[#25418F] text-[#25418F] bg-blue-50' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                                    >
                                        <Activity size={18} /> Vitals
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLogType('Symptoms')}
                                        className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition flex justify-center items-center gap-2 ${logType === 'Symptoms' ? 'border-[#25418F] text-[#25418F] bg-blue-50' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                                    >
                                        <AlertTriangle size={18} /> Symptoms
                                    </button>
                                </div>
                            </div>

                            {logType === 'Vitals' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Blood Pressure (Sys)</label>
                                        <input type="number" required value={bpSys} onChange={(e) => setBpSys(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#25418F] focus:outline-none focus:ring-1 focus:ring-[#25418F]" placeholder="120" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Blood Pressure (Dia)</label>
                                        <input type="number" required value={bpDia} onChange={(e) => setBpDia(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#25418F] focus:outline-none focus:ring-1 focus:ring-[#25418F]" placeholder="80" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Heart Rate (BPM)</label>
                                        <input type="number" required value={hr} onChange={(e) => setHr(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#25418F] focus:outline-none focus:ring-1 focus:ring-[#25418F]" placeholder="72" />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Notes & Observations</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder={logType === 'Vitals' ? "Any additional context about your reading..." : "Describe what you are feeling..."}
                                    className="w-full p-4 rounded-xl border border-slate-200 h-28 resize-none focus:border-[#25418F] focus:outline-none focus:ring-1 focus:ring-[#25418F]"
                                />
                            </div>

                            <button type="submit" className="w-full bg-[#25418F] text-white py-4 rounded-xl font-bold shadow-md hover:bg-blue-800 transition">
                                Save Entry to Timeline
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
