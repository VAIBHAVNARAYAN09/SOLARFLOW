// Import Recharts components
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  Bar,
  Line,
  Pie,
  Cell,
  AreaChart as AreaChartComponent,
  BarChart as BarChartComponent,
  LineChart as LineChartComponent,
  PieChart as PieChartComponent
} from "recharts";
import { useTheme } from "next-themes";
import { useMemo } from "react";

// Define common properties for all chart types
interface ChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

// Helper to get colors based on the theme
const useChartColors = (colors: string[] = ["blue", "green", "yellow", "purple", "red"]) => {
  const { theme } = useTheme();
  
  return useMemo(() => {
    const colorMap: Record<string, Record<string, string>> = {
      blue: { light: "#3b82f6", dark: "#60a5fa" },
      green: { light: "#22c55e", dark: "#4ade80" },
      red: { light: "#ef4444", dark: "#f87171" },
      yellow: { light: "#eab308", dark: "#facc15" },
      purple: { light: "#8b5cf6", dark: "#a78bfa" },
      orange: { light: "#f97316", dark: "#fb923c" },
      teal: { light: "#14b8a6", dark: "#2dd4bf" },
      gray: { light: "#6b7280", dark: "#9ca3af" },
    };
    
    return colors.map(color => {
      if (theme === "dark") {
        return colorMap[color]?.dark || "#60a5fa"; // default to blue if color not found
      }
      return colorMap[color]?.light || "#3b82f6";
    });
  }, [colors, theme]);
};

// Common chart dimensions
const useChartDimensions = (className: string = "") => {
  return {
    width: 800,
    height: 350,
    className,
  };
};

// Area Chart
export function AreaChart({ 
  data, 
  index, 
  categories, 
  colors = ["blue"], 
  valueFormatter = (value: number) => `${value}`,
  className 
}: ChartProps) {
  const chartColors = useChartColors(colors);
  const dimensions = useChartDimensions(className);
  
  return (
    <AreaChartComponent
      data={data}
      {...dimensions}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <defs>
        {categories.map((_, i) => (
          <linearGradient key={i} id={`color-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartColors[i % chartColors.length]} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={chartColors[i % chartColors.length]} stopOpacity={0}/>
          </linearGradient>
        ))}
      </defs>
      <XAxis dataKey={index} />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip formatter={valueFormatter} />
      {categories.map((category, i) => (
        <Area
          key={category}
          type="monotone"
          dataKey={category}
          stroke={chartColors[i % chartColors.length]}
          fillOpacity={1}
          fill={`url(#color-${i})`}
        />
      ))}
    </AreaChartComponent>
  );
}

// Bar Chart
export function BarChart({ 
  data, 
  index, 
  categories,
  colors = ["blue"],
  valueFormatter = (value: number) => `${value}`,
  className 
}: ChartProps) {
  const chartColors = useChartColors(colors);
  const dimensions = useChartDimensions(className);
  
  return (
    <BarChartComponent
      data={data}
      {...dimensions}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={index} />
      <YAxis />
      <Tooltip formatter={valueFormatter} />
      <Legend />
      {categories.map((category, i) => (
        <Bar 
          key={category} 
          dataKey={category} 
          fill={chartColors[i % chartColors.length]} 
        />
      ))}
    </BarChartComponent>
  );
}

// Line Chart
export function LineChart({ 
  data, 
  index, 
  categories,
  colors = ["blue"],
  valueFormatter = (value: number) => `${value}`,
  className 
}: ChartProps) {
  const chartColors = useChartColors(colors);
  const dimensions = useChartDimensions(className);
  
  return (
    <LineChartComponent
      data={data}
      {...dimensions}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={index} />
      <YAxis />
      <Tooltip formatter={valueFormatter} />
      <Legend />
      {categories.map((category, i) => (
        <Line
          key={category}
          type="monotone"
          dataKey={category}
          stroke={chartColors[i % chartColors.length]}
          activeDot={{ r: 8 }}
        />
      ))}
    </LineChartComponent>
  );
}

// Pie Chart
export function PieChart({ 
  data, 
  categories, 
  colors = ["blue", "green", "yellow", "purple", "red"],
  valueFormatter = (value: number) => `${value}`,
  className 
}: Omit<ChartProps, "index"> & { index?: string }) {
  const chartColors = useChartColors(colors);
  const dimensions = useChartDimensions(className);
  
  return (
    <PieChartComponent
      {...dimensions}
      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
    >
      <Tooltip formatter={valueFormatter} />
      <Legend />
      <Pie
        data={data}
        dataKey={categories[0]}
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
        ))}
      </Pie>
    </PieChartComponent>
  );
}

