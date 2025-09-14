
import React from 'react';

interface SpinnerProps {
    message: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary-600"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">{message}</p>
    </div>
  );
};