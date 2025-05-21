import React from 'react';

// A simple mock that renders children as-is with skipHtml prop support
const ReactMarkdown = ({ 
  children, 
  skipHtml 
}: { 
  children: React.ReactNode, 
  skipHtml?: boolean 
}) => {
  return (
    <div data-testid="markdown-content">
      {children}
      {skipHtml !== undefined && ` - ${skipHtml ? "HTML skipped" : "HTML included"}`}
    </div>
  );
};

export default ReactMarkdown;