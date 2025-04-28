import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Sun, Home, Ticket, BarChart3, FileText, Users, Cloud, MessageSquare, LogOut, Settings, Wrench, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Support Tickets", href: "/tickets", icon: Ticket },
    { name: "Performance Monitor", href: "/monitor", icon: BarChart3 },
    { name: "Maintenance Booking", href: "/maintenance-booking", icon: Wrench },
    { name: "Maintenance Reports", href: "/reports", icon: FileText },
    { name: "Referrals & Installs", href: "/referrals", icon: Users },
    { name: "Weather Forecasts", href: "/forecasts", icon: Cloud },
    { name: "AI Assistant", href: "/chatbot", icon: MessageSquare },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    }

    function handleClickOutside(event: MouseEvent) {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && !sidebar.contains(event.target as Node) && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    }

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setSidebarOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-5">
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-1.5 rounded-md">
                <Sun className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">SolarFlow</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden text-gray-600 dark:text-slate-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location === item.href;
              const ItemIcon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md cursor-pointer transition-colors group",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  )}
                >
                  <ItemIcon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={typeof user?.avatar === 'string' ? user.avatar : undefined} alt={user?.name || "User"} />
                <AvatarFallback>{(user?.name || "User").substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium dark:text-slate-200">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{user?.role}</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" className="text-sm text-gray-600 hover:text-primary dark:text-slate-400 dark:hover:text-slate-200">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm text-gray-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
