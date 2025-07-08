
import { getPdfStyles } from './pdfStyles';

export const printPdf = (receiptElement: HTMLElement, fileName: string = 'comprovante-pagamento.pdf') => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const styles = getPdfStyles();
  const receiptHTML = receiptElement.innerHTML;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${fileName}</title>
        ${styles}
      </head>
      <body>
        ${receiptHTML}
        <script>
          window.onload = function() {
            // Aguardar carregamento completo antes de imprimir
            setTimeout(() => {
              window.print();
              setTimeout(() => window.close(), 1000);
            }, 500);
          }
        </script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
};
