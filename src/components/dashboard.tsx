import { TopNavigation } from "@/components/top-navigation";
import BottomNav from "./bottomNav";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col z-50 overflow-x-hidden">
      <TopNavigation />
      <main className="flex-1 container px-10 pb-20 min-w-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
