import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendDirection: "up" | "down";
  icon: React.ReactNode;
  description?: string;
}

export default function StatsCard({
  title,
  value,
  trend,
  trendDirection,
  icon,
  description = "from last period"
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground dark:text-slate-400">
          <span className={cn(
            "font-medium",
            trendDirection === "up" 
              ? (title.includes("Response") ? "text-red-500" : "text-green-500") 
              : (title.includes("Ticket") ? "text-green-500" : "text-red-500")
          )}>
            {trend}
          </span>
          {" "}{description}
        </p>
      </CardContent>
    </Card>
  );
}
