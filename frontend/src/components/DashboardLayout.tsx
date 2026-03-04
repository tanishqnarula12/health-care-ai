import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header Placeholder (Global to dashboard) */}
                <div className="h-16 border-b border-slate-200 bg-white flex items-center px-8 shrink-0">
                    {/* Header content varies per page, so we can inject dynamically or handle in pages */}
                    <div className="w-full h-full flex items-center justify-end">
                        {/* User profile common area */}
                        <div className="flex items-center gap-4">
                            {/* Could add a global Notifications icon, User Profile etc. */}
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto px-8 py-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
