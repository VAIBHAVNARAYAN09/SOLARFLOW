import { Link } from "wouter";
import { formatDateTime, formatRelativeTime, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  EyeIcon, 
  MoreHorizontal, 
  Clock, 
  ExternalLink,
  AlertCircle,
  CheckCircle,
  ArrowUpRight
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Ticket } from "@shared/schema";

interface TicketTableProps {
  tickets: Ticket[];
}

export default function TicketTable({ tickets }: TicketTableProps) {
  // Get status badge variant based on ticket status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return { 
          variant: "outline" as const, 
          className: "border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-950 dark:hover:bg-blue-900",
          icon: <AlertCircle className="w-3 h-3 mr-1" />
        };
      case 'in progress':
        return { 
          variant: "outline" as const, 
          className: "border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-400 dark:bg-amber-950 dark:hover:bg-amber-900", 
          icon: <Clock className="w-3 h-3 mr-1" />
        };
      case 'resolved':
        return { 
          variant: "outline" as const, 
          className: "border-green-200 text-green-700 bg-green-50 hover:bg-green-100 dark:border-green-800 dark:text-green-400 dark:bg-green-950 dark:hover:bg-green-900", 
          icon: <CheckCircle className="w-3 h-3 mr-1" />
        };
      default:
        return { 
          variant: "outline" as const, 
          className: "border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:bg-slate-950 dark:hover:bg-slate-900", 
          icon: <ArrowUpRight className="w-3 h-3 mr-1" />
        };
    }
  };

  // Get priority badge variant based on ticket priority
  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return { 
          variant: "outline" as const, 
          className: "border-red-200 text-red-700 bg-red-50 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:bg-red-950 dark:hover:bg-red-900"
        };
      case 'medium':
        return { 
          variant: "outline" as const, 
          className: "border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-400 dark:bg-amber-950 dark:hover:bg-amber-900"
        };
      case 'low':
        return { 
          variant: "outline" as const, 
          className: "border-green-200 text-green-700 bg-green-50 hover:bg-green-100 dark:border-green-800 dark:text-green-400 dark:bg-green-950 dark:hover:bg-green-900"
        };
      default:
        return { 
          variant: "outline" as const, 
          className: "border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:bg-slate-950 dark:hover:bg-slate-900"
        };
    }
  };

  if (!tickets.length) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
          <AlertCircle className="h-10 w-10 mb-3 opacity-30" />
          <p>No tickets found</p>
          <p className="text-sm mt-2">Create a new ticket to get started</p>
          <Button asChild className="mt-4">
            <Link href="/new-ticket">
              Create Ticket
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => {
            const statusBadge = getStatusBadge(ticket.status);
            const priorityBadge = getPriorityBadge(ticket.priority);
            
            return (
              <TableRow key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                <TableCell className="font-medium text-primary">
                  #{ticket.id}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900 dark:text-slate-200">{ticket.subject}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {ticket.description}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusBadge.variant} className={statusBadge.className}>
                    <div className="flex items-center">
                      {statusBadge.icon}
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </div>
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityBadge.variant} className={priorityBadge.className}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-700 dark:text-slate-300">
                    {formatRelativeTime(ticket.createdAt)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDateTime(ticket.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-7 w-7 mr-2">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials("John Doe")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">John Doe</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/tickets/${ticket.id}`}>
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in new tab
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as resolved
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
