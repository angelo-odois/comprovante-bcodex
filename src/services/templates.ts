import api from './api';

export interface ReceiptTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  type: 'PIX' | 'TED' | 'DOC' | 'Boleto' | 'Cartão';
  is_default: boolean;
  config: Record<string, any>;
  default_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  type: 'PIX' | 'TED' | 'DOC' | 'Boleto' | 'Cartão';
  is_default?: boolean;
  config?: Record<string, any>;
  default_data?: Record<string, any>;
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  is_default?: boolean;
  config?: Record<string, any>;
  default_data?: Record<string, any>;
}

export const templateService = {
  async getTemplates(userId: string): Promise<ReceiptTemplate[]> {
    return api.get(`/users/${userId}/templates`);
  },

  async getTemplate(templateId: string): Promise<ReceiptTemplate> {
    return api.get(`/templates/${templateId}`);
  },

  async createTemplate(userId: string, data: CreateTemplateRequest): Promise<ReceiptTemplate> {
    return api.post(`/users/${userId}/templates`, data);
  },

  async updateTemplate(templateId: string, data: UpdateTemplateRequest): Promise<ReceiptTemplate> {
    return api.put(`/templates/${templateId}`, data);
  },

  async deleteTemplate(templateId: string): Promise<void> {
    return api.delete(`/templates/${templateId}`);
  },

  async getTemplatesByType(userId: string, type: string): Promise<ReceiptTemplate[]> {
    return api.get(`/users/${userId}/templates?type=${type}`);
  },

  async setDefaultTemplate(templateId: string, userId: string): Promise<ReceiptTemplate> {
    return api.put(`/templates/${templateId}/default`, { userId });
  }
};