const { Pool } = require('pg');

const connectionString = "postgres://postgres:vcClbZixT5W8M6wiBf6oocvrnsGrEPG0EGlvcSnKZ7sGhIQMkrGNxWAsgoH87cfC@212.85.13.91:5432/bcodex";

const pool = new Pool({
  connectionString,
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function testConnection() {
  console.log('🔍 Testando conexão com o banco de dados...');

  try {
    const client = await pool.connect();
    console.log('✅ Conectado ao PostgreSQL com sucesso');

    // Listar todas as tabelas criadas
    console.log('\n📊 Tabelas criadas:');
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    tablesResult.rows.forEach(row => {
      console.log(`  • ${row.table_name}`);
    });

    // Verificar estrutura da tabela users
    console.log('\n👤 Estrutura da tabela users:');
    const usersStructure = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);

    usersStructure.rows.forEach(row => {
      console.log(`  • ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

    // Verificar estrutura da tabela receipts
    console.log('\n🧾 Estrutura da tabela receipts (primeiras 10 colunas):');
    const receiptsStructure = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'receipts' AND table_schema = 'public'
      ORDER BY ordinal_position
      LIMIT 10
    `);

    receiptsStructure.rows.forEach(row => {
      console.log(`  • ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

    // Verificar índices
    console.log('\n📇 Índices criados:');
    const indexesResult = await client.query(`
      SELECT indexname, tablename
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `);

    indexesResult.rows.forEach(row => {
      console.log(`  • ${row.indexname} (${row.tablename})`);
    });

    // Teste básico de inserção e consulta
    console.log('\n🧪 Executando teste básico...');

    // Criar um usuário de teste
    const userResult = await client.query(`
      INSERT INTO public.users (email, password_hash)
      VALUES ('teste@exemplo.com', 'hash_teste')
      RETURNING id, email, created_at
    `);

    const userId = userResult.rows[0].id;
    console.log(`✅ Usuário criado: ${userResult.rows[0].email} (ID: ${userId})`);

    // Criar perfil para o usuário
    await client.query(`
      INSERT INTO public.profiles (id, full_name, email, company_name)
      VALUES ($1, 'Usuário Teste', 'teste@exemplo.com', 'Empresa Teste')
    `, [userId]);
    console.log('✅ Perfil criado');

    // Consultar dados
    const profileResult = await client.query(`
      SELECT u.email, p.full_name, p.company_name, p.created_at
      FROM public.users u
      JOIN public.profiles p ON u.id = p.id
      WHERE u.email = 'teste@exemplo.com'
    `);

    if (profileResult.rows.length > 0) {
      const profile = profileResult.rows[0];
      console.log('✅ Dados recuperados:');
      console.log(`  • Email: ${profile.email}`);
      console.log(`  • Nome: ${profile.full_name}`);
      console.log(`  • Empresa: ${profile.company_name}`);
      console.log(`  • Criado em: ${profile.created_at}`);
    }

    // Limpar dados de teste
    await client.query(`DELETE FROM public.users WHERE email = 'teste@exemplo.com'`);
    console.log('✅ Dados de teste removidos');

    client.release();
    console.log('\n🎉 Todos os testes passaram! O banco está funcionando corretamente.');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  testConnection()
    .then(() => {
      console.log('✅ Teste de conexão finalizado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha no teste de conexão:', error);
      process.exit(1);
    });
}