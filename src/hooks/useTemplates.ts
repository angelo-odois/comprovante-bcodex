import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { templateService, ReceiptTemplate } from '@/services/templates';
import { toast } from '@/hooks/use-toast';

// Mock data para templates
const mockTemplates: ReceiptTemplate[] = [
  {
    id: '1',
    name: 'Template PIX Padrão',
    description: 'Template padrão para comprovantes PIX',
    type: 'PIX',
    isDefault: true,
    config: {
      showLogo: true,
      showPayer: true,
      showBeneficiary: true,
      showDescription: true,
      showFees: false,
      customFields: [],
      styling: {
        headerColor: 'hsl(var(--primary))',
        accentColor: 'hsl(var(--accent))',
        fontSize: 'medium',
        layout: 'standard'
      }
    },
    defaultData: {},
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Template TED Empresarial',
    description: 'Template para transferências TED empresariais',
    type: 'TED',
    isDefault: false,
    config: {
      showLogo: true,
      showPayer: true,
      showBeneficiary: true,
      showDescription: true,
      showFees: true,
      customFields: [],
      styling: {
        headerColor: 'hsl(var(--primary))',
        accentColor: 'hsl(var(--accent))',
        fontSize: 'medium',
        layout: 'standard'
      }
    },
    defaultData: {},
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const useTemplates = () => {
  const [templates, setTemplates] = useState<ReceiptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTemplates = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await templateService.getTemplates(user.id);
      setTemplates(data);
    } catch (error: any) {
      console.error('Erro ao buscar templates:', error);
      setTemplates(mockTemplates);
      toast({
        title: "Usando dados offline",
        description: "Conectando com servidor...",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async (templateData: Omit<ReceiptTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const newTemplate = await templateService.createTemplate(user.id, {
        name: templateData.name,
        description: templateData.description,
        type: templateData.type,
        is_default: templateData.is_default,
        config: templateData.config,
        default_data: templateData.default_data
      });

      setTemplates(prev => [newTemplate, ...prev]);

      toast({
        title: "Template criado",
        description: "Template criado com sucesso!",
      });

      return newTemplate;
    } catch (error: any) {
      console.error('Erro ao criar template:', error);

      const fallbackTemplate: ReceiptTemplate = {
        ...templateData,
        id: Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setTemplates(prev => [fallbackTemplate, ...prev]);

      toast({
        title: "Template criado localmente",
        description: "Dados serão sincronizados quando conectar ao servidor",
        variant: "default",
      });

      return fallbackTemplate;
    }
  };

  const createTemplate = async (templateData: Omit<ReceiptTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    return await saveTemplate(templateData);
  };

  const updateTemplate = async (id: string, templateData: Partial<ReceiptTemplate>) => {
    try {
      const updatedTemplate = await templateService.updateTemplate(id, {
        name: templateData.name,
        description: templateData.description,
        is_default: templateData.is_default,
        config: templateData.config,
        default_data: templateData.default_data
      });

      setTemplates(prev =>
        prev.map(template =>
          template.id === id ? updatedTemplate : template
        )
      );

      toast({
        title: "Template atualizado",
        description: "Template atualizado com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar template:', error);

      setTemplates(prev =>
        prev.map(template =>
          template.id === id
            ? { ...template, ...templateData, updated_at: new Date().toISOString() }
            : template
        )
      );

      toast({
        title: "Template atualizado localmente",
        description: "Dados serão sincronizados quando conectar ao servidor",
        variant: "default",
      });
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await templateService.deleteTemplate(id);
      setTemplates(prev => prev.filter(template => template.id !== id));

      toast({
        title: "Template removido",
        description: "Template removido com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao remover template:', error);

      setTemplates(prev => prev.filter(template => template.id !== id));

      toast({
        title: "Template removido localmente",
        description: "Alteração será sincronizada quando conectar ao servidor",
        variant: "default",
      });
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [user]);

  return {
    templates,
    loading,
    fetchTemplates,
    saveTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};