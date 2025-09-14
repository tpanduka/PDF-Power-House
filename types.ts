export interface Tool {
  id: 'merge' | 'split' | 'extract-text' | 'image-to-pdf' | 'pdf-to-image' | 'watermark' | 'image-extract-text';
  title: string;
  description: string;
  Icon: React.ElementType;
}