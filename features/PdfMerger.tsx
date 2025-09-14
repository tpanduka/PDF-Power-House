import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileDropzone } from '../components/FileDropzone';
import { Spinner } from '../components/Spinner';
import { ToolContainer } from '../components/ToolContainer';
import { PasswordProtection } from '../components/PasswordProtection';
import { Download, Merge } from 'lucide-react';
import { FileListItem } from '../components/FileListItem';

export const PdfMerger: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState<string | undefined>();

    const handleFilesAccepted = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
        setError(null);
    }, []);

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const moveFile = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= files.length) return;
        const newFiles = [...files];
        const [movedItem] = newFiles.splice(fromIndex, 1);
        newFiles.splice(toIndex, 0, movedItem);
        setFiles(newFiles);
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            setError('Please upload at least two PDF files to merge.');
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const mergedPdf = await PDFDocument.create();
            for (const file of files) {
                const pdfBytes = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                copiedPages.forEach(page => mergedPdf.addPage(page));
            }

            // FIX: pdf-lib encrypts the document using the encrypt() method before saving.
            if (password) {
                await mergedPdf.encrypt({ userPassword: password });
            }
            const mergedPdfBytes = await mergedPdf.save();

            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'merged.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setFiles([]);
        } catch (e) {
            console.error(e);
            setError('An error occurred while merging the PDFs. Please ensure all files are valid PDFs.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ToolContainer>
            {isLoading ? (
                <Spinner message="Merging PDFs..." />
            ) : (
                <>
                    <FileDropzone
                        onFilesAccepted={handleFilesAccepted}
                        accept="application/pdf"
                        multiple
                        title="Select PDFs to Merge"
                    />
                    {error && <p className="text-red-500 dark:text-red-400 mt-4 text-center">{error}</p>}
                    {files.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">Files to Merge (in order):</h3>
                            <ul className="space-y-2">
                                {files.map((file, index) => (
                                    <FileListItem
                                        key={index}
                                        file={file}
                                        onRemove={() => removeFile(index)}
                                        onMoveUp={() => moveFile(index, index - 1)}
                                        onMoveDown={() => moveFile(index, index + 1)}
                                        isFirst={index === 0}
                                        isLast={index === files.length - 1}
                                    />
                                ))}
                            </ul>
                            <PasswordProtection onPasswordChange={setPassword} />
                            <button
                                onClick={handleMerge}
                                disabled={files.length < 2}
                                className="mt-6 w-full flex items-center justify-center bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600"
                            >
                                <Merge className="mr-2" size={20} />
                                Merge PDFs
                            </button>
                        </div>
                    )}
                </>
            )}
        </ToolContainer>
    );
};