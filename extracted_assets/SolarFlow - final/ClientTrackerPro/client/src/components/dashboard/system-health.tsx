import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface SystemHealth {
  name: string;
  operationalPercentage: number;
  status: 'optimal' | 'good' | 'attention';
}

export default function SystemHealth() {
  // This would fetch system health data from your API
  const { data, isLoading } = useQuery({
    queryKey: ['/api/system-health'],
    queryFn: async () => {
      // In a real app, this would be an API call
      return {
        systems: [
          { name: "Solar Panels", operationalPercentage: 98.2, status: "optimal" },
          { name: "Inverters", operationalPercentage: 99.5, status: "optimal" },
          { name: "Battery Storage", operationalPercentage: 92.7, status: "good" },
          { name: "Communication Systems", operationalPercentage: 100, status: "optimal" }
        ],
        alerts: [
          { message: "Battery bank at Site 24 requires maintenance", level: "warning" }
        ]
      };
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'text-green-600 dark:text-green-400';
      case 'good':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'attention':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 95) return 'bg-green-500';
    if (percentage >= 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">System Health</CardTitle>
        <Link href="/monitor">
          <Button variant="link" className="text-sm">Details</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {data?.systems.map((system, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{system.name}</p>
                  <p className={`text-sm font-medium ${getStatusColor(system.status)}`}>
                    {system.operationalPercentage}% Operational
                  </p>
                </div>
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden dark:bg-slate-700">
                  <div 
                    className={`h-2 ${getProgressColor(system.operationalPercentage)}`} 
                    style={{ width: `${system.operationalPercentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            
            {data?.alerts && data.alerts.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">Systems Requiring Attention</p>
                {data.alerts.map((alert, index) => (
                  <div 
                    key={index} 
                    className="bg-red-50 border-l-4 border-red-500 p-3 dark:bg-red-900/30 dark:border-red-600"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800 dark:text-red-400">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
