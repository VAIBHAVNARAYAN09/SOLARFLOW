import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun, Moon, Bell, Menu, Download, Search } from "lucide-react";
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
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-900 sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={onMenuClick} 
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
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <header className="hidden lg:flex bg-white dark:bg-gray-900 shadow-sm px-6 py-4 sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between w-full">
          {/* Page Title */}
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
          
          {/* Search Bar */}
          <div className="relative hidden md:block mx-4 flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search tickets, users, or FAQs..."
                className="pl-10 pr-4 py-2 h-10"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
          
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
