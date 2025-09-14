
import React from 'react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onSelect: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const { Icon } = tool;
  return (
    <div
      onClick={onSelect}
      className="group bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-xl dark:hover:shadow-primary-500/20 transition-shadow duration-300 cursor-pointer overflow-hidden flex flex-col p-6"
    >
      <div className="flex items-center justify-center bg-primary-100 dark:bg-slate-700 rounded-lg w-16 h-16 mb-4 group-hover:bg-primary-500 dark:group-hover:bg-primary-600 transition-colors duration-300">
        <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{tool.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 flex-grow">{tool.description}</p>
    </div>
  );
};