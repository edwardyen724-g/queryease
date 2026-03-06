import React from 'react';
import './globals.css';
import { SupabaseProvider } from '../context/SupabaseContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QueryEase',
  description: 'Streamline your query management for modern frameworks.',
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SupabaseProvider>
      <html lang="en">
        <body>
          <header>
            <h1>Transform Your Query Management Experience</h1>
            <p>Streamline your query management for modern frameworks.</p>
          </header>
          <main>{children}</main>
          <footer>
            <p>© {new Date().getFullYear()} QueryEase. All rights reserved.</p>
          </footer>
        </body>
      </html>
    </SupabaseProvider>
  );
};

export default Layout;