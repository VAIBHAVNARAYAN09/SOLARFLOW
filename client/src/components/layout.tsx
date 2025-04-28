import { useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = "Dashboard" }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header title={title} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-grow bg-gray-50">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
