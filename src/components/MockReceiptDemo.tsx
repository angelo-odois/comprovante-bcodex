import React from 'react';
import { PaymentReceipt } from './PaymentReceipt';
import { PaymentData, CompanyLogo } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { generatePDF, downloadPDF } from '@/utils/pdfGenerator';

export const MockReceiptDemo: React.FC = () => {
  // Dados mockados para demonstração
  const mockPaymentData: PaymentData = {
    id: 'TXN001234567',
    tipo: 'PIX',
    valor: 1250.50,
    dataHora: new Date(),
    status: 'Aprovado',
    pagador: {
      nome: 'João Silva Santos',
      cpfCnpj: '12345678901',
      banco: '341 - Itaú Unibanco S.A.',
      agencia: '1234',
      conta: '56789-0'
    },
    beneficiario: {
      nome: 'Maria Oliveira Ltda',
      cpfCnpj: '98765432000198',
      banco: '237 - Banco Bradesco S.A.',
      agencia: '9876',
      conta: '54321-8',
      chavePix: 'maria.oliveira@empresa.com.br'
    },
    transacao: {
      numeroAutenticacao: 'AUTH789123456789',
      endToEnd: 'E12345678202412345678901234567890',
      descricao: 'Pagamento de serviços prestados - Ref: NF 001234'
    }
  };

  // Logo mockada para demonstração
  const mockLogo: CompanyLogo = {
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMjU2M2ViIi8+Cjx0ZXh0IHg9IjUwIiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9nbyBFeGVtcGxvPC90ZXh0Pgo8L3N2Zz4=',
    name: 'logo-exemplo.svg'
  };

  const handleDownloadPDF = () => {
    const receiptElement = document.getElementById('mock-receipt-content');
    if (receiptElement) {
      downloadPDF(receiptElement, `comprovante-mock-${mockPaymentData.id}.pdf`);
    }
  };

  const handlePrint = () => {
    const receiptElement = document.getElementById('mock-receipt-content');
    if (receiptElement) {
      generatePDF(receiptElement, `comprovante-mock-${mockPaymentData.id}.pdf`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Modelo de Comprovante - Demonstração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Este é um exemplo de como o comprovante ficará com dados reais. 
            Utilize os botões abaixo para testar a impressão e download do PDF.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleDownloadPDF} variant="default">
              Baixar PDF de Exemplo
            </Button>
            <Button onClick={handlePrint} variant="outline">
              Imprimir Exemplo
            </Button>
          </div>
        </CardContent>
      </Card>

      <div id="mock-receipt-content">
        <PaymentReceipt
          data={mockPaymentData}
          logo={mockLogo}
          onDownloadPDF={handleDownloadPDF}
          onPrint={handlePrint}
        />
      </div>
    </div>
  );
};
