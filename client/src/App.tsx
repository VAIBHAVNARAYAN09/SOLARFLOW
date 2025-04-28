import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Tickets from "@/pages/tickets";
import NewTicket from "@/pages/new-ticket";
import AiAssistant from "@/pages/ai-assistant";
import MaintenanceBooking from "@/pages/maintenance-booking";
import Maintenance from "@/pages/maintenance";
import WeatherForecast from "@/pages/weather-forecast";
import PerformanceMonitor from "@/pages/performance-monitor";
import Referrals from "@/pages/referrals";
import AuthPage from "@/pages/auth-page";
import Layout from "@/components/layout";
import AiChatButton from "@/components/ai-chat-button";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/tickets" component={Tickets} />
      <ProtectedRoute path="/new-ticket" component={NewTicket} />
      <ProtectedRoute path="/ai-assistant" component={AiAssistant} />
      <ProtectedRoute path="/maintenance" component={Maintenance} />
      <ProtectedRoute path="/maintenance-booking" component={MaintenanceBooking} />
      <ProtectedRoute path="/weather-forecast" component={WeatherForecast} />
      <ProtectedRoute path="/monitor" component={PerformanceMonitor} />
      <ProtectedRoute path="/referrals" component={Referrals} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" attribute="class">
        <TooltipProvider>
          <AuthProvider>
            <Router />
            <Toaster />
            <AiChatButton />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
