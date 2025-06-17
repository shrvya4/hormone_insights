import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";
import OnboardingNew from "@/pages/OnboardingNew";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import DailyPlanner from "@/pages/DailyPlanner";
import EvaluationDashboard from "@/pages/EvaluationDashboard";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, loading, token } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && token && user) {
      // User is authenticated, check if they need onboarding or can go to dashboard
      if (location === '/') {
        // Redirect authenticated users away from login page
        setLocation('/dashboard');
      }
    } else if (!loading && !token && location !== '/') {
      // User is not authenticated, redirect to login
      setLocation('/');
    }
  }, [user, loading, token, location, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/onboarding" component={OnboardingNew} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/daily-planner" component={DailyPlanner} />
      <Route path="/evaluation" component={EvaluationDashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
