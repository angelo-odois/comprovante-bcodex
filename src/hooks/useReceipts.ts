import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PaymentReceipt } from '@/types/payment';
import { toast } from '@/hooks/use-toast';

// Mock data para comprovantes
const mockReceipts: PaymentReceipt[] = [
  {
    id: '1',
    userId: '899f1167-bc33-4587-8af5-2cca6ac8a9af',
    templateId: '1',
    logoId: null,
    paymentType: 'PIX',
    amount: 1500.00,
    status: 'Aprovado',
    paymentDate: new Date('2025-09-15T10:30:00').toISOString(),
    payer: {
      name: 'João Silva Santos',
      document: '123.456.789-00',
      bank: 'Banco do Brasil',
      agency: '1234',
      account: '56789-0'
    },
    beneficiary: {
      name: 'Maria Oliveira',
      document: '987.654.321-00',
      bank: 'Itaú',
      agency: '5678',
      account: '12345-6',
      pixKey: 'maria@email.com'
    },
    transaction: {
      authNumber: 'AUT123456789',
      endToEnd: 'E12345678202509151030123456789',
      description: 'Pagamento de serviços',
      fees: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: '899f1167-bc33-4587-8af5-2cca6ac8a9af',
    templateId: '2',
    logoId: null,
    paymentType: 'TED',
    amount: 5000.00,
    status: 'Aprovado',
    paymentDate: new Date('2025-09-14T14:20:00').toISOString(),
    payer: {
      name: 'Empresa ABC Ltda',
      document: '12.345.678/0001-00',
      bank: 'Bradesco',
      agency: '2468',
      account: '13579-1'
    },
    beneficiary: {
      name: 'Fornecedor XYZ',
      document: '98.765.432/0001-00',
      bank: 'Santander',
      agency: '1357',
      account: '24680-2'
    },
    transaction: {
      authNumber: 'TED987654321',
      description: 'Pagamento de fornecedor',
      fees: 15.90
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useReceipts = () => {
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchReceipts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filtra comprovantes do usuário
      const userReceipts = mockReceipts.filter(r => r.userId === user.id);
      setReceipts(userReceipts);
    } catch (error: any) {
      console.error('Erro ao buscar comprovantes:', error);
      toast({
        title: "Erro ao carregar comprovantes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createReceipt = async (receiptData: Omit<PaymentReceipt, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const newReceipt: PaymentReceipt = {
        ...receiptData,
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setReceipts(prev => [newReceipt, ...prev]);

      toast({
        title: "Comprovante criado",
        description: "Comprovante criado com sucesso!",
      });

      return newReceipt;
    } catch (error: any) {
      console.error('Erro ao criar comprovante:', error);
      toast({
        title: "Erro ao criar comprovante",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateReceipt = async (id: string, receiptData: Partial<PaymentReceipt>) => {
    try {
      setReceipts(prev =>
        prev.map(receipt =>
          receipt.id === id
            ? { ...receipt, ...receiptData, updatedAt: new Date().toISOString() }
            : receipt
        )
      );

      toast({
        title: "Comprovante atualizado",
        description: "Comprovante atualizado com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar comprovante:', error);
      toast({
        title: "Erro ao atualizar comprovante",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteReceipt = async (id: string) => {
    try {
      setReceipts(prev => prev.filter(receipt => receipt.id !== id));

      toast({
        title: "Comprovante removido",
        description: "Comprovante removido com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao remover comprovante:', error);
      toast({
        title: "Erro ao remover comprovante",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [user]);

  return {
    receipts,
    loading,
    fetchReceipts,
    createReceipt,
    updateReceipt,
    deleteReceipt,
  };
};