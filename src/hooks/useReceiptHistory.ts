
import { useState, useEffect } from 'react';
import { PaymentData, CompanyLogo } from '@/types/payment';

export interface ReceiptHistoryItem {
  id: string;
  paymentData: PaymentData;
  logo?: CompanyLogo | null;
  createdAt: Date;
  templateId?: string;
}

const STORAGE_KEY = 'receipt-history';

export const useReceiptHistory = () => {
  const [history, setHistory] = useState<ReceiptHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Converter strings de data de volta para objetos Date
        const historyWithDates = parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          paymentData: {
            ...item.paymentData,
            dataHora: new Date(item.paymentData.dataHora),
            dadosBoleto: item.paymentData.dadosBoleto ? {
              ...item.paymentData.dadosBoleto,
              dataVencimento: new Date(item.paymentData.dadosBoleto.dataVencimento),
              dataPagamento: new Date(item.paymentData.dadosBoleto.dataPagamento)
            } : undefined
          }
        }));
        setHistory(historyWithDates);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    }
  }, []);

  const saveToHistory = (paymentData: PaymentData, logo?: CompanyLogo | null, templateId?: string) => {
    const newItem: ReceiptHistoryItem = {
      id: `history-${Date.now()}`,
      paymentData,
      logo,
      templateId,
      createdAt: new Date()
    };

    const updatedHistory = [newItem, ...history].slice(0, 100); // Manter apenas os últimos 100
    setHistory(updatedHistory);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
    }
  };

  const deleteFromHistory = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Erro ao deletar do histórico:', error);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    saveToHistory,
    deleteFromHistory,
    clearHistory
  };
};
