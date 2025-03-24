import { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import { ConsentBanner } from "../rgpd/consent-banner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if consent has been given
    const storedConsent = localStorage.getItem('carbonos_consent');
    if (!storedConsent) {
      setShowConsent(true);
    } else {
      try {
        const consent = JSON.parse(storedConsent);
        if (!consent.accepted) {
          setShowConsent(true);
        }
      } catch (e) {
        setShowConsent(true);
      }
    }
  }, []);

  const handleConsentAccept = () => {
    localStorage.setItem('carbonos_consent', JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString()
    }));
    setShowConsent(false);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header onToggleSidebar={handleToggleSidebar} />
      
      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden" 
            onClick={handleCloseSidebar}
          ></div>
        )}
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
      
      {showConsent && (
        <ConsentBanner onAccept={handleConsentAccept} />
      )}
    </div>
  );
}

export default AppLayout;
