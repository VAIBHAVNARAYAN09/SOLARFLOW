import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PerformanceStats from "@/components/monitor/performance-stats";
import DailyOutputChart from "@/components/monitor/daily-output-chart";
import SitePerformanceTable from "@/components/monitor/site-performance-table";
import { Button } from "@/components/ui/button";
import { Download, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Monitor() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState("24h");

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header title="Solar Performance Monitor" setSidebarOpen={setSidebarOpen} />

        <main className="flex-grow p-6">
          <div className="mb-6">
            <div className="bg-background rounded-lg shadow-sm p-6 border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
                <h1 className="text-xl font-semibold">Solar Performance Monitor</h1>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-[180px]">
                        <Clock className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">Last 24 Hours</SelectItem>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="90d">Last 90 Days</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </div>
              
              {/* Performance Stats Cards */}
              <PerformanceStats />
              
              {/* Daily Output Chart */}
              <DailyOutputChart />
              
              {/* Site Performance Table */}
              <SitePerformanceTable />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
