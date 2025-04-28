import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MaintenanceBooking } from "@shared/schema";
import { format } from "date-fns";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CreditCard, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

interface MaintenancePaymentInterfaceProps {
  bookingId: number;
}

export default function MaintenancePaymentInterface({ bookingId }: MaintenancePaymentInterfaceProps) {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState<boolean>(false);
  
  // Fetch booking details
  const { data: booking, isLoading, error } = useQuery<MaintenanceBooking>({
    queryKey: ["/api/maintenance-bookings", bookingId],
  });

  // Process payment mutation
  const paymentMutation = useMutation({
    mutationFn: async () => {
      setIsProcessing(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const res = await apiRequest("PATCH", `/api/maintenance-bookings/${bookingId}/payment`, {
        paymentStatus: "paid"
      });
      return await res.json();
    },
    onSuccess: () => {
      setIsProcessing(false);
      setIsPaymentComplete(true);
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance-bookings", bookingId] });
      
      toast({
        title: "Payment Successful",
        description: "Your maintenance booking has been confirmed",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      setIsProcessing(false);
      
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePayment = () => {
    paymentMutation.mutate();
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'PPP');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-8 w-1/3" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-2/3" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    toast({
      title: "Error loading booking details",
      description: error.message,
      variant: "destructive",
    });
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Booking</CardTitle>
          <CardDescription>There was a problem loading the booking details.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!booking) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking Not Found</CardTitle>
          <CardDescription>The requested booking could not be found.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (booking.paymentStatus === "paid" || isPaymentComplete) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Successful</CardTitle>
              <CardDescription>Your maintenance booking has been confirmed</CardDescription>
            </div>
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Booking Reference</h4>
                <p className="font-medium">#{booking.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Amount Paid</h4>
                <p className="font-medium">₹{booking.amount}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Scheduled Date</h4>
                <p className="font-medium">{formatDate(booking.requestedDate)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <Badge variant="success">Confirmed</Badge>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 text-primary rounded-full p-2 flex-shrink-0">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Scheduled for {formatDate(booking.requestedDate)}</h4>
                <p className="text-muted-foreground text-sm">Our technician will arrive during the morning hours (9AM-12PM)</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 text-primary rounded-full p-2 flex-shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Booking is confirmed</h4>
                <p className="text-muted-foreground text-sm">Our team will contact you a day before to confirm the exact time</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex-col items-stretch gap-4">
          <Button variant="outline" className="w-full">
            Download Receipt
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Thank you for choosing our maintenance service. If you have any questions, please contact our support team.
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <CardDescription>
          Choose your preferred payment method to confirm your maintenance booking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6 md:col-span-2">
            <Tabs defaultValue={paymentMethod} onValueChange={setPaymentMethod}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="card">Credit/Debit Card</TabsTrigger>
                <TabsTrigger value="upi">UPI Payment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="card" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      className="mt-1"
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input 
                      id="expiryDate" 
                      placeholder="MM/YY" 
                      className="mt-1"
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv" 
                      placeholder="123" 
                      className="mt-1"
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input 
                      id="cardName" 
                      placeholder="John Smith" 
                      className="mt-1"
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="upi" className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input 
                    id="upiId" 
                    placeholder="name@upi" 
                    className="mt-1"
                    disabled={isProcessing}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter your UPI ID to make the payment directly from your bank account
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <Accordion type="single" collapsible>
              <AccordionItem value="payment-security">
                <AccordionTrigger>Payment Security Information</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    All payments are processed securely. We use industry-standard encryption to protect your personal and financial information.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your payment details are not stored on our servers and are directly processed by our secure payment gateway.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="refund-policy">
                <AccordionTrigger>Cancellation & Refund Policy</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Cancellations made 24 hours before the scheduled service are eligible for a full refund.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    For cancellations made less than 24 hours before the service, a 20% cancellation fee will be applied.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Type:</span>
                  <span>Maintenance</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduled Date:</span>
                  <span>{formatDate(booking.requestedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Slot:</span>
                  <span>Morning (9AM-12PM)</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total Amount:</span>
                  <span>₹{booking.amount}</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">
                    <Clock className="h-4 w-4" />
                  </span>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ₹{booking.amount}
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground mt-3 text-center">
              By proceeding with payment, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}