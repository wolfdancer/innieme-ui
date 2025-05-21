import React from 'react';

// A simple mock that renders children as-is with skipHtml prop support
const ReactMarkdown = ({ 
  children, 
  skipHtml 
}: { 
  children: React.ReactNode, 
  skipHtml?: boolean 
}) => {
  return <div data-testid="markdown-content">{children}-{skipHtml}</div>;
};

export default ReactMarkdown;