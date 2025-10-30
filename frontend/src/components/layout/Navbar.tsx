import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  LogOut, 
  User, 
  Settings, 
  CreditCard,
  ArrowLeftRight,
  BarChart3,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="banking-card border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Sky Bank
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {!state.isAuthenticated && (
              <>
                <Link
                  to="/"
                  className={`banking-nav-item ${isActive('/') ? 'active' : ''}`}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className={`banking-nav-item ${isActive('/about') ? 'active' : ''}`}
                >
                  About Us
                </Link>
              </>
            )}
            
            {state.isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`banking-nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              
              <Link
                to={state.user?.role === 'ADMIN' ? '/admin/accounts' : '/dashboard'}
                className={`banking-nav-item ${isActive(state.user?.role === 'ADMIN' ? '/admin/accounts' : '/dashboard') ? 'active' : ''}`}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Accounts
              </Link>
              
              <Link
                to="/transfer"
                className={`banking-nav-item ${isActive('/transfer') ? 'active' : ''}`}
              >
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Transfer
              </Link>

              {state.user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={`banking-nav-item ${isActive('/admin') ? 'active' : ''}`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Admin Panel
                </Link>
              )}
              </>
            )}
          </div>

          {/* User Menu */}
          {state.isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border border-border">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{state.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{state.user?.email}</p>
                    <p className="text-xs text-primary font-medium">{state.user?.role}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="banking-button-primary">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}