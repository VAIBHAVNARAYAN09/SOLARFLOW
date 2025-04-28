import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Wrench, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { MaintenanceBooking } from "@shared/schema";

interface MaintenanceBookingsListProps {
  onSelectBooking: (id: number | null) => void;
  selectedBookingId: number | null;
}

export default function MaintenanceBookingsList({ 
  onSelectBooking, 
  selectedBookingId 
}: MaintenanceBookingsListProps) {
  const { toast } = useToast();
  
  const { data: bookings, isLoading, error } = useQuery<MaintenanceBooking[]>({
    queryKey: ["/api/maintenance-bookings"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-8 w-1/3" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-2/3" /></CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    toast({
      title: "Error loading bookings",
      description: error.message,
      variant: "destructive",
    });
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Bookings</CardTitle>
          <CardDescription>There was a problem loading your maintenance bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: Date) => {
    return format(new Date(date), 'PPP');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "in_progress":
        return "secondary";
      case "completed":
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "processing":
        return "info";
      case "unpaid":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Maintenance Bookings</CardTitle>
        <CardDescription>View and manage your scheduled maintenance services</CardDescription>
      </CardHeader>
      <CardContent>
        {!bookings || bookings.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">You don't have any maintenance bookings yet.</p>
            <Button onClick={() => onSelectBooking(null)}>Book Maintenance</Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} className={selectedBookingId === booking.id ? "bg-muted/50" : ""}>
                  <TableCell>
                    <div className="font-medium">#{booking.id}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {booking.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.solarPanelId ? `Panel #${booking.solarPanelId}` : "General"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(booking.requestedDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>Morning (9AM-12PM)</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPaymentStatusBadgeVariant(booking.paymentStatus)}>
                      {booking.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span>₹{booking.amount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.paymentStatus === "unpaid" && (
                      <Button 
                        size="sm" 
                        onClick={() => onSelectBooking(booking.id)}
                      >
                        Pay Now
                      </Button>
                    )}
                    {booking.paymentStatus === "paid" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onSelectBooking(booking.id)}
                      >
                        View Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}