import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText } from "lucide-react";
import { MaintenanceReport } from "@shared/schema";

export default function MaintenanceReportsList() {
  // In a real app, this would fetch from an API
  const { data, isLoading } = useQuery<MaintenanceReport[]>({
    queryKey: ['/api/maintenance-reports'],
    queryFn: async () => {
      return [];
    }
  });

  // Sample data for UI development
  const sampleReports = [
    {
      id: 1,
      solarPanelId: 101,
      technician: "Rajiv Kumar",
      serviceDate: new Date('2023-06-10'),
      report: "Routine maintenance completed. Cleaned panels and checked connections.",
      createdAt: new Date('2023-06-10')
    },
    {
      id: 2,
      solarPanelId: 102,
      technician: "Anjali Singh",
      serviceDate: new Date('2023-06-05'),
      report: "Replaced faulty inverter. System running at optimal performance now.",
      createdAt: new Date('2023-06-05')
    },
    {
      id: 3,
      solarPanelId: 103,
      technician: "Vikram Patel",
      serviceDate: new Date('2023-05-28'),
      report: "Adjusted panel alignment to improve efficiency by 5%. Cleaned panels.",
      createdAt: new Date('2023-05-28')
    }
  ];

  const reportsToDisplay = data && data.length > 0 ? data : sampleReports;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReportBadge = (panelId: number) => {
    const panelType = panelId % 3;
    switch (panelType) {
      case 0:
        return <Badge variant="info">Residential</Badge>;
      case 1:
        return <Badge variant="success">Commercial</Badge>;
      case 2:
        return <Badge variant="secondary">Industrial</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const truncateReport = (report: string, maxLength = 50) => {
    return report.length > maxLength 
      ? report.substring(0, maxLength) + '...' 
      : report;
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <CardTitle>Maintenance Reports</CardTitle>
          <Button variant="outline" className="space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Reports</span>
          </Button>
        </div>
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
                  <TableHead>Report ID</TableHead>
                  <TableHead>Panel</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Service Date</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportsToDisplay.map((report) => (
                  <TableRow key={report.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">#{report.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span>Panel #{report.solarPanelId}</span>
                        {getReportBadge(report.solarPanelId)}
                      </div>
                    </TableCell>
                    <TableCell>{report.technician}</TableCell>
                    <TableCell>{formatDate(report.serviceDate)}</TableCell>
                    <TableCell>{truncateReport(report.report)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          <span>View PDF</span>
                        </Button>
                      </div>
                    </TableCell>
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
