import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Report {
    id: string;
    title: string;
    date: string;
    category: 'Bloodwork' | 'Imaging' | 'Prescriptions' | 'Other';
    source: 'File Upload' | 'EMR Integration';
    summary?: string;
}

interface ReportState {
    reports: Report[];
    addReport: (report: Omit<Report, 'id' | 'date'>) => void;
    deleteReport: (id: string) => void;
    clearReports: () => void;
}

export const useReportStore = create<ReportState>()(
    persist(
        (set) => ({
            reports: [],
            addReport: (reportData) =>
                set((state) => {
                    const newReport: Report = {
                        ...reportData,
                        id: Date.now().toString(),
                        date: new Date().toISOString(),
                    };
                    return { reports: [newReport, ...state.reports] };
                }),
            deleteReport: (id) =>
                set((state) => ({
                    reports: state.reports.filter((r) => r.id !== id),
                })),
            clearReports: () => set({ reports: [] }),
        }),
        {
            name: 'report-storage',
        }
    )
);
