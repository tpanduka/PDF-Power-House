import React, { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import JSZip from 'jszip';
import { FileDropzone } from '../components/FileDropzone';
import { Spinner } from '../components/Spinner';
import { ToolContainer } from '../components/ToolContainer';
import { Image, Download } from 'lucide-react';
import { FileListItem } from '../components/FileListItem';

// Setup worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const PdfToImage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleFileAccepted = useCallback((acceptedFiles: File[]) => {
        setFile(acceptedFiles[0]);
        setError(null);
    }, []);

    const handleConvert = async () => {
        if (!file) {
            setError('Please upload a PDF file.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setProgress(0);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            const numPages = pdf.numPages;
            const zip = new JSZip();

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (!context) {
                    throw new Error('Could not get canvas context');
                }

                await page.render({ canvasContext: context, viewport: viewport }).promise;
                
                const imageData = canvas.toDataURL('image/jpeg', 0.9);
                const base64Data = imageData.split(',')[1];
                zip.file(`page_${i}.jpg`, base64Data, { base64: true });
                setProgress(Math.round((i / numPages) * 100));
            }
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'pdf_images.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setFile(null);

        } catch (e) {
            console.error(e);
            setError('An error occurred during conversion. The PDF may be corrupted or password protected.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ToolContainer>
            {isLoading ? (
                <div>
                     <Spinner message="Converting PDF to images..." />
                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
                        <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-center mt-2 dark:text-gray-300">{progress}% complete</p>
                </div>
            ) : (
                <>
                    <FileDropzone
                        onFilesAccepted={handleFileAccepted}
                        accept="application/pdf"
                        multiple={false}
                        title="Select a PDF to Convert to Images"
                    />
                    {error && <p className="text-red-500 dark:text-red-400 mt-4 text-center">{error}</p>}
                    {file && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">Selected File:</h3>
                            <ul className="mb-4">
                                <FileListItem file={file} onRemove={() => setFile(null)} />
                            </ul>
                            <button
                                onClick={handleConvert}
                                className="mt-6 w-full flex items-center justify-center bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                <Image className="mr-2" size={20} />
                                Convert to Images
                            </button>
                        </div>
                    )}
                </>
            )}
        </ToolContainer>
    );
};
