
import { PaymentData } from './payment';

export interface ReceiptTemplate {
  id: string;
  name: string;
  description: string;
  type: 'PIX' | 'TED' | 'DOC' | 'Boleto' | 'Cartão';
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Configurações do template
  config: {
    showLogo: boolean;
    showBeneficiary: boolean;
    showDescription: boolean;
    showFees: boolean;
    customFields: CustomField[];
    styling: TemplateStyle;
  };
  
  // Dados pré-preenchidos do template
  defaultData: Partial<PaymentData>;
}

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  options?: string[]; // Para campos do tipo select
  placeholder?: string;
  defaultValue?: string | number | Date;
}

export interface TemplateStyle {
  headerColor: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  layout: 'compact' | 'standard' | 'detailed';
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  templates: ReceiptTemplate[];
}
