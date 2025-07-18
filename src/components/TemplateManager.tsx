
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Copy, Settings } from 'lucide-react';
import { ReceiptTemplate } from '@/types/template';
import { TemplateList } from './templates/TemplateList';
import { TemplateEditor } from './templates/TemplateEditor';
import { TemplatePreview } from './templates/TemplatePreview';

interface TemplateManagerProps {
  onSelectTemplate: (template: ReceiptTemplate) => void;
  onCreateReceipt: (template: ReceiptTemplate) => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  onSelectTemplate,
  onCreateReceipt
}) => {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedTemplate, setSelectedTemplate] = useState<ReceiptTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<ReceiptTemplate | null>(null);

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setActiveTab('editor');
  };

  const handleEditTemplate = (template: ReceiptTemplate) => {
    setEditingTemplate(template);
    setActiveTab('editor');
  };

  const handlePreviewTemplate = (template: ReceiptTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('preview');
  };

  const handleUseTemplate = (template: ReceiptTemplate) => {
    // Selecionar o template e chamar a função de criar recibo
    onSelectTemplate(template);
    onCreateReceipt(template);
  };

  const handleTemplateSaved = (template: ReceiptTemplate) => {
    setActiveTab('list');
    setEditingTemplate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Templates</h2>
          <p className="text-muted-foreground">
            Crie e gerencie templates personalizados para seus comprovantes
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Template
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Meus Templates</TabsTrigger>
          <TabsTrigger value="editor">
            {editingTemplate ? 'Editar Template' : 'Criar Template'}
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!selectedTemplate}>
            Visualizar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <TemplateList
            onEdit={handleEditTemplate}
            onPreview={handlePreviewTemplate}
            onSelect={onSelectTemplate}
            onCreate={handleUseTemplate}
          />
        </TabsContent>

        <TabsContent value="editor">
          <TemplateEditor
            template={editingTemplate}
            onSave={handleTemplateSaved}
            onCancel={() => setActiveTab('list')}
          />
        </TabsContent>

        <TabsContent value="preview">
          {selectedTemplate && (
            <TemplatePreview
              template={selectedTemplate}
              onEdit={() => handleEditTemplate(selectedTemplate)}
              onUse={() => handleUseTemplate(selectedTemplate)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
