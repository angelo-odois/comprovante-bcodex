import api from './api';

export interface Receipt {
  id: string;
  user_id: string;
  template_id?: string;
  logo_id?: string;
  payment_type: 'PIX' | 'TED' | 'DOC' | 'Boleto' | 'Cartão';
  amount: number;
  status: 'Aprovado' | 'Pendente' | 'Rejeitado';
  payment_date: string;

  payer_name: string;
  payer_document: string;
  payer_bank: string;
  payer_agency: string;
  payer_account: string;

  beneficiary_name?: string;
  beneficiary_document?: string;
  beneficiary_bank?: string;
  beneficiary_agency?: string;
  beneficiary_account?: string;
  beneficiary_pix_key?: string;

  auth_number: string;
  end_to_end?: string;
  description?: string;
  fees: number;

  boleto_document?: string;
  boleto_barcode?: string;
  boleto_due_date?: string;
  boleto_payment_date?: string;
  boleto_document_value?: number;
  boleto_fine: number;
  boleto_interest: number;
  boleto_discount: number;

  card_brand?: string;
  card_last_digits?: string;
  card_installments: number;

  created_at: string;
  updated_at: string;
}

export interface CreateReceiptRequest {
  template_id?: string;
  logo_id?: string;
  payment_type: 'PIX' | 'TED' | 'DOC' | 'Boleto' | 'Cartão';
  amount: number;
  status: 'Aprovado' | 'Pendente' | 'Rejeitado';
  payment_date: string;

  payer_name: string;
  payer_document: string;
  payer_bank: string;
  payer_agency: string;
  payer_account: string;

  beneficiary_name?: string;
  beneficiary_document?: string;
  beneficiary_bank?: string;
  beneficiary_agency?: string;
  beneficiary_account?: string;
  beneficiary_pix_key?: string;

  auth_number: string;
  end_to_end?: string;
  description?: string;
  fees?: number;

  boleto_document?: string;
  boleto_barcode?: string;
  boleto_due_date?: string;
  boleto_payment_date?: string;
  boleto_document_value?: number;
  boleto_fine?: number;
  boleto_interest?: number;
  boleto_discount?: number;

  card_brand?: string;
  card_last_digits?: string;
  card_installments?: number;
}

export interface ReceiptsFilter {
  payment_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export interface ReceiptsResponse {
  receipts: Receipt[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const receiptService = {
  async getReceipts(userId: string, filter?: ReceiptsFilter): Promise<ReceiptsResponse> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const query = params.toString();
    return api.get(`/users/${userId}/receipts${query ? `?${query}` : ''}`);
  },

  async getReceipt(receiptId: string): Promise<Receipt> {
    return api.get(`/receipts/${receiptId}`);
  },

  async createReceipt(userId: string, data: CreateReceiptRequest): Promise<Receipt> {
    return api.post(`/users/${userId}/receipts`, data);
  },

  async updateReceipt(receiptId: string, data: Partial<CreateReceiptRequest>): Promise<Receipt> {
    return api.put(`/receipts/${receiptId}`, data);
  },

  async deleteReceipt(receiptId: string): Promise<void> {
    return api.delete(`/receipts/${receiptId}`);
  },

  async getReceiptsByType(userId: string, paymentType: string): Promise<Receipt[]> {
    return api.get(`/users/${userId}/receipts?payment_type=${paymentType}`);
  },

  async getReceiptStats(userId: string): Promise<{
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    totalAmount: number;
  }> {
    return api.get(`/users/${userId}/receipts/stats`);
  }
};