
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
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar templates:', error);
        throw error;
      }
      
      console.log('Templates recebidos do banco:', data);
      
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
      
      console.log('Templates formatados:', formattedTemplates);
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
      console.log('Iniciando salvamento do template:', template);

      // Converter objetos complexos para JSON compatível
      const templateData = {
        user_id: user.id,
        name: template.name,
        description: template.description,
        type: template.type,
        is_default: template.isDefault,
        config: JSON.parse(JSON.stringify(template.config)), // Converte para JSON puro
        default_data: JSON.parse(JSON.stringify(template.defaultData)), // Converte para JSON puro
      };

      console.log('Dados do template preparados para inserção:', templateData);

      const { data, error } = await supabase
        .from('receipt_templates')
        .insert([templateData])
        .select()
        .single();

      if (error) {
        console.error('Erro do Supabase ao salvar template:', error);
        throw error;
      }

      console.log('Template salvo com sucesso:', data);
      await fetchTemplates();
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
      if (updates.config !== undefined) updateData.config = JSON.parse(JSON.stringify(updates.config));
      if (updates.defaultData !== undefined) updateData.default_data = JSON.parse(JSON.stringify(updates.defaultData));

      console.log('Atualizando template:', id, updateData);

      const { error } = await supabase
        .from('receipt_templates')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Erro do Supabase ao atualizar template:', error);
        throw error;
      }

      console.log('Template atualizado com sucesso');
      await fetchTemplates();
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
      console.log('Deletando template:', id);
      
      const { error } = await supabase
        .from('receipt_templates')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro do Supabase ao deletar template:', error);
        throw error;
      }

      console.log('Template deletado com sucesso');
      await fetchTemplates();
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
