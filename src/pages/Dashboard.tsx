
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, History, Plus, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useReceiptHistory } from "@/hooks/useReceiptHistory";

export default function Dashboard() {
  const { history } = useReceiptHistory();
  const recentReceipts = history.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao sistema de comprovantes de pagamento
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Comprovantes
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{history.length}</div>
            <p className="text-xs text-muted-foreground">
              Comprovantes emitidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Este Mês
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {history.filter(receipt => {
                const receiptDate = new Date(receipt.createdAt);
                const now = new Date();
                return receiptDate.getMonth() === now.getMonth() && 
                       receiptDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Novos comprovantes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/novo">
              <Button className="w-full justify-start">
                <Receipt className="h-4 w-4 mr-2" />
                Novo Comprovante
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="outline" className="w-full justify-start">
                <History className="h-4 w-4 mr-2" />
                Ver Histórico
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Comprovantes Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentReceipts.length > 0 ? (
              <div className="space-y-3">
                {recentReceipts.map((receipt) => (
                  <div key={receipt.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">{receipt.beneficiary.name}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {receipt.amount.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(receipt.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum comprovante encontrado
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
