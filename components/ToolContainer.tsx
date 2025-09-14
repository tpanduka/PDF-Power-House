
import React from 'react';

interface ToolContainerProps {
  children: React.ReactNode;
}

export const ToolContainer: React.FC<ToolContainerProps> = ({ children }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 sm:p-8">
      {children}
    </div>
  );
};