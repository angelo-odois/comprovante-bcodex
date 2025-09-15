import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ReceiptTemplate } from '@/types/template';
import { toast } from '@/hooks/use-toast';

// Mock data para templates
const mockTemplates: ReceiptTemplate[] = [
  {
    id: '1',
    name: 'Template PIX Padrão',
    description: 'Template padrão para comprovantes PIX',
    type: 'PIX',
    isDefault: true,
    userId: '899f1167-bc33-4587-8af5-2cca6ac8a9af',
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Template TED Empresarial',
    description: 'Template para transferências TED empresariais',
    type: 'TED',
    isDefault: false,
    userId: '899f1167-bc33-4587-8af5-2cca6ac8a9af',
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filtra templates do usuário
      const userTemplates = mockTemplates.filter(t => t.userId === user.id);
      setTemplates(userTemplates);
    } catch (error: any) {
      console.error('Erro ao buscar templates:', error);
      toast({
        title: "Erro ao carregar templates",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (templateData: Omit<ReceiptTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const newTemplate: ReceiptTemplate = {
        ...templateData,
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTemplates(prev => [newTemplate, ...prev]);

      toast({
        title: "Template criado",
        description: "Template criado com sucesso!",
      });

      return newTemplate;
    } catch (error: any) {
      console.error('Erro ao criar template:', error);
      toast({
        title: "Erro ao criar template",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateTemplate = async (id: string, templateData: Partial<ReceiptTemplate>) => {
    try {
      setTemplates(prev =>
        prev.map(template =>
          template.id === id
            ? { ...template, ...templateData, updatedAt: new Date().toISOString() }
            : template
        )
      );

      toast({
        title: "Template atualizado",
        description: "Template atualizado com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar template:', error);
      toast({
        title: "Erro ao atualizar template",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      setTemplates(prev => prev.filter(template => template.id !== id));

      toast({
        title: "Template removido",
        description: "Template removido com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao remover template:', error);
      toast({
        title: "Erro ao remover template",
        description: error.message,
        variant: "destructive",
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
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};