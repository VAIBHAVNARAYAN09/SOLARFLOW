import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { format, subDays, eachDayOfInterval, getHours } from "date-fns";
import { AreaChart, BarChart, LineChart } from "@/components/ui/charts";
import {
  ArrowUpRight,
  ArrowDownRight,
  SunIcon,
  CloudIcon,
  Zap,
  Thermometer,
  BarChart3,
  TrendingUp,
  Battery,
  Droplets,
  Clock,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Define mock data types
interface SystemPerformance {
  id: number;
  name: string;
  location: string;
  efficiency: number;
  currentOutput: number;
  totalEnergyGenerated: number;
  peakPower: number;
  status: "optimal" | "warning" | "critical" | "offline";
  lastUpdated: Date;
}

interface DailyPerformance {
  date: string;
  generation: number;
  efficiency: number;
  sunHours: number;
  temperature: number;
}

interface HourlyPerformance {
  hour: string;
  output: number;
  expected: number;
}

interface MonthlyPerformance {
  month: string;
  generation: number;
  projected: number;
}

interface PerformanceComparison {
  category: string;
  thisMonth: number;
  lastMonth: number;
  change: number;
}

// Mock data
const systemsMock: SystemPerformance[] = [
  {
    id: 1,
    name: "Residential System 1",
    location: "New Delhi, India",
    efficiency: 92,
    currentOutput: 4.2,
    totalEnergyGenerated: 12435,
    peakPower: 5.6,
    status: "optimal",
    lastUpdated: new Date()
  },
  {
    id: 2,
    name: "Residential System 2",
    location: "Mumbai, India",
    efficiency: 87,
    currentOutput: 3.8,
    totalEnergyGenerated: 10987,
    peakPower: 5.2,
    status: "warning",
    lastUpdated: new Date()
  },
  {
    id: 3,
    name: "Commercial Installation",
    location: "Bangalore, India",
    efficiency: 94,
    currentOutput: 12.4,
    totalEnergyGenerated: 45672,
    peakPower: 15.8,
    status: "optimal",
    lastUpdated: new Date()
  }
];

// Generate daily performance data for the past 30 days
const generateDailyData = (): DailyPerformance[] => {
  return eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date()
  }).map(date => {
    const dateString = format(date, "MMM dd");
    const dayOfWeek = date.getDay();
    // Introduce some natural variation, with weekends slightly higher (more sun)
    const baseGeneration = 15 + Math.random() * 10;
    const weatherFactor = Math.random() > 0.25 ? 1 : 0.6; // Cloudy days
    const generation = baseGeneration * (dayOfWeek === 0 || dayOfWeek === 6 ? 1.1 : 1) * weatherFactor;
    const efficiency = 80 + Math.random() * 15 * weatherFactor;
    const sunHours = 4 + Math.random() * 6 * weatherFactor;
    const temperature = 25 + Math.random() * 10;
    
    return {
      date: dateString,
      generation: Math.round(generation * 10) / 10,
      efficiency: Math.round(efficiency),
      sunHours: Math.round(sunHours * 10) / 10,
      temperature: Math.round(temperature)
    };
  });
};

// Generate hourly performance data for a day
const generateHourlyData = (): HourlyPerformance[] => {
  return Array.from({ length: 24 }, (_, hour) => {
    // Solar panels produce power during daylight hours
    const isDaylight = hour >= 6 && hour <= 18;
    const peakHour = Math.abs(hour - 12); // 12 is peak sun
    const outputFactor = isDaylight ? Math.max(0, 1 - peakHour / 8) : 0;
    const output = outputFactor * (4 + Math.random() * 2);
    const expected = outputFactor * 5; // Ideal output
    
    return {
      hour: `${hour}:00`,
      output: Math.round(output * 100) / 100,
      expected: Math.round(expected * 100) / 100
    };
  });
};

// Generate monthly performance data
const generateMonthlyData = (): MonthlyPerformance[] => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  
  return months.map((month, index) => {
    // Past months have actual generation, future months have projections
    const isPast = index <= currentMonth;
    const seasonalFactor = 1 - Math.abs((index - 6) / 12); // Peak in middle of year
    const baseGeneration = 300 + 100 * seasonalFactor;
    const variation = Math.random() * 50 - 25;
    
    return {
      month,
      generation: isPast ? Math.round(baseGeneration + variation) : 0,
      projected: Math.round(baseGeneration + (Math.random() * 30 - 15))
    };
  });
};

