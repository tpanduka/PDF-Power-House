import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileDropzone } from '../components/FileDropzone';
import { Spinner } from '../components/Spinner';
import { ToolContainer } from '../components/ToolContainer';
import { PasswordProtection } from '../components/PasswordProtection';
import { Download } from 'lucide-react';
import { FileListItem } from '../components/FileListItem';

export const ImageToPdf: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState<string | undefined>();

    const handleFilesAccepted = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
        setError(null);
    }, []);

    const removeFile = (indexToRemove: number) => {
        setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleConvert = async () => {
        if (files.length === 0) {
            setError('Please upload at least one image.');
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const pdfDoc = await PDFDocument.create();

            for (const file of files) {
                const imageBytes = await file.arrayBuffer();
                let image;
                if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                    image = await pdfDoc.embedJpg(imageBytes);
                } else if (file.type === 'image/png') {
                    image = await pdfDoc.embedPng(imageBytes);
                } else {
                    console.warn(`Skipping unsupported file type: ${file.type}`);
                    continue;
                }

                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });
            }

            // FIX: pdf-lib encrypts the document using the encrypt() method before saving.
            if (password) {
                await pdfDoc.encrypt({ userPassword: password });
            }
            const pdfBytes = await pdfDoc.save();

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setFiles([]);

        } catch (e) {
            console.error(e);
            setError('An error occurred during conversion. Please ensure all files are valid images.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ToolContainer>
            {isLoading ? (
                <Spinner message="Converting images to PDF..." />
            ) : (
                <>
                    <FileDropzone
                        onFilesAccepted={handleFilesAccepted}
                        accept="image/jpeg, image/png"
                        multiple
                        title="Select Images to Convert"
                    />
                    {error && <p className="text-red-500 dark:text-red-400 mt-4 text-center">{error}</p>}
                    {files.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">Selected Images:</h3>
                             <ul className="space-y-2">
                                {files.map((file, index) => (
                                    <FileListItem
                                        key={index}
                                        file={file}
                                        onRemove={() => removeFile(index)}
                                    />
                                ))}
                            </ul>
                            <PasswordProtection onPasswordChange={setPassword} />
                            <button
                                onClick={handleConvert}
                                className="mt-6 w-full flex items-center justify-center bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                <Download className="mr-2" size={20} />
                                Convert and Download PDF
                            </button>
                        </div>
                    )}
                </>
            )}
        </ToolContainer>
    );
};