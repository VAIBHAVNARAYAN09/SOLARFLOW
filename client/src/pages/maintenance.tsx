import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { format } from "date-fns";

import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Plus, 
  FilterX, 
  Search, 
  MoreVertical, 
  FileEdit, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  User
} from "lucide-react";

// Status badge colors
const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function MaintenancePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);
  
  // Fetch maintenance bookings
  const { 
    data: bookings, 
    isLoading: bookingsLoading,
    refetch: refetchBookings 
  } = useQuery({
    queryKey: ["/api/maintenance/bookings", { status: selectedStatus }],
  });
  
  // Fetch solar systems
  const { 
    data: solarSystems, 
    isLoading: systemsLoading 
  } = useQuery({
    queryKey: ["/api/solar-systems"],
  });
  
  // Fetch maintenance stats
  const { 
    data: maintenanceStats, 
    isLoading: statsLoading 
  } = useQuery({
    queryKey: ["/api/maintenance/stats"],
  });
  
  // Fetch maintenance reports
  const { 
    data: reports, 
    isLoading: reportsLoading 
  } = useQuery({
    queryKey: ["/api/maintenance/reports"],
  });
  
  // Update booking status mutation
  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      return await apiRequest("PATCH", `/api/maintenance/bookings/${id}`, {
        status,
        ...(notes && { completionNotes: notes })
      });
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "The maintenance booking status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handler for updating booking status
  const handleStatusUpdate = (id: number, status: string, notes?: string) => {
    updateBookingMutation.mutate({ id, status, notes });
  };
  
  // Filter bookings by search query, status, and system
  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = searchQuery === "" || 
      booking.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSystem = selectedSystem === null || booking.systemId === selectedSystem;
    
    const matchesStatus = selectedStatus === "" || selectedStatus === "all" || booking.status === selectedStatus;
    
    return matchesSearch && matchesSystem && matchesStatus;
  });
  
  // Get system name by ID
  const getSystemName = (systemId: number) => {
    const system = solarSystems?.find(s => s.id === systemId);
    return system ? system.name : "Unknown System";
  };
  
  // Find reports related to a booking
  const getReportForBooking = (bookingId: number) => {
    return reports?.find(report => report.bookingId === bookingId);
  };

  return (
    <Layout title="Maintenance">
      <div className="space-y-6 p-5 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight dark:text-white">Maintenance Management</h2>
            <p className="text-sm text-muted-foreground dark:text-slate-400">
              Schedule and manage maintenance services for your solar systems
            </p>
          </div>
          <Button asChild>
            <a href="/maintenance-booking">
              <Plus className="mr-1 h-4 w-4" />
              <span>Book Service</span>
            </a>
          </Button>
        </div>
        
        {/* Stats Cards */}
        {statsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : maintenanceStats && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                <div className="rounded-full bg-yellow-100 p-1 dark:bg-yellow-900">
                  <Calendar className="h-4 w-4 text-yellow-500 dark:text-yellow-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{maintenanceStats.pendingBookings}</div>
                <p className="text-xs text-muted-foreground dark:text-slate-400">
                  Awaiting confirmation
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confirmed Services</CardTitle>
                <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-900">
                  <CheckCircle className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{maintenanceStats.confirmedBookings}</div>
                <p className="text-xs text-muted-foreground dark:text-slate-400">
                  Scheduled and confirmed
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
                <div className="rounded-full bg-green-100 p-1 dark:bg-green-900">
                  <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{maintenanceStats.completedServices}</div>
                <p className="text-xs text-muted-foreground dark:text-slate-400">
                  Successfully completed
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
                <div className="rounded-full bg-purple-100 p-1 dark:bg-purple-900">
                  <User className="h-4 w-4 text-purple-500 dark:text-purple-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{maintenanceStats.averageRating.toFixed(1)}/5.0</div>
                <p className="text-xs text-muted-foreground dark:text-slate-400">
                  Based on customer feedback
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Upcoming Services */}
        {!statsLoading && maintenanceStats && maintenanceStats.upcomingServices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Services</CardTitle>
              <CardDescription>
                Maintenance services scheduled in the near future
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>System</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time Slot</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceStats.upcomingServices.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {new Date(booking.preferredDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getSystemName(booking.systemId)}
                        </TableCell>
                        <TableCell>{booking.serviceType}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[booking.status]}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{booking.preferredTimeSlot}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookings">Maintenance Bookings</TabsTrigger>
            <TabsTrigger value="reports">Service Reports</TabsTrigger>
          </TabsList>
          
          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Maintenance Bookings</CardTitle>
                <CardDescription>
                  View and manage all maintenance service requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search bookings..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select 
                      onValueChange={(value) => setSelectedStatus(value)}
                      defaultValue="all"
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      onValueChange={(value) => setSelectedSystem(value === "all" ? null : parseInt(value))}
                      defaultValue="all"
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Systems</SelectItem>
                        {!systemsLoading && solarSystems && solarSystems.map((system) => (
                          <SelectItem key={system.id} value={system.id.toString()}>
                            {system.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedStatus("all");
                        setSelectedSystem(null);
                      }}
                    >
                      <FilterX className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {bookingsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredBookings && filteredBookings.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>System</TableHead>
                          <TableHead>Service Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">#{booking.id}</TableCell>
                            <TableCell>
                              {new Date(booking.preferredDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {getSystemName(booking.systemId)}
                            </TableCell>
                            <TableCell>{booking.serviceType}</TableCell>
                            <TableCell>
                              <Badge className={statusColors[booking.status]}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  
                                  <DropdownMenuItem 
                                    onClick={() => navigate(`/maintenance/booking/${booking.id}`)}
                                  >
                                    <FileEdit className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  
                                  <DropdownMenuSeparator />
                                  
                                  {booking.status === "pending" && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                          <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
                                          Confirm Booking
                                        </DropdownMenuItem>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Confirm Maintenance Booking</DialogTitle>
                                          <DialogDescription>
                                            Are you sure you want to confirm this maintenance booking?
                                            This will notify the customer that their service has been scheduled.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                          <Button 
                                            variant="outline" 
                                            onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                                          >
                                            Confirm Booking
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                  
                                  {booking.status === "confirmed" && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                          Mark as Completed
                                        </DropdownMenuItem>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                          <DialogTitle>Complete Maintenance Service</DialogTitle>
                                          <DialogDescription>
                                            Mark this service as completed and provide completion notes.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                          <div className="grid gap-2">
                                            <Textarea
                                              id="notes"
                                              placeholder="Enter completion notes and any follow-up actions"
                                              className="min-h-[100px]"
                                            />
                                          </div>
                                        </div>
                                        <DialogFooter>
                                          <Button 
                                            onClick={() => {
                                              const notes = (document.getElementById("notes") as HTMLTextAreaElement).value;
                                              handleStatusUpdate(booking.id, "completed", notes);
                                            }}
                                          >
                                            Complete Service
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                  
                                  {(booking.status === "pending" || booking.status === "confirmed") && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem 
                                          className="text-red-600 focus:text-red-600" 
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          <AlertCircle className="mr-2 h-4 w-4" />
                                          Cancel Booking
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Cancel Maintenance Booking</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to cancel this maintenance booking?
                                            This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>No, Keep It</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Yes, Cancel Booking
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No maintenance bookings found</p>
                    {(searchQuery || (selectedStatus && selectedStatus !== "all") || selectedSystem) && (
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedStatus("all");
                          setSelectedSystem(null);
                        }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Reports</CardTitle>
                <CardDescription>
                  View detailed reports from completed maintenance services
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reportsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : reports && reports.length > 0 ? (
                  <div className="space-y-6">
                    {reports.map((report) => {
                      const booking = bookings?.find(b => b.id === report.bookingId);
                      return (
                        <Card key={report.id} className="overflow-hidden">
                          <CardHeader className="bg-slate-50 dark:bg-slate-800 pb-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>
                                  Report #{report.id} - {booking?.serviceType || "Maintenance Service"}
                                </CardTitle>
                                <CardDescription>
                                  {new Date(report.date).toLocaleDateString()} - {getSystemName(booking?.systemId || 0)}
                                </CardDescription>
                              </div>
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                {report.systemPerformance}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Service Performed</h4>
                                <p className="text-sm text-muted-foreground dark:text-slate-400">
                                  {report.servicePerformed}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Findings</h4>
                                <p className="text-sm text-muted-foreground dark:text-slate-400">
                                  {report.findings}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                                <p className="text-sm text-muted-foreground dark:text-slate-400">
                                  {report.recommendations || "No specific recommendations"}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Parts Replaced</h4>
                                <p className="text-sm text-muted-foreground dark:text-slate-400">
                                  {report.partsReplaced || "No parts replaced"}
                                </p>
                              </div>
                              {report.nextServiceDue && (
                                <div className="md:col-span-2">
                                  <h4 className="text-sm font-medium mb-2">Next Service Due</h4>
                                  <p className="text-sm text-muted-foreground dark:text-slate-400">
                                    {new Date(report.nextServiceDue).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="border-t bg-slate-50 dark:bg-slate-800 flex justify-between">
                            <p className="text-xs text-muted-foreground">
                              Technician ID: {report.technicianId} • Report created on {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                            <Button variant="outline" size="sm">
                              <a href={`/maintenance/report/${report.id}`}>
                                View Full Report
                              </a>
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No maintenance reports found</p>
                    <p className="text-xs mt-2">Reports are created after maintenance services are completed</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}