
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Eye, 
  Trash2, 
  Star, 
  FileText,
  CreditCard,
  Banknote,
  Zap,
  Loader2
} from 'lucide-react';
import { ReceiptTemplate } from '@/types/template';
import { useTemplates } from '@/hooks/useTemplates';
import { toast } from '@/hooks/use-toast';

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
  const { templates, loading, deleteTemplate } = useTemplates();

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
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Boleto':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'TED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'DOC':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Cartão':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleDelete = async (template: ReceiptTemplate) => {
    if (window.confirm(`Tem certeza que deseja excluir o template "${template.name}"?`)) {
      try {
        await deleteTemplate(template.id);
        toast({
          title: "Template removido",
          description: "Template foi removido com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro ao remover template",
          description: "Não foi possível remover o template.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando templates...</span>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhum template encontrado</h3>
        <p className="text-muted-foreground mb-4">
          Crie seu primeiro template para começar a gerar comprovantes personalizados.
        </p>
      </div>
    );
  }

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
                {template.config.showPayer && (
                  <Badge variant="outline" className="text-xs">
                    Com pagador
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(template)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
