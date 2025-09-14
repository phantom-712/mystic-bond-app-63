import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavigationProps {
  variant?: 'landing' | 'dashboard';
}

export const Navigation: React.FC<NavigationProps> = ({ variant = 'landing' }) => {
  const navigate = useNavigate();

  const handleAuth = () => {
    // Simulate Google sign-up/login
    navigate('/onboarding');
  };

  if (variant === 'dashboard') {
    return null; // Dashboard has its own sidebar navigation
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-heading font-bold text-gradient">
              SoulMate
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/about" 
              className="text-foreground hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link 
              to="/products" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Our Products
            </Link>
            <Link 
              to="/safety" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Safety
            </Link>
            <Link 
              to="/support" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Support
            </Link>
          </div>

          {/* Theme Toggle and Auth Button */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button 
              onClick={handleAuth}
              className="btn-mystical"
            >
              Log In / Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};