import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, Settings, ArrowLeft } from 'lucide-react';

interface GlobalHeaderProps {
  showBackButton?: boolean;
  title?: string;
  actions?: React.ReactNode;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ 
  showBackButton, 
  title, 
  actions 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();

  // Don't show header on landing page or onboarding
  if (location.pathname === '/' || location.pathname === '/onboarding') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-mystical-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button or Logo */}
          <div className="flex items-center space-x-4">
            {showBackButton ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="hover:bg-secondary/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <div className="text-2xl font-heading font-bold text-gradient">
                  SoulMate
                </div>
              </Link>
            )}
            
            {title && (
              <div className="hidden md:block">
                <h1 className="text-xl font-heading font-semibold">
                  {title}
                </h1>
              </div>
            )}
          </div>

          {/* Right side - Actions and Controls */}
          <div className="flex items-center space-x-3">
            {/* Custom actions */}
            {actions}
            
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/notifications')}
              className="relative hover:bg-secondary/50"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs min-w-5 h-5 border-2 border-background">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Settings */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/profile/edit')}
              className="hover:bg-secondary/50"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};