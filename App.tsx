import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Tool } from './types';
import { PdfMerger } from './features/PdfMerger';
import { PdfSplitter } from './features/PdfSplitter';
import { TextExtractor } from './features/TextExtractor';
import { ImageToPdf } from './features/ImageToPdf';
import { PdfToImage } from './features/PdfToImage';
import { Watermarker } from './features/Watermarker';
import { ImageTextExtractor } from './features/ImageTextExtractor';
import { AboutPage } from './components/AboutPage';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const renderActiveTool = () => {
    if (!activeTool) {
      return <Dashboard onSelectTool={setActiveTool} />;
    }

    switch (activeTool.id) {
        case 'merge':
            return <PdfMerger />;
        case 'split':
            return <PdfSplitter />;
        case 'extract-text':
            return <TextExtractor />;
        case 'image-extract-text':
            return <ImageTextExtractor />;
        case 'image-to-pdf':
            return <ImageToPdf />;
        case 'pdf-to-image':
            return <PdfToImage />;
        case 'watermark':
            return <Watermarker />;
      default:
        return <Dashboard onSelectTool={setActiveTool} />;
    }
  };
  
  const handleBack = () => setActiveTool(null);

  return (
    <HashRouter>
      <div className="min-h-screen text-gray-800 dark:text-gray-200">
        <Header activeTool={activeTool} onBack={handleBack} />
        <main className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={renderActiveTool()} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;