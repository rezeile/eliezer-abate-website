// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Eliezer Abate', description = 'Personal website of Eliezer Abate' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow max-w-3xl mx-auto px-4 w-full">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;