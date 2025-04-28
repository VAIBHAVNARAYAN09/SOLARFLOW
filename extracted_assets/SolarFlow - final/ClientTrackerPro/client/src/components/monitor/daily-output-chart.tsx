import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type PanelGroup = "all" | "group1" | "group2" | "group3";

export default function DailyOutputChart() {
  const [panelGroup, setPanelGroup] = useState<PanelGroup>("all");
  
  // In a real app, this would fetch from an API with the selected panel group
  const { data, isLoading } = useQuery({
    queryKey: ['/api/performance-data/daily', panelGroup],
    queryFn: async ({ queryKey }) => {
      // Mock data for UI development
      const times = ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'];
      const actualOutput = [0, 0, 0, 0.5, 3.2, 8.7, 12.5, 14.1, 11.3, 5.8, 0.9, 0];
      const predictedOutput = [0, 0, 0, 0.6, 3.5, 9.1, 13.2, 14.8, 12.1, 6.2, 1.1, 0];
      
      return {
        data: times.map((time, index) => ({
          time,
          actual: actualOutput[index],
          predicted: predictedOutput[index]
        }))
      };
    }
  });

  return (
    <Card className="mb-6">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <CardTitle>Daily Power Output</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant={panelGroup === 'all' ? 'default' : 'outline'} 
              onClick={() => setPanelGroup('all')}
            >
              All Panels
            </Button>
            <Button 
              size="sm" 
              variant={panelGroup === 'group1' ? 'default' : 'outline'} 
              onClick={() => setPanelGroup('group1')}
            >
              Group 1
            </Button>
            <Button 
              size="sm" 
              variant={panelGroup === 'group2' ? 'default' : 'outline'} 
              onClick={() => setPanelGroup('group2')}
            >
              Group 2
            </Button>
            <Button 
              size="sm" 
              variant={panelGroup === 'group3' ? 'default' : 'outline'} 
              onClick={() => setPanelGroup('group3')}
            >
              Group 3
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
              <AreaChart
                data={data?.data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="time" />
                <YAxis 
                  label={{ 
                    value: 'Power Output (MW)', 
                    angle: -90, 
                    position: 'insideLeft' 
                  }} 
                />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  name="Power Output" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary)/0.2)" 
                  activeDot={{ r: 8 }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  name="Predicted Output" 
                  stroke="hsl(var(--secondary))" 
                  fill="hsl(var(--secondary)/0.1)" 
                  strokeDasharray="5 5" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
