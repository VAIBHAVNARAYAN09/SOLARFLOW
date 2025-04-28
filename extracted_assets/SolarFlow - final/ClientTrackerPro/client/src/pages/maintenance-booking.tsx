import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BookMaintenanceForm from "@/components/maintenance/book-maintenance-form";
import MaintenanceBookingsList from "@/components/maintenance/maintenance-bookings-list";
import MaintenancePaymentInterface from "@/components/maintenance/maintenance-payment-interface";
import { Wrench, ListChecks, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MaintenanceBooking() {
  const [activeTab, setActiveTab] = useState<string>("new");
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSelectBooking = (id: number | null) => {
    if (id) {
      setSelectedBookingId(id);
      setActiveTab("payment");
    } else {
      setSelectedBookingId(null);
    }
  };

  const handleBackToList = () => {
    setSelectedBookingId(null);
    setActiveTab("bookings");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header title="Maintenance Booking" setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1">
          <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Maintenance Bookings</h1>
                <p className="text-muted-foreground">Schedule maintenance for your solar panels and track your bookings</p>
              </div>
            </div>

            <Separator />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="new" className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  <span>New Booking</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  <span>My Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="payment" className="flex items-center gap-2" disabled={!selectedBookingId}>
                  <CreditCard className="h-4 w-4" />
                  <span>Payment</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="space-y-6">
                <BookMaintenanceForm />
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Service Benefits</CardTitle>
                    <CardDescription>Regular maintenance ensures optimal performance of your solar system</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-2">Increased Efficiency</h3>
                        <p className="text-sm text-muted-foreground">Regular cleaning can improve solar panel efficiency by up to 25%, maximizing your energy production.</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-2">Extended Lifespan</h3>
                        <p className="text-sm text-muted-foreground">Preventative maintenance helps identify potential issues early, extending your system's operational life.</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-2">Warranty Protection</h3>
                        <p className="text-sm text-muted-foreground">Many manufacturer warranties require regular professional maintenance to remain valid.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-6">
                <MaintenanceBookingsList 
                  onSelectBooking={handleSelectBooking}
                  selectedBookingId={selectedBookingId}
                />
              </TabsContent>

              <TabsContent value="payment" className="space-y-6">
                {selectedBookingId ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleBackToList}
                      >
                        Back to bookings
                      </Button>
                    </div>
                    <MaintenancePaymentInterface bookingId={selectedBookingId} />
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Booking Selected</CardTitle>
                      <CardDescription>Please select a booking from the "My Bookings" tab to proceed with payment</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => setActiveTab("bookings")}>Go to My Bookings</Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}