import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Ticket } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TicketListProps {
  tickets: Ticket[] | undefined;
  isLoading: boolean;
  onViewTicket: (ticket: Ticket) => void;
}

export default function TicketList({ tickets, isLoading, onViewTicket }: TicketListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [ticketToAssign, setTicketToAssign] = useState<number | null>(null);

  const assignMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/tickets/${id}`, { 
        status: "assigned", 
        assignedToId: 1 // In a real app, this would be the current user's ID
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({
        title: "Ticket assigned",
        description: "The ticket has been assigned successfully.",
      });
      setTicketToAssign(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to assign ticket",
        description: error.message,
        variant: "destructive",
      });
      setTicketToAssign(null);
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="secondary">Open</Badge>;
      case 'assigned':
        return <Badge variant="info">Assigned</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'waiting':
        return <Badge variant="purple">Waiting</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="success">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No tickets found</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          There are no tickets that match your current filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Created On</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow 
              key={ticket.id}
              className="hover:bg-muted/50"
            >
              <TableCell className="font-medium">#{ticket.id}</TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>
                {/* In a real app, this would show user data */}
                User #{ticket.userId}
              </TableCell>
              <TableCell>{getStatusBadge(ticket.status)}</TableCell>
              <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
              <TableCell>{formatDate(ticket.createdAt)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="link" 
                    className="h-auto p-0 text-primary"
                    onClick={() => onViewTicket(ticket)}
                  >
                    View
                  </Button>
                  {ticket.status === 'open' && (
                    <Button 
                      variant="link" 
                      className="h-auto p-0 text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                      onClick={() => {
                        setTicketToAssign(ticket.id);
                        assignMutation.mutate(ticket.id);
                      }}
                      disabled={assignMutation.isPending && ticketToAssign === ticket.id}
                    >
                      {assignMutation.isPending && ticketToAssign === ticket.id
                        ? "Assigning..." 
                        : "Assign"}
                    </Button>
                  )}
                  {ticket.status === 'in_progress' && (
                    <Button 
                      variant="link" 
                      className="h-auto p-0 text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Update
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
