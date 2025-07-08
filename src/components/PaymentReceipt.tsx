
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, Share2 } from 'lucide-react';
import { PaymentData, CompanyLogo } from '@/types/payment';
import { generateEnhancedPDF, downloadEnhancedPDF } from '@/utils/enhancedPdfGenerator';

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
      minute: '2-digit',
      second: '2-digit'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'Pendente':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'Rejeitado':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
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
    <div className="space-y-4">
      <div className="flex gap-2 mb-4 print-hidden">
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

      <Card id="receipt-content" className="max-w-2xl mx-auto border-2 border-gray-200 shadow-lg">
        <CardContent className="p-0">
          {/* Cabeçalho com gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 text-center">
            {logo && (
              <div className="mb-4">
                <img 
                  src={logo.url} 
                  alt="Logo da empresa" 
                  className="max-h-16 mx-auto object-contain bg-white rounded px-2 py-1"
                />
              </div>
            )}
            <h1 className="text-2xl font-bold mb-2">COMPROVANTE DE PAGAMENTO</h1>
            <p className="text-blue-100 text-lg">Transação {data.tipo}</p>
          </div>

          <div className="p-8 space-y-6">
            {/* Status e Valor */}
            <div className="text-center py-4">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(data.status)}`}>
                ✓ {data.status}
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 font-medium">Valor da Transação</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{formatCurrency(data.valor)}</p>
              </div>
            </div>

            {/* Informações da Transação */}
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="font-bold text-gray-800 text-lg mb-4">📋 Dados da Transação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">ID:</span>
                  <span className="font-mono font-bold text-blue-600">{data.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Data/Hora:</span>
                  <span className="font-medium">{formatDateTime(data.dataHora)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Tipo:</span>
                  <span className="font-bold text-blue-600">{data.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Protocolo:</span>
                  <span className="font-mono text-xs">{data.transacao.numeroProtocolo}</span>
                </div>
                <div className="col-span-full flex justify-between">
                  <span className="text-gray-600 font-medium">Autenticação:</span>
                  <span className="font-mono text-xs">{data.transacao.numeroAutenticacao}</span>
                </div>
              </div>
              {data.transacao.descricao && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-600 font-medium mb-1">Descrição:</p>
                  <p className="text-sm text-gray-800">{data.transacao.descricao}</p>
                </div>
              )}
            </div>

            {/* Dados do Pagador */}
            <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
              <h3 className="font-bold text-gray-800 text-lg mb-4">👤 Pagador</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 font-medium">Nome:</p>
                  <p className="font-bold text-gray-900">{data.pagador.nome}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">CPF/CNPJ:</p>
                  <p className="font-mono font-bold">{formatCpfCnpj(data.pagador.cpfCnpj)}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Banco:</p>
                  <p className="font-medium">{data.pagador.banco}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Agência/Conta:</p>
                  <p className="font-mono font-bold">{data.pagador.agencia}/{data.pagador.conta}</p>
                </div>
              </div>
            </div>

            {/* Dados do Beneficiário */}
            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="font-bold text-gray-800 text-lg mb-4">🏢 Beneficiário</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 font-medium">Nome:</p>
                  <p className="font-bold text-gray-900">{data.beneficiario.nome}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">CPF/CNPJ:</p>
                  <p className="font-mono font-bold">{formatCpfCnpj(data.beneficiario.cpfCnpj)}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Banco:</p>
                  <p className="font-medium">{data.beneficiario.banco}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Agência/Conta:</p>
                  <p className="font-mono font-bold">{data.beneficiario.agencia}/{data.beneficiario.conta}</p>
                </div>
                {data.beneficiario.chavePix && (
                  <div className="col-span-2">
                    <p className="text-gray-600 font-medium">Chave PIX:</p>
                    <p className="font-mono font-bold text-green-600">{data.beneficiario.chavePix}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Informações de Segurança */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-center text-xs text-yellow-800 font-medium">
                🔒 Este comprovante foi gerado eletronicamente e possui validade jurídica
              </p>
            </div>

            {/* Rodapé */}
            <div className="border-t pt-6 text-center text-xs text-gray-500 bg-gray-50 -mx-8 px-8 py-4">
              <p className="font-medium">Documento gerado em {formatDateTime(new Date())}</p>
              <p className="mt-1">Sistema de Comprovantes - Tecnologia segura e confiável</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
