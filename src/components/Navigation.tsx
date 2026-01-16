// src/components/Navigation.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation: React.FC = () => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  if (isHomePage) {
    return <div className="py-6" />;
  }

  return (
    <nav className="py-6">
      <div className="max-w-3xl mx-auto px-4 flex justify-end items-center">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          Home
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;