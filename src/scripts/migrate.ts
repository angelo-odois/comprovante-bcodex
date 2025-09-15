import pool from '../lib/database';

async function runMigrations() {
  console.log('🚀 Iniciando migrações do banco de dados...');

  try {
    // Conectar ao banco
    const client = await pool.connect();
    console.log('✅ Conectado ao PostgreSQL');

    // Criar schema public se não existir
    await client.query('CREATE SCHEMA IF NOT EXISTS public');

    // Criar extensões necessárias
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    console.log('📋 Executando migração principal...');

    // Primeira migração - estrutura principal (adaptada para PostgreSQL puro)
    const migration1 = `
-- Criar tabela de usuários (substitui auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de logos de empresa
CREATE TABLE IF NOT EXISTS public.company_logos (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de templates
CREATE TABLE IF NOT EXISTS public.receipt_templates (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS public.receipts (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
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
`;

    await client.query(migration1);
    console.log('✅ Migração principal executada');

    // Segunda migração - colunas do cartão
    console.log('📋 Executando migração de cartão...');
    const migration2 = `
-- Add card-specific columns to receipts table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'receipts' AND column_name = 'card_brand') THEN
        ALTER TABLE public.receipts ADD COLUMN card_brand TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'receipts' AND column_name = 'card_last_digits') THEN
        ALTER TABLE public.receipts ADD COLUMN card_last_digits TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'receipts' AND column_name = 'card_installments') THEN
        ALTER TABLE public.receipts ADD COLUMN card_installments INTEGER DEFAULT 1;
    END IF;
END $$;
`;

    await client.query(migration2);
    console.log('✅ Migração de cartão executada');

    // Função para atualizar updated_at automaticamente
    console.log('📋 Criando funções e triggers...');
    const functions = `
-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS handle_updated_at_users ON public.users;
CREATE TRIGGER handle_updated_at_users
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_company_logos ON public.company_logos;
CREATE TRIGGER handle_updated_at_company_logos
    BEFORE UPDATE ON public.company_logos
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_receipt_templates ON public.receipt_templates;
CREATE TRIGGER handle_updated_at_receipt_templates
    BEFORE UPDATE ON public.receipt_templates
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_receipts ON public.receipts;
CREATE TRIGGER handle_updated_at_receipts
    BEFORE UPDATE ON public.receipts
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
`;

    await client.query(functions);
    console.log('✅ Funções e triggers criados');

    // Criar índices
    console.log('📋 Criando índices...');
    const indexes = `
-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_company_logos_user_id ON public.company_logos(user_id);
CREATE INDEX IF NOT EXISTS idx_receipt_templates_user_id ON public.receipt_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_receipt_templates_type ON public.receipt_templates(type);
CREATE INDEX IF NOT EXISTS idx_receipts_user_id ON public.receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_payment_type ON public.receipts(payment_type);
CREATE INDEX IF NOT EXISTS idx_receipts_status ON public.receipts(status);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON public.receipts(created_at DESC);
`;

    await client.query(indexes);
    console.log('✅ Índices criados');

    client.release();
    console.log('🎉 Migrações executadas com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante as migrações:', error);
    throw error;
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('✅ Processo de migração finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha na migração:', error);
      process.exit(1);
    });
}

export default runMigrations;