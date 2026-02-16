import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

// Layout principal do dashboard — fundo escuro STRATA industrial
export function DashboardLayout() {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Noise overlay global — idêntico à landing */}
      <div className="fixed inset-0 pointer-events-none z-[999] bg-noise opacity-[0.02] mix-blend-overlay" />

      {isMobile ? (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="p-0 w-72 border-r border-border bg-card">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      ) : (
        <Sidebar />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav onMenuClick={() => setMobileOpen(true)} showMenu={isMobile} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
