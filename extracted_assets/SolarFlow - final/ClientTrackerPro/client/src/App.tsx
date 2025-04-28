import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Tickets from "@/pages/tickets";
import Monitor from "@/pages/monitor";
import Reports from "@/pages/reports";
import Referrals from "@/pages/referrals";
import Forecasts from "@/pages/forecasts";
import Chatbot from "@/pages/chatbot";
import MaintenanceBooking from "@/pages/maintenance-booking";
import { ProtectedRoute } from "@/lib/protected-route";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./components/ui/theme-provider";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/tickets" component={Tickets} />
      <ProtectedRoute path="/monitor" component={Monitor} />
      <ProtectedRoute path="/reports" component={Reports} />
      <ProtectedRoute path="/referrals" component={Referrals} />
      <ProtectedRoute path="/forecasts" component={Forecasts} />
      <ProtectedRoute path="/chatbot" component={Chatbot} />
      <ProtectedRoute path="/maintenance-booking" component={MaintenanceBooking} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="solarflow-theme">
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
