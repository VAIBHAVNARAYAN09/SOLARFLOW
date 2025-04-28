import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout";
import TicketTable from "@/components/ticket-table";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";

export default function Tickets() {
  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  
  // Fetch all tickets
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["/api/tickets"],
  });
  
  // Filter tickets based on selected criteria
  const filteredTickets = tickets?.filter((ticket) => {
    // Filter by status
    if (status !== "all" && ticket.status !== status) {
      return false;
    }
    
    // Filter by priority
    if (priority !== "all" && ticket.priority !== priority) {
      return false;
    }
    
    // Filter by search term
    if (search && !ticket.subject.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  }) || [];

  return (
    <Layout>
      <div className="space-y-6 p-4 lg:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
            <p className="text-gray-600">Manage and track all support tickets</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild>
              <Link href="/new-ticket">
                <div className="flex items-center gap-2">
                  <i className="fas fa-plus"></i>
                  <span>New Ticket</span>
                </div>
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Filter controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search tickets..." 
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Tickets List */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <TicketTable tickets={filteredTickets} />
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredTickets.length}</span> of{" "}
                  <span className="font-medium">{filteredTickets.length}</span> tickets
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="text-gray-500" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary-50 border-primary-300 text-primary-700">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white text-gray-700" disabled={true}>
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
