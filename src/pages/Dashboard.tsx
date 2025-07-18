
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Receipt, TrendingUp, Clock, FileText, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReceipts } from '@/hooks/useReceipts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { receipts, loading } = useReceipts();

  const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  const thisMonthCount = receipts.filter(receipt => {
    const receiptDate = new Date(receipt.payment_date);
    const now = new Date();
    return receiptDate.getMonth() === now.getMonth() && 
           receiptDate.getFullYear() === now.getFullYear();
  }).length;

  const approvedCount = receipts.filter(receipt => receipt.status === 'Aprovado').length;
  const recentReceipts = receipts.slice(0, 5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Visão geral dos seus comprovantes e atividades
          </p>
        </div>
        <Button 
          onClick={() => navigate('/novo')} 
          size="lg"
          className="h-12 px-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Comprovante
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Total em Comprovantes
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(totalAmount)}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Total acumulado
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
              Comprovantes Este Mês
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {thisMonthCount}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Gerados no mês atual
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Pagamentos Aprovados
            </CardTitle>
            <Receipt className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {approvedCount}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Status aprovado
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">
              Total de Comprovantes
            </CardTitle>
            <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {receipts.length}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Todos os comprovantes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Receipts */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Clock className="h-5 w-5" />
                Comprovantes Recentes
              </CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Últimos 5 comprovantes gerados
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/history')}
              className="border-slate-200 dark:border-slate-700"
            >
              Ver Todos
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentReceipts.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Nenhum comprovante encontrado
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Você ainda não gerou nenhum comprovante. Comece criando seu primeiro comprovante.
              </p>
              <Button onClick={() => navigate('/novo')}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Comprovante
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentReceipts.map((receipt) => (
                <div key={receipt.id} className="flex justify-between items-center p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-medium">{receipt.beneficiary_name || 'Pagamento'}</p>
                      <Badge className={getStatusColor(receipt.status)}>
                        {receipt.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatCurrency(receipt.amount)}</span>
                      <span>{receipt.payment_type}</span>
                      <span>{new Date(receipt.payment_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <p>{new Date(receipt.created_at).toLocaleDateString('pt-BR')}</p>
                    <p>{new Date(receipt.created_at).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
