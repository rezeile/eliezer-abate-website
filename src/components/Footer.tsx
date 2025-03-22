// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 text-center text-sm text-gray-500">
      <p>© {new Date().getFullYear()} Eliezer Abate. All rights reserved.</p>
    </footer>
  );
};

export default Footer;