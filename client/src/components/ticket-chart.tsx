import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Generate sample data for demo charts
const generatePerformanceData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  
  return months.map((month) => ({
    name: month,
    "Actual": Math.floor(Math.random() * 30) + 150, // kWh
    "Expected": Math.floor(Math.random() * 15) + 170, // kWh
  }));
};

const generateTicketData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  return days.map((day) => ({
    name: day,
    "New": Math.floor(Math.random() * 6) + 1,
    "Resolved": Math.floor(Math.random() * 8) + 2,
    "Pending": Math.floor(Math.random() * 4) + 1,
  }));
};

const generateSavingsData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  
  return months.map((month) => ({
    name: month,
    "Amount": Math.floor(Math.random() * 50) + 100, // $
  }));
};

export default function TicketChart() {
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [ticketData, setTicketData] = useState<any[]>([]);
  const [savingsData, setSavingsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setPerformanceData(generatePerformanceData());
      setTicketData(generateTicketData());
      setSavingsData(generateSavingsData());
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Get the current URL to determine which tab is active
  const pathname = window.location.pathname;
  const hash = window.location.hash;
  
  // Default to performance chart
  let activeChartType = "performance";
  
  if (hash === "#tickets") {
    activeChartType = "tickets";
  } else if (hash === "#savings") {
    activeChartType = "savings";
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      {activeChartType === "performance" && (
        <LineChart 
          data={performanceData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            className="text-xs" 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            className="text-xs" 
            tickFormatter={(value) => `${value}kWh`} 
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Actual" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ r: 4, fill: "#3B82F6" }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Expected" 
            stroke="#10B981" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4, fill: "#10B981" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      )}
      
      {activeChartType === "tickets" && (
        <BarChart
          data={ticketData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            className="text-xs" 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            className="text-xs" 
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="New" fill="#3B82F6" radius={[5, 5, 0, 0]} />
          <Bar dataKey="Resolved" fill="#10B981" radius={[5, 5, 0, 0]} />
          <Bar dataKey="Pending" fill="#F59E0B" radius={[5, 5, 0, 0]} />
        </BarChart>
      )}
      
      {activeChartType === "savings" && (
        <AreaChart
          data={savingsData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            className="text-xs" 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            className="text-xs" 
            tickFormatter={(value) => `$${value}`} 
          />
          <Tooltip formatter={(value) => [`$${value}`, "Savings"]} />
          <Area 
            type="monotone" 
            dataKey="Amount" 
            stroke="#10B981" 
            fillOpacity={1} 
            fill="url(#colorAmount)" 
          />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}
