import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import Layout from "@/components/layout";
import TicketForm from "@/components/ticket-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { InsertTicket } from "@shared/schema";

export default function NewTicket() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const createTicketMutation = useMutation({
    mutationFn: async (ticketData: InsertTicket) => {
      const res = await apiRequest("POST", "/api/tickets", ticketData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Ticket created",
        description: "Your ticket has been submitted successfully",
        variant: "default",
      });
      
      // Invalidate tickets query to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      // Redirect to dashboard
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create ticket: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (ticketData: InsertTicket) => {
    createTicketMutation.mutate(ticketData);
  };

  return (
    <Layout>
      <div className="space-y-6 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Support Ticket</h1>
            <p className="text-gray-600">Fill out the form below to create a new support ticket</p>
          </div>
          <button 
            onClick={() => setLocation("/")} 
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            Cancel
          </button>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <TicketForm 
            onSubmit={handleSubmit} 
            isSubmitting={createTicketMutation.isPending} 
          />
        </div>
      </div>
    </Layout>
  );
}
