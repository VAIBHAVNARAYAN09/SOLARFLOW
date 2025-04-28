import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout";
import StatsCard from "@/components/stats-card";
import TicketChart from "@/components/ticket-chart";
import ActivityItem from "@/components/activity-item";
import TicketTable from "@/components/ticket-table";
import { Loader2, Plus, Sun, ArrowUpRight, Calendar, DownloadCloud } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define types for API responses
interface StatsData {
  openTickets: number;
  inProgressTickets: number;
  resolvedToday: number;
  avgResponseTime: number;
  customerSatisfaction: number;
}

interface ActivityData {
  id: number;
  ticketId: number;
  userId: number;
  action: string;
  details: string;
  createdAt: Date;
}

export default function Dashboard() {
  // Fetch ticket stats
  const { data: stats, isLoading: statsLoading } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  // Fetch recent activities
  const { data: activities, isLoading: activitiesLoading } = useQuery<ActivityData[]>({
    queryKey: ["/api/activities"],
  });

  // Fetch recent tickets
  const { data: tickets, isLoading: ticketsLoading } = useQuery<any[]>({
    queryKey: ["/api/tickets"],
  });

  const isLoading = statsLoading || activitiesLoading || ticketsLoading;

  return (
    <Layout title="Dashboard">
      <div className="space-y-6 p-5 md:p-8">
        {/* Dashboard Header Section */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight dark:text-white">System Overview</h2>
            <p className="text-sm text-muted-foreground dark:text-slate-400">
              Monitor your solar system performance and support tickets
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="7days">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button asChild>
              <Link href="/new-ticket">
                <Plus className="mr-1 h-4 w-4" />
                <span>New Ticket</span>
              </Link>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Performance Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Energy Generated</CardTitle>
                  <Sun className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">254.8 kWh</div>
                  <p className="text-xs text-muted-foreground dark:text-slate-400">
                    <span className="text-green-500 font-medium">+12.5%</span> from last week
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                  <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-900">
                    <ArrowUpRight className="h-3 w-3 text-blue-500 dark:text-blue-300" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.openTickets || 0}</div>
                  <p className="text-xs text-muted-foreground dark:text-slate-400">
                    <span className="text-green-500 font-medium">-2</span> from yesterday
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                  <div className="rounded-full bg-yellow-100 p-1 dark:bg-yellow-900">
                    <ArrowUpRight className="h-3 w-3 text-yellow-500 dark:text-yellow-300" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.avgResponseTime || 0}h</div>
                  <p className="text-xs text-muted-foreground dark:text-slate-400">
                    <span className="text-red-500 font-medium">+1.2%</span> from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                  <div className="rounded-full bg-green-100 p-1 dark:bg-green-900">
                    <ArrowUpRight className="h-3 w-3 text-green-500 dark:text-green-300" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">99.8%</div>
                  <p className="text-xs text-muted-foreground dark:text-slate-400">
                    <span className="text-green-500 font-medium">+0.3%</span> from last quarter
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <Card className="md:col-span-2 lg:col-span-4">
                <Tabs defaultValue="performance" className="h-full space-y-6">
                  <div className="space-between flex items-center p-6 pt-6 pb-0">
                    <TabsList>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                      <TabsTrigger value="tickets">Tickets</TabsTrigger>
                      <TabsTrigger value="savings">Energy Savings</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto mr-4">
                      <Button variant="outline" size="sm">
                        <DownloadCloud className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <TabsContent
                    value="performance"
                    className="border-none p-0 pt-0"
                  >
                    <div className="p-6 pt-0">
                      <div className="h-[300px]">
                        <TicketChart />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="tickets"
                    className="border-none p-0 pt-0"
                  >
                    <div className="p-6 pt-0">
                      <div className="h-[300px]">
                        <TicketChart />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="savings"
                    className="border-none p-0 pt-0"
                  >
                    <div className="p-6 pt-0">
                      <div className="h-[300px]">
                        <TicketChart />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
              
              {/* Recent Activities */}
              <Card className="md:col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>
                    Latest system events and support tickets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities && Array.isArray(activities) && activities.length > 0 ? (
                      activities.slice(0, 4).map((activity: any) => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground dark:text-slate-400">No recent activities</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Tickets */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Support Tickets</CardTitle>
                  <CardDescription>
                    Your latest support requests and their status
                  </CardDescription>
                </div>
                <Link href="/tickets">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <TicketTable tickets={tickets || []} />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
