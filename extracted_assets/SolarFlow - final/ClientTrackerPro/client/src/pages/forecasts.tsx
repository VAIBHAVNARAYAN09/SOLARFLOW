import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WeatherDetails from "@/components/forecasts/weather-details";
import ProductionForecast from "@/components/forecasts/production-forecast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Cloud, 
  AreaChart,  
  Calendar, 
  Droplets, 
  Wind, 
  Thermometer, 
  Sun
} from "lucide-react";

export default function Forecasts() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location, setLocation] = useState("New Delhi, India");

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header title="Weather Forecasts" setSidebarOpen={setSidebarOpen} />

        <main className="flex-grow p-6">
          {/* Location Selector */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Location Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form 
                className="flex flex-col sm:flex-row gap-3" 
                onSubmit={(e) => {
                  e.preventDefault();
                  // In a real app, this would trigger a location change
                }}
              >
                <Input
                  placeholder="Enter city or postal code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">Update Location</Button>
              </form>
            </CardContent>
          </Card>

          {/* Weather Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <WeatherDetails />
            </div>
            <div className="lg:col-span-2">
              <ProductionForecast />
            </div>
          </div>

          {/* Additional Weather Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Forecast Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">93%</div>
                <p className="text-sm text-muted-foreground">7-day prediction accuracy</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Droplets className="h-4 w-4" />
                  Precipitation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12%</div>
                <p className="text-sm text-muted-foreground">Chance of rain today</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Wind className="h-4 w-4" />
                  Wind Speed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5 km/h</div>
                <p className="text-sm text-muted-foreground">North-east direction</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Sun className="h-4 w-4" />
                  UV Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-sm text-muted-foreground">High - protection needed</p>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
