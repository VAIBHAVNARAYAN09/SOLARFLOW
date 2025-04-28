import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import TicketFilters from "@/components/tickets/ticket-filters";
import TicketList from "@/components/tickets/ticket-list";
import CreateTicketDialog from "@/components/tickets/create-ticket-dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "@shared/schema";

export default function Tickets() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);

  // Fetch tickets
  const { data: tickets, isLoading } = useQuery<Ticket[]>({
    queryKey: ['/api/tickets'],
    queryFn: async () => {
      return [];
    }
  });

  // Sample ticket filters
  const filters = [
    { name: "All", value: "all", count: 48 },
    { name: "Open", value: "open", count: 12 },
    { name: "In Progress", value: "in_progress", count: 18 },
    { name: "Waiting", value: "waiting", count: 8 },
    { name: "Resolved", value: "resolved", count: 10 }
  ];

  // Sample tickets for UI development
  const sampleTickets = [
    {
      id: 1249,
      subject: "Inverter failure at Site 3",
      description: "The inverter has stopped working completely. No power output is being registered from the system.",
      status: "in_progress",
      priority: "high",
      userId: 123,
      createdAt: new Date('2023-06-15')
    },
    {
      id: 1248,
      subject: "Panel alignment issues",
      description: "After the recent storm, several panels appear to have shifted from their optimal position.",
      status: "resolved",
      priority: "medium",
      userId: 124,
      createdAt: new Date('2023-06-14')
    },
    {
      id: 1247,
      subject: "Battery backup not charging",
      description: "The battery storage system is not accepting charge from the solar array during peak sun hours.",
      status: "assigned",
      priority: "high",
      userId: 125,
      createdAt: new Date('2023-06-14')
    },
    {
      id: 1246,
      subject: "Performance monitoring error",
      description: "The monitoring system is showing inconsistent data compared to the actual meter readings.",
      status: "open",
      priority: "low",
      userId: 126,
      createdAt: new Date('2023-06-13')
    },
    {
      id: 1245,
      subject: "Billing discrepancy for May",
      description: "My May invoice doesn't reflect the actual solar production credits I should have received.",
      status: "waiting",
      priority: "medium",
      userId: 127,
      createdAt: new Date('2023-06-12')
    }
  ];

  const ticketsToDisplay = tickets && tickets.length > 0 ? tickets : sampleTickets;

  // Filter tickets based on active filter and search query
  const filteredTickets = ticketsToDisplay
    .filter(ticket => 
      activeFilter === 'all' || ticket.status === activeFilter
    )
    .filter(ticket => 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toString().includes(searchQuery)
    );

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header title="Support Tickets" setSidebarOpen={setSidebarOpen} />

        <main className="flex-grow p-6">
          <div className="mb-6">
            <div className="bg-background rounded-lg shadow-sm p-6 border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
                <h1 className="text-xl font-semibold">Support Tickets</h1>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="Search tickets..." 
                      className="pl-10 pr-4 py-2 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400 dark:text-slate-500">
                      <Search className="h-5 w-5" />
                    </div>
                  </div>
                  <CreateTicketDialog />
                </div>
              </div>
              
              <TicketFilters 
                filters={filters} 
                activeFilter={activeFilter} 
                setActiveFilter={setActiveFilter} 
              />
              
              <TicketList 
                tickets={filteredTickets}
                isLoading={isLoading}
                onViewTicket={(ticket) => setViewingTicket(ticket)}
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!viewingTicket} onOpenChange={(open) => !open && setViewingTicket(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Ticket #{viewingTicket?.id}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 pt-2">
              Created on {viewingTicket && formatDate(viewingTicket.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {viewingTicket && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{viewingTicket.subject}</h3>
                <div className="flex items-center gap-2">
                  {getStatusBadge(viewingTicket.status)}
                  {getPriorityBadge(viewingTicket.priority)}
                </div>
              </div>

              <div className="border rounded-md p-4 bg-muted/50">
                <p className="text-sm whitespace-pre-line">{viewingTicket.description}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Customer Information</h4>
                <p className="text-sm">Customer ID: {viewingTicket.userId}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
