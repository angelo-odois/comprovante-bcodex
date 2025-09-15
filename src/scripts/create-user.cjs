const { Pool } = require('pg');
const readline = require('readline');

const connectionString = "postgres://postgres:vcClbZixT5W8M6wiBf6oocvrnsGrEPG0EGlvcSnKZ7sGhIQMkrGNxWAsgoH87cfC@212.85.13.91:5432/bcodex";

const pool = new Pool({
  connectionString,
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createUser() {
  console.log('🆕 Criando novo usuário...\n');

  try {
    // Coletar dados do usuário
    const email = await askQuestion('📧 Email: ');
    const fullName = await askQuestion('👤 Nome completo: ');
    const companyName = await askQuestion('🏢 Nome da empresa (opcional): ');
    const password = await askQuestion('🔐 Senha (opcional - deixe vazio): ');

    if (!email || !fullName) {
      throw new Error('Email e nome completo são obrigatórios!');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido!');
    }

    const client = await pool.connect();
    console.log('\n✅ Conectado ao banco de dados');

    // Verificar se o email já existe
    const existingUser = await client.query(
      'SELECT id FROM public.users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('❌ Este email já está em uso!');
    }

    // Criar usuário
    const userResult = await client.query(`
      INSERT INTO public.users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, created_at
    `, [email, password || null]);

    const userId = userResult.rows[0].id;
    console.log(`✅ Usuário criado com ID: ${userId}`);

    // Criar perfil
    await client.query(`
      INSERT INTO public.profiles (id, full_name, email, company_name)
      VALUES ($1, $2, $3, $4)
    `, [userId, fullName, email, companyName || null]);

    console.log('✅ Perfil criado');

    // Mostrar dados criados
    const userData = await client.query(`
      SELECT
        u.id,
        u.email,
        p.full_name,
        p.company_name,
        u.created_at
      FROM public.users u
      JOIN public.profiles p ON u.id = p.id
      WHERE u.id = $1
    `, [userId]);

    const user = userData.rows[0];

    console.log('\n🎉 Usuário criado com sucesso!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📋 ID: ${user.id}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Nome: ${user.full_name}`);
    console.log(`🏢 Empresa: ${user.company_name || 'Não informado'}`);
    console.log(`📅 Criado em: ${new Date(user.created_at).toLocaleString('pt-BR')}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    client.release();

  } catch (error) {
    console.error('\n❌ Erro ao criar usuário:', error.message);
    throw error;
  } finally {
    rl.close();
    await pool.end();
  }
}

if (require.main === module) {
  createUser()
    .then(() => {
      console.log('\n✅ Processo finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Falha na criação do usuário');
      process.exit(1);
    });
}