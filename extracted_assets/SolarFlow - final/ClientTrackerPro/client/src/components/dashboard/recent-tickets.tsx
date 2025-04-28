import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Ticket } from "@shared/schema";

export default function RecentTickets() {
  // This would fetch the latest tickets from your API
  const { data, isLoading } = useQuery<Ticket[]>({
    queryKey: ['/api/tickets', { limit: 4 }],
    queryFn: async () => {
      // In a real app, this would be an API call
      return [];
    }
  });

  // Sample data for UI development
  const sampleTickets = [
    {
      id: 1249,
      subject: "Inverter failure at Site 3",
      status: "in_progress",
      priority: "high"
    },
    {
      id: 1248,
      subject: "Panel alignment issues",
      status: "resolved",
      priority: "medium"
    },
    {
      id: 1247,
      subject: "Battery backup not charging",
      status: "assigned",
      priority: "high"
    },
    {
      id: 1246,
      subject: "Performance monitoring error",
      status: "open",
      priority: "low"
    }
  ];

  const ticketsToDisplay = data && data.length > 0 ? data : sampleTickets;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'resolved':
        return { variant: 'success', label: 'Resolved' };
      case 'in_progress':
        return { variant: 'warning', label: 'In Progress' };
      case 'assigned':
        return { variant: 'info', label: 'Assigned' };
      case 'open':
        return { variant: 'secondary', label: 'Open' };
      case 'waiting':
        return { variant: 'purple', label: 'Waiting' };
      default:
        return { variant: 'secondary', label: status };
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return { variant: 'destructive', label: 'High' };
      case 'medium':
        return { variant: 'warning', label: 'Medium' };
      case 'low':
        return { variant: 'success', label: 'Low' };
      default:
        return { variant: 'secondary', label: priority };
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Support Tickets</CardTitle>
        <Link href="/tickets">
          <Button variant="link" className="text-sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b dark:border-slate-700">
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-400">ID</th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-400">Subject</th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-400">Status</th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-400">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {ticketsToDisplay.map((ticket) => {
                  const statusBadge = getStatusBadgeVariant(ticket.status);
                  const priorityBadge = getPriorityBadgeVariant(ticket.priority);

                  return (
                    <tr key={ticket.id}>
                      <td className="py-3 px-2 whitespace-nowrap text-sm text-gray-800 dark:text-slate-300">#{ticket.id}</td>
                      <td className="py-3 px-2 whitespace-nowrap text-sm text-gray-800 dark:text-slate-300">{ticket.subject}</td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <Badge variant={statusBadge.variant as any}>{statusBadge.label}</Badge>
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <Badge variant={priorityBadge.variant as any}>{priorityBadge.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
