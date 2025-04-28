import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

import Layout from "@/components/layout";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Form schema
const bookingFormSchema = z.object({
  userId: z.number(),
  systemId: z.number(),
  serviceType: z.string().min(1, "Service type is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  preferredDate: z.date().refine(date => date > new Date(), {
    message: "Preferred date must be in the future"
  }),
  preferredTimeSlot: z.string().min(1, "Preferred time slot is required"),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const serviceTypes = [
  "Panel Cleaning", 
  "Annual Inspection", 
  "System Maintenance", 
  "Inverter Service", 
  "Electrical Inspection",
  "Performance Optimization",
  "Emergency Repair"
];

const timeSlots = [
  "Morning (8 AM - 12 PM)",
  "Afternoon (12 PM - 4 PM)",
  "Evening (4 PM - 8 PM)"
];

export default function MaintenanceBooking() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Fetch user's solar systems
  const { data: solarSystems, isLoading: systemsLoading } = useQuery({
    queryKey: ["/api/solar-systems", { userId: 1 }], // Hardcoded user ID for now
  });
  
  // Form setup
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      userId: 1, // Default user ID
      systemId: 0, // Will be set once systems are loaded
      serviceType: "",
      description: "",
      preferredTimeSlot: "",
    },
  });
  
  // Update system ID when data loads
  React.useEffect(() => {
    if (solarSystems && solarSystems.length > 0 && !form.getValues().systemId) {
      form.setValue("systemId", solarSystems[0].id);
    }
  }, [solarSystems, form]);
  
  // Create booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      // Convert date to ISO string for API
      const formattedData = {
        ...data,
        preferredDate: data.preferredDate.toISOString(),
        status: "pending",
        technicianId: null,
        confirmedDate: null,
        confirmedTime: null,
        completionNotes: null
      };
      
      return await apiRequest("POST", "/api/maintenance/bookings", formattedData);
    },
    onSuccess: () => {
      setLoading(false);
      toast({
        title: "Booking Successful",
        description: "Your maintenance service has been scheduled. You will receive a confirmation soon.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance/bookings"] });
      navigate("/maintenance");
    },
    onError: (error: Error) => {
      setLoading(false);
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  function onSubmit(data: BookingFormValues) {
    setLoading(true);
    
    // Validate preferredDate exists before submission
    if (!data.preferredDate) {
      toast({
        title: "Missing Date",
        description: "Please select a preferred date for your maintenance booking.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    bookingMutation.mutate(data);
    // Don't set loading to false here, let onSuccess/onError handle it
  }
  
  // Fetch weather forecast for the selected date
  const selectedDate = form.watch("preferredDate");
  const { data: weatherForecast, isLoading: weatherLoading } = useQuery({
    queryKey: ["/api/weather", selectedDate ? format(selectedDate, "yyyy-MM-dd") : null],
    enabled: !!selectedDate,
  });
  
  // Calculate if date is more than 7 days in the future (beyond weather forecast)
  const isDateBeyondForecast = selectedDate && 
    ((selectedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) > 7);
  
  // Find weather data for the selected date
  const selectedDateWeather = selectedDate && weatherForecast?.daily.find(
    day => day.date === format(selectedDate, "yyyy-MM-dd")
  );

  return (
    <Layout title="Maintenance Booking">
      <div className="space-y-6 p-5 md:p-8">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white">Maintenance Service Booking</h2>
        <p className="text-sm text-muted-foreground dark:text-slate-400">
          Schedule regular maintenance for your solar panels to ensure optimum performance
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Book a Maintenance Service</CardTitle>
              <CardDescription>Please fill out the form below to schedule a maintenance visit</CardDescription>
            </CardHeader>
            <CardContent>
              {systemsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : solarSystems && solarSystems.length > 0 ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="systemId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Solar System</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a solar system" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {solarSystems.map((system) => (
                                <SelectItem key={system.id} value={system.id.toString()}>
                                  {system.name} ({system.capacity} kW)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {serviceTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please describe your service needs"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Include any specific issues or concerns you'd like the technician to address
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Preferred Date</FormLabel>
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
                                  date < new Date() || // Can't book in the past
                                  date > new Date(new Date().setMonth(new Date().getMonth() + 3)) // Max 3 months in advance
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="preferredTimeSlot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select preferred time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Book Maintenance
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No solar systems found for your account.</p>
                  <p className="mt-2">Please add a solar system first before booking maintenance.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weather Forecast</CardTitle>
                <CardDescription>
                  {selectedDate 
                    ? `Weather forecast for ${format(selectedDate, "PPP")}`
                    : "Select a date to see the weather forecast"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedDate ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p>Select a date for your maintenance to see the weather forecast</p>
                  </div>
                ) : weatherLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : isDateBeyondForecast ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p>Weather forecast is only available for the next 7 days</p>
                  </div>
                ) : selectedDateWeather ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{selectedDateWeather.description}</h3>
                        <p className="text-sm text-muted-foreground">
                          Temperature: {selectedDateWeather.minTemp.toFixed(1)}°C - {selectedDateWeather.maxTemp.toFixed(1)}°C
                        </p>
                      </div>
                      <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                        <img 
                          src={`http://openweathermap.org/img/wn/${selectedDateWeather.icon}@2x.png`} 
                          alt="Weather icon"
                          width={50}
                          height={50} 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Precipitation Chance:</span> {selectedDateWeather.precipitationChance.toFixed(0)}%
                      </p>
                      {selectedDateWeather.precipitationChance > 50 && (
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                          ⚠️ High chance of precipitation on this date. You may want to consider another day for outdoor maintenance.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>Weather data not available for the selected date</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>Regular maintenance is recommended every 6 months</li>
                  <li>Panel cleaning is best scheduled after dry or dusty weather periods</li>
                  <li>Annual inspection should check electrical connections and inverter performance</li>
                  <li>The best time for maintenance is typically mid-morning when panels are accessible but not too hot</li>
                  <li>Our technicians will bring all necessary equipment for the service</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}