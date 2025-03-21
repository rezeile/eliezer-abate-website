// src/components/Navigation.tsx
import React from 'react';
import Link from 'next/link';

const Navigation: React.FC = () => {
  return (
    <nav className="py-6">
      <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-lg font-medium hover:text-gray-600 transition-colors">
          Eliezer Abate
        </Link>
        <div className="space-x-6">
          <Link href="/about" className="text-sm hover:text-gray-600 transition-colors">
            About
          </Link>
          <Link href="/blog" className="text-sm hover:text-gray-600 transition-colors">
            Blog
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;