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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Referral } from "@shared/schema";

export default function ReferralsList() {
  // In a real app, this would fetch from an API
  const { data, isLoading } = useQuery<Referral[]>({
    queryKey: ['/api/referrals'],
    queryFn: async () => {
      return [];
    }
  });

  // Sample data for UI development
  const sampleReferrals = [
    {
      id: 1,
      referrerId: 123,
      referredName: "Rahul Mehta",
      referredEmail: "rahul@example.com",
      status: "pending",
      createdAt: new Date('2023-06-15')
    },
    {
      id: 2,
      referrerId: 123,
      referredName: "Priya Singh",
      referredEmail: "priya@example.com",
      status: "contacted",
      createdAt: new Date('2023-06-10')
    },
    {
      id: 3,
      referrerId: 123,
      referredName: "Vikram Joshi",
      referredEmail: "vikram@example.com",
      status: "converted",
      createdAt: new Date('2023-05-28')
    },
    {
      id: 4,
      referrerId: 123,
      referredName: "Sneha Kapoor",
      referredEmail: "sneha@example.com",
      status: "not_interested",
      createdAt: new Date('2023-05-20')
    }
  ];

  const referralsToDisplay = data && data.length > 0 ? data : sampleReferrals;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'contacted':
        return <Badge variant="info">Contacted</Badge>;
      case 'converted':
        return <Badge variant="success">Converted</Badge>;
      case 'not_interested':
        return <Badge variant="outline">Not Interested</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Your Referrals</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Referred Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Referred On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralsToDisplay.length > 0 ? (
                  referralsToDisplay.map((referral) => (
                    <TableRow key={referral.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">#{referral.id}</TableCell>
                      <TableCell>{referral.referredName}</TableCell>
                      <TableCell>{referral.referredEmail}</TableCell>
                      <TableCell>{formatDate(referral.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(referral.status)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={referral.status === 'converted' || referral.status === 'not_interested'}
                        >
                          Follow Up
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      You haven't made any referrals yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
