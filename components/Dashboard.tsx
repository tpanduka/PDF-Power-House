import React from 'react';
import { Tool } from '../types';
import { ToolCard } from './ToolCard';
import { Merge, Split, ScanText, FileImage, Image, Droplets, FileScan } from 'lucide-react';

interface DashboardProps {
  onSelectTool: (tool: Tool) => void;
}

const tools: Tool[] = [
  {
    id: 'merge',
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into a single document.',
    Icon: Merge,
  },
  {
    id: 'split',
    title: 'Split PDF',
    description: 'Extract pages or page ranges from a PDF file.',
    Icon: Split,
  },
  {
    id: 'extract-text',
    title: 'Extract Text from PDF',
    description: 'Use AI to perform OCR on a PDF and extract its text content.',
    Icon: ScanText,
  },
   {
    id: 'image-extract-text',
    title: 'Extract Text from Image',
    description: 'Use AI to perform OCR and extract text from an image file.',
    Icon: FileScan,
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF',
    description: 'Convert JPG, PNG, and other images to a PDF file.',
    Icon: FileImage,
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to Image',
    description: 'Convert each page of a PDF into a JPG image.',
    Icon: Image,
  },
  {
    id: 'watermark',
    title: 'Add Watermark',
    description: 'Stamp an image or text over your PDF pages.',
    Icon: Droplets,
  },
];

export const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  return (
    <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-gray-100">Your All-in-One PDF Toolkit</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Select a tool below to get started.</p>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onSelect={() => onSelectTool(tool)} />
        ))}
      </div>
    </div>
  );
};