import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type TimeRange = 'day' | 'week' | 'month' | 'year';

export default function PerformanceChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  
  // This would fetch data from your API based on the selected time range
  const { data, isLoading } = useQuery({
    queryKey: ['/api/performance-data', timeRange],
    queryFn: async ({ queryKey }) => {
      // In a real app, this would be an actual API call with the timeRange
      const range = queryKey[1];
      
      // Sample data generation
      const times = range === 'day' 
        ? ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM']
        : range === 'week'
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : range === 'month'
        ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const currentData = [0, 2.1, 5.8, 8.3, 9.2, 7.4, 4.1, 0.2].slice(0, times.length);
      const previousData = [0, 1.8, 5.2, 7.8, 8.5, 6.9, 3.8, 0.1].slice(0, times.length);
      
      // Extend or truncate data to match time periods
      while (currentData.length < times.length) {
        currentData.push(Math.random() * 10);
      }
      while (previousData.length < times.length) {
        previousData.push(Math.random() * 10);
      }
      
      return {
        labels: times,
        datasets: [
          {
            name: "Today",
            data: currentData,
            color: "hsl(var(--chart-1))"
          },
          {
            name: "Yesterday",
            data: previousData,
            color: "hsl(var(--chart-3))"
          }
        ]
      };
    }
  });

  // Create a chart-ready format
  const chartData = data?.labels.map((label, index) => ({
    name: label,
    current: data.datasets[0].data[index],
    previous: data.datasets[1].data[index]
  }));
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <CardTitle>System Performance</CardTitle>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant={timeRange === 'day' ? 'default' : 'outline'} 
              onClick={() => setTimeRange('day')}
            >
              Day
            </Button>
            <Button 
              size="sm" 
              variant={timeRange === 'week' ? 'default' : 'outline'} 
              onClick={() => setTimeRange('week')}
            >
              Week
            </Button>
            <Button 
              size="sm" 
              variant={timeRange === 'month' ? 'default' : 'outline'} 
              onClick={() => setTimeRange('month')}
            >
              Month
            </Button>
            <Button 
              size="sm" 
              variant={timeRange === 'year' ? 'default' : 'outline'} 
              onClick={() => setTimeRange('year')}
            >
              Year
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis 
                  label={{ 
                    value: 'Power Output (MW)', 
                    angle: -90, 
                    position: 'insideLeft' 
                  }} 
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  name={data?.datasets[0].name}
                  stroke={data?.datasets[0].color} 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  fill={`${data?.datasets[0].color}20`}
                />
                <Line 
                  type="monotone" 
                  dataKey="previous" 
                  name={data?.datasets[1].name}
                  stroke={data?.datasets[1].color} 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill={`${data?.datasets[1].color}10`}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
