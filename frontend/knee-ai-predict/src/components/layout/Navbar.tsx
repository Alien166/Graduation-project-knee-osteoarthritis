import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Mock authentication state - replace with actual auth context
  const isAuthenticated = location.pathname.includes('/dashboard') ||
    location.pathname.includes('/predict') ||
    location.pathname.includes('/history') ||
    location.pathname.includes('/profile');

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/features', label: 'Features' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },

  ];

  const dashboardLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/predict', label: 'New Prediction' },
    { href: '/history', label: 'History' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-medical-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-medical-primary rounded-lg flex items-center justify-center">
                <img src="/favicon.ico" alt="Knee AI Predict" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold text-medical-primary">
                Knee AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              // Dashboard navigation
              <>
                {dashboardLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === link.href
                      ? 'text-medical-secondary bg-medical-light'
                      : 'text-medical-primary hover:text-medical-secondary hover:bg-medical-light'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-medical-secondary text-white">
                          JD
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Public navigation
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === link.href
                      ? 'text-medical-secondary bg-medical-light'
                      : 'text-medical-primary hover:text-medical-secondary hover:bg-medical-light'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center space-x-3">
                  {/* Language Switcher */}
                  <LanguageSwitcher />

                  <Link to="/auth/login">
                    <Button
                      variant="ghost"
                      className="relative px-6 py-2 text-[#2C3E50] hover:text-[#3498DB] transition-colors duration-300 group"
                    >
                      <span className="relative z-10">{t('auth.login', 'Sign In')}</span>
                      <div className="absolute inset-0 bg-[#3498DB]/5 rounded-md transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </Button>
                  </Link>
                  <Link to="/auth/signup">
                    <Button
                      className="relative px-6 py-2 bg-gradient-to-r from-[#3498DB] to-[#2C3E50] hover:from-[#2980B9] hover:to-[#2C3E50] text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 group"
                    >
                      <span className="relative z-10">{t('common.signup')}</span>
                      <div className="absolute inset-0 bg-white/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language Switcher for mobile */}
            <LanguageSwitcher />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-medical-primary" />
              ) : (
                <Menu className="h-6 w-6 text-medical-primary" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-medical-light">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {(isAuthenticated ? dashboardLinks : navLinks).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${location.pathname === link.href
                  ? 'text-medical-secondary bg-medical-light'
                  : 'text-medical-primary hover:text-medical-secondary hover:bg-medical-light'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-4 pb-3 border-t border-medical-light">
                <div className="space-y-3">
                  <Link to="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[#2C3E50] hover:text-[#3498DB] transition-colors duration-300 group"
                    >
                      <span className="relative z-10">{t('auth.login', 'Sign In')}</span>
                      <div className="absolute inset-0 bg-[#3498DB]/5 rounded-md transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </Button>
                  </Link>
                  <Link to="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      className="w-full bg-gradient-to-r from-[#3498DB] to-[#2C3E50] hover:from-[#2980B9] hover:to-[#2C3E50] text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 group"
                    >
                      <span className="relative z-10">{t('common.signup')}</span>
                      <div className="absolute inset-0 bg-white/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
