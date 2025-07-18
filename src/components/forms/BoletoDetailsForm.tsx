
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentData } from '@/types/payment';

interface BoletoDetailsFormProps {
  formData: Partial<PaymentData>;
  onInputChange: (section: string, field: string, value: string | number | Date) => void;
}

export const BoletoDetailsForm: React.FC<BoletoDetailsFormProps> = ({
  formData,
  onInputChange
}) => {
  // Só mostra se o tipo for Boleto
  if (formData.tipo !== 'Boleto') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Boleto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="documento">Documento *</Label>
            <Input
              id="documento"
              value={formData.dadosBoleto?.documento || ''}
              onChange={(e) => onInputChange('dadosBoleto', 'documento', e.target.value)}
              placeholder="Ex: 000001234567890"
              required
            />
          </div>

          <div>
            <Label htmlFor="codigoBarras">Código de Barras *</Label>
            <Input
              id="codigoBarras"
              value={formData.dadosBoleto?.codigoBarras || ''}
              onChange={(e) => onInputChange('dadosBoleto', 'codigoBarras', e.target.value)}
              placeholder="Ex: 00190000090012345678901234567890123456"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dataVencimento">Data de Vencimento *</Label>
            <Input
              id="dataVencimento"
              type="date"
              value={formData.dadosBoleto?.dataVencimento ? 
                new Date(formData.dadosBoleto.dataVencimento).toISOString().slice(0, 10) : ''}
              onChange={(e) => onInputChange('dadosBoleto', 'dataVencimento', new Date(e.target.value))}
              required
            />
          </div>

          <div>
            <Label htmlFor="dataPagamento">Data do Pagamento *</Label>
            <Input
              id="dataPagamento"
              type="date"
              value={formData.dadosBoleto?.dataPagamento ? 
                new Date(formData.dadosBoleto.dataPagamento).toISOString().slice(0, 10) : ''}
              onChange={(e) => onInputChange('dadosBoleto', 'dataPagamento', new Date(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="valorDocumento">Valor do Documento (R$) *</Label>
            <Input
              id="valorDocumento"
              type="number"
              step="0.01"
              value={formData.dadosBoleto?.valorDocumento || ''}
              onChange={(e) => onInputChange('dadosBoleto', 'valorDocumento', parseFloat(e.target.value) || 0)}
              placeholder="0,00"
              required
            />
          </div>

          <div>
            <Label htmlFor="multa">(+) Multa (R$)</Label>
            <Input
              id="multa"
              type="number"
              step="0.01"
              value={formData.dadosBoleto?.multa || ''}
              onChange={(e) => onInputChange('dadosBoleto', 'multa', parseFloat(e.target.value) || 0)}
              placeholder="0,00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="juros">(+) Juros (R$)</Label>
            <Input
              id="juros"
              type="number"
              step="0.01"
              value={formData.dadosBoleto?.juros || ''}
              onChange={(e) => onInputChange('dadosBoleto', 'juros', parseFloat(e.target.value) || 0)}
              placeholder="0,00"
            />
          </div>

          <div>
            <Label htmlFor="descontos">(-) Descontos (R$)</Label>
            <Input
              id="descontos"
              type="number"
              step="0.01"
              value={formData.dadosBoleto?.descontos || ''}
              onChange={(e) => onInputChange('dadosBoleto', 'descontos', parseFloat(e.target.value) || 0)}
              placeholder="0,00"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
