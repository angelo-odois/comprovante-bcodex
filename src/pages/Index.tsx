
import React, { useState } from 'react';
import { PaymentForm } from '@/components/PaymentForm';
import { PaymentReceipt } from '@/components/PaymentReceipt';
import { LogoUpload } from '@/components/LogoUpload';
import { PaymentData, CompanyLogo } from '@/types/payment';
import { generatePDF, downloadPDF } from '@/utils/pdfGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Receipt, Settings, FileText, History as HistoryIcon } from 'lucide-react';
import { MockReceiptDemo } from '@/components/MockReceiptDemo';
import { TemplateManager } from '@/components/TemplateManager';
import { ReceiptTemplate } from '@/types/template';
import { useReceiptHistory } from '@/hooks/useReceiptHistory';
import { Link } from 'react-router-dom';

const Index = () => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [companyLogo, setCompanyLogo] = useState<CompanyLogo | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ReceiptTemplate | null>(null);
  const { saveToHistory, history } = useReceiptHistory();

  const handlePaymentSubmit = (data: PaymentData) => {
    setPaymentData(data);
    // Salvar automaticamente no histórico
    saveToHistory(data, companyLogo, selectedTemplate?.id);
  };

  const handleTemplateSelect = (template: ReceiptTemplate) => {
    setSelectedTemplate(template);
    // Aqui você pode aplicar configurações do template
    console.log('Template selecionado:', template);
  };

  const handleCreateFromTemplate = (template: ReceiptTemplate) => {
    setSelectedTemplate(template);
    // Redirecionar para o formulário com dados pré-preenchidos do template
    console.log('Criar recibo com template:', template);
  };

  const handleDownloadPDF = () => {
    const receiptElement = document.getElementById('receipt-content');
    if (receiptElement && paymentData) {
      downloadPDF(receiptElement, `comprovante-${paymentData.id}.pdf`);
    }
  };

  const handlePrint = () => {
    const receiptElement = document.getElementById('receipt-content');
    if (receiptElement && paymentData) {
      generatePDF(receiptElement, `comprovante-${paymentData.id}.pdf`);
    }
  };

  const handleNewReceipt = () => {
    setPaymentData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Sistema de Comprovantes de Pagamento
            </h1>
            <p className="text-gray-600 text-lg">
              Gere comprovantes profissionais de forma rápida e segura
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link to="/history">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <HistoryIcon className="h-4 w-4" />
                Histórico ({history.length})
              </Button>
            </Link>
          </div>
        </div>

        {!paymentData ? (
          <Tabs defaultValue="form" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="form" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Dados do Pagamento
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="demo" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Modelo PDF
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="form">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Informações do Pagamento
                  </CardTitle>
                  {selectedTemplate && (
                    <p className="text-sm text-muted-foreground">
                      Usando template: <span className="font-medium">{selectedTemplate.name}</span>
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <PaymentForm onSubmit={handlePaymentSubmit} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates">
              <TemplateManager
                onSelectTemplate={handleTemplateSelect}
                onCreateReceipt={handleCreateFromTemplate}
              />
            </TabsContent>

            <TabsContent value="demo">
              <MockReceiptDemo />
            </TabsContent>

            <TabsContent value="settings">
              <LogoUpload 
                onLogoChange={setCompanyLogo} 
                currentLogo={companyLogo}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={handleNewReceipt}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                ← Voltar para criar novo comprovante
              </button>
            </div>
            
            <PaymentReceipt 
              data={paymentData}
              logo={companyLogo}
              onDownloadPDF={handleDownloadPDF}
              onPrint={handlePrint}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
