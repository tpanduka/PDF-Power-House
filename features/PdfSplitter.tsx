import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { FileDropzone } from '../components/FileDropzone';
import { Spinner } from '../components/Spinner';
import { ToolContainer } from '../components/ToolContainer';
import { PasswordProtection } from '../components/PasswordProtection';
import { Split } from 'lucide-react';
import { FileListItem } from '../components/FileListItem';

export const PdfSplitter: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [pageRanges, setPageRanges] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState<string | undefined>();

    const handleFileAccepted = useCallback((acceptedFiles: File[]) => {
        setFile(acceptedFiles[0]);
        setPageRanges('');
        setError(null);
    }, []);

    const parsePageRanges = (rangeStr: string, maxPages: number): number[][] => {
        const ranges: number[][] = [];
        const parts = rangeStr.split(',').map(p => p.trim());

        for (const part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                if (!isNaN(start) && !isNaN(end) && start <= end && start > 0 && end <= maxPages) {
                    const range = [];
                    for (let i = start; i <= end; i++) {
                        range.push(i - 1); // 0-indexed
                    }
                    ranges.push(range);
                } else {
                    throw new Error(`Invalid range: ${part}`);
                }
            } else {
                const pageNum = Number(part);
                if (!isNaN(pageNum) && pageNum > 0 && pageNum <= maxPages) {
                    ranges.push([pageNum - 1]); // 0-indexed
                } else {
                    throw new Error(`Invalid page number: ${part}`);
                }
            }
        }
        return ranges;
    };

    const handleSplit = async () => {
        if (!file || !pageRanges) {
            setError('Please upload a PDF and specify page ranges.');
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const totalPages = pdfDoc.getPageCount();

            const parsedRanges = parsePageRanges(pageRanges, totalPages);
            if (parsedRanges.length === 0) {
                throw new Error("No valid pages or ranges specified.");
            }

            const zip = new JSZip();

            for (let i = 0; i < parsedRanges.length; i++) {
                const newPdf = await PDFDocument.create();
                const copiedPages = await newPdf.copyPages(pdfDoc, parsedRanges[i]);
                copiedPages.forEach(page => newPdf.addPage(page));

                // FIX: pdf-lib encrypts the document using the encrypt() method before saving.
                if (password) {
                    await newPdf.encrypt({ userPassword: password });
                }
                const newPdfBytes = await newPdf.save();
                zip.file(`split_part_${i + 1}.pdf`, newPdfBytes);
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'split_pdfs.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setFile(null);
            setPageRanges('');

        } catch (e: any) {
            console.error(e);
            setError(`Error: ${e.message}. Please check your page ranges.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ToolContainer>
            {isLoading ? (
                <Spinner message="Splitting PDF..." />
            ) : (
                <>
                    <FileDropzone
                        onFilesAccepted={handleFileAccepted}
                        accept="application/pdf"
                        multiple={false}
                        title="Select a PDF to Split"
                    />
                    {error && <p className="text-red-500 dark:text-red-400 mt-4 text-center">{error}</p>}
                    {file && (
                        <div className="mt-6">
                             <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">Selected File:</h3>
                            <ul className="mb-4">
                                <FileListItem file={file} onRemove={() => { setFile(null); setPageRanges(''); }} />
                            </ul>
                            <input
                                type="text"
                                value={pageRanges}
                                onChange={(e) => setPageRanges(e.target.value)}
                                placeholder="e.g., 1-3, 5, 8-10"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200 dark:placeholder-gray-400"
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Enter page numbers or ranges to extract, separated by commas. Each range will be a separate PDF.</p>
                            <PasswordProtection onPasswordChange={setPassword} />
                            <button
                                onClick={handleSplit}
                                disabled={!pageRanges}
                                className="mt-6 w-full flex items-center justify-center bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600"
                            >
                                <Split className="mr-2" size={20} />
                                Split PDF
                            </button>
                        </div>
                    )}
                </>
            )}
        </ToolContainer>
    );
};