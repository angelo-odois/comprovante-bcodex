
-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de logos de empresa
CREATE TABLE public.company_logos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de templates
CREATE TABLE public.receipt_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('PIX', 'TED', 'DOC', 'Boleto', 'Cartão')),
  is_default BOOLEAN DEFAULT false,
  config JSONB NOT NULL DEFAULT '{}',
  default_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de comprovantes
CREATE TABLE public.receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.receipt_templates(id) ON DELETE SET NULL,
  logo_id UUID REFERENCES public.company_logos(id) ON DELETE SET NULL,
  
  -- Dados do pagamento
  payment_type TEXT NOT NULL CHECK (payment_type IN ('PIX', 'TED', 'DOC', 'Boleto', 'Cartão')),
  amount DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Aprovado', 'Pendente', 'Rejeitado')),
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Dados do pagador
  payer_name TEXT NOT NULL,
  payer_document TEXT NOT NULL,
  payer_bank TEXT NOT NULL,
  payer_agency TEXT NOT NULL,
  payer_account TEXT NOT NULL,
  
  -- Dados do beneficiário
  beneficiary_name TEXT,
  beneficiary_document TEXT,
  beneficiary_bank TEXT,
  beneficiary_agency TEXT,
  beneficiary_account TEXT,
  beneficiary_pix_key TEXT,
  
  -- Dados da transação
  auth_number TEXT NOT NULL,
  end_to_end TEXT,
  description TEXT,
  fees DECIMAL(10,2) DEFAULT 0,
  
  -- Dados específicos do boleto
  boleto_document TEXT,
  boleto_barcode TEXT,
  boleto_due_date DATE,
  boleto_payment_date DATE,
  boleto_document_value DECIMAL(15,2),
  boleto_fine DECIMAL(10,2) DEFAULT 0,
  boleto_interest DECIMAL(10,2) DEFAULT 0,
  boleto_discount DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Políticas RLS para company_logos
CREATE POLICY "Users can view their own logos" 
  ON public.company_logos 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own logos" 
  ON public.company_logos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logos" 
  ON public.company_logos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logos" 
  ON public.company_logos 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para receipt_templates
CREATE POLICY "Users can view their own templates" 
  ON public.receipt_templates 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own templates" 
  ON public.receipt_templates 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" 
  ON public.receipt_templates 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" 
  ON public.receipt_templates 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para receipts
CREATE POLICY "Users can view their own receipts" 
  ON public.receipts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own receipts" 
  ON public.receipts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own receipts" 
  ON public.receipts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own receipts" 
  ON public.receipts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_company_logos
    BEFORE UPDATE ON public.company_logos
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_receipt_templates
    BEFORE UPDATE ON public.receipt_templates
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_receipts
    BEFORE UPDATE ON public.receipts
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Criar bucket para logos de empresa
INSERT INTO storage.buckets (id, name, public) 
VALUES ('company-logos', 'company-logos', true);

-- Políticas para o bucket de logos
CREATE POLICY "Users can upload their own logos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own logos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own logos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own logos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Índices para melhorar performance
CREATE INDEX idx_company_logos_user_id ON public.company_logos(user_id);
CREATE INDEX idx_receipt_templates_user_id ON public.receipt_templates(user_id);
CREATE INDEX idx_receipt_templates_type ON public.receipt_templates(type);
CREATE INDEX idx_receipts_user_id ON public.receipts(user_id);
CREATE INDEX idx_receipts_payment_type ON public.receipts(payment_type);
CREATE INDEX idx_receipts_status ON public.receipts(status);
CREATE INDEX idx_receipts_created_at ON public.receipts(created_at DESC);
