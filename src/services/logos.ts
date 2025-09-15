import api from './api';

export interface CompanyLogo {
  id: string;
  user_id: string;
  name: string;
  url: string;
  file_size?: number;
  file_type?: string;
  created_at: string;
  updated_at: string;
}

export interface UploadLogoRequest {
  name: string;
  file: File;
}

export const logoService = {
  async getLogos(userId: string): Promise<CompanyLogo[]> {
    return api.get(`/users/${userId}/logos`);
  },

  async getLogo(logoId: string): Promise<CompanyLogo> {
    return api.get(`/logos/${logoId}`);
  },

  async uploadLogo(userId: string, data: UploadLogoRequest): Promise<CompanyLogo> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('file', data.file);

    const response = await fetch(`${api.API_BASE_URL}/users/${userId}/logos`, {
      method: 'POST',
      headers: {
        ...getHeaders(true), // Skip Content-Type for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  },

  async deleteLogo(logoId: string): Promise<void> {
    return api.delete(`/logos/${logoId}`);
  },

  async updateLogoName(logoId: string, name: string): Promise<CompanyLogo> {
    return api.put(`/logos/${logoId}`, { name });
  }
};

// Helper function for headers (similar to api.ts but for multipart uploads)
const getHeaders = (skipContentType = false) => {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {};

  if (!skipContentType) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};