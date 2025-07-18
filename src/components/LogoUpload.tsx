
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Image, CloudUpload } from 'lucide-react';
import { CompanyLogo } from '@/types/payment';

interface LogoUploadProps {
  onLogoChange: (logo: CompanyLogo | null) => void;
  currentLogo?: CompanyLogo | null;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({ onLogoChange, currentLogo }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onLogoChange({
          url: result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeLogo = () => {
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {currentLogo ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center p-6 border-2 border-dashed border-border rounded-xl bg-gradient-to-br from-muted/30 to-muted/60">
            <img 
              src={currentLogo.url} 
              alt="Logo da empresa" 
              className="max-h-24 max-w-full object-contain rounded-lg shadow-sm"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Image className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{currentLogo.name}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={removeLogo}
              className="text-destructive hover:text-destructive border-destructive/20 hover:border-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Remover
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragOver 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full transition-colors ${
              dragOver ? 'bg-primary/10' : 'bg-muted'
            }`}>
              <CloudUpload className={`h-8 w-8 transition-colors ${
                dragOver ? 'text-primary' : 'text-muted-foreground'
              }`} />
            </div>
            <div className="space-y-2">
              <p className="text-base font-medium">
                Arraste e solte uma imagem aqui
              </p>
              <p className="text-sm text-muted-foreground">
                ou clique para selecionar um arquivo
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 hover:bg-accent h-10 px-6"
            >
              <Upload className="h-4 w-4 mr-2" />
              Selecionar Arquivo
            </Button>
            <p className="text-xs text-muted-foreground">
              PNG, JPG ou JPEG até 5MB
            </p>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};
