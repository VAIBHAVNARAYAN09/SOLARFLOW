import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";

interface PerformanceStatProps {
  title: string;
  value: string;
  unit: string;
  footnote: string;
  trend: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
}

function PerformanceStat({ title, value, unit, footnote, trend }: PerformanceStatProps) {
  const getTrendIcon = () => {
    switch (trend.direction) {
      case 'up':
        return <ArrowUp className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 mr-1 text-red-600 dark:text-red-400" />;
      case 'neutral':
        return <ArrowRight className="h-4 w-4 mr-1 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend.direction) {
      case 'up':
        return "text-green-600 dark:text-green-400";
      case 'down':
        return "text-red-600 dark:text-red-400";
      case 'neutral':
        return "text-yellow-600 dark:text-yellow-400";
    }
  };

  return (
    <Card className="p-5">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400">{title}</h3>
        <span className={`text-sm font-medium flex items-center ${getTrendColor()}`}>
          {getTrendIcon()}
          {trend.value}
        </span>
      </div>
      <div className="flex items-end">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
        <span className="text-lg ml-1 text-gray-600 dark:text-slate-400">{unit}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">{footnote}</p>
    </Card>
  );
}

export default function PerformanceStats() {
  // In a real app, this would fetch from an API
  const { data, isLoading } = useQuery({
    queryKey: ['/api/performance-stats'],
    queryFn: async () => {
      // Mock data for UI development
      return {
        totalProduction: {
          value: "128.5",
          unit: "MWh",
          trend: { value: "12%", direction: "up" },
          footnote: "vs. 114.7 MWh yesterday"
        },
        peakPower: {
          value: "15.2",
          unit: "MW",
          trend: { value: "5%", direction: "up" },
          footnote: "at 12:30 PM today"
        },
        performanceRatio: {
          value: "89.7",
          unit: "%",
          trend: { value: "0%", direction: "neutral" },
          footnote: "stable from yesterday"
        },
        co2Avoided: {
          value: "91.2",
          unit: "tons",
          trend: { value: "12%", direction: "up" },
          footnote: "vs. 81.5 tons yesterday"
        }
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-5">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex items-end">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-5 w-8 ml-1" />
            </div>
            <Skeleton className="h-3 w-32 mt-1" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <PerformanceStat
        title="Total Production"
        value={data?.totalProduction.value || "0"}
        unit={data?.totalProduction.unit || ""}
        footnote={data?.totalProduction.footnote || ""}
        trend={data?.totalProduction.trend || { value: "0%", direction: "neutral" }}
      />
      
      <PerformanceStat
        title="Peak Power"
        value={data?.peakPower.value || "0"}
        unit={data?.peakPower.unit || ""}
        footnote={data?.peakPower.footnote || ""}
        trend={data?.peakPower.trend || { value: "0%", direction: "neutral" }}
      />
      
      <PerformanceStat
        title="Performance Ratio"
        value={data?.performanceRatio.value || "0"}
        unit={data?.performanceRatio.unit || ""}
        footnote={data?.performanceRatio.footnote || ""}
        trend={data?.performanceRatio.trend || { value: "0%", direction: "neutral" }}
      />
      
      <PerformanceStat
        title="CO₂ Avoided"
        value={data?.co2Avoided.value || "0"}
        unit={data?.co2Avoided.unit || ""}
        footnote={data?.co2Avoided.footnote || ""}
        trend={data?.co2Avoided.trend || { value: "0%", direction: "neutral" }}
      />
    </div>
  );
}
