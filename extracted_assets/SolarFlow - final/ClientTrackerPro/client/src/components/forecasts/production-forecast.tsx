import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { SunIcon } from "lucide-react";

export default function ProductionForecast() {
  // In a real app, this would fetch from the API
  const { data, isLoading } = useQuery({
    queryKey: ['/api/forecasts/production'],
    queryFn: async () => {
      // Mock data for UI development
      return {
        // Next 7 days production forecast
        forecast: [
          { day: "Today", predicted: 138.4, actual: 132.1, weather: "sunny" },
          { day: "Tomorrow", predicted: 142.7, actual: null, weather: "sunny" },
          { day: "Monday", predicted: 89.5, actual: null, weather: "cloudy" },
          { day: "Tuesday", predicted: 65.2, actual: null, weather: "rain" },
          { day: "Wednesday", predicted: 128.3, actual: null, weather: "sunny" },
          { day: "Thursday", predicted: 110.5, actual: null, weather: "partly-cloudy" },
          { day: "Friday", predicted: 105.8, actual: null, weather: "partly-cloudy" }
        ],
        // Monthly summary
        monthSummary: {
          expectedTotal: 3245.6,
          comparedToLastMonth: "+12.5%",
          weatherImpact: "Favorable weather conditions expected to increase production by 15% compared to seasonal average"
        }
      };
    }
  });

  const getWeatherBadge = (weather: string) => {
    switch (weather) {
      case 'sunny':
        return <Badge variant="warning" className="flex items-center gap-1"><SunIcon className="h-3 w-3" /> Sunny</Badge>;
      case 'cloudy':
        return <Badge variant="secondary">Cloudy</Badge>;
      case 'partly-cloudy':
        return <Badge variant="secondary">Partly Cloudy</Badge>;
      case 'rain':
        return <Badge variant="info">Rain</Badge>;
      default:
        return <Badge>{weather}</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-semibold">Production Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6 py-4">
            <Skeleton className="h-[300px] w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data?.forecast}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="day" />
                  <YAxis
                    label={{
                      value: 'Production (kWh)',
                      angle: -90,
                      position: 'insideLeft',
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actual" name="Actual" fill="hsl(var(--primary))" />
                  <Bar dataKey="predicted" name="Predicted" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Next 7 Days</h3>
                <div className="space-y-2">
                  {data?.forecast.map((day, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{day.day}</span>
                      <div className="flex items-center gap-2">
                        {getWeatherBadge(day.weather)}
                        <span className="text-sm">{day.predicted} kWh</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Monthly Summary</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="mb-2">
                    <span className="text-sm font-medium">Expected Total: </span>
                    <span className="text-sm">{data?.monthSummary.expectedTotal} kWh</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-medium">Compared to Last Month: </span>
                    <span className="text-sm text-green-600 dark:text-green-400">
                      {data?.monthSummary.comparedToLastMonth}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                    {data?.monthSummary.weatherImpact}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
