import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MaintenanceReportsList from "@/components/reports/maintenance-reports-list";
import GenerateReportForm from "@/components/reports/generate-report-form";

export default function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header title="Maintenance Reports" setSidebarOpen={setSidebarOpen} />

        <main className="flex-grow p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MaintenanceReportsList />
            </div>
            <div>
              <GenerateReportForm />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
