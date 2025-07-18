
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoUpload } from "@/components/LogoUpload";
import { TemplateManager } from "@/components/TemplateManager";
import { UserProfile } from "@/components/UserProfile";
import { useState } from "react";
import { CompanyLogo } from "@/types/payment";
import { ReceiptTemplate } from "@/types/template";
import { Settings as SettingsIcon, Image, Receipt, Palette, Shield, User } from "lucide-react";
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
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Configurações
        </h1>
        <p className="text-lg text-muted-foreground">
          Configure as preferências do sistema e personalize seus comprovantes
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50">
          <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="logo" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Image className="h-4 w-4" />
            Logo da Empresa
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Receipt className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Palette className="h-4 w-4" />
            Aparência
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <UserProfile />
        </TabsContent>

        <TabsContent value="logo" className="mt-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Image className="h-5 w-5" />
                Upload do Logo da Empresa
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

        <TabsContent value="templates" className="mt-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-lg p-1">
            <div className="bg-background rounded-lg">
              <TemplateManager
                onSelectTemplate={handleTemplateSelect}
                onCreateReceipt={handleCreateFromTemplate}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                <Palette className="h-5 w-5" />
                Configurações de Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Configurações de tema em desenvolvimento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
