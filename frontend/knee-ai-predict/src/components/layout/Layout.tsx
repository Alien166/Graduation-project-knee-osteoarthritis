
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-medical-background">
      <Navbar />
      <main className={`${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
