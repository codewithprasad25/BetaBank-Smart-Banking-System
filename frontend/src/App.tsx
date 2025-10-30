import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from './pages/Dashboard';
import Transfer from './pages/Transfer';
import AdminDashboard from './pages/AdminDashboard';
import AdminDeposit from './pages/AdminDeposit';
import AdminAccounts from './pages/AdminAccounts';
import AdminUsers from './pages/AdminUsers';
const AdminReports = () => <div className="container mx-auto p-6"><h1 className="text-2xl font-bold">Reports (Coming Soon)</h1></div>;
import About from './pages/About';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/accounts" element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } />
              
              <Route path="/transfer" element={
                <ProtectedRoute>
                  <Transfer />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } />
              
              {/* Admin only routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/deposit" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDeposit />
                </ProtectedRoute>
              } />
              <Route path="/admin/accounts" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminAccounts />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminReports />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
