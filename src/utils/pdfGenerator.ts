
export const generatePDF = (receiptElement: HTMLElement, fileName: string = 'comprovante-pagamento.pdf') => {
  // Para uma implementação completa com PDF, seria necessário usar uma biblioteca como jsPDF ou html2pdf
  // Por enquanto, vamos implementar uma versão simplificada usando print
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const styles = `
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background: white;
      }
      
      .receipt-container {
        max-width: 800px;
        margin: 0 auto;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }
      
      @media print {
        body {
          background: white;
          padding: 0;
        }
        
        .receipt-container {
          border: none;
          border-radius: 0;
          box-shadow: none;
        }
        
        button {
          display: none !important;
        }
      }
      
      .print-hidden {
        display: none !important;
      }
    </style>
  `;

  const receiptHTML = receiptElement.innerHTML;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${fileName}</title>
        ${styles}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div class="receipt-container">
          ${receiptHTML}
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 1000);
          }
        </script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
};

export const downloadPDF = async (receiptElement: HTMLElement, fileName: string = 'comprovante-pagamento.pdf') => {
  // Esta é uma implementação simplificada
  // Para uma versão completa, instale: npm install html2canvas jspdf
  
  try {
    // Simula download criando um blob com o HTML
    const receiptHTML = receiptElement.innerHTML;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comprovante de Pagamento</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .print-hidden { display: none !important; }
            button { display: none !important; }
          </style>
        </head>
        <body>
          ${receiptHTML}
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace('.pdf', '.html');
    link.click();
    
    URL.revokeObjectURL(url);
    
    console.log('Para gerar PDF real, instale as dependências: npm install html2canvas jspdf');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
  }
};
