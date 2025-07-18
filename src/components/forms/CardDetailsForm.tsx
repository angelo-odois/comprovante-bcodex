import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentData } from '@/types/payment';

interface CardDetailsFormProps {
  formData: Partial<PaymentData>;
  onInputChange: (section: string, field: string, value: string | number | Date) => void;
}

export const CardDetailsForm: React.FC<CardDetailsFormProps> = ({
  formData,
  onInputChange
}) => {
  // Só mostra se o tipo for Cartão
  if (formData.tipo !== 'Cartão') {
    return null;
  }

  const bandeiras = [
    'Visa',
    'Mastercard', 
    'American Express',
    'Elo',
    'Hipercard',
    'Diners Club',
    'Discover',
    'JCB',
    'Aura',
    'Sorocred'
  ];

  const parcelas = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Cartão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="bandeira">Bandeira do Cartão *</Label>
            <Select
              value={formData.dadosCartao?.bandeira || ''}
              onValueChange={(value) => onInputChange('dadosCartao', 'bandeira', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a bandeira" />
              </SelectTrigger>
              <SelectContent>
                {bandeiras.map((bandeira) => (
                  <SelectItem key={bandeira} value={bandeira}>
                    {bandeira}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="ultimosDigitos">Últimos 4 Dígitos *</Label>
            <Input
              id="ultimosDigitos"
              value={formData.dadosCartao?.ultimosDigitos || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                onInputChange('dadosCartao', 'ultimosDigitos', value);
              }}
              placeholder="1234"
              maxLength={4}
              pattern="[0-9]{4}"
              required
            />
          </div>

          <div>
            <Label htmlFor="parcelas">Parcelas *</Label>
            <Select
              value={formData.dadosCartao?.parcelas?.toString() || '1'}
              onValueChange={(value) => onInputChange('dadosCartao', 'parcelas', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Nº de parcelas" />
              </SelectTrigger>
              <SelectContent>
                {parcelas.map((parcela) => (
                  <SelectItem key={parcela} value={parcela.toString()}>
                    {parcela}x {parcela === 1 ? '(à vista)' : '(parcelado)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>💳 <strong>Informações adicionais:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Informe apenas os 4 últimos dígitos do cartão por segurança</li>
            <li>A bandeira deve corresponder ao tipo do cartão utilizado</li>
            <li>Número de parcelas refere-se ao parcelamento da transação</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};