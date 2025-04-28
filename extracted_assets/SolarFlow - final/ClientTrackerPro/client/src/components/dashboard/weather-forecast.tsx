import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Sun, Cloud, CloudDrizzle, CloudFog } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function WeatherForecast() {
  // This would fetch weather forecast data from your API
  const { data, isLoading } = useQuery({
    queryKey: ['/api/weather-forecast'],
    queryFn: async () => {
      // In a real app, this would be an API call
      return {
        location: "New Delhi, India",
        current: {
          temperature: 32,
          condition: "Sunny",
          icon: "sun",
          expectedProduction: 85 // percent of max
        },
        forecast: [
          { day: "Mon", condition: "sunny", temperature: 33, productionPercent: 90 },
          { day: "Tue", condition: "cloudy", temperature: 29, productionPercent: 65 },
          { day: "Wed", condition: "rain", temperature: 28, productionPercent: 40 },
          { day: "Thu", condition: "sunny", temperature: 31, productionPercent: 88 },
          { day: "Fri", condition: "partly-cloudy", temperature: 30, productionPercent: 75 }
        ]
      };
    }
  });

  // Helper function to render weather icons
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case "cloudy":
      case "partly-cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case "rain":
        return <CloudDrizzle className="h-6 w-6 text-blue-500" />;
      case "fog":
        return <CloudFog className="h-6 w-6 text-gray-500" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  // Helper function to get large weather icon
  const getLargeWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Sunny":
        return <Sun className="h-14 w-14 text-yellow-500" />;
      case "Cloudy":
      case "Partly Cloudy":
        return <Cloud className="h-14 w-14 text-gray-500" />;
      case "Rain":
        return <CloudDrizzle className="h-14 w-14 text-blue-500" />;
      case "Fog":
        return <CloudFog className="h-14 w-14 text-gray-500" />;
      default:
        return <Sun className="h-14 w-14 text-yellow-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Weather Forecast</CardTitle>
        {!isLoading && (
          <span className="text-sm text-gray-500 dark:text-slate-400">{data?.location}</span>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-12 w-16" />
              <Skeleton className="h-14 w-14 rounded-full" />
            </div>
            <Skeleton className="h-8 w-full" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-2 w-24 rounded-full" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Today's Weather */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{data?.current.temperature}°C</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">{data?.current.condition}</p>
              </div>
              <div>
                {getLargeWeatherIcon(data?.current.condition || "Sunny")}
              </div>
            </div>
            
            {/* Production Forecast */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Expected Production Today</p>
              <Progress value={data?.current.expectedProduction} className="h-2" />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500 dark:text-slate-400">0 kWh</span>
                <span className="text-xs font-medium text-gray-700 dark:text-slate-300">
                  {(data?.current.expectedProduction || 0) * 1.5} kWh ({data?.current.expectedProduction}% of max)
                </span>
              </div>
            </div>
            
            {/* Future Forecast */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3 dark:text-slate-300">5-Day Forecast</p>
              <div className="space-y-3">
                {data?.forecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-slate-400 w-10">{day.day}</span>
                    <div className="flex-shrink-0">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-slate-400 w-12">{day.temperature}°C</span>
                    <div className="w-24 bg-gray-200 h-2 rounded-full dark:bg-slate-700">
                      <div 
                        className="bg-secondary h-2 rounded-full" 
                        style={{ width: `${day.productionPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-slate-400 w-10 text-right">{day.productionPercent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
