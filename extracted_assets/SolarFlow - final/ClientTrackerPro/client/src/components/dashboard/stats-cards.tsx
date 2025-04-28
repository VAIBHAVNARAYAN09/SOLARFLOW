import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { UsersRound, SunIcon, Ticket, Zap } from "lucide-react";

interface StatsCardsProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend: {
    value: string;
    isPositive: boolean;
    text: string;
  };
}

function StatsCard({ title, value, subtitle, icon, trend }: StatsCardsProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-full dark:bg-primary/20">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium flex items-center ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={trend.isPositive ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
          </svg>
          {trend.value}
        </span>
        <span className="text-gray-500 text-sm ml-2 dark:text-slate-400">{trend.text}</span>
      </div>
    </Card>
  );
}

export default function StatsCards() {
  // This would typically fetch real-time data
  const { data, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: async () => {
      // In a real app, this would be an API call
      return {
        customers: {
          total: 5247,
          trend: { value: "12%", isPositive: true, text: "from last month" }
        },
        panels: {
          total: 21349,
          trend: { value: "8.5%", isPositive: true, text: "from last month" }
        },
        tickets: {
          total: 89,
          trend: { value: "3%", isPositive: false, text: "from last week" }
        },
        production: {
          total: "128.5 MWh",
          trend: { value: "15.2%", isPositive: true, text: "vs. yesterday" }
        }
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded dark:bg-slate-700 animate-pulse mb-2"></div>
                <div className="h-8 w-16 bg-gray-300 rounded dark:bg-slate-600 animate-pulse"></div>
              </div>
              <div className="p-3 bg-gray-200 rounded-full dark:bg-slate-700 animate-pulse h-12 w-12"></div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="h-4 w-12 bg-gray-200 rounded dark:bg-slate-700 animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded dark:bg-slate-700 animate-pulse ml-2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatsCard
        title="Total Customers"
        value={data?.customers.total.toLocaleString() || "0"}
        subtitle="Active customers"
        icon={<UsersRound className="h-6 w-6 text-primary" />}
        trend={data?.customers.trend || { value: "0%", isPositive: true, text: "no change" }}
      />
      
      <StatsCard
        title="Active Solar Panels"
        value={data?.panels.total.toLocaleString() || "0"}
        subtitle="Installed panels"
        icon={<SunIcon className="h-6 w-6 text-primary" />}
        trend={data?.panels.trend || { value: "0%", isPositive: true, text: "no change" }}
      />
      
      <StatsCard
        title="Active Tickets"
        value={data?.tickets.total.toLocaleString() || "0"}
        subtitle="Open support tickets"
        icon={<Ticket className="h-6 w-6 text-red-500" />}
        trend={data?.tickets.trend || { value: "0%", isPositive: false, text: "no change" }}
      />
      
      <StatsCard
        title="Today's Production"
        value={data?.production.total || "0"}
        subtitle="Energy generated"
        icon={<Zap className="h-6 w-6 text-secondary" />}
        trend={data?.production.trend || { value: "0%", isPositive: true, text: "no change" }}
      />
    </div>
  );
}
