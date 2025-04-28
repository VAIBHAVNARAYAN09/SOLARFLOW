import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";

interface SitePerformance {
  id: string;
  location: string;
  capacity: string;
  todayOutput: string;
  performanceRatio: number;
  status: 'optimal' | 'good' | 'needs-attention';
}

export default function SitePerformanceTable() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // In a real app, this would fetch from an API with search parameters
  const { data, isLoading } = useQuery<SitePerformance[]>({
    queryKey: ['/api/site-performance', { search: searchQuery }],
    queryFn: async () => {
      // Mock data for UI development
      return [
        {
          id: "SITE-001",
          location: "Jaipur, Rajasthan",
          capacity: "5.8 MW",
          todayOutput: "32.4 MWh",
          performanceRatio: 92,
          status: "optimal"
        },
        {
          id: "SITE-002",
          location: "Delhi NCR",
          capacity: "8.2 MW",
          todayOutput: "41.6 MWh",
          performanceRatio: 84,
          status: "good"
        },
        {
          id: "SITE-003",
          location: "Mumbai, Maharashtra",
          capacity: "3.5 MW",
          todayOutput: "14.2 MWh",
          performanceRatio: 65,
          status: "needs-attention"
        }
      ] as SitePerformance[];
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'optimal':
        return <Badge variant="success">Optimal</Badge>;
      case 'good':
        return <Badge variant="warning">Good</Badge>;
      case 'needs-attention':
        return <Badge variant="destructive">Needs Attention</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getProgressColor = (ratio: number) => {
    if (ratio >= 90) return "bg-green-500";
    if (ratio >= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const filteredSites = data?.filter(site => 
    site.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <CardTitle>Site Performance</CardTitle>
          <div className="relative">
            <Input
              placeholder="Search sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-64"
            />
            <div className="absolute left-3 top-2.5 text-gray-400 dark:text-slate-500">
              <Search className="h-5 w-5" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Today's Output</TableHead>
                  <TableHead>Performance Ratio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites && filteredSites.length > 0 ? (
                  filteredSites.map((site) => (
                    <TableRow key={site.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{site.id}</TableCell>
                      <TableCell>{site.location}</TableCell>
                      <TableCell>{site.capacity}</TableCell>
                      <TableCell>{site.todayOutput}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">{site.performanceRatio}%</span>
                          <div className="w-24 relative">
                            <Progress 
                              value={site.performanceRatio} 
                              className={`h-2 ${getProgressColor(site.performanceRatio)}`} 
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(site.status)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="link" 
                          className="h-auto p-0 text-primary"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No sites found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
