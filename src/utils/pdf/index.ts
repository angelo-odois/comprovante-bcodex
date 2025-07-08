
import { printPdf } from './pdfPrint';
import { downloadPdf } from './pdfDownload';

export const generateEnhancedPDF = (receiptElement: HTMLElement, fileName: string = 'comprovante-pagamento.pdf') => {
  printPdf(receiptElement, fileName);
};

export const downloadEnhancedPDF = async (receiptElement: HTMLElement, fileName: string = 'comprovante-pagamento.pdf') => {
  await downloadPdf(receiptElement, fileName);
};

// Re-export utilities for flexibility
export { printPdf, downloadPdf };
