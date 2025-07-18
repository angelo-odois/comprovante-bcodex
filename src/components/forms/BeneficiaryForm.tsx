
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentData } from '@/types/payment';

interface BeneficiaryFormProps {
  formData: Partial<PaymentData>;
  onInputChange: (section: string, field: string, value: string | number | Date) => void;
  isOptional?: boolean;
}

export const BeneficiaryForm: React.FC<BeneficiaryFormProps> = ({
  formData,
  onInputChange,
  isOptional = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Beneficiário {isOptional && '(Opcional)'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="beneficiarioNome">Nome</Label>
            <Input
              id="beneficiarioNome"
              value={formData.beneficiario?.nome || ''}
              onChange={(e) => onInputChange('beneficiario', 'nome', e.target.value)}
              required={!isOptional}
            />
          </div>
          
          <div>
            <Label htmlFor="beneficiarioCpfCnpj">CPF/CNPJ</Label>
            <Input
              id="beneficiarioCpfCnpj"
              value={formData.beneficiario?.cpfCnpj || ''}
              onChange={(e) => onInputChange('beneficiario', 'cpfCnpj', e.target.value)}
              required={!isOptional}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="beneficiarioBanco">Banco</Label>
            <Input
              id="beneficiarioBanco"
              value={formData.beneficiario?.banco || ''}
              onChange={(e) => onInputChange('beneficiario', 'banco', e.target.value)}
              required={!isOptional}
            />
          </div>
          
          <div>
            <Label htmlFor="beneficiarioAgencia">Agência</Label>
            <Input
              id="beneficiarioAgencia"
              value={formData.beneficiario?.agencia || ''}
              onChange={(e) => onInputChange('beneficiario', 'agencia', e.target.value)}
              required={!isOptional}
            />
          </div>
          
          <div>
            <Label htmlFor="beneficiarioConta">Conta</Label>
            <Input
              id="beneficiarioConta"
              value={formData.beneficiario?.conta || ''}
              onChange={(e) => onInputChange('beneficiario', 'conta', e.target.value)}
              required={!isOptional}
            />
          </div>
        </div>

        {formData.tipo === 'PIX' && (
          <div>
            <Label htmlFor="chavePix">Chave PIX</Label>
            <Input
              id="chavePix"
              value={formData.beneficiario?.chavePix || ''}
              onChange={(e) => onInputChange('beneficiario', 'chavePix', e.target.value)}
              placeholder="CPF, e-mail, telefone ou chave aleatória"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
