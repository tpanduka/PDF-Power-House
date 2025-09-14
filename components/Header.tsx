
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Tool } from '../types';
import { FileType2, ArrowLeft, Info } from 'lucide-react';

interface HeaderProps {
    activeTool: Tool | null;
    onBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTool, onBack }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAboutPage = location.pathname === '/about';
  const showBackButton = activeTool || isAboutPage;

  const handleBackClick = () => {
    if (activeTool) {
      onBack();
    } else {
      navigate('/');
    }
  };

  const getTitle = () => {
    if (isAboutPage) return 'About';
    if (activeTool) return activeTool.title;
    return 'PDF Powerhouse';
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {showBackButton ? (
              <button onClick={handleBackClick} className="text-primary-600 hover:text-primary-800 mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" aria-label="Go back">
                <ArrowLeft size={24} />
              </button>
            ) : (
                <FileType2 className="h-8 w-8 text-primary-600" />
            )}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 ml-2">
              {getTitle()}
            </h1>
          </div>
          <div className="flex items-center">
            {!showBackButton && (
              <Link to="/about" className="text-primary-600 hover:text-primary-800 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" aria-label="About page">
                <Info size={24} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};