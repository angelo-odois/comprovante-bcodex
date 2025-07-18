
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PaymentData, CompanyLogo } from '@/types/payment';
import { TransactionDetailsForm } from '@/components/forms/TransactionDetailsForm';
import { PayerForm } from '@/components/forms/PayerForm';
import { BeneficiaryForm } from '@/components/forms/BeneficiaryForm';
import { BoletoDetailsForm } from '@/components/forms/BoletoDetailsForm';

interface PaymentFormProps {
  onSubmit: (data: PaymentData, logo?: CompanyLogo) => void;
  initialData?: PaymentData;
  initialLogo?: CompanyLogo;
  submitButtonText?: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ 
  onSubmit, 
  initialData,
  initialLogo,
  submitButtonText = 'Gerar Comprovante'
}) => {
  const [formData, setFormData] = useState<Partial<PaymentData>>(initialData || {
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
      endToEnd: '',
      descricao: ''
    },
    dadosBoleto: {
      documento: '',
      codigoBarras: '',
      dataVencimento: new Date(),
      dataPagamento: new Date(),
      valorDocumento: 0,
      multa: 0,
      juros: 0,
      descontos: 0
    }
  });

  const [logo, setLogo] = useState<CompanyLogo | undefined>(initialLogo);

  const handleInputChange = (section: string, field: string, value: string | number | Date) => {
    setFormData(prev => {
      if (section === 'valor' || section === 'tipo' || section === 'status' || section === 'dataHora' || section === 'id') {
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
      transacao: {
        ...formData.transacao!
      }
    } as PaymentData;

    onSubmit(paymentData, logo);
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
        isOptional={formData.tipo === 'Boleto'}
      />

      <BoletoDetailsForm 
        formData={formData} 
        onInputChange={handleInputChange} 
      />

      <Button type="submit" className="w-full" size="lg">
        {submitButtonText}
      </Button>
    </form>
  );
};
