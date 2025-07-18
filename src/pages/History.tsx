
import React, { useState } from 'react';
import { useReceiptHistory, ReceiptHistoryItem } from '@/hooks/useReceiptHistory';
import { PaymentReceipt } from '@/components/PaymentReceipt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  History as HistoryIcon, 
  Eye, 
  Download, 
  Printer, 
  Trash2, 
  Search,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateEnhancedPDF, downloadEnhancedPDF } from '@/utils/pdf';

const History = () => {
  const { history, deleteFromHistory, clearHistory } = useReceiptHistory();
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptHistoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (tipo: string) => {
    const colors = {
      PIX: 'bg-purple-100 text-purple-800',
      TED: 'bg-blue-100 text-blue-800',
      DOC: 'bg-indigo-100 text-indigo-800',
      Boleto: 'bg-orange-100 text-orange-800',
      Cartão: 'bg-green-100 text-green-800'
    };
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredHistory = history.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.paymentData.pagador.nome.toLowerCase().includes(searchLower) ||
      item.paymentData.beneficiario.nome.toLowerCase().includes(searchLower) ||
      item.paymentData.id.toLowerCase().includes(searchLower) ||
      item.paymentData.tipo.toLowerCase().includes(searchLower)
    );
  });

  const handleViewReceipt = (item: ReceiptHistoryItem) => {
    setSelectedReceipt(item);
  };

  const handleDownloadPDF = (item: ReceiptHistoryItem) => {
    // Criar temporariamente o elemento para gerar PDF
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.innerHTML = `
      <div id="temp-receipt">
        <!-- O conteúdo seria renderizado aqui -->
      </div>
    `;
    document.body.appendChild(tempDiv);
    
    setTimeout(() => {
      downloadEnhancedPDF(tempDiv, `comprovante-${item.paymentData.id}.pdf`);
      document.body.removeChild(tempDiv);
    }, 100);
  };

  const handlePrint = (item: ReceiptHistoryItem) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    
    setTimeout(() => {
      generateEnhancedPDF(tempDiv, `comprovante-${item.paymentData.id}.pdf`);
      document.body.removeChild(tempDiv);
    }, 100);
  };

  if (selectedReceipt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedReceipt(null)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Histórico
            </Button>
          </div>
          
          <PaymentReceipt 
            data={selectedReceipt.paymentData}
            logo={selectedReceipt.logo}
            onDownloadPDF={() => handleDownloadPDF(selectedReceipt)}
            onPrint={() => handlePrint(selectedReceipt)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <HistoryIcon className="h-8 w-8" />
              Histórico de Comprovantes
            </h1>
            <p className="text-gray-600">
              Gerencie e reimprima seus comprovantes anteriores
            </p>
          </div>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Comprovantes Emitidos ({history.length})</CardTitle>
              {history.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpar Histórico
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Confirmar Exclusão
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Todos os comprovantes do histórico serão permanentemente removidos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={clearHistory} className="bg-destructive hover:bg-destructive/90">
                        Confirmar Exclusão
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            
            {history.length > 0 && (
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, ID ou tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-12">
                <HistoryIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Nenhum comprovante encontrado
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Os comprovantes que você gerar aparecerão aqui
                </p>
                <Link to="/">
                  <Button>
                    Criar Primeiro Comprovante
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Pagador</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">
                          {formatDateTime(item.createdAt)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.paymentData.id}
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(item.paymentData.tipo)}>
                            {item.paymentData.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.paymentData.pagador.nome}
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatCurrency(item.paymentData.valor)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.paymentData.status)}>
                            {item.paymentData.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewReceipt(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownloadPDF(item)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePrint(item)}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Deseja remover este comprovante do histórico?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteFromHistory(item.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
