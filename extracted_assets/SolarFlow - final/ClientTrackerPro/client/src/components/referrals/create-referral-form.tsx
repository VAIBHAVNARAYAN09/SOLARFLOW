import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  referredName: z.string().min(2, "Name must be at least 2 characters"),
  referredEmail: z.string().email("Please enter a valid email address"),
  referredPhone: z.string().optional(),
  message: z.string().optional(),
  consent: z.boolean().refine(val => val === true, {
    message: "You must agree to contact the referred person",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateReferralForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referredName: "",
      referredEmail: "",
      referredPhone: "",
      message: "",
      consent: false,
    },
  });
  
  const createReferralMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiRequest("POST", "/api/referrals", {
        referredName: values.referredName,
        referredEmail: values.referredEmail,
        status: "pending",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/referrals'] });
      toast({
        title: "Referral Submitted",
        description: "Your referral has been submitted successfully. Our team will contact them soon.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit referral",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    createReferralMutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Refer a Friend
        </CardTitle>
        <CardDescription>
          Recommend our solar solutions to friends and family
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referred-name">Friend's Name</Label>
            <Input 
              id="referred-name" 
              placeholder="John Doe" 
              {...form.register("referredName")}
            />
            {form.formState.errors.referredName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.referredName.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="referred-email">Friend's Email</Label>
            <Input 
              id="referred-email" 
              type="email" 
              placeholder="john@example.com" 
              {...form.register("referredEmail")}
            />
            {form.formState.errors.referredEmail && (
              <p className="text-sm text-destructive">
                {form.formState.errors.referredEmail.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="referred-phone">Friend's Phone (Optional)</Label>
            <Input 
              id="referred-phone" 
              placeholder="+91 9876543210" 
              {...form.register("referredPhone")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Personal Message (Optional)</Label>
            <Textarea 
              id="message" 
              placeholder="Add a personal message to your referral" 
              className="min-h-[80px]"
              {...form.register("message")}
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="consent" 
              {...form.register("consent")}
            />
            <Label htmlFor="consent" className="text-sm">
              I confirm that I have permission to share my friend's contact details and they're interested in solar solutions.
            </Label>
          </div>
          {form.formState.errors.consent && (
            <p className="text-sm text-destructive">
              {form.formState.errors.consent.message}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={createReferralMutation.isPending}
            className="w-full sm:w-auto"
          >
            {createReferralMutation.isPending ? "Submitting..." : "Submit Referral"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
