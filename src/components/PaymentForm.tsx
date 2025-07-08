
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { PaymentData } from '@/types/payment';

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
    setFormData(prev => ({
      ...prev,
      [section]: section === 'valor' || section === 'tipo' || section === 'status' || section === 'dataHora' 
        ? value 
        : {
            ...prev[section as keyof PaymentData],
            [field]: value
          }
    }));
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
      <Card>
        <CardHeader>
          <CardTitle>Dados da Transação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tipo">Tipo de Transação</Label>
              <Select 
                value={formData.tipo} 
                onValueChange={(value) => handleInputChange('tipo', '', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="TED">TED</SelectItem>
                  <SelectItem value="DOC">DOC</SelectItem>
                  <SelectItem value="Boleto">Boleto</SelectItem>
                  <SelectItem value="Cartão">Cartão</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor || ''}
                onChange={(e) => handleInputChange('valor', '', parseFloat(e.target.value))}
                placeholder="0,00"
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', '', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.transacao?.descricao || ''}
              onChange={(e) => handleInputChange('transacao', 'descricao', e.target.value)}
              placeholder="Descrição da transação"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Pagador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pagadorNome">Nome</Label>
              <Input
                id="pagadorNome"
                value={formData.pagador?.nome || ''}
                onChange={(e) => handleInputChange('pagador', 'nome', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="pagadorCpfCnpj">CPF/CNPJ</Label>
              <Input
                id="pagadorCpfCnpj"
                value={formData.pagador?.cpfCnpj || ''}
                onChange={(e) => handleInputChange('pagador', 'cpfCnpj', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="pagadorBanco">Banco</Label>
              <Input
                id="pagadorBanco"
                value={formData.pagador?.banco || ''}
                onChange={(e) => handleInputChange('pagador', 'banco', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="pagadorAgencia">Agência</Label>
              <Input
                id="pagadorAgencia"
                value={formData.pagador?.agencia || ''}
                onChange={(e) => handleInputChange('pagador', 'agencia', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="pagadorConta">Conta</Label>
              <Input
                id="pagadorConta"
                value={formData.pagador?.conta || ''}
                onChange={(e) => handleInputChange('pagador', 'conta', e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Beneficiário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="beneficiarioNome">Nome</Label>
              <Input
                id="beneficiarioNome"
                value={formData.beneficiario?.nome || ''}
                onChange={(e) => handleInputChange('beneficiario', 'nome', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="beneficiarioCpfCnpj">CPF/CNPJ</Label>
              <Input
                id="beneficiarioCpfCnpj"
                value={formData.beneficiario?.cpfCnpj || ''}
                onChange={(e) => handleInputChange('beneficiario', 'cpfCnpj', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="beneficiarioBanco">Banco</Label>
              <Input
                id="beneficiarioBanco"
                value={formData.beneficiario?.banco || ''}
                onChange={(e) => handleInputChange('beneficiario', 'banco', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="beneficiarioAgencia">Agência</Label>
              <Input
                id="beneficiarioAgencia"
                value={formData.beneficiario?.agencia || ''}
                onChange={(e) => handleInputChange('beneficiario', 'agencia', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="beneficiarioConta">Conta</Label>
              <Input
                id="beneficiarioConta"
                value={formData.beneficiario?.conta || ''}
                onChange={(e) => handleInputChange('beneficiario', 'conta', e.target.value)}
                required
              />
            </div>
          </div>

          {formData.tipo === 'PIX' && (
            <div>
              <Label htmlFor="chavePix">Chave PIX</Label>
              <Input
                id="chavePix"
                value={formData.beneficiario?.chavePix || ''}
                onChange={(e) => handleInputChange('beneficiario', 'chavePix', e.target.value)}
                placeholder="CPF, e-mail, telefone ou chave aleatória"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" size="lg">
        Gerar Comprovante
      </Button>
    </form>
  );
};
