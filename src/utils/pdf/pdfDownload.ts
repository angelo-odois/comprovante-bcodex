
import { getDownloadStyles } from './pdfStyles';

export const downloadPdf = async (receiptElement: HTMLElement, fileName: string = 'comprovante-pagamento.pdf') => {
  try {
    const receiptHTML = receiptElement.innerHTML;
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Comprovante de Pagamento</title>
          <style>
            ${getDownloadStyles()}
          </style>
        </head>
        <body>
          ${receiptHTML}
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace('.pdf', '.html');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    console.log('Comprovante baixado com sucesso!');
    console.log('Para gerar PDF real, considere instalar: npm install html2canvas jspdf');
  } catch (error) {
    console.error('Erro ao baixar comprovante:', error);
  }
};
