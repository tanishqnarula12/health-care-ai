"use client";
import DashboardLayout from '../../components/DashboardLayout';
import { UploadCloud, FileText, Download, X, Link as LinkIcon, Activity } from 'lucide-react';
import { useState, useRef } from 'react';
import { useReportStore, Report } from '../../store/useReportStore';

export default function ReportsPage() {
    const { reports, addReport, deleteReport } = useReportStore();

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isEMROpen, setIsEMROpen] = useState(false);

    // Drag and Drop state
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter states
    const [filterCategory, setFilterCategory] = useState<'All' | 'Bloodwork' | 'Imaging' | 'Prescriptions' | 'Other'>('All');

    // Upload Form State
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadCategory, setUploadCategory] = useState<Report['category']>('Bloodwork');

    // EMR Form State
    const [emrId, setEmrId] = useState('');

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        setUploadTitle(file.name);
        setIsUploadOpen(true);
    };



    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addReport({
            title: uploadTitle || 'Untitled Document',
            category: uploadCategory,
            source: 'File Upload',
            summary: 'Pending AI Analysis...'
        });
        setIsUploadOpen(false);
        setUploadTitle('');
    };

    const handleEMRSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mocking an EMR fetch
        addReport({
            title: `EMR Sync: Record #${emrId}`,
            category: 'Bloodwork', // Mock default
            source: 'EMR Integration',
            summary: 'Successfully synced from remote epic system. Complete vitals panel available.'
        });
        setIsEMROpen(false);
        setEmrId('');
    };

    const filteredReports = reports.filter(r => filterCategory === 'All' || r.category === filterCategory);

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-extrabold text-[#1E293B]">Medical Reports</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <div
                        className={`bg-white border-2 border-dashed ${isDragging ? 'border-[#25418F] bg-blue-50/50' : 'border-slate-200'} rounded-3xl p-12 flex flex-col items-center justify-center text-center transition hover:border-[#25418F] hover:bg-slate-50 mb-10 cursor-pointer`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf, image/jpeg, image/png"
                        />
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-[#25418F] mb-6 transition ${isDragging ? 'bg-[#25418F] text-white scale-110' : 'bg-indigo-50'}`}>
                            <UploadCloud size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">{isDragging ? 'Drop file here' : 'Upload New Report'}</h2>
                        <p className="text-slate-500 font-medium mb-6 max-w-sm">Drag and drop your PDF or image files here, or click to browse from your device.</p>
                        <div className="flex gap-4">
                            <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="bg-[#25418F] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-blue-800 transition">Select Files</button>
                            <button onClick={(e) => { e.stopPropagation(); setIsEMROpen(true); }} className="bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition flex items-center gap-2">
                                <LinkIcon size={16} /> Link EMR
                            </button>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-6">Supports: PDF, JPG, PNG (Max 20MB)</p>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-6 font-extrabold">Recent Reports</h3>

                    {filteredReports.length === 0 ? (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                                <FileText size={24} />
                            </div>
                            <h4 className="font-bold text-slate-700 text-lg mb-2">No Reports Available</h4>
                            <p className="text-sm font-medium text-slate-500 max-w-sm">You haven't uploaded any medical reports yet. Upload a document above to get an AI summary.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredReports.map(report => (
                                <div key={report.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex gap-6 shadow-sm hover:shadow transition items-center">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${report.source === 'EMR Integration' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {report.source === 'EMR Integration' ? <Activity size={24} /> : <FileText size={24} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1 items-center">
                                            <h4 className="font-bold text-slate-800 text-lg">{report.title}</h4>
                                            <span className="text-xs font-bold text-slate-400">{new Date(report.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex gap-2 mb-2">
                                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase tracking-wider">{report.category}</span>
                                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase tracking-wider">{report.source}</span>
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium">{report.summary}</p>
                                    </div>
                                    <div>
                                        <button onClick={() => deleteReport(report.id)} className="text-slate-400 hover:text-red-500 transition p-2">
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-6">
                        <h3 className="font-extrabold text-slate-800 mb-6 pb-4 border-b border-slate-100">Filter Repository</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3 block">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => setFilterCategory('All')} className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition ${filterCategory === 'All' ? 'bg-[#25418F] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>All</button>
                                    <button onClick={() => setFilterCategory('Bloodwork')} className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition ${filterCategory === 'Bloodwork' ? 'bg-[#25418F] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Bloodwork</button>
                                    <button onClick={() => setFilterCategory('Imaging')} className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition ${filterCategory === 'Imaging' ? 'bg-[#25418F] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Imaging</button>
                                    <button onClick={() => setFilterCategory('Prescriptions')} className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition ${filterCategory === 'Prescriptions' ? 'bg-[#25418F] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Prescriptions</button>
                                </div>
                            </div>
                            <button onClick={() => setFilterCategory('All')} className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition text-sm">Reset All Filters</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {isUploadOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-black text-[#1E293B] flex items-center gap-3">
                                <UploadCloud className="text-[#25418F]" /> Upload Document
                            </h3>
                            <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-slate-700 transition p-2 bg-white rounded-full shadow-sm">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUploadSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Document Title</label>
                                <input type="text" required value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#25418F] focus:outline-none focus:ring-1 focus:ring-[#25418F]" placeholder="E.g. Annual Bloodwork 2026" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                                <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value as Report['category'])} className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#25418F] focus:outline-none focus:ring-1 focus:ring-[#25418F] bg-white">
                                    <option value="Bloodwork">Bloodwork</option>
                                    <option value="Imaging">Imaging</option>
                                    <option value="Prescriptions">Prescriptions</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full bg-[#25418F] text-white py-4 rounded-xl font-bold shadow-md hover:bg-blue-800 transition">
                                Simulate Upload & Analyze
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* EMR Modal */}
            {isEMROpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-black text-[#1E293B] flex items-center gap-3">
                                <LinkIcon className="text-[#25418F]" /> Link External EMR
                            </h3>
                            <button onClick={() => setIsEMROpen(false)} className="text-slate-400 hover:text-slate-700 transition p-2 bg-white rounded-full shadow-sm">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleEMRSubmit} className="p-8 space-y-6">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                                <p className="text-sm font-medium text-slate-600">Connect securely to your healthcare provider to automatically sync your latest medical records.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Provider Patient ID</label>
                                <input type="text" required value={emrId} onChange={(e) => setEmrId(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#25418F] focus:outline-none focus:ring-1 focus:ring-[#25418F]" placeholder="E.g. PID-9824X" />
                            </div>

                            <button type="submit" className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold shadow-md hover:bg-slate-900 transition flex justify-center items-center gap-2">
                                <LinkIcon size={18} /> Authenticate & Sync
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
