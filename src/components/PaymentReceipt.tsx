
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, Share2 } from 'lucide-react';
import { PaymentData, CompanyLogo } from '@/types/payment';

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
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Pendente':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Rejeitado':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button onClick={onDownloadPDF} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Baixar PDF
        </Button>
        <Button onClick={onPrint} variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar
        </Button>
      </div>

      <Card id="receipt-content" className="max-w-2xl mx-auto">
        <CardContent className="p-8 space-y-6">
          {/* Cabeçalho com Logo */}
          <div className="text-center border-b pb-6">
            {logo && (
              <div className="mb-4">
                <img 
                  src={logo.url} 
                  alt="Logo da empresa" 
                  className="max-h-16 mx-auto object-contain"
                />
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-800">COMPROVANTE DE PAGAMENTO</h1>
            <p className="text-gray-600 mt-2">Transação {data.tipo}</p>
          </div>

          {/* Status e Valor */}
          <div className="text-center py-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(data.status)}`}>
              {data.status}
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Valor da Transação</p>
              <p className="text-3xl font-bold text-gray-800">{formatCurrency(data.valor)}</p>
            </div>
          </div>

          {/* Dados da Transação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Dados da Transação</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-mono">{data.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data/Hora:</span>
                  <span>{formatDateTime(data.dataHora)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span>{data.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Protocolo:</span>
                  <span className="font-mono">{data.transacao.numeroProtocolo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Autenticação:</span>
                  <span className="font-mono">{data.transacao.numeroAutenticacao}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Descrição</h3>
              <p className="text-sm text-gray-700">{data.transacao.descricao || 'Não informado'}</p>
            </div>
          </div>

          {/* Dados do Pagador */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">Pagador</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Nome:</p>
                <p className="font-medium">{data.pagador.nome}</p>
              </div>
              <div>
                <p className="text-gray-600">CPF/CNPJ:</p>
                <p className="font-medium font-mono">{formatCpfCnpj(data.pagador.cpfCnpj)}</p>
              </div>
              <div>
                <p className="text-gray-600">Banco:</p>
                <p className="font-medium">{data.pagador.banco}</p>
              </div>
              <div>
                <p className="text-gray-600">Agência/Conta:</p>
                <p className="font-medium font-mono">{data.pagador.agencia}/{data.pagador.conta}</p>
              </div>
            </div>
          </div>

          {/* Dados do Beneficiário */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">Beneficiário</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Nome:</p>
                <p className="font-medium">{data.beneficiario.nome}</p>
              </div>
              <div>
                <p className="text-gray-600">CPF/CNPJ:</p>
                <p className="font-medium font-mono">{formatCpfCnpj(data.beneficiario.cpfCnpj)}</p>
              </div>
              <div>
                <p className="text-gray-600">Banco:</p>
                <p className="font-medium">{data.beneficiario.banco}</p>
              </div>
              <div>
                <p className="text-gray-600">Agência/Conta:</p>
                <p className="font-medium font-mono">{data.beneficiario.agencia}/{data.beneficiario.conta}</p>
              </div>
              {data.beneficiario.chavePix && (
                <div className="col-span-2">
                  <p className="text-gray-600">Chave PIX:</p>
                  <p className="font-medium font-mono">{data.beneficiario.chavePix}</p>
                </div>
              )}
            </div>
          </div>

          {/* Rodapé */}
          <div className="border-t pt-6 text-center text-xs text-gray-500">
            <p>Este comprovante foi gerado eletronicamente e possui validade jurídica.</p>
            <p className="mt-1">Documento gerado em {formatDateTime(new Date())}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
