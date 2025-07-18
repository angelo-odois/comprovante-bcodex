
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoUpload } from "@/components/LogoUpload";
import { TemplateManager } from "@/components/TemplateManager";
import { useState } from "react";
import { CompanyLogo } from "@/types/payment";
import { ReceiptTemplate } from "@/types/template";
import { Settings as SettingsIcon, Image, Receipt } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const [companyLogo, setCompanyLogo] = useState<CompanyLogo | null>(null);

  const handleTemplateSelect = (template: ReceiptTemplate) => {
    console.log('Template selecionado:', template);
  };

  const handleCreateFromTemplate = (template: ReceiptTemplate) => {
    console.log('Criar recibo com template:', template);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Configure as preferências do sistema e personalize seus comprovantes
        </p>
      </div>

      <Tabs defaultValue="logo" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logo" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Logo da Empresa
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Upload do Logo da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LogoUpload 
                onLogoChange={setCompanyLogo} 
                currentLogo={companyLogo}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <TemplateManager
            onSelectTemplate={handleTemplateSelect}
            onCreateReceipt={handleCreateFromTemplate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
