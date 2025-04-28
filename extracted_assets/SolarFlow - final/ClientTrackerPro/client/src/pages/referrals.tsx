import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ReferralsList from "@/components/referrals/referrals-list";
import CreateReferralForm from "@/components/referrals/create-referral-form";
import InstallationsList from "@/components/referrals/installations-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Zap } from "lucide-react";

export default function Referrals() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header title="Referrals & Installations" setSidebarOpen={setSidebarOpen} />

        <main className="flex-grow p-6">
          {/* Referral Program Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Total Referrals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-sm text-muted-foreground">2 pending, 1 converted</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Rewards Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹5,000</div>
                <p className="text-sm text-muted-foreground">For successful conversions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  System Installations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-sm text-muted-foreground">Total capacity: 23.5 kW</p>
              </CardContent>
            </Card>
          </div>

          {/* Referrals and Create Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <ReferralsList />
            </div>
            <div>
              <CreateReferralForm />
            </div>
          </div>

          {/* Recent Installations */}
          <InstallationsList />
        </main>

        <Footer />
      </div>
    </div>
  );
}
