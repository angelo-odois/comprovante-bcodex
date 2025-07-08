
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PaymentData } from '@/types/payment';
import { TransactionDetailsForm } from '@/components/forms/TransactionDetailsForm';
import { PayerForm } from '@/components/forms/PayerForm';
import { BeneficiaryForm } from '@/components/forms/BeneficiaryForm';

interface PaymentFormProps {
  onSubmit: (data: PaymentData) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Partial<PaymentData>>({
    tipo: 'PIX',
    status: 'Aprovado',
    dataHora: new Date(),
    pagador: {
      nome: '',
      cpfCnpj: '',
      banco: '',
      agencia: '',
      conta: ''
    },
    beneficiario: {
      nome: '',
      cpfCnpj: '',
      banco: '',
      agencia: '',
      conta: '',
      chavePix: ''
    },
    transacao: {
      numeroAutenticacao: '',
      numeroProtocolo: '',
      descricao: ''
    }
  });

  const generateRandomId = () => Math.random().toString(36).substr(2, 9).toUpperCase();
  const generateAuth = () => Math.random().toString(36).substr(2, 16).toUpperCase();

  const handleInputChange = (section: string, field: string, value: string | number | Date) => {
    setFormData(prev => {
      if (section === 'valor' || section === 'tipo' || section === 'status' || section === 'dataHora') {
        return {
          ...prev,
          [section]: value
        };
      }
      
      // Garantir que a seção existe como objeto antes de fazer spread
      const currentSection = prev[section as keyof PaymentData] as Record<string, any> || {};
      
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value
        }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentData: PaymentData = {
      ...formData,
      id: generateRandomId(),
      transacao: {
        ...formData.transacao!,
        numeroAutenticacao: formData.transacao?.numeroAutenticacao || generateAuth(),
        numeroProtocolo: formData.transacao?.numeroProtocolo || generateAuth()
      }
    } as PaymentData;

    onSubmit(paymentData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TransactionDetailsForm 
        formData={formData} 
        onInputChange={handleInputChange} 
      />
      
      <PayerForm 
        formData={formData} 
        onInputChange={handleInputChange} 
      />
      
      <BeneficiaryForm 
        formData={formData} 
        onInputChange={handleInputChange} 
      />

      <Button type="submit" className="w-full" size="lg">
        Gerar Comprovante
      </Button>
    </form>
  );
};
