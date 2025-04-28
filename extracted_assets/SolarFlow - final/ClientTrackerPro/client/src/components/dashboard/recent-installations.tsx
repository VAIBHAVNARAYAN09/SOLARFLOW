import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";

interface Installation {
  id: number;
  customer: {
    name: string;
    initials: string;
  };
  location: string;
  capacity: string;
  date: string;
  status: string;
}

export default function RecentInstallations() {
  // This would fetch recent installations data from your API
  const { data, isLoading } = useQuery<Installation[]>({
    queryKey: ['/api/installations', { limit: 3 }],
    queryFn: async () => {
      // In a real app, this would be an API call
      return [
        {
          id: 1,
          customer: { name: "Suresh Mehta", initials: "SM" },
          location: "Jaipur, Rajasthan",
          capacity: "5.8 kW",
          date: "June 12, 2023",
          status: "completed"
        },
        {
          id: 2,
          customer: { name: "Rahul Patel", initials: "RP" },
          location: "Ahmedabad, Gujarat",
          capacity: "10.2 kW",
          date: "June 10, 2023",
          status: "completed"
        },
        {
          id: 3,
          customer: { name: "Anjali Kumar", initials: "AK" },
          location: "Pune, Maharashtra",
          capacity: "7.5 kW",
          date: "June 8, 2023",
          status: "in_progress"
        }
      ];
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Installations</CardTitle>
        <Link href="/referrals">
          <Button variant="link" className="text-sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="ml-3 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                  <Skeleton className="h-3 w-24 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b dark:border-slate-700">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-400">Customer</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-400">Location</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-400">Capacity</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-400">Date</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {data?.map((installation) => (
                  <tr key={installation.id}>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 bg-primary/20 text-primary">
                          <AvatarFallback>{installation.customer.initials}</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800 dark:text-slate-300">{installation.customer.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800 dark:text-slate-300">{installation.location}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800 dark:text-slate-300">{installation.capacity}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600 dark:text-slate-400">{installation.date}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(installation.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
