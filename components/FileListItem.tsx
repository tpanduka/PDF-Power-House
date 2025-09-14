import React from 'react';
import { FileText, FileImage, Trash2, ArrowUp, ArrowDown, File as FileIcon } from 'lucide-react';

const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getFileIcon = (fileType: string): React.ReactElement => {
  const commonClasses = "w-8 h-8 mr-4 text-primary-600 flex-shrink-0";
  if (fileType.startsWith('image/')) {
    return <FileImage className={commonClasses} />;
  }
  if (fileType === 'application/pdf') {
    return <FileText className={commonClasses} />;
  }
  return <FileIcon className="w-8 h-8 mr-4 text-gray-500 flex-shrink-0" />;
};

interface FileListItemProps {
  file: File;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const FileListItem: React.FC<FileListItemProps> = ({ file, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) => {
  return (
    <li className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/80 rounded-lg shadow-sm">
      <div className="flex items-center overflow-hidden">
        {getFileIcon(file.type)}
        <div className="flex flex-col truncate">
          <span className="font-semibold text-sm truncate text-gray-800 dark:text-gray-200">{file.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatFileSize(file.size)} &bull; {file.type}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-1 flex-shrink-0 ml-4">
        {onMoveUp && <button onClick={onMoveUp} disabled={isFirst} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-transparent dark:text-gray-300 transition-colors" aria-label="Move up"><ArrowUp size={18} /></button>}
        {onMoveDown && <button onClick={onMoveDown} disabled={isLast} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-transparent dark:text-gray-300 transition-colors" aria-label="Move down"><ArrowDown size={18} /></button>}
        <button onClick={onRemove} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 dark:text-red-400 dark:hover:text-red-300 transition-colors" aria-label="Remove file"><Trash2 size={18} /></button>
      </div>
    </li>
  );
};
