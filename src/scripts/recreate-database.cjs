const { Pool } = require('pg');

const connectionStringBase = "postgres://postgres:vcClbZixT5W8M6wiBf6oocvrnsGrEPG0EGlvcSnKZ7sGhIQMkrGNxWAsgoH87cfC@212.85.13.91:5432/postgres";
const connectionString = "postgres://postgres:vcClbZixT5W8M6wiBf6oocvrnsGrEPG0EGlvcSnKZ7sGhIQMkrGNxWAsgoH87cfC@212.85.13.91:5432/bcodex";

async function recreateDatabase() {
  console.log('🗑️  RECRIANDO BANCO DE DADOS COMPLETO...\n');

  // Conectar ao postgres para recriar o banco
  const poolBase = new Pool({
    connectionString: connectionStringBase,
    ssl: false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  try {
    const client = await poolBase.connect();
    console.log('✅ Conectado ao PostgreSQL');

    // Forçar encerramento de todas as conexões ao banco bcodex
    console.log('🔌 Encerrando conexões existentes...');
    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = 'bcodex' AND pid <> pg_backend_pid()
    `);

    // Remover banco se existir
    console.log('🗑️  Removendo banco existente...');
    await client.query('DROP DATABASE IF EXISTS bcodex');

    // Criar banco novo
    console.log('🆕 Criando banco novo...');
    await client.query('CREATE DATABASE bcodex');

    client.release();
    await poolBase.end();

    console.log('✅ Banco bcodex recriado com sucesso!\n');

  } catch (error) {
    console.error('❌ Erro ao recriar banco:', error);
    await poolBase.end();
    throw error;
  }

  // Agora conectar ao banco novo e criar estrutura
  const pool = new Pool({
    connectionString,
    ssl: false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  try {
    const client = await pool.connect();
    console.log('🔧 Criando estrutura do banco...\n');

    // Criar extensões
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Estrutura completa do banco
    const schema = `
-- Tabela de usuários
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de perfis
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de logos
CREATE TABLE public.company_logos (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de templates
CREATE TABLE public.receipt_templates (
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

-- Tabela de comprovantes
CREATE TABLE public.receipts (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.receipt_templates(id) ON DELETE SET NULL,
  logo_id UUID REFERENCES public.company_logos(id) ON DELETE SET NULL,

  payment_type TEXT NOT NULL CHECK (payment_type IN ('PIX', 'TED', 'DOC', 'Boleto', 'Cartão')),
  amount DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Aprovado', 'Pendente', 'Rejeitado')),
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL,

  payer_name TEXT NOT NULL,
  payer_document TEXT NOT NULL,
  payer_bank TEXT NOT NULL,
  payer_agency TEXT NOT NULL,
  payer_account TEXT NOT NULL,

  beneficiary_name TEXT,
  beneficiary_document TEXT,
  beneficiary_bank TEXT,
  beneficiary_agency TEXT,
  beneficiary_account TEXT,
  beneficiary_pix_key TEXT,

  auth_number TEXT NOT NULL,
  end_to_end TEXT,
  description TEXT,
  fees DECIMAL(10,2) DEFAULT 0,

  boleto_document TEXT,
  boleto_barcode TEXT,
  boleto_due_date DATE,
  boleto_payment_date DATE,
  boleto_document_value DECIMAL(15,2),
  boleto_fine DECIMAL(10,2) DEFAULT 0,
  boleto_interest DECIMAL(10,2) DEFAULT 0,
  boleto_discount DECIMAL(10,2) DEFAULT 0,

  card_brand TEXT,
  card_last_digits TEXT,
  card_installments INTEGER DEFAULT 1,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Função de trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER handle_updated_at_users
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

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

-- Índices
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_company_logos_user_id ON public.company_logos(user_id);
CREATE INDEX idx_receipt_templates_user_id ON public.receipt_templates(user_id);
CREATE INDEX idx_receipt_templates_type ON public.receipt_templates(type);
CREATE INDEX idx_receipts_user_id ON public.receipts(user_id);
CREATE INDEX idx_receipts_payment_type ON public.receipts(payment_type);
CREATE INDEX idx_receipts_status ON public.receipts(status);
CREATE INDEX idx_receipts_created_at ON public.receipts(created_at DESC);
`;

    console.log('📋 Executando schema...');
    await client.query(schema);

    // Criar usuários
    console.log('👤 Criando usuários...');

    // Admin
    const adminResult = await client.query(`
      INSERT INTO public.users (email, password_hash)
      VALUES ('admin@comprovante.com', 'admin123')
      RETURNING id
    `);
    const adminId = adminResult.rows[0].id;

    await client.query(`
      INSERT INTO public.profiles (id, full_name, email, company_name)
      VALUES ($1, 'Administrador Sistema', 'admin@comprovante.com', 'Comprovante M-53')
    `, [adminId]);

    // Ana Livia
    const anaResult = await client.query(`
      INSERT INTO public.users (email, password_hash)
      VALUES ('ana.livia@bcodex.io', '3C0dex@25')
      RETURNING id
    `);
    const anaId = anaResult.rows[0].id;

    await client.query(`
      INSERT INTO public.profiles (id, full_name, email, company_name)
      VALUES ($1, 'Ana Livia', 'ana.livia@bcodex.io', 'BCodex')
    `, [anaId]);

    // Templates padrão
    console.log('📄 Criando templates padrão...');
    await client.query(`
      INSERT INTO public.receipt_templates (user_id, name, description, type, is_default, config) VALUES
      ($1, 'Template PIX Padrão', 'Template padrão para comprovantes PIX', 'PIX', true, '{"showLogo": true, "showPayer": true, "showBeneficiary": true}'),
      ($1, 'Template TED Empresarial', 'Template para transferências TED', 'TED', false, '{"showLogo": true, "showPayer": true, "showBeneficiary": true, "showFees": true}'),
      ($2, 'Template PIX Ana', 'Template PIX personalizado', 'PIX', true, '{"showLogo": true, "showPayer": true, "showBeneficiary": true}')
    `, [adminId, anaId]);

    client.release();
    await pool.end();

    console.log('\n🎉 BANCO DE DADOS RECRIADO COM SUCESSO!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Usuários criados:');
    console.log('   • admin@comprovante.com (senha: admin123)');
    console.log('   • ana.livia@bcodex.io (senha: 3C0dex@25)');
    console.log('📄 Templates padrão criados');
    console.log('🗄️  Estrutura completa do banco restaurada');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Erro ao criar estrutura:', error);
    await pool.end();
    throw error;
  }
}

if (require.main === module) {
  recreateDatabase()
    .then(() => {
      console.log('\n✅ PROCESSO COMPLETO FINALIZADO!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ FALHA NA RECRIAÇÃO DO BANCO');
      process.exit(1);
    });
}