import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import StatsCards from "@/components/dashboard/stats-cards";
import PerformanceChart from "@/components/dashboard/performance-chart";
import RecentTickets from "@/components/dashboard/recent-tickets";
import WeatherForecast from "@/components/dashboard/weather-forecast";
import SystemHealth from "@/components/dashboard/system-health";
import RecentInstallations from "@/components/dashboard/recent-installations";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header title="Dashboard" setSidebarOpen={setSidebarOpen} />

        <main className="flex-grow p-6">
          {/* Dashboard Overview */}
          <StatsCards />

          {/* Performance Chart */}
          <PerformanceChart />

          {/* Recent Tickets & Weather */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-3">
              <RecentTickets />
            </div>
            <div className="lg:col-span-2">
              <WeatherForecast />
            </div>
          </div>

          {/* System Health & Recent Installations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <SystemHealth />
            </div>
            <div className="lg:col-span-2">
              <RecentInstallations />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
