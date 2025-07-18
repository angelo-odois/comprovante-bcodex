
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ReceiptTemplate } from '@/types/template';
import { toast } from '@/components/ui/use-toast';

export const useTemplates = () => {
  const [templates, setTemplates] = useState<ReceiptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTemplates = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('receipt_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedTemplates: ReceiptTemplate[] = (data || []).map(template => ({
        id: template.id,
        name: template.name,
        description: template.description || '',
        type: template.type as 'PIX' | 'TED' | 'DOC' | 'Boleto' | 'Cartão',
        isDefault: template.is_default || false,
        createdAt: new Date(template.created_at),
        updatedAt: new Date(template.updated_at),
        config: template.config as any,
        defaultData: template.default_data as any,
      }));
      
      setTemplates(formattedTemplates);
    } catch (error: any) {
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
    if (!user) return;

    try {
      const templateData = {
        user_id: user.id,
        name: template.name,
        description: template.description,
        type: template.type,
        is_default: template.isDefault,
        config: template.config,
        default_data: template.defaultData,
      };

      const { data, error } = await supabase
        .from('receipt_templates')
        .insert([templateData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Template salvo",
        description: "Template criado com sucesso.",
      });

      fetchTemplates();
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao salvar template",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<ReceiptTemplate>) => {
    try {
      const { error } = await supabase
        .from('receipt_templates')
        .update({
          name: updates.name,
          description: updates.description,
          type: updates.type,
          is_default: updates.isDefault,
          config: updates.config,
          default_data: updates.defaultData,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Template atualizado",
        description: "Template atualizado com sucesso.",
      });

      fetchTemplates();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar template",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('receipt_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Template removido",
        description: "Template removido com sucesso.",
      });

      fetchTemplates();
    } catch (error: any) {
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
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    fetchTemplates,
  };
};
