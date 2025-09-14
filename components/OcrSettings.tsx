import React from 'react';

const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Russian', 'Arabic', 'Portuguese', 'Italian', 'Hindi', 'Korean'];

interface OcrSettingsProps {
    language: string;
    onLanguageChange: (lang: string) => void;
    promptHint: string;
    onPromptHintChange: (hint: string) => void;
}

export const OcrSettings: React.FC<OcrSettingsProps> = ({
    language,
    onLanguageChange,
    promptHint,
    onPromptHintChange,
}) => {
    return (
        <div className="mt-6 p-4 border rounded-lg dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 space-y-4">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">AI OCR Settings</h4>
            <div>
                <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Primary Language
                </label>
                <select
                    id="language-select"
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200 focus:ring-primary-500 focus:border-primary-500"
                    aria-label="Select document language"
                >
                    {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Helps the AI recognize specific characters and grammar.</p>
            </div>
            <div>
                <label htmlFor="prompt-hint" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content Hint (Optional)
                </label>
                <input
                    type="text"
                    id="prompt-hint"
                    value={promptHint}
                    onChange={(e) => onPromptHintChange(e.target.value)}
                    placeholder="e.g., 'This is a restaurant menu' or 'Extract table data'"
                    className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200 focus:ring-primary-500 focus:border-primary-500"
                    aria-label="Provide a hint about the content"
                />
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Provide context to improve accuracy and formatting.</p>
            </div>
        </div>
    );
};
