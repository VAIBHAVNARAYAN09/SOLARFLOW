import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { SolarPanel } from "@shared/schema";

export default function InstallationsList() {
  // In a real app, this would fetch from an API
  const { data, isLoading } = useQuery<SolarPanel[]>({
    queryKey: ['/api/solar-panels'],
    queryFn: async () => {
      return [];
    }
  });

  // Sample data for UI development
  const sampleInstallations = [
    {
      id: 1,
      siteId: "SITE-001",
      location: "Jaipur, Rajasthan",
      capacity: "5.8 kW",
      userId: 101,
      user: { name: "Suresh Mehta", initials: "SM" },
      installationDate: new Date('2023-06-12'),
      status: "operational",
      createdAt: new Date('2023-06-12')
    },
    {
      id: 2,
      siteId: "SITE-002",
      location: "Ahmedabad, Gujarat",
      capacity: "10.2 kW",
      userId: 102,
      user: { name: "Rahul Patel", initials: "RP" },
      installationDate: new Date('2023-06-10'),
      status: "operational",
      createdAt: new Date('2023-06-10')
    },
    {
      id: 3,
      siteId: "SITE-003",
      location: "Pune, Maharashtra",
      capacity: "7.5 kW",
      userId: 103,
      user: { name: "Anjali Kumar", initials: "AK" },
      installationDate: new Date('2023-06-08'),
      status: "in_progress",
      createdAt: new Date('2023-06-08')
    }
  ];

  const installationsToDisplay = data && data.length > 0 ? data : sampleInstallations;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      case 'maintenance':
        return <Badge variant="info">Maintenance</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Recent Installations</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Installation Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installationsToDisplay.map((installation) => (
                  <TableRow key={installation.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 bg-primary/20 text-primary mr-2">
                          <AvatarFallback>
                            {/* In a real app, this would use the user's initials */}
                            {(installation as any).user?.initials || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          {/* In a real app, this would use the user's name */}
                          <p className="font-medium">{(installation as any).user?.name || `User #${installation.userId}`}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{installation.location}</TableCell>
                    <TableCell>{installation.capacity}</TableCell>
                    <TableCell>{formatDate(installation.installationDate)}</TableCell>
                    <TableCell>{getStatusBadge(installation.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
