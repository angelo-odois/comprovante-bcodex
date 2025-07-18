
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Download, Trash2, Eye } from 'lucide-react';
import { useReceipts } from '@/hooks/useReceipts';

export default function History() {
  const { receipts, loading, deleteReceipt } = useReceipts();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateTime = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Histórico de Comprovantes</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Histórico de Comprovantes</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todos os seus comprovantes gerados
        </p>
      </div>

      {receipts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Nenhum comprovante encontrado
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Você ainda não gerou nenhum comprovante. Vá para a página "Novo Comprovante" para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {receipts.map((receipt) => (
            <Card key={receipt.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {receipt.beneficiary_name || 'Comprovante de Pagamento'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      ID: {receipt.id}
                    </p>
                  </div>
                  <Badge className={getStatusColor(receipt.status)}>
                    {receipt.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor</p>
                    <p className="text-lg font-bold">{formatCurrency(receipt.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                    <p className="font-medium">{receipt.payment_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data</p>
                    <p className="font-medium">{formatDateTime(receipt.payment_date)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pagador</p>
                    <p className="font-medium">{receipt.payer_name}</p>
                    <p className="text-sm text-muted-foreground">{receipt.payer_bank}</p>
                  </div>
                  {receipt.beneficiary_name && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Beneficiário</p>
                      <p className="font-medium">{receipt.beneficiary_name}</p>
                      <p className="text-sm text-muted-foreground">{receipt.beneficiary_bank}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteReceipt(receipt.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
