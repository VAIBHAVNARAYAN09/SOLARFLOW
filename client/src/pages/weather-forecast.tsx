import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, RefreshCw, Droplets, Wind, Thermometer, Sun } from "lucide-react";

// Weather forecast interface
interface WeatherForecast {
  location: string;
  current: {
    temperature: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    uvIndex: number;
  };
  daily: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    description: string;
    icon: string;
    precipitationChance: number;
  }>;
  hourly: Array<{
    time: string;
    temperature: number;
    description: string;
    icon: string;
    precipitationChance: number;
  }>;
}

export default function WeatherForecastPage() {
  const { toast } = useToast();
  const [location, setLocation] = useState<string>("Delhi,India");
  const [searchInput, setSearchInput] = useState<string>("Delhi,India");
  
  // Fetch weather forecast
  const { 
    data: forecast, 
    isLoading: forecastLoading,
    refetch: refetchForecast
  } = useQuery<WeatherForecast>({
    queryKey: ["/api/weather", location],
    refetchOnWindowFocus: false,
  });
  
  // Handle search
  const handleSearch = () => {
    if (searchInput.trim() === "") {
      toast({
        title: "Please enter a location",
        description: "Enter a city name, state, or country",
        variant: "destructive",
      });
      return;
    }
    
    setLocation(searchInput);
  };
  
  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  // Format time
  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get day of week
  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "EEE");
  };
  
  // Weather icon URL
  const getWeatherIconUrl = (icon: string) => {
    return `http://openweathermap.org/img/wn/${icon}@2x.png`;
  };
  
  // Refresh forecast
  const handleRefresh = () => {
    refetchForecast();
    toast({
      title: "Refreshing weather data",
      description: "The latest weather forecast is being fetched",
    });
  };

  return (
    <Layout title="Weather Forecast">
      <div className="space-y-6 p-5 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight dark:text-white">Solar Weather Forecast</h2>
            <p className="text-sm text-muted-foreground dark:text-slate-400">
              Check the weather forecast to plan your solar system maintenance
            </p>
          </div>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-1 h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
        
        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter location (e.g., city, state, country)"
                  className="pl-8"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </CardContent>
        </Card>
        
        {forecastLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : forecast ? (
          <>
            {/* Current Weather */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-800 dark:to-blue-900 text-white py-6">
                <div className="container px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={getWeatherIconUrl(forecast.current.icon)} 
                      alt={forecast.current.description}
                      className="w-24 h-24"
                    />
                    <div>
                      <h3 className="text-3xl font-bold">{forecast.location}</h3>
                      <p className="text-lg capitalize">{forecast.current.description}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold">{forecast.current.temperature.toFixed(1)}°C</div>
                    <p className="text-sm opacity-90">Feels like {(forecast.current.temperature).toFixed(1)}°C</p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex items-center">
                      <Wind className="h-5 w-5 mr-2 opacity-75" />
                      <span>Wind: {forecast.current.windSpeed} m/s</span>
                    </div>
                    <div className="flex items-center">
                      <Droplets className="h-5 w-5 mr-2 opacity-75" />
                      <span>Humidity: {forecast.current.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <Sun className="h-5 w-5 mr-2 opacity-75" />
                      <span>UV Index: {forecast.current.uvIndex}</span>
                    </div>
                    <div className="flex items-center">
                      <Thermometer className="h-5 w-5 mr-2 opacity-75" />
                      <span>Pressure: {forecast.current.pressure} hPa</span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="py-6">
                <h3 className="text-lg font-medium mb-4">Solar Performance Insight</h3>
                <p className="text-muted-foreground dark:text-slate-400">
                  {forecast.current.description.toLowerCase().includes("clear") || 
                   forecast.current.description.toLowerCase().includes("sun") ?
                    "Excellent conditions for solar power generation today. Your panels should be operating at peak efficiency." :
                   forecast.current.description.toLowerCase().includes("cloud") ?
                    "Partly cloudy conditions may reduce solar output slightly. Expect moderate energy production." :
                   forecast.current.description.toLowerCase().includes("rain") || 
                   forecast.current.description.toLowerCase().includes("shower") ?
                    "Rainy conditions will significantly reduce solar output. Energy production will be below average." :
                    "Current weather conditions may impact solar production. Monitor your system performance."
                  }
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Maintenance Recommendations:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground dark:text-slate-400 space-y-1">
                    {forecast.current.description.toLowerCase().includes("rain") || 
                     forecast.current.description.toLowerCase().includes("shower") ? (
                      <>
                        <li>Postpone any planned panel cleaning until dry conditions return</li>
                        <li>Check drainage systems around ground-mounted panels if heavy rain is expected</li>
                      </>
                    ) : forecast.current.description.toLowerCase().includes("snow") ? (
                      <>
                        <li>Monitor snow accumulation on panels</li>
                        <li>Snow removal may be necessary if accumulation exceeds 2 inches</li>
                        <li>Avoid maintenance visits until roads are clear</li>
                      </>
                    ) : forecast.current.windSpeed > 8 ? (
                      <>
                        <li>High winds detected - check panel mounting fixtures</li>
                        <li>Postpone maintenance work at heights until wind speeds decrease</li>
                        <li>Inspect for wind-blown debris after the weather event</li>
                      </>
                    ) : (
                      <>
                        <li>Good conditions for routine maintenance and inspection</li>
                        <li>Ideal time for panel cleaning if scheduled</li>
                        <li>Check for any shade patterns during peak sun hours</li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            {/* Detailed Forecast Tabs */}
            <Tabs defaultValue="daily" className="space-y-4">
              <TabsList>
                <TabsTrigger value="daily">7-Day Forecast</TabsTrigger>
                <TabsTrigger value="hourly">Hourly Forecast</TabsTrigger>
              </TabsList>
              
              {/* Daily Forecast */}
              <TabsContent value="daily">
                <Card>
                  <CardHeader>
                    <CardTitle>7-Day Weather Forecast</CardTitle>
                    <CardDescription>
                      Plan your solar maintenance with our 7-day weather forecast
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                      {forecast.daily.map((day) => (
                        <Card key={day.date} className="overflow-hidden border-none shadow-md h-full">
                          <CardHeader className="bg-slate-50 dark:bg-slate-800 p-3 text-center">
                            <p className="text-sm font-medium">{getDayOfWeek(day.date)}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(day.date), "MMM d")}</p>
                          </CardHeader>
                          <CardContent className="p-3 text-center">
                            <div className="flex justify-center">
                              <img 
                                src={getWeatherIconUrl(day.icon)} 
                                alt={day.description}
                                className="w-12 h-12 mx-auto"
                              />
                            </div>
                            <p className="text-xs capitalize mt-1 h-8 flex items-center justify-center">{day.description}</p>
                            <div className="mt-2 flex justify-between text-sm">
                              <span className="font-medium">{day.maxTemp.toFixed(0)}°</span>
                              <span className="text-muted-foreground">{day.minTemp.toFixed(0)}°</span>
                            </div>
                            <div className="mt-2 text-xs flex items-center justify-center gap-1">
                              <Droplets className="h-3 w-3" />
                              <span>{day.precipitationChance.toFixed(0)}%</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Hourly Forecast */}
              <TabsContent value="hourly">
                <Card>
                  <CardHeader>
                    <CardTitle>Hourly Weather Forecast</CardTitle>
                    <CardDescription>
                      Detailed hourly weather forecast for the next 24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead>Temperature</TableHead>
                            <TableHead>Precipitation</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {forecast.hourly.slice(0, 24).map((hour, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {formatTime(hour.time)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <img 
                                    src={getWeatherIconUrl(hour.icon)} 
                                    alt={hour.description}
                                    className="w-10 h-10 mr-2"
                                  />
                                  <span className="capitalize">{hour.description}</span>
                                </div>
                              </TableCell>
                              <TableCell>{hour.temperature.toFixed(1)}°C</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                                  {hour.precipitationChance.toFixed(0)}%
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Solar Production Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Solar Production Impact Analysis</CardTitle>
                <CardDescription>
                  How current and forecasted weather conditions will affect your solar system's performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
                      <h4 className="text-sm font-medium mb-2">Current Production Impact</h4>
                      <div className="flex items-center mb-2">
                        {forecast.current.description.toLowerCase().includes("clear") || 
                         forecast.current.description.toLowerCase().includes("sun") ? (
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "90%" }}></div>
                          </div>
                        ) : forecast.current.description.toLowerCase().includes("cloud") ? (
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "60%" }}></div>
                          </div>
                        ) : (
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "30%" }}></div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground dark:text-slate-400">
                        {forecast.current.description.toLowerCase().includes("clear") || 
                         forecast.current.description.toLowerCase().includes("sun") ? 
                          "Excellent (90% efficiency)" : 
                         forecast.current.description.toLowerCase().includes("cloud") ? 
                          "Moderate (60% efficiency)" : 
                          "Low (30% efficiency)"}
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
                      <h4 className="text-sm font-medium mb-2">Best Production Time Today</h4>
                      <p className="text-lg font-bold">
                        {forecast.hourly.slice(0, 24).reduce((best, hour) => {
                          return hour.temperature > best.temperature &&
                                !hour.description.toLowerCase().includes("rain") ? hour : best;
                        }, forecast.hourly[0]).time ?
                          formatTime(forecast.hourly.slice(0, 24).reduce((best, hour) => {
                            return hour.temperature > best.temperature &&
                                  !hour.description.toLowerCase().includes("rain") ? hour : best;
                          }, forecast.hourly[0]).time) : "12:00 PM"
                        }
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-slate-400">
                        Expected peak solar generation time based on weather conditions
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
                      <h4 className="text-sm font-medium mb-2">Optimal Maintenance Day</h4>
                      <p className="text-lg font-bold">
                        {format(new Date(forecast.daily.reduce((best, day) => {
                          return day.precipitationChance < best.precipitationChance &&
                                day.maxTemp > 15 ? day : best;
                        }, forecast.daily[0]).date), "EEE, MMM d")}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-slate-400">
                        Recommended day for maintenance based on forecast conditions
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Weekly Production Forecast</h4>
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Weather</TableHead>
                            <TableHead>Expected Production</TableHead>
                            <TableHead>Maintenance Suitability</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {forecast.daily.map((day) => {
                            // Calculate expected production percentage based on weather
                            let productionPercentage = 90; // Default high
                            
                            if (day.description.toLowerCase().includes("rain") || 
                                day.description.toLowerCase().includes("snow")) {
                              productionPercentage = 30; // Low for rain or snow
                            } else if (day.description.toLowerCase().includes("cloud")) {
                              productionPercentage = 60; // Medium for clouds
                            } else if (day.precipitationChance > 50) {
                              productionPercentage = 50; // Medium-low for high precipitation chance
                            }
                            
                            // Determine maintenance suitability
                            let suitability = "Excellent";
                            let suitabilityColor = "text-green-600 dark:text-green-400";
                            
                            if (day.description.toLowerCase().includes("rain") || 
                                day.description.toLowerCase().includes("snow") ||
                                day.precipitationChance > 70) {
                              suitability = "Poor";
                              suitabilityColor = "text-red-600 dark:text-red-400";
                            } else if (day.description.toLowerCase().includes("cloud") ||
                                       day.precipitationChance > 30) {
                              suitability = "Fair";
                              suitabilityColor = "text-yellow-600 dark:text-yellow-400";
                            }
                            
                            return (
                              <TableRow key={day.date}>
                                <TableCell className="font-medium">
                                  {getDayOfWeek(day.date)} {format(new Date(day.date), "MMM d")}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <img 
                                      src={getWeatherIconUrl(day.icon)} 
                                      alt={day.description}
                                      className="w-8 h-8 mr-2"
                                    />
                                    <span className="capitalize">{day.description}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                      <div 
                                        className={`h-2 rounded-full ${
                                          productionPercentage > 70 ? "bg-green-600" :
                                          productionPercentage > 40 ? "bg-yellow-500" : "bg-red-500"
                                        }`} 
                                        style={{ width: `${productionPercentage}%` }}
                                      ></div>
                                    </div>
                                    <span>{productionPercentage}%</span>
                                  </div>
                                </TableCell>
                                <TableCell className={suitabilityColor}>
                                  {suitability}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No weather data available</p>
              <p className="text-xs mt-2">Try searching for a different location</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}