
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ReceiptTemplate } from '@/types/template';
import { toast } from '@/hooks/use-toast';

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
      const { data, error } = await supabase
        .from('receipt_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar templates:', error);
        throw error;
      }
      
      const formattedTemplates: ReceiptTemplate[] = (data || []).map(template => {
        // Parse config from JSON
        let config;
        try {
          config = typeof template.config === 'string' 
            ? JSON.parse(template.config) 
            : (template.config as any) || {
                showLogo: true,
                showPayer: false,
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
              };
        } catch (e) {
          config = {
            showLogo: true,
            showPayer: false,
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
          };
        }

        // Parse defaultData from JSON
        let defaultData;
        try {
          defaultData = typeof template.default_data === 'string' 
            ? JSON.parse(template.default_data) 
            : (template.default_data as any) || {};
        } catch (e) {
          defaultData = {};
        }

        return {
          id: template.id,
          name: template.name,
          description: template.description || '',
          type: template.type as 'PIX' | 'TED' | 'DOC' | 'Boleto' | 'Cartão',
          isDefault: template.is_default || false,
          createdAt: new Date(template.created_at),
          updatedAt: new Date(template.updated_at),
          config,
          defaultData,
        };
      });
      
      setTemplates(formattedTemplates);
    } catch (error: any) {
      console.error('Erro ao carregar templates:', error);
      toast({
        title: "Erro ao carregar templates",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async (template: Omit<ReceiptTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const templateData = {
        user_id: user.id,
        name: template.name,
        description: template.description,
        type: template.type,
        is_default: template.isDefault,
        config: JSON.stringify(template.config),
        default_data: JSON.stringify(template.defaultData),
      };

      const { data, error } = await supabase
        .from('receipt_templates')
        .insert([templateData])
        .select()
        .single();

      if (error) {
        console.error('Erro do Supabase ao salvar template:', error);
        throw error;
      }

      // Atualizar lista local sem refazer consulta
      const newTemplate: ReceiptTemplate = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        type: data.type as 'PIX' | 'TED' | 'DOC' | 'Boleto' | 'Cartão',
        isDefault: data.is_default || false,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        config: typeof data.config === 'string' ? JSON.parse(data.config) : data.config as any,
        defaultData: typeof data.default_data === 'string' ? JSON.parse(data.default_data) : data.default_data as any || {},
      };
      
      setTemplates(prev => [newTemplate, ...prev]);
      return data;
    } catch (error: any) {
      console.error('Erro ao salvar template:', error);
      toast({
        title: "Erro ao salvar template",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<ReceiptTemplate>) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.isDefault !== undefined) updateData.is_default = updates.isDefault;
      if (updates.config !== undefined) updateData.config = JSON.stringify(updates.config);
      if (updates.defaultData !== undefined) updateData.default_data = JSON.stringify(updates.defaultData);

      const { error } = await supabase
        .from('receipt_templates')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro do Supabase ao atualizar template:', error);
        throw error;
      }

      // Atualizar lista local
      setTemplates(prev => prev.map(template => 
        template.id === id ? { ...template, ...updates, updatedAt: new Date() } : template
      ));
    } catch (error: any) {
      console.error('Erro ao atualizar template:', error);
      toast({
        title: "Erro ao atualizar template",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { error } = await supabase
        .from('receipt_templates')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro do Supabase ao deletar template:', error);
        throw error;
      }

      // Atualizar lista local
      setTemplates(prev => prev.filter(template => template.id !== id));
    } catch (error: any) {
      console.error('Erro ao remover template:', error);
      toast({
        title: "Erro ao remover template",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [user?.id]);

  return {
    templates,
    loading,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    fetchTemplates,
  };
};
