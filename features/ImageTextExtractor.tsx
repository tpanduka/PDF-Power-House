import React, { useState, useCallback } from 'react';
import { FileDropzone } from '../components/FileDropzone';
import { Spinner } from '../components/Spinner';
import { ToolContainer } from '../components/ToolContainer';
import { extractTextFromImage } from '../services/geminiService';
import { FileScan } from 'lucide-react';
import { FileListItem } from '../components/FileListItem';
import { OcrSettings } from '../components/OcrSettings';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove the data url prefix e.g. 'data:image/jpeg;base64,'
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

export const ImageTextExtractor: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [language, setLanguage] = useState('English');
    const [promptHint, setPromptHint] = useState('');

    const handleFileAccepted = useCallback((acceptedFiles: File[]) => {
        setFile(acceptedFiles[0]);
        setExtractedText('');
        setError(null);
    }, []);

    const handleExtract = async () => {
        if (!file) {
            setError('Please upload an image file.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setExtractedText('');

        try {
            const base64Data = await fileToBase64(file);
            const textFromImage = await extractTextFromImage(base64Data, file.type, language, promptHint);
            setExtractedText(textFromImage);
        } catch (e: any) {
            console.error(e);
            setError(`An error occurred: ${e.message}. The API key might be missing or invalid.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ToolContainer>
            {isLoading ? (
                <Spinner message="Extracting text from image..." />
            ) : (
                <>
                    <FileDropzone
                        onFilesAccepted={handleFileAccepted}
                        accept="image/jpeg, image/png"
                        multiple={false}
                        title="Select an Image to Extract Text"
                    />
                    {error && <p className="text-red-500 dark:text-red-400 mt-4 text-center">{error}</p>}
                    {file && !extractedText && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">Selected File:</h3>
                            <ul className="mb-4">
                                <FileListItem file={file} onRemove={() => setFile(null)} />
                            </ul>
                            <OcrSettings 
                                language={language}
                                onLanguageChange={setLanguage}
                                promptHint={promptHint}
                                onPromptHintChange={setPromptHint}
                            />
                            <button
                                onClick={handleExtract}
                                className="mt-6 w-full flex items-center justify-center bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                <FileScan className="mr-2" size={20} />
                                Extract Text with AI
                            </button>
                        </div>
                    )}
                    {extractedText && (
                         <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-4 text-center">Extracted Text</h3>
                            <textarea
                                readOnly
                                value={extractedText}
                                className="w-full h-96 p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-slate-900 dark:text-gray-300 dark:border-slate-700 font-mono text-sm"
                            />
                            <button
                                onClick={() => { setFile(null); setExtractedText(''); }}
                                className="mt-4 w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                Process Another File
                            </button>
                        </div>
                    )}
                </>
            )}
        </ToolContainer>
    );
};