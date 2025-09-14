import React, { useState, useCallback } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { FileDropzone } from '../components/FileDropzone';
import { Spinner } from '../components/Spinner';
import { ToolContainer } from '../components/ToolContainer';
import { PasswordProtection } from '../components/PasswordProtection';
import { Droplets, Download } from 'lucide-react';
import { FileListItem } from '../components/FileListItem';

type WatermarkType = 'text' | 'image';

export const Watermarker: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
    const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
    const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
    const [opacity, setOpacity] = useState(0.2);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState<string | undefined>();

    const handlePdfAccepted = useCallback((files: File[]) => setPdfFile(files[0]), []);
    const handleWatermarkImageAccepted = useCallback((files: File[]) => setWatermarkFile(files[0]), []);

    const applyWatermark = async () => {
        if (!pdfFile) {
            setError('Please upload a PDF file.');
            return;
        }
        if (watermarkType === 'image' && !watermarkFile) {
            setError('Please upload a watermark image.');
            return;
        }
        if (watermarkType === 'text' && !watermarkText) {
            setError('Please enter watermark text.');
            return;
        }
        
        setIsLoading(true);
        setError(null);

        try {
            const pdfBytes = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();
            
            let watermarkImageBytes: Uint8Array | null = null;
            if (watermarkType === 'image' && watermarkFile) {
                watermarkImageBytes = new Uint8Array(await watermarkFile.arrayBuffer());
            }

            for (const page of pages) {
                const { width, height } = page.getSize();
                if (watermarkType === 'text') {
                    page.drawText(watermarkText, {
                        x: width / 2 - 150,
                        y: height / 2,
                        size: 50,
                        color: rgb(0.5, 0.5, 0.5),
                        opacity: opacity,
                        rotate: degrees(45),
                    });
                } else if (watermarkImageBytes) {
                    let watermarkImage;
                    if (watermarkFile?.type === 'image/png') {
                        watermarkImage = await pdfDoc.embedPng(watermarkImageBytes);
                    } else if (watermarkFile?.type === 'image/jpeg') {
                        watermarkImage = await pdfDoc.embedJpg(watermarkImageBytes);
                    } else {
                        throw new Error('Unsupported watermark image type.');
                    }
                    const scaled = watermarkImage.scale(0.5);
                    page.drawImage(watermarkImage, {
                        x: width / 2 - scaled.width / 2,
                        y: height / 2 - scaled.height / 2,
                        width: scaled.width,
                        height: scaled.height,
                        opacity: opacity,
                    });
                }
            }

            // FIX: pdf-lib encrypts the document using the encrypt() method before saving.
            if (password) {
                await pdfDoc.encrypt({ userPassword: password });
            }
            const watermarkedPdfBytes = await pdfDoc.save();

            const blob = new Blob([watermarkedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'watermarked.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            setPdfFile(null);
            setWatermarkFile(null);

        } catch (e: any) {
            console.error(e);
            setError(`Error: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ToolContainer>
            {isLoading ? (
                <Spinner message="Applying watermark..." />
            ) : (
                <>
                    {!pdfFile ? (
                        <FileDropzone
                            onFilesAccepted={handlePdfAccepted}
                            accept="application/pdf"
                            multiple={false}
                            title="Select PDF to Watermark"
                        />
                     ) : (
                        <div className="p-4 border rounded-lg dark:border-slate-600">
                             <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">Selected PDF:</h3>
                             <FileListItem file={pdfFile} onRemove={() => setPdfFile(null)} />
                        </div>
                     )}
                    
                    {pdfFile && (
                        <div className="mt-6">
                            <div className="flex justify-center space-x-4 mb-4">
                                <button onClick={() => setWatermarkType('text')} className={`px-4 py-2 rounded ${watermarkType === 'text' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-slate-600 dark:text-gray-200'}`}>Text</button>
                                <button onClick={() => setWatermarkType('image')} className={`px-4 py-2 rounded ${watermarkType === 'image' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-slate-600 dark:text-gray-200'}`}>Image</button>
                            </div>
                            
                            {watermarkType === 'text' ? (
                                <input
                                    type="text"
                                    value={watermarkText}
                                    onChange={e => setWatermarkText(e.target.value)}
                                    placeholder="Watermark Text"
                                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200"
                                />
                            ) : (
                                <>
                                    {!watermarkFile ? (
                                        <FileDropzone
                                            onFilesAccepted={handleWatermarkImageAccepted}
                                            accept="image/png, image/jpeg"
                                            multiple={false}
                                            title="Select Watermark Image"
                                        />
                                     ) : (
                                        <div className="p-4 border rounded-lg dark:border-slate-600">
                                            <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">Selected Watermark Image:</h3>
                                            <FileListItem file={watermarkFile} onRemove={() => setWatermarkFile(null)} />
                                        </div>
                                     )}
                                </>
                            )}
                            
                            <div className="my-4">
                                <label className="block dark:text-gray-300">Opacity: {opacity}</label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1"
                                    step="0.1"
                                    value={opacity}
                                    onChange={e => setOpacity(parseFloat(e.target.value))}
                                    className="w-full accent-primary-600"
                                />
                            </div>
                            
                            <PasswordProtection onPasswordChange={setPassword} />

                            <button
                                onClick={applyWatermark}
                                className="mt-6 w-full flex items-center justify-center bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                <Droplets className="mr-2" size={20} />
                                Apply Watermark & Download
                            </button>
                        </div>
                    )}
                    {error && <p className="text-red-500 dark:text-red-400 mt-4 text-center">{error}</p>}
                </>
            )}
        </ToolContainer>
    );
};