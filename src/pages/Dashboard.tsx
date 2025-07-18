
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, History, Plus, FileText, TrendingUp, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { useReceiptHistory } from "@/hooks/useReceiptHistory";

export default function Dashboard() {
  const { history } = useReceiptHistory();
  const recentReceipts = history.slice(0, 5);

  const totalAmount = history.reduce((sum, receipt) => sum + (receipt.paymentData?.valor || 0), 0);
  const thisMonthCount = history.filter(receipt => {
    const receiptDate = new Date(receipt.createdAt);
    const now = new Date();
    return receiptDate.getMonth() === now.getMonth() && 
           receiptDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Bem-vindo ao sistema de comprovantes de pagamento
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total de Comprovantes
            </CardTitle>
            <Receipt className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{history.length}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Comprovantes emitidos
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Este Mês
            </CardTitle>
            <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{thisMonthCount}</div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Novos comprovantes
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Valor Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              R$ {totalAmount.toFixed(2).replace('.', ',')}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Total processado
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Crescimento
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">+12%</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/novo">
              <Button className="w-full justify-start h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-md">
                <Receipt className="h-4 w-4 mr-2" />
                Novo Comprovante
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="outline" className="w-full justify-start h-12 border-2 hover:bg-accent">
                <History className="h-4 w-4 mr-2" />
                Ver Histórico
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="outline" className="w-full justify-start h-12 border-2 hover:bg-accent">
                <FileText className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Comprovantes Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentReceipts.length > 0 ? (
              <div className="space-y-3">
                {recentReceipts.map((receipt) => (
                  <div key={receipt.id} className="flex justify-between items-center p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <p className="font-medium">{receipt.paymentData?.beneficiario?.nome || 'Beneficiário'}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {(receipt.paymentData?.valor || 0).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      <div>{new Date(receipt.createdAt).toLocaleDateString()}</div>
                      <div>{new Date(receipt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Nenhum comprovante encontrado</p>
                <Link to="/novo">
                  <Button className="mt-4" variant="outline">
                    Criar primeiro comprovante
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
