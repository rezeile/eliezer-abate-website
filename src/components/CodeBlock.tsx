// src/components/CodeBlock.tsx
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  children: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  const language = className ? className.replace(/language-/, '') : 'text';
  
  return (
    <div className="my-6 rounded-md overflow-hidden">
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        className="text-sm"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;