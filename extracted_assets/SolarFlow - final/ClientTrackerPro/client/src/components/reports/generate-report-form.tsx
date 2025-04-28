import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileText, Calendar } from "lucide-react";

export default function GenerateReportForm() {
  const { toast } = useToast();
  const [siteId, setSiteId] = useState("");
  const [technician, setTechnician] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [notes, setNotes] = useState("");
  const [includeSections, setIncludeSections] = useState({
    performance: true,
    maintenance: true,
    recommendations: true,
    photos: false
  });

  const generateReportMutation = useMutation({
    mutationFn: async (formData: any) => {
      // In a real app, this would submit to an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      return { success: true, reportId: 12345 };
    },
    onSuccess: (data) => {
      toast({
        title: "Report Generated",
        description: `Maintenance report #${data.reportId} has been created successfully.`,
      });
      // Reset form
      setSiteId("");
      setTechnician("");
      setServiceDate("");
      setNotes("");
      setIncludeSections({
        performance: true,
        maintenance: true,
        recommendations: true,
        photos: false
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to generate report",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateReportMutation.mutate({
      siteId,
      technician,
      serviceDate,
      notes,
      includeSections
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Maintenance Report
        </CardTitle>
        <CardDescription>
          Create a new maintenance report for completed service visits
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site-id">Site ID</Label>
              <Select value={siteId} onValueChange={setSiteId} required>
                <SelectTrigger id="site-id">
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SITE-001">SITE-001 (Jaipur)</SelectItem>
                  <SelectItem value="SITE-002">SITE-002 (Delhi NCR)</SelectItem>
                  <SelectItem value="SITE-003">SITE-003 (Mumbai)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="technician">Technician</Label>
              <Input 
                id="technician" 
                placeholder="Technician name" 
                value={technician}
                onChange={e => setTechnician(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service-date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Service Date
            </Label>
            <Input 
              id="service-date" 
              type="date" 
              value={serviceDate}
              onChange={e => setServiceDate(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Maintenance Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Describe the maintenance work performed" 
              className="min-h-[100px]"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label>Include in Report</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="performance" 
                  checked={includeSections.performance}
                  onCheckedChange={(checked) => 
                    setIncludeSections({...includeSections, performance: checked as boolean})
                  }
                />
                <Label htmlFor="performance" className="cursor-pointer">Performance Data</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="maintenance" 
                  checked={includeSections.maintenance}
                  onCheckedChange={(checked) => 
                    setIncludeSections({...includeSections, maintenance: checked as boolean})
                  }
                />
                <Label htmlFor="maintenance" className="cursor-pointer">Maintenance Actions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="recommendations" 
                  checked={includeSections.recommendations}
                  onCheckedChange={(checked) => 
                    setIncludeSections({...includeSections, recommendations: checked as boolean})
                  }
                />
                <Label htmlFor="recommendations" className="cursor-pointer">Recommendations</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="photos" 
                  checked={includeSections.photos}
                  onCheckedChange={(checked) => 
                    setIncludeSections({...includeSections, photos: checked as boolean})
                  }
                />
                <Label htmlFor="photos" className="cursor-pointer">Site Photos</Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={generateReportMutation.isPending}
            className="w-full sm:w-auto"
          >
            {generateReportMutation.isPending ? "Generating Report..." : "Generate Report"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
