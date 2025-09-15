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
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Return all templates for now
      setTemplates(mockTemplates);
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

  const saveTemplate = async (templateData: Omit<ReceiptTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const newTemplate: ReceiptTemplate = {
        ...templateData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date()
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

  const createTemplate = async (templateData: Omit<ReceiptTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await saveTemplate(templateData);
  };

  const updateTemplate = async (id: string, templateData: Partial<ReceiptTemplate>) => {
    try {
      setTemplates(prev =>
        prev.map(template =>
          template.id === id
            ? { ...template, ...templateData, updatedAt: new Date() }
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
    saveTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};