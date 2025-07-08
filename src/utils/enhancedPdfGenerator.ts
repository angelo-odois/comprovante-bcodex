
export const generateEnhancedPDF = (receiptElement: HTMLElement, fileName: string = 'comprovante-pagamento.pdf') => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const styles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        margin: 0;
        padding: 20px;
        background: white;
        color: #1f2937;
        line-height: 1.5;
      }
      
      .receipt-container {
        max-width: 800px;
        margin: 0 auto;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }
      
      .receipt-header {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        padding: 24px;
        text-align: center;
      }
      
      .receipt-title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 8px;
        letter-spacing: 0.5px;
      }
      
      .receipt-subtitle {
        font-size: 14px;
        opacity: 0.9;
      }
      
      .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        margin: 16px 0;
      }
      
      .status-approved {
        background: #d1fae5;
        color: #065f46;
        border: 1px solid #a7f3d0;
      }
      
      .value-display {
        font-size: 28px;
        font-weight: 700;
        color: #1f2937;
        margin: 16px 0;
      }
      
      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        padding: 24px;
      }
      
      .info-section {
        background: #f9fafb;
        border-radius: 8px;
        padding: 20px;
        border-left: 4px solid #3b82f6;
      }
      
      .info-section h3 {
        font-size: 16px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        padding: 4px 0;
      }
      
      .info-label {
        font-size: 14px;
        color: #6b7280;
        font-weight: 500;
      }
      
      .info-value {
        font-size: 14px;
        color: #1f2937;
        font-weight: 600;
        font-family: 'Courier New', monospace;
      }
      
      .receipt-footer {
        background: #f9fafb;
        padding: 20px;
        text-align: center;
        border-top: 1px solid #e5e7eb;
      }
      
      .footer-text {
        font-size: 12px;
        color: #6b7280;
        line-height: 1.6;
      }
      
      .security-info {
        background: #fef3c7;
        border: 1px solid #f59e0b;
        border-radius: 6px;
        padding: 12px;
        margin: 16px 0;
      }
      
      .security-text {
        font-size: 12px;
        color: #92400e;
        text-align: center;
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
          max-width: none;
        }
        
        button, .print-hidden {
          display: none !important;
        }
        
        .receipt-header {
          background: #3b82f6 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .status-approved {
          background: #d1fae5 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .info-section {
          background: #f9fafb !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .security-info {
          background: #fef3c7 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    </style>
  `;

  // Criar conteúdo estruturado para o PDF
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
        <div class="receipt-container">
          ${receiptHTML}
        </div>
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

export const downloadEnhancedPDF = async (receiptElement: HTMLElement, fileName: string = 'comprovante-pagamento.pdf') => {
  try {
    // Criar versão para download com estilos inline
    const receiptHTML = receiptElement.innerHTML;
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Comprovante de Pagamento</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              background: white;
              color: #333;
            }
            .print-hidden { display: none !important; }
            button { display: none !important; }
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${receiptHTML}
          </div>
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