// Generate performance comparison data
const generatePerformanceComparison = (): PerformanceComparison[] => {
  return [
    {
      category: "Energy Generated (kWh)",
      thisMonth: 425,
      lastMonth: 386,
      change: 10.1
    },
    {
      category: "System Efficiency (%)",
      thisMonth: 92,
      lastMonth: 88,
      change: 4.5
    },
    {
      category: "Peak Power (kW)",
      thisMonth: 5.8,
      lastMonth: 5.6,
      change: 3.6
    },
    {
      category: "Carbon Offset (kg)",
      thisMonth: 312,
      lastMonth: 284,
      change: 9.9
    }
  ];
};

export default function PerformanceMonitor() {
  const [selectedSystem, setSelectedSystem] = useState<string>("1");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 29),
    to: new Date()
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [dailyData, setDailyData] = useState<DailyPerformance[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyPerformance[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyPerformance[]>([]);
  const [comparisonData, setComparisonData] = useState<PerformanceComparison[]>([]);
  
  // Simulate data fetching
  useEffect(() => {
    setDailyData(generateDailyData());
    setHourlyData(generateHourlyData());
    setMonthlyData(generateMonthlyData());
    setComparisonData(generatePerformanceComparison());
  }, [selectedSystem]);
  
  // Mock query for system stats
  const { data: systemStats } = useQuery({
    queryKey: ["/api/performance/stats", selectedSystem],
    queryFn: async () => {
      // This would be an actual API call in a real app
      return {
        totalEnergyGenerated: 12435,
        averageEfficiency: 92,
        peakPower: 5.6,
        lastWeekGeneration: [15.2, 16.8, 14.5, 17.2, 15.9, 12.4, 16.7],
        performanceTrend: 8.5
      };
    },
    enabled: !!selectedSystem,
  });
  
  // Find the selected system
  const selectedSystemData = systemsMock.find(sys => sys.id === parseInt(selectedSystem)) || systemsMock[0];
  
  // Status colors
  const statusColors: Record<string, string> = {
    optimal: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
    offline: "bg-gray-500"
  };
  
  // Format numbers for display
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };
  
  // Format kWh for daily data
  const formatKWh = (value: number) => `${value} kWh`;
  
  return (
    <Layout title="Performance Monitor">
      <div className="p-6 space-y-6">
        <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Performance Monitor</h1>
            <p className="text-muted-foreground">
              Track and analyze your solar system performance metrics
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedSystem} onValueChange={setSelectedSystem}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select system" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Your Systems</SelectLabel>
                  {systemsMock.map(system => (
                    <SelectItem key={system.id} value={system.id.toString()}>
                      {system.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <DateRangePicker 
              date={dateRange} 
              onDateChange={(range) => setDateRange(range)} 
            />
          </div>
        </div>
        
        {/* System Overview Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{selectedSystemData.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <span className="mr-2">{selectedSystemData.location}</span>
                  <Badge variant="secondary">5.6 kW System</Badge>
                </CardDescription>
              </div>
              
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-2 ${statusColors[selectedSystemData.status]}`}></div>
                <span className="capitalize text-sm font-medium">
                  {selectedSystemData.status === "optimal" ? "Performing Optimally" : 
                   selectedSystemData.status === "warning" ? "Needs Attention" :
                   selectedSystemData.status === "critical" ? "Critical Issues" : "System Offline"}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Current Output</h3>
                  <Zap className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="mt-1 flex items-baseline">
                  <p className="text-2xl font-semibold">{selectedSystemData.currentOutput} kW</p>
                  <p className="ml-2 text-xs font-medium text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    12%
                  </p>
                </div>
                <div className="mt-1">
                  <p className="text-xs text-muted-foreground">
                    Peak today: 5.2 kW at 12:30 PM
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">System Efficiency</h3>
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </div>
                <div className="mt-1">
                  <p className="text-2xl font-semibold">{selectedSystemData.efficiency}%</p>
                  <div className="mt-1">
                    <Progress value={selectedSystemData.efficiency} className="h-1.5" />
                  </div>
                </div>
                <div className="mt-1">
                  <p className="text-xs text-muted-foreground">
                    Expected range: 85-95%
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Energy Generated</h3>
                  <Battery className="h-4 w-4 text-green-500" />
                </div>
                <div className="mt-1 flex items-baseline">
                  <p className="text-2xl font-semibold">{formatNumber(selectedSystemData.totalEnergyGenerated)} kWh</p>
                </div>
                <div className="mt-1">
                  <p className="text-xs text-muted-foreground">
                    Since installation ({format(new Date(2023, 5, 15), "MMM dd, yyyy")})
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Current Weather</h3>
                  <SunIcon className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="mt-1 flex items-baseline">
                  <p className="text-2xl font-semibold">31°C</p>
                  <p className="ml-2 text-sm font-medium">Sunny</p>
                </div>
                <div className="mt-1">
                  <p className="text-xs text-muted-foreground">
                    Ideal conditions for generation
                  </p>
                </div>
              </div>
            </div>
            
            {/* System Performance Indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Daily Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <AreaChart
                    data={dailyData}
                    index="date"
                    categories={["generation"]}
                    colors={["green"]}
                    valueFormatter={formatKWh}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comparisonData.map((item, index) => (
                      <div key={index} className="flex flex-col space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.category}</span>
                          <span className={`flex items-center ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.change > 0 ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                            {Math.abs(item.change)}%
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium">{item.thisMonth}</div>
                          <Separator orientation="vertical" className="h-4" />
                          <div className="text-sm text-muted-foreground">{item.lastMonth}</div>
                        </div>
                        <Progress value={item.thisMonth / (item.lastMonth * 1.5) * 100} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        {/* Performance Detail Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="daily">Daily Performance</TabsTrigger>
            <TabsTrigger value="hourly">Hourly Output</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Analysis</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Issues</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    System performance metrics and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">System Health Score</h4>
                      <div className="flex items-center space-x-2">
                        <div className="text-2xl font-bold">92/100</div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Excellent
                        </Badge>
                      </div>
                      <Progress value={92} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Your system is performing optimally with high efficiency ratings
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Last 7 Days Generation</h4>
                      <BarChart
                        data={[
                          { day: "Mon", energy: 15.2 },
                          { day: "Tue", energy: 16.8 },
                          { day: "Wed", energy: 14.5 },
                          { day: "Thu", energy: 17.2 },
                          { day: "Fri", energy: 15.9 },
                          { day: "Sat", energy: 12.4 },
                          { day: "Sun", energy: 16.7 },
                        ]}
                        index="day"
                        categories={["energy"]}
                        colors={["blue"]}
                        valueFormatter={(value) => `${value} kWh`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Production Ratio</h4>
                        <div className="text-2xl font-semibold">1.42</div>
                        <p className="text-xs text-muted-foreground">
                          kWh / kW of capacity
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Carbon Offset</h4>
                        <div className="text-2xl font-semibold">8.7 tons</div>
                        <p className="text-xs text-muted-foreground">
                          CO₂ equivalent saved
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Activity</CardTitle>
                  <CardDescription>
                    Recent events and maintenance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Next Scheduled Maintenance</h4>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        {format(new Date(2023, 4, 18), "MMMM dd, yyyy")}
                      </div>
                      <Button variant="link" className="p-0 h-auto text-xs" size="sm">
                        Reschedule
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Recent Events</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="p-1.5 bg-green-100 rounded-full">
                            <RefreshCw className="h-3.5 w-3.5 text-green-800" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">System Update Applied</span>
                              <span className="text-xs text-muted-foreground">2 days ago</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Firmware updated to version 3.4.2
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="p-1.5 bg-yellow-100 rounded-full">
                            <AlertCircle className="h-3.5 w-3.5 text-yellow-800" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Efficiency Warning</span>
                              <span className="text-xs text-muted-foreground">5 days ago</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Panel 3 efficiency dropped below 80% temporarily
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="p-1.5 bg-blue-100 rounded-full">
                            <Droplets className="h-3.5 w-3.5 text-blue-800" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Panel Cleaning</span>
                              <span className="text-xs text-muted-foreground">2 weeks ago</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Routine cleaning performed by technician
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">System Uptime</h4>
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-semibold">99.8%</div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          Last 90 days
                        </div>
                      </div>
                      <Progress value={99.8} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Daily Performance Tab */}
          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Energy Production</CardTitle>
                <CardDescription>
                  Energy generated each day during the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <AreaChart
                    data={dailyData}
                    index="date"
                    categories={["generation"]}
                    colors={["green"]}
                    valueFormatter={(value) => `${value} kWh`}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Efficiency Trend</CardTitle>
                  <CardDescription>
                    System efficiency percentage over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart
                    data={dailyData}
                    index="date"
                    categories={["efficiency"]}
                    colors={["blue"]}
                    valueFormatter={(value) => `${value}%`}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sun Hours</CardTitle>
                  <CardDescription>
                    Hours of sunlight each day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={dailyData}
                    index="date"
                    categories={["sunHours"]}
                    colors={["amber"]}
                    valueFormatter={(value) => `${value} hrs`}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Temperature Correlation</CardTitle>
                  <CardDescription>
                    Temperature impact on system performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart
                    data={dailyData}
                    index="date"
                    categories={["temperature"]}
                    colors={["red"]}
                    valueFormatter={(value) => `${value}°C`}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Hourly Output Tab */}
          <TabsContent value="hourly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Output</CardTitle>
                <CardDescription>
                  Today's energy production by hour compared to expected output
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <LineChart
                    data={hourlyData}
                    index="hour"
                    categories={["output", "expected"]}
                    colors={["green", "blue"]}
                    valueFormatter={(value) => `${value} kW`}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Peak Generation Hours</CardTitle>
                  <CardDescription>
                    Hours with highest energy production
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Today's Peak Production</h4>
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-semibold">5.4 kW</div>
                        <Badge>12:30 PM</Badge>
                      </div>
                    </div>
                    
                    <BarChart
                      data={hourlyData.filter(h => getHours(new Date(`2023-01-01T${h.hour}`)) >= 10 && getHours(new Date(`2023-01-01T${h.hour}`)) <= 16)}
                      index="hour"
                      categories={["output"]}
                      colors={["orange"]}
                      valueFormatter={(value) => `${value} kW`}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Ratio</CardTitle>
                  <CardDescription>
                    Actual output compared to expected performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Overall Performance Ratio</h4>
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-semibold">94%</div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                          Above Target
                        </Badge>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Hourly Performance Ratio</h4>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        {hourlyData
                          .filter(h => parseFloat(h.hour) >= 8 && parseFloat(h.hour) <= 18)
                          .map((item, i) => {
                            const ratio = item.output / item.expected * 100;
                            let bgColor = "bg-green-100 text-green-800";
                            if (ratio < 80) bgColor = "bg-red-100 text-red-800";
                            else if (ratio < 90) bgColor = "bg-yellow-100 text-yellow-800";
                            
                            return (
                              <div key={i} className={`p-2 rounded ${bgColor} text-center`}>
                                <div className="font-medium">{item.hour}</div>
                                <div>{Math.round(ratio)}%</div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Monthly Analysis Tab */}
          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Energy Production</CardTitle>
                <CardDescription>
                  Actual vs projected monthly energy generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <BarChart
                    data={monthlyData}
                    index="month"
                    categories={["generation", "projected"]}
                    colors={["green", "blue"]}
                    valueFormatter={(value) => `${value} kWh`}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Annual Projections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Year to Date</h4>
                      <div className="text-3xl font-bold">2,483 kWh</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600 flex items-center">
                          <ArrowUpRight className="mr-1 h-4 w-4" />
                          On track to exceed annual target
                        </span>
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Annual Projection</h4>
                      <div className="text-2xl font-bold">4,850 kWh</div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Annual Target: 4,500 kWh</span>
                        <span className="text-green-600">+7.8%</span>
                      </div>
                      <Progress value={4850/4500*100} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">System ROI</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">On Track</span>
                        <span className="text-sm">Estimated payback: 5.2 years</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Seasonal Analysis</CardTitle>
                  <CardDescription>
                    Performance variations by season
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Average Daily Output</h4>
                      <BarChart
                        data={[
                          { season: "Winter", output: 12.4 },
                          { season: "Spring", output: 18.6 },
                          { season: "Summer", output: 22.8 },
                          { season: "Autumn", output: 15.2 },
                        ]}
                        index="season"
                        categories={["output"]}
                        colors={["blue"]}
                        valueFormatter={(value) => `${value} kWh`}
                      />
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Average Daylight Hours</h4>
                      <BarChart
                        data={[
                          { season: "Winter", hours: 6.2 },
                          { season: "Spring", hours: 8.5 },
                          { season: "Summer", hours: 10.8 },
                          { season: "Autumn", hours: 7.4 },
                        ]}
                        index="season"
                        categories={["hours"]}
                        colors={["amber"]}
                        valueFormatter={(value) => `${value} hrs`}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <h4 className="text-sm font-medium">Seasonal Efficiency</h4>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <h5 className="text-sm font-medium mb-2">Winter</h5>
                        <div className="text-xl font-semibold">86%</div>
                        <Progress value={86} className="h-1.5 mt-1" />
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <h5 className="text-sm font-medium mb-2">Spring</h5>
                        <div className="text-xl font-semibold">92%</div>
                        <Progress value={92} className="h-1.5 mt-1" />
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <h5 className="text-sm font-medium mb-2">Summer</h5>
                        <div className="text-xl font-semibold">94%</div>
                        <Progress value={94} className="h-1.5 mt-1" />
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <h5 className="text-sm font-medium mb-2">Autumn</h5>
                        <div className="text-xl font-semibold">89%</div>
                        <Progress value={89} className="h-1.5 mt-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Alerts & Issues Tab */}
          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>
                  Active and recently resolved alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Active Alerts</h4>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                        1 Alert
                      </Badge>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-medium text-yellow-800">Panel 3 Efficiency Warning</h5>
                          <p className="text-xs text-yellow-700 mt-1">
                            Panel 3 is operating at 82% efficiency, below the expected 90% threshold.
                            This may be due to dust accumulation or partial shading.
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <Button size="sm" variant="outline" className="h-7 text-xs bg-white">
                              Schedule Cleaning
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs bg-white">
                              Ignore
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recently Resolved</h4>
                    
                    <div className="border rounded-lg divide-y">
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="p-1 bg-green-100 rounded-full mt-0.5">
                              <CheckCircle className="h-3 w-3 text-green-700" />
                            </div>
                            <div>
                              <h5 className="text-sm font-medium">Inverter Communication Error</h5>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Communication with the inverter was temporarily lost.
                                Auto-reconnected after system reboot.
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">2 days ago</span>
                        </div>
                      </div>
                      
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="p-1 bg-green-100 rounded-full mt-0.5">
                              <CheckCircle className="h-3 w-3 text-green-700" />
                            </div>
                            <div>
                              <h5 className="text-sm font-medium">Grid Connection Fluctuation</h5>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Grid connection stability issues detected.
                                Resolved after utility maintenance work was completed.
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">1 week ago</span>
                        </div>
                      </div>
                      
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="p-1 bg-green-100 rounded-full mt-0.5">
                              <CheckCircle className="h-3 w-3 text-green-700" />
                            </div>
                            <div>
                              <h5 className="text-sm font-medium">Software Update Required</h5>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                System firmware required an update to the latest version.
                                Update was applied automatically during scheduled maintenance.
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">2 weeks ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-1.5 bg-blue-100 rounded-full">
                        <Droplets className="h-4 w-4 text-blue-800" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium">Panel Cleaning Recommended</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          It has been 3 months since the last panel cleaning. Scheduling a cleaning
                          can improve system efficiency by up to 10%.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">
                          Schedule Cleaning
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="p-1.5 bg-purple-100 rounded-full">
                        <RefreshCw className="h-4 w-4 text-purple-800" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium">Annual Inspection Due</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          Your annual system inspection is due in 3 weeks. This comprehensive check
                          ensures optimal performance and identifies potential issues.
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            Schedule Now
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs">
                            Remind Later
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">System Performance Score</h4>
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl font-bold">92/100</div>
                      <div className="space-y-1 flex-1">
                        <Progress value={92} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Critical</span>
                          <span>Good</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Component Health</h4>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Solar Panels</span>
                          <span>95%</span>
                        </div>
                        <Progress value={95} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Inverter</span>
                          <span>98%</span>
                        </div>
                        <Progress value={98} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Mounting System</span>
                          <span>99%</span>
                        </div>
                        <Progress value={99} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Wiring & Connections</span>
                          <span>97%</span>
                        </div>
                        <Progress value={97} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Performance Optimization</h4>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                      <p className="text-sm">
                        Based on system analysis, cleaning panels and adjusting their angle by 5° could
                        increase daily output by approximately 1.2 kWh.
                      </p>
                      <Button size="sm" className="mt-2">Apply Recommendations</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}