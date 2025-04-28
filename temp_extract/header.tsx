import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun, Moon, Bell, Menu, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title: string;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ title, setSidebarOpen }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-background sticky top-0 z-40 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="text-gray-500 dark:text-slate-400"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-1 rounded-md">
                <Sun className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-primary">SolarFlow</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="text-gray-600 dark:text-slate-400">
              <Bell className="h-6 w-6" />
            </button>
            <Avatar>
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <header className="hidden lg:flex bg-background shadow-sm px-6 py-4 sticky top-0 z-40 border-b">
        <div className="flex items-center justify-between w-full">
          {/* Page Title */}
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
          
          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </Button>
            
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full relative"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-slate-400" />
                  <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="py-3 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Ticket #1234 updated</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">A technician has been assigned to your ticket</p>
                    <p className="text-xs text-gray-400 mt-1 dark:text-slate-500">10 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-3 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Performance alert</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Solar panel SK-102 is underperforming by 15%</p>
                    <p className="text-xs text-gray-400 mt-1 dark:text-slate-500">1 hour ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-3 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Maintenance report ready</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">The latest maintenance report is available for review</p>
                    <p className="text-xs text-gray-400 mt-1 dark:text-slate-500">Yesterday</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-primary text-xs hover:bg-transparent focus:bg-transparent cursor-pointer">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Export Data */}
            <Button className="text-sm bg-primary hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
