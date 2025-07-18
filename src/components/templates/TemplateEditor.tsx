
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Save, X, Loader2 } from 'lucide-react';
import { ReceiptTemplate } from '@/types/template';
import { useTemplates } from '@/hooks/useTemplates';
import { toast } from '@/hooks/use-toast';

interface TemplateEditorProps {
  template?: ReceiptTemplate | null;
  onSave: (template: ReceiptTemplate) => void;
  onCancel: () => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const { saveTemplate, updateTemplate } = useTemplates();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<ReceiptTemplate>>({
    name: template?.name || '',
    description: template?.description || '',
    type: template?.type || 'PIX',
    isDefault: template?.isDefault || false,
    config: {
      showLogo: template?.config?.showLogo ?? true,
      showPayer: template?.config?.showPayer ?? false,
      showBeneficiary: template?.config?.showBeneficiary ?? true,
      showDescription: template?.config?.showDescription ?? true,
      showFees: template?.config?.showFees ?? false,
      customFields: template?.config?.customFields || [],
      styling: {
        headerColor: template?.config?.styling?.headerColor || 'hsl(var(--primary))',
        accentColor: template?.config?.styling?.accentColor || 'hsl(var(--accent))',
        fontSize: template?.config?.styling?.fontSize || 'medium',
        layout: template?.config?.styling?.layout || 'standard'
      }
    },
    defaultData: template?.defaultData || {}
  });

  const handleSave = async () => {
    if (!formData.name || !formData.type) {
      toast({
        title: "Erro de validação",
        description: "Nome e tipo do template são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    try {
      if (template) {
        // Editando template existente
        await updateTemplate(template.id, formData);
        onSave({
          ...template,
          ...formData,
          updatedAt: new Date()
        } as ReceiptTemplate);
        
        toast({
          title: "Template atualizado",
          description: "Template foi atualizado com sucesso.",
        });
      } else {
        // Criando novo template
        const newTemplateData = {
          name: formData.name!,
          description: formData.description || '',
          type: formData.type!,
          isDefault: formData.isDefault!,
          config: formData.config!,
          defaultData: formData.defaultData!
        };
        
        const savedTemplate = await saveTemplate(newTemplateData);
        
        if (savedTemplate) {
          onSave({
            id: savedTemplate.id,
            createdAt: new Date(savedTemplate.created_at),
            updatedAt: new Date(savedTemplate.updated_at),
            ...newTemplateData
          });
        }
        
        toast({
          title: "Template criado",
          description: "Template foi criado com sucesso.",
        });
      }
    } catch (error: any) {
      console.error('Erro ao salvar template:', error);
      toast({
        title: "Erro ao salvar template",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config!,
        [key]: value
      }
    }));
  };

  const updateStyling = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config!,
        styling: {
          ...prev.config!.styling,
          [key]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">
            {template ? 'Editar Template' : 'Novo Template'}
          </h3>
          <p className="text-muted-foreground">
            Configure as opções do seu template personalizado
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving || !formData.name || !formData.type}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Template</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: PIX Empresarial"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o propósito deste template"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Tipo de Pagamento</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="TED">TED</SelectItem>
                  <SelectItem value="DOC">DOC</SelectItem>
                  <SelectItem value="Boleto">Boleto</SelectItem>
                  <SelectItem value="Cartão">Cartão</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="default"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
              />
              <Label htmlFor="default">Template padrão</Label>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de exibição */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Exibição</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="showLogo"
                checked={formData.config?.showLogo}
                onCheckedChange={(checked) => updateConfig('showLogo', checked)}
              />
              <Label htmlFor="showLogo">Mostrar logo da empresa</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="showPayer"
                checked={formData.config?.showPayer}
                onCheckedChange={(checked) => updateConfig('showPayer', checked)}
              />
              <Label htmlFor="showPayer">Mostrar dados do pagador</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="showBeneficiary"
                checked={formData.config?.showBeneficiary}
                onCheckedChange={(checked) => updateConfig('showBeneficiary', checked)}
              />
              <Label htmlFor="showBeneficiary">Mostrar dados do beneficiário</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="showDescription"
                checked={formData.config?.showDescription}
                onCheckedChange={(checked) => updateConfig('showDescription', checked)}
              />
              <Label htmlFor="showDescription">Mostrar descrição da transação</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="showFees"
                checked={formData.config?.showFees}
                onCheckedChange={(checked) => updateConfig('showFees', checked)}
              />
              <Label htmlFor="showFees">Mostrar taxas (boleto)</Label>
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="layout">Layout</Label>
              <Select
                value={formData.config?.styling?.layout}
                onValueChange={(value) => updateStyling('layout', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compacto</SelectItem>
                  <SelectItem value="standard">Padrão</SelectItem>
                  <SelectItem value="detailed">Detalhado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="fontSize">Tamanho da fonte</Label>
              <Select
                value={formData.config?.styling?.fontSize}
                onValueChange={(value) => updateStyling('fontSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Pequena</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
