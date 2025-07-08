import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, Share2 } from 'lucide-react';
import { PaymentData, CompanyLogo } from '@/types/payment';
import { generateEnhancedPDF, downloadEnhancedPDF } from '@/utils/pdf';

interface PaymentReceiptProps {
  data: PaymentData;
  logo?: CompanyLogo | null;
  onDownloadPDF: () => void;
  onPrint: () => void;
}

export const PaymentReceipt: React.FC<PaymentReceiptProps> = ({ 
  data, 
  logo, 
  onDownloadPDF, 
  onPrint 
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCpfCnpj = (doc: string) => {
    if (doc.length === 11) {
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (doc.length === 14) {
      return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return doc;
  };

  const handleEnhancedDownload = () => {
    const receiptElement = document.getElementById('receipt-content');
    if (receiptElement) {
      downloadEnhancedPDF(receiptElement, `comprovante-${data.id}.pdf`);
    }
  };

  const handleEnhancedPrint = () => {
    const receiptElement = document.getElementById('receipt-content');
    if (receiptElement) {
      generateEnhancedPDF(receiptElement, `comprovante-${data.id}.pdf`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-6 print-hidden">
        <Button onClick={handleEnhancedDownload} variant="default" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Baixar PDF
        </Button>
        <Button onClick={handleEnhancedPrint} variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar
        </Button>
      </div>

      <Card id="receipt-content" className="max-w-2xl mx-auto border shadow-sm">
        <CardContent className="p-8">
          {/* Cabeçalho simples */}
          <div className="text-center mb-8">
            {logo && (
              <div className="mb-6">
                <img 
                  src={logo.url} 
                  alt="Logo da empresa" 
                  className="max-h-12 mx-auto object-contain"
                />
              </div>
            )}
            <h1 className="text-xl font-semibold text-foreground mb-2">Comprovante de Pagamento</h1>
            <p className="text-sm text-muted-foreground">{data.tipo}</p>
          </div>

          {/* Valor e Status */}
          <div className="text-center mb-8 pb-6 border-b">
            <div className="mb-3">
              <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                {data.status}
              </span>
            </div>
            <div className="text-3xl font-bold text-foreground">{formatCurrency(data.valor)}</div>
            <div className="text-sm text-muted-foreground mt-1">{formatDateTime(data.dataHora)}</div>
          </div>

          {/* Detalhes em grid simples */}
          <div className="space-y-6">
            {/* Transação */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Detalhes da Transação</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-mono">{data.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">EndToEnd</span>
                  <span className="font-mono text-xs">{data.transacao.endToEnd}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Autenticação</span>
                  <span className="font-mono text-xs">{data.transacao.numeroAutenticacao}</span>
                </div>
                {data.transacao.descricao && (
                  <div className="pt-2">
                    <span className="text-muted-foreground block mb-1">Descrição</span>
                    <span className="text-sm">{data.transacao.descricao}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pagador */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-foreground mb-3">Pagador</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nome</span>
                  <span className="font-medium">{data.pagador.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPF/CNPJ</span>
                  <span className="font-mono">{formatCpfCnpj(data.pagador.cpfCnpj)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Banco</span>
                  <span>{data.pagador.banco}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conta</span>
                  <span className="font-mono">{data.pagador.agencia}/{data.pagador.conta}</span>
                </div>
              </div>
            </div>

            {/* Beneficiário */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-foreground mb-3">Beneficiário</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nome</span>
                  <span className="font-medium">{data.beneficiario.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPF/CNPJ</span>
                  <span className="font-mono">{formatCpfCnpj(data.beneficiario.cpfCnpj)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Banco</span>
                  <span>{data.beneficiario.banco}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conta</span>
                  <span className="font-mono">{data.beneficiario.agencia}/{data.beneficiario.conta}</span>
                </div>
                {data.beneficiario.chavePix && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chave PIX</span>
                    <span className="font-mono text-green-600">{data.beneficiario.chavePix}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rodapé minimalista */}
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Documento gerado em {formatDateTime(new Date())}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
