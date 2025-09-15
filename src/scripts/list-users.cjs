const { Pool } = require('pg');

const connectionString = "postgres://postgres:vcClbZixT5W8M6wiBf6oocvrnsGrEPG0EGlvcSnKZ7sGhIQMkrGNxWAsgoH87cfC@212.85.13.91:5432/bcodex";

const pool = new Pool({
  connectionString,
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function listUsers() {
  console.log('👥 Listando todos os usuários do sistema...\n');

  try {
    const client = await pool.connect();
    console.log('✅ Conectado ao banco de dados');

    // Buscar todos os usuários
    const usersResult = await client.query(`
      SELECT
        u.id,
        u.email,
        p.full_name,
        p.company_name,
        u.created_at
      FROM public.users u
      JOIN public.profiles p ON u.id = p.id
      ORDER BY u.created_at DESC
    `);

    const users = usersResult.rows;

    console.log(`\n📊 Total de usuários: ${users.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. 👤 ${user.full_name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🏢 Empresa: ${user.company_name || 'Não informado'}`);
      console.log(`   📋 ID: ${user.id}`);
      console.log(`   📅 Criado: ${new Date(user.created_at).toLocaleString('pt-BR')}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    client.release();

  } catch (error) {
    console.error('\n❌ Erro ao listar usuários:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  listUsers()
    .then(() => {
      console.log('\n✅ Listagem finalizada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Falha na listagem');
      process.exit(1);
    });
}