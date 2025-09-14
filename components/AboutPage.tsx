import React, { useState, useEffect } from 'react';
import { ToolContainer } from './ToolContainer';

interface Metadata {
  name: string;
  description: string;
}

export const AboutPage: React.FC = () => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch('./metadata.json');
        if (!response.ok) {
          throw new Error(`Failed to load application info: ${response.statusText}`);
        }
        const data = await response.json();
        setMetadata(data);
      } catch (e: any) {
        console.error("Error fetching metadata:", e);
        setError("Could not load application information.");
      }
    };

    fetchMetadata();
  }, []);

  return (
    <ToolContainer>
      <h2 className="text-2xl font-bold text-center mb-6 dark:text-gray-100">About PDF Powerhouse</h2>

      {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
      {!metadata && !error && (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary-600"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">Loading info...</p>
        </div>
      )}
      {metadata && (
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p className="text-lg">{metadata.description}</p>
          <p><strong>Version:</strong> 1.0.0</p>
          
          <div className="pt-6 mt-6 border-t dark:border-slate-600">
              <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-200">ETech Solutions</h3>
              <address className="not-italic mt-2 space-y-1">
                <span>72/10, Edirisinghe Road,</span><br/>
                <span>Mirihana, Nugegoda</span><br/>
                <span><strong>Tel:</strong> +94 777 88 9734</span>
              </address>
          </div>
        </div>
      )}
    </ToolContainer>
  );
};
