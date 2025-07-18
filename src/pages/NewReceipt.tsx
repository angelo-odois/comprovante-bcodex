
import React, { useState } from 'react';
import { PaymentForm } from '@/components/PaymentForm';
import { PaymentReceipt } from '@/components/PaymentReceipt';
import { LogoUpload } from '@/components/LogoUpload';
import { PaymentData, CompanyLogo } from '@/types/payment';
import { generatePDF, downloadPDF } from '@/utils/pdfGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Receipt, Settings, FileText, ArrowLeft, Sparkles } from 'lucide-react';
import { MockReceiptDemo } from '@/components/MockReceiptDemo';
import { TemplateManager } from '@/components/TemplateManager';
import { ReceiptTemplate } from '@/types/template';
import { useReceipts } from '@/hooks/useReceipts';
import { toast } from '@/hooks/use-toast';

export default function NewReceipt() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [companyLogo, setCompanyLogo] = useState<CompanyLogo | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ReceiptTemplate | null>(null);
  const [activeTab, setActiveTab] = useState('form');
  const { saveReceipt } = useReceipts();

  const handlePaymentSubmit = async (data: PaymentData) => {
    setPaymentData(data);
    
    try {
      await saveReceipt(data, undefined, selectedTemplate?.id);
      toast({
        title: "Comprovante gerado com sucesso!",
        description: "Seu comprovante foi criado e salvo.",
      });
    } catch (error) {
      console.error('Erro ao salvar comprovante:', error);
      toast({
        title: "Erro ao salvar comprovante",
        description: "Ocorreu um erro ao salvar o comprovante.",
        variant: "destructive",
      });
    }
  };

  const handleTemplateSelect = (template: ReceiptTemplate) => {
    setSelectedTemplate(template);
    toast({
      title: "Template selecionado",
      description: `Template "${template.name}" foi selecionado.`,
    });
  };

  const handleUseTemplate = (template: ReceiptTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('form');
    
    toast({
      title: "Template aplicado",
      description: `Usando template "${template.name}". Configure os dados do pagamento.`,
    });
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
    setSelectedTemplate(null);
    setActiveTab('form');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Novo Comprovante
        </h1>
        <p className="text-lg text-muted-foreground">
          Gere comprovantes profissionais de forma rápida e segura
        </p>
      </div>

      {!paymentData ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50">
            <TabsTrigger value="form" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <FileText className="h-4 w-4" />
              Dados do Pagamento
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Receipt className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Sparkles className="h-4 w-4" />
              Modelo PDF
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="mt-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Receipt className="h-5 w-5" />
                  Informações do Pagamento
                </CardTitle>
                {selectedTemplate && (
                  <div className="mt-2">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Template selecionado: <span className="font-medium">{selectedTemplate.name}</span>
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-300">
                      {selectedTemplate.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTemplate(null)}
                      className="mt-2"
                    >
                      Remover Template
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-6">
                <PaymentForm 
                  onSubmit={handlePaymentSubmit} 
                  template={selectedTemplate || undefined}
                  initialData={selectedTemplate?.defaultData as PaymentData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-lg p-1">
              <div className="bg-background rounded-lg">
                <TemplateManager
                  onSelectTemplate={handleTemplateSelect}
                  onCreateReceipt={handleUseTemplate}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="demo" className="mt-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                  <Sparkles className="h-5 w-5" />
                  Demonstração do Modelo PDF
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <MockReceiptDemo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
                  <Settings className="h-5 w-5" />
                  Configurações do Comprovante
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <LogoUpload 
                  onLogoChange={setCompanyLogo} 
                  currentLogo={companyLogo}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={handleNewReceipt}
              className="border-2 hover:bg-accent h-12 px-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para criar novo comprovante
            </Button>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg p-1">
            <div className="bg-background rounded-lg">
              <PaymentReceipt 
                data={paymentData}
                logo={companyLogo}
                template={selectedTemplate || undefined}
                onDownloadPDF={handleDownloadPDF}
                onPrint={handlePrint}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
