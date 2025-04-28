import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SolarPanel } from "@shared/schema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Define the form schema
const formSchema = z.object({
  solarPanelId: z.string().min(1, "Please select a solar installation"),
  serviceType: z.string().min(1, "Please select a service type"),
  scheduledDate: z.date({
    required_error: "Please select a date for the maintenance",
  }),
  timeSlot: z.string().min(1, "Please select a time slot"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function BookMaintenanceForm() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  // Fetch user's solar panels
  const { data: panels, isLoading: isPanelsLoading } = useQuery<SolarPanel[]>({
    queryKey: ["/api/solar-panels"],
  });

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      solarPanelId: "",
      serviceType: "",
      location: "",
      timeSlot: "",
      notes: "",
    },
  });

  // Create the booking
  const bookingMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiRequest("POST", "/api/maintenance-bookings", {
        ...values,
        solarPanelId: parseInt(values.solarPanelId),
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Successful",
        description: "Your maintenance has been scheduled successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance-bookings"] });
      form.reset();
      setStep(1);
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: FormValues) {
    bookingMutation.mutate(data);
  }

  // Handle next step
  const handleNextStep = () => {
    form.trigger(["solarPanelId", "serviceType"]).then((isValid) => {
      if (isValid) setStep(2);
    });
  };

  if (isPanelsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-24 ml-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no panels are available, show a message
  if (!panels || panels.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-10">
            <h3 className="text-lg font-semibold mb-2">No Solar Installations Found</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any registered solar installations. Please contact support to register your installation.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service Information</h3>

                <FormField
                  control={form.control}
                  name="solarPanelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solar Installation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an installation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {panels.map((panel) => (
                            <SelectItem key={panel.id} value={panel.id.toString()}>
                              {panel.siteId} - {panel.location} ({panel.capacity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the solar installation that needs maintenance
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="routine">Routine Maintenance</SelectItem>
                          <SelectItem value="cleaning">Panel Cleaning</SelectItem>
                          <SelectItem value="inspection">Inspection</SelectItem>
                          <SelectItem value="repair">Repair</SelectItem>
                          <SelectItem value="upgrade">System Upgrade</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the type of maintenance service you need
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    onClick={handleNextStep}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Scheduling Details</h3>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter specific location details" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide any specific details about the service location
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Maintenance Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => 
                              date < new Date(new Date().setDate(new Date().getDate() + 2)) || 
                              date > new Date(new Date().setMonth(new Date().getMonth() + 2)) ||
                              date.getDay() === 0
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select a preferred date for the maintenance (minimum 2 days in advance, Sundays excluded)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Time Slot</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (1 PM - 4 PM)</SelectItem>
                          <SelectItem value="evening">Evening (4 PM - 6 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose your preferred time slot for the maintenance
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any specific instructions or details about the maintenance needs"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Add any specific requirements or concerns
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit"
                    disabled={bookingMutation.isPending}
                  >
                    {bookingMutation.isPending ? "Submitting..." : "Book Maintenance"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}