
import React, { useState } from 'react';
import { PaymentForm } from '@/components/PaymentForm';
import { PaymentReceipt } from '@/components/PaymentReceipt';
import { LogoUpload } from '@/components/LogoUpload';
import { PaymentData, CompanyLogo } from '@/types/payment';
import { generatePDF, downloadPDF } from '@/utils/pdfGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Receipt, Settings, FileText } from 'lucide-react';
import { MockReceiptDemo } from '@/components/MockReceiptDemo';
import { TemplateManager } from '@/components/TemplateManager';
import { ReceiptTemplate } from '@/types/template';
import { useReceiptHistory } from '@/hooks/useReceiptHistory';

export default function NewReceipt() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [companyLogo, setCompanyLogo] = useState<CompanyLogo | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ReceiptTemplate | null>(null);
  const { saveToHistory } = useReceiptHistory();

  const handlePaymentSubmit = (data: PaymentData) => {
    setPaymentData(data);
    saveToHistory(data, companyLogo, selectedTemplate?.id);
  };

  const handleTemplateSelect = (template: ReceiptTemplate) => {
    setSelectedTemplate(template);
    console.log('Template selecionado:', template);
  };

  const handleCreateFromTemplate = (template: ReceiptTemplate) => {
    setSelectedTemplate(template);
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Comprovante</h1>
        <p className="text-muted-foreground">
          Gere comprovantes profissionais de forma rápida e segura
        </p>
      </div>

      {!paymentData ? (
        <Tabs defaultValue="form" className="w-full">
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
            <Button variant="outline" onClick={handleNewReceipt}>
              ← Voltar para criar novo comprovante
            </Button>
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
  );
}
