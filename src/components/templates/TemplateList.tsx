
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Eye, 
  Copy, 
  Trash2, 
  Star, 
  FileText,
  CreditCard,
  Banknote,
  Zap
} from 'lucide-react';
import { ReceiptTemplate } from '@/types/template';

interface TemplateListProps {
  onEdit: (template: ReceiptTemplate) => void;
  onPreview: (template: ReceiptTemplate) => void;
  onSelect: (template: ReceiptTemplate) => void;
  onCreate: (template: ReceiptTemplate) => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({
  onEdit,
  onPreview,
  onSelect,
  onCreate
}) => {
  // Templates de exemplo (depois virão de um store/API)
  const [templates] = useState<ReceiptTemplate[]>([
    {
      id: '1',
      name: 'PIX Padrão',
      description: 'Template padrão para pagamentos PIX',
      type: 'PIX',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      config: {
        showLogo: true,
        showBeneficiary: true,
        showDescription: true,
        showFees: false,
        customFields: [],
        styling: {
          headerColor: 'hsl(var(--primary))',
          accentColor: 'hsl(var(--accent))',
          fontSize: 'medium',
          layout: 'standard'
        }
      },
      defaultData: {}
    },
    {
      id: '2',
      name: 'Boleto Empresarial',
      description: 'Template para boletos com dados empresariais',
      type: 'Boleto',
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      config: {
        showLogo: true,
        showBeneficiary: false,
        showDescription: true,
        showFees: true,
        customFields: [],
        styling: {
          headerColor: 'hsl(var(--primary))',
          accentColor: 'hsl(var(--accent))',
          fontSize: 'medium',
          layout: 'detailed'
        }
      },
      defaultData: {}
    },
    {
      id: '3',
      name: 'TED Simplificado',
      description: 'Template minimalista para TEDs',
      type: 'TED',
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      config: {
        showLogo: false,
        showBeneficiary: true,
        showDescription: false,
        showFees: true,
        customFields: [],
        styling: {
          headerColor: 'hsl(var(--primary))',
          accentColor: 'hsl(var(--accent))',
          fontSize: 'small',
          layout: 'compact'
        }
      },
      defaultData: {}
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PIX':
        return <Zap className="h-4 w-4" />;
      case 'Boleto':
        return <FileText className="h-4 w-4" />;
      case 'TED':
      case 'DOC':
        return <Banknote className="h-4 w-4" />;
      case 'Cartão':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PIX':
        return 'bg-green-100 text-green-800';
      case 'Boleto':
        return 'bg-orange-100 text-orange-800';
      case 'TED':
        return 'bg-blue-100 text-blue-800';
      case 'DOC':
        return 'bg-purple-100 text-purple-800';
      case 'Cartão':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(template.type)}
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  {template.isDefault && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <Badge className={getTypeColor(template.type)}>
                  {template.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  {template.config.styling.layout}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {template.config.styling.fontSize}
                </Badge>
                {template.config.showLogo && (
                  <Badge variant="outline" className="text-xs">
                    Com logo
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onCreate(template)}
                  className="flex-1"
                >
                  Usar Template
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPreview(template)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(template)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
