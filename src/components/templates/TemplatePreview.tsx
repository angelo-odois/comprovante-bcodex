
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, FileText } from 'lucide-react';
import { ReceiptTemplate } from '@/types/template';
import { PaymentReceipt } from '@/components/PaymentReceipt';
import { PaymentData } from '@/types/payment';

interface TemplatePreviewProps {
  template: ReceiptTemplate;
  onEdit: () => void;
  onUse: () => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  onEdit,
  onUse
}) => {
  // Dados mockados para preview
  const mockData: PaymentData = {
    id: 'PREVIEW123',
    tipo: template.type,
    valor: 1250.50,
    dataHora: new Date(),
    status: 'Aprovado',
    pagador: {
      nome: 'João Silva Santos',
      cpfCnpj: '12345678901',
      banco: '341 - Itaú Unibanco S.A.',
      agencia: '1234',
      conta: '56789-0'
    },
    beneficiario: {
      nome: 'Empresa Exemplo Ltda',
      cpfCnpj: '98765432000198',
      banco: '237 - Banco Bradesco S.A.',
      agencia: '9876',
      conta: '54321-8',
      chavePix: 'empresa@exemplo.com.br'
    },
    transacao: {
      numeroAutenticacao: 'AUTH123456789',
      endToEnd: 'E12345678202412345678901234567890',
      descricao: 'Pagamento de serviços - Preview do template'
    },
    ...(template.type === 'Boleto' && {
      dadosBoleto: {
        documento: '000001234567890',
        codigoBarras: '00190000090012345678901234567890123456',
        dataVencimento: new Date('2024-12-15'),
        dataPagamento: new Date(),
        valorDocumento: 1200.00,
        multa: 25.50,
        juros: 30.00,
        descontos: 5.00
      }
    })
  };

  const mockLogo = {
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNDAiIGZpbGw9IndoaXRlIi8+PHRleHQgeD0iNTAiIHk9IjI1IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9nbyBFeGVtcGxvPC90ZXh0Pjwvc3ZnPg==',
    name: 'logo-exemplo.svg'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {template.name}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {template.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{template.type}</Badge>
              {template.isDefault && (
                <Badge variant="secondary">Padrão</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button onClick={onUse} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Usar Este Template
            </Button>
            <Button variant="outline" onClick={onEdit} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Editar Template
            </Button>
          </div>
          
          {/* Configurações do template */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Layout</p>
              <p className="font-medium capitalize">{template.config.styling.layout}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Fonte</p>
              <p className="font-medium capitalize">{template.config.styling.fontSize}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Logo</p>
              <p className="font-medium">{template.config.showLogo ? 'Sim' : 'Não'}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Beneficiário</p>
              <p className="font-medium">{template.config.showBeneficiary ? 'Sim' : 'Não'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview do recibo */}
      <div id="template-preview">
        <PaymentReceipt
          data={mockData}
          logo={template.config.showLogo ? mockLogo : null}
          onDownloadPDF={() => {}}
          onPrint={() => {}}
        />
      </div>
    </div>
  );
};
