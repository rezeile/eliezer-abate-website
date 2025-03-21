// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Eliezer Abate</p>
      </div>
    </footer>
  );
};

export default Footer;