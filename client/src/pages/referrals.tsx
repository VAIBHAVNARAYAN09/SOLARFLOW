import { useState } from "react";
import Layout from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, PieChart } from "@/components/ui/charts";
import { format, subDays } from "date-fns";
import { 
  Users, Gift, Share2, Award, ArrowUpRight, 
  UserPlus, CircleDollarSign, Home, FileSpreadsheet,
  Calendar, CheckCircle, Clock, Loader2
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

// Mock Data
const referralStats = {
  totalReferrals: 37,
  pendingReferrals: 12,
  completedReferrals: 25,
  totalEarnings: 3750,
  potentialEarnings: 1800,
};

const mockReferrals = [
  {
    id: 1,
    name: "Michael Johnson",
    email: "michael.j@example.com",
    date: subDays(new Date(), 5),
    status: "completed",
    amount: 150,
    installDate: subDays(new Date(), 2),
    systemSize: "8.5 kW",
  },
  {
    id: 2,
    name: "Sarah Thompson",
    email: "sarah.t@example.com",
    date: subDays(new Date(), 8),
    status: "completed",
    amount: 150,
    installDate: subDays(new Date(), 3),
    systemSize: "10 kW",
  },
  {
    id: 3,
    name: "Robert Chen",
    email: "robert.c@example.com",
    date: subDays(new Date(), 12),
    status: "pending",
    amount: 150,
    installDate: null,
    systemSize: "12 kW",
  },
  {
    id: 4,
    name: "Jennifer Wilson",
    email: "jennifer.w@example.com",
    date: subDays(new Date(), 15),
    status: "consultation",
    amount: 0,
    installDate: null,
    systemSize: null,
  },
  {
    id: 5,
    name: "David Rodriguez",
    email: "david.r@example.com",
    date: subDays(new Date(), 20),
    status: "pending",
    amount: 150,
    installDate: null,
    systemSize: "15 kW",
  },
  {
    id: 6,
    name: "Lisa Martinez",
    email: "lisa.m@example.com",
    date: subDays(new Date(), 25),
    status: "completed",
    amount: 150,
    installDate: subDays(new Date(), 10),
    systemSize: "7.2 kW",
  },
  {
    id: 7,
    name: "Kevin Park",
    email: "kevin.p@example.com",
    date: subDays(new Date(), 30),
    status: "completed",
    amount: 150,
    installDate: subDays(new Date(), 15),
    systemSize: "9.8 kW",
  },
];

const monthlyData = [
  { name: 'Jan', referrals: 3, installations: 2 },
  { name: 'Feb', referrals: 2, installations: 1 },
  { name: 'Mar', referrals: 5, installations: 3 },
  { name: 'Apr', referrals: 4, installations: 3 },
  { name: 'May', referrals: 6, installations: 4 },
  { name: 'Jun', referrals: 8, installations: 5 },
  { name: 'Jul', referrals: 6, installations: 4 },
  { name: 'Aug', referrals: 3, installations: 3 },
];

const referralSourceData = [
  { name: 'Family', value: 40 },
  { name: 'Friends', value: 25 },
  { name: 'Colleagues', value: 20 },
  { name: 'Neighbors', value: 15 },
];

const systemTypeData = [
  { name: 'Residential Small (5-10kW)', value: 45 },
  { name: 'Residential Large (10-15kW)', value: 30 },
  { name: 'Commercial (15-25kW)', value: 15 },
  { name: 'Battery + Solar', value: 10 },
];

const statusColorMap: Record<string, string> = {
  completed: "bg-green-100 text-green-800 hover:bg-green-100",
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  consultation: "bg-blue-100 text-blue-800 hover:bg-blue-100",
};

// Badge component based on status
const StatusBadge = ({ status }: { status: string }) => {
  const colorClass = statusColorMap[status] || "bg-gray-100 text-gray-800 hover:bg-gray-100";
  
  return (
    <Badge className={colorClass}>
      {status === "completed" && <CheckCircle className="mr-1 h-3 w-3" />}
      {status === "pending" && <Clock className="mr-1 h-3 w-3" />}
      {status === "consultation" && <Calendar className="mr-1 h-3 w-3" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function Referrals() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return (
    <Layout title="Referrals & Installs">
      <div className="p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Referrals & Installs</h1>
          <p className="text-muted-foreground">
            Refer friends and family to SolarFlow and earn rewards
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="my-referrals">My Referrals</TabsTrigger>
            <TabsTrigger value="refer-now">Refer Someone</TabsTrigger>
            <TabsTrigger value="rewards">My Rewards</TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Referrals
                  </CardTitle>
                  <UserPlus className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{referralStats.totalReferrals}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 flex items-center">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      +8% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Installs
                  </CardTitle>
                  <Home className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{referralStats.completedReferrals}</div>
                  <div className="mt-1">
                    <Progress value={67} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    67% conversion rate
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Earnings
                  </CardTitle>
                  <CircleDollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${referralStats.totalEarnings}</div>
                  <p className="text-xs text-muted-foreground">
                    + ${referralStats.potentialEarnings} pending
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Bonus Tier
                  </CardTitle>
                  <Award className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Silver</div>
                  <div className="mt-1">
                    <Progress value={70} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    5 more for Gold Tier
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                  <CardDescription>
                    Referrals and completed installations by month
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BarChart 
                    data={monthlyData}
                    index="name"
                    categories={["referrals", "installations"]}
                    colors={["blue", "green"]}
                    valueFormatter={(value) => `${value}`}
                    className="h-[300px]"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Referral Analytics</CardTitle>
                  <CardDescription>
                    Referral sources and system types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Referral Sources</h3>
                      <div className="h-[130px]">
                        <PieChart 
                          data={referralSourceData}
                          categories={["value"]}
                          colors={["blue", "green", "yellow", "purple"]}
                          valueFormatter={(value) => `${value}%`}
                          className="h-[130px]"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">System Types</h3>
                      <div className="h-[130px]">
                        <PieChart 
                          data={systemTypeData}
                          categories={["value"]}
                          colors={["amber", "orange", "red", "pink"]}
                          valueFormatter={(value) => `${value}%`}
                          className="h-[130px]"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Referrals */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
                <CardDescription>
                  Your most recent referrals and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>System Size</TableHead>
                      <TableHead>Reward</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReferrals.slice(0, 5).map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell className="font-medium">{referral.name}</TableCell>
                        <TableCell>{format(referral.date, "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <StatusBadge status={referral.status} />
                        </TableCell>
                        <TableCell>{referral.systemSize || "-"}</TableCell>
                        <TableCell>
                          {referral.status === "completed" ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              ${referral.amount}
                            </Badge>
                          ) : referral.status === "pending" ? (
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                              Pending ${referral.amount}
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                              -
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("my-referrals")}>
                  View All Referrals
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* My Referrals Tab */}
          <TabsContent value="my-referrals" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>All Referrals</CardTitle>
                    <CardDescription>
                      Complete history of all your referrals
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Search referrals..." 
                      className="w-[200px]" 
                    />
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("refer-now")}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      New Referral
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Referral Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>System Details</TableHead>
                      <TableHead>Install Date</TableHead>
                      <TableHead>Reward</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReferrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell className="font-medium">{referral.name}</TableCell>
                        <TableCell>{referral.email}</TableCell>
                        <TableCell>{format(referral.date, "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <StatusBadge status={referral.status} />
                        </TableCell>
                        <TableCell>{referral.systemSize || "-"}</TableCell>
                        <TableCell>
                          {referral.installDate 
                            ? format(referral.installDate, "MMM dd, yyyy") 
                            : "-"
                          }
                        </TableCell>
                        <TableCell>
                          {referral.status === "completed" ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              ${referral.amount}
                            </Badge>
                          ) : referral.status === "pending" ? (
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                              Pending ${referral.amount}
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                              -
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {mockReferrals.length} referrals
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Refer Now Tab */}
          <TabsContent value="refer-now" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Refer a Friend</CardTitle>
                  <CardDescription>
                    Share solar benefits with friends and earn rewards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="friend-name" className="text-sm font-medium">Friend's Name</label>
                    <Input id="friend-name" placeholder="Enter your friend's name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="friend-email" className="text-sm font-medium">Friend's Email</label>
                    <Input id="friend-email" type="email" placeholder="Enter your friend's email" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="friend-phone" className="text-sm font-medium">Friend's Phone (Optional)</label>
                    <Input id="friend-phone" placeholder="Enter your friend's phone" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="personal-message" className="text-sm font-medium">Personal Message (Optional)</label>
                    <textarea 
                      id="personal-message"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Add a personal message to your referral"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("dashboard")}>
                    Cancel
                  </Button>
                  <Button>
                    <Gift className="mr-2 h-4 w-4" />
                    Send Referral
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="flex flex-col gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Referral Program Benefits</CardTitle>
                    <CardDescription>
                      How our referral program works
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Share2 className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-medium">Share</h4>
                        <p className="text-sm text-muted-foreground">
                          Refer friends and family who might benefit from solar energy
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <Calendar className="h-4 w-4 text-amber-700" />
                      </div>
                      <div>
                        <h4 className="font-medium">Schedule</h4>
                        <p className="text-sm text-muted-foreground">
                          They schedule a free consultation with our solar experts
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Home className="h-4 w-4 text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-medium">Install</h4>
                        <p className="text-sm text-muted-foreground">
                          When they complete their solar installation, you both earn rewards
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Gift className="h-4 w-4 text-purple-700" />
                      </div>
                      <div>
                        <h4 className="font-medium">Earn</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive $150 for each successful referral, with bonus tiers for multiple referrals
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Share Your Link</CardTitle>
                    <CardDescription>
                      Share your unique referral link on social media or via email
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Input 
                        readOnly 
                        value="https://solarflow.com/ref/12345" 
                        className="font-mono text-sm"
                      />
                      <Button variant="outline" size="sm">Copy</Button>
                    </div>
                    <div className="mt-4 flex justify-center space-x-2">
                      <Button size="sm" variant="outline" className="rounded-full w-9 h-9 p-0">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          />
                        </svg>
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-full w-9 h-9 p-0">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                          />
                        </svg>
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-full w-9 h-9 p-0">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-full w-9 h-9 p-0">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-full w-9 h-9 p-0">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"
                          />
                        </svg>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* My Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Reward Summary</CardTitle>
                  <CardDescription>
                    Overview of your earned and pending rewards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Total Earned</h3>
                      <p className="text-3xl font-bold text-green-600">${referralStats.totalEarnings}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Pending</h3>
                      <p className="text-3xl font-bold text-amber-600">${referralStats.potentialEarnings}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reward Program Tier</label>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Award className="h-5 w-5 text-amber-500 mr-2" />
                          <span className="font-medium">Silver Tier</span>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          5/10 to Next Tier
                        </Badge>
                      </div>
                      <Progress value={50} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>$150 per referral</span>
                        <span>Next: $175 per referral</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Reward Program Benefits</label>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>$150 for each successful referral</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Silver Tier (5-9 referrals): $175 per referral</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Gold Tier (10+ referrals): $200 per referral + annual bonus</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Platinum Tier (25+ referrals): $250 per referral + VIP perks</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    Record of your referral reward payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Referral</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{format(subDays(new Date(), 10), "MMM dd, yyyy")}</TableCell>
                        <TableCell className="font-medium">$150.00</TableCell>
                        <TableCell>Michael Johnson</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Paid
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{format(subDays(new Date(), 45), "MMM dd, yyyy")}</TableCell>
                        <TableCell className="font-medium">$150.00</TableCell>
                        <TableCell>Sarah Thompson</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Paid
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{format(subDays(new Date(), 90), "MMM dd, yyyy")}</TableCell>
                        <TableCell className="font-medium">$150.00</TableCell>
                        <TableCell>Lisa Martinez</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Paid
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{format(subDays(new Date(), 120), "MMM dd, yyyy")}</TableCell>
                        <TableCell className="font-medium">$150.00</TableCell>
                        <TableCell>Kevin Park</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Paid
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                    <Button variant="outline" size="sm">
                      Download Payment History
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Pending Rewards</CardTitle>
                <CardDescription>
                  Referrals that are in progress towards payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referral</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Estimated Completion</TableHead>
                      <TableHead>Potential Reward</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Robert Chen</TableCell>
                      <TableCell>{format(subDays(new Date(), 12), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Loader2 className="h-4 w-4 text-yellow-500 animate-spin mr-2" />
                          <span>System Design</span>
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000), "MMM dd, yyyy")}</TableCell>
                      <TableCell>$150.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">David Rodriguez</TableCell>
                      <TableCell>{format(subDays(new Date(), 20), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Loader2 className="h-4 w-4 text-yellow-500 animate-spin mr-2" />
                          <span>Permitting</span>
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), "MMM dd, yyyy")}</TableCell>
                      <TableCell>$150.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Jennifer Wilson</TableCell>
                      <TableCell>{format(subDays(new Date(), 15), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                          <span>Consultation Scheduled</span>
                        </div>
                      </TableCell>
                      <TableCell>Pending assessment</TableCell>
                      <TableCell>TBD</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}