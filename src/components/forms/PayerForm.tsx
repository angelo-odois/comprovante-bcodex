
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentData } from '@/types/payment';

interface PayerFormProps {
  formData: Partial<PaymentData>;
  onInputChange: (section: string, field: string, value: string | number | Date) => void;
  isOptional?: boolean;
}

export const PayerForm: React.FC<PayerFormProps> = ({
  formData,
  onInputChange,
  isOptional = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Dados do Pagador
          {isOptional && <span className="text-sm font-normal text-muted-foreground ml-2">(Opcional)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pagadorNome">Nome</Label>
            <Input
              id="pagadorNome"
              value={formData.pagador?.nome || ''}
              onChange={(e) => onInputChange('pagador', 'nome', e.target.value)}
              required={!isOptional}
            />
          </div>
          
          <div>
            <Label htmlFor="pagadorCpfCnpj">CPF/CNPJ</Label>
            <Input
              id="pagadorCpfCnpj"
              value={formData.pagador?.cpfCnpj || ''}
              onChange={(e) => onInputChange('pagador', 'cpfCnpj', e.target.value)}
              required={!isOptional}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="pagadorBanco">Banco</Label>
            <Input
              id="pagadorBanco"
              value={formData.pagador?.banco || ''}
              onChange={(e) => onInputChange('pagador', 'banco', e.target.value)}
              required={!isOptional}
            />
          </div>
          
          <div>
            <Label htmlFor="pagadorAgencia">Agência</Label>
            <Input
              id="pagadorAgencia"
              value={formData.pagador?.agencia || ''}
              onChange={(e) => onInputChange('pagador', 'agencia', e.target.value)}
              required={!isOptional}
            />
          </div>
          
          <div>
            <Label htmlFor="pagadorConta">Conta</Label>
            <Input
              id="pagadorConta"
              value={formData.pagador?.conta || ''}
              onChange={(e) => onInputChange('pagador', 'conta', e.target.value)}
              required={!isOptional}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
