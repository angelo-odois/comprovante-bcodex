const { Pool } = require('pg');

// Conectar ao PostgreSQL sem especificar o banco (usa 'postgres' por padrão)
const connectionStringBase = "postgres://postgres:vcClbZixT5W8M6wiBf6oocvrnsGrEPG0EGlvcSnKZ7sGhIQMkrGNxWAsgoH87cfC@212.85.13.91:5432/postgres";

const pool = new Pool({
  connectionString: connectionStringBase,
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function createDatabase() {
  console.log('🚀 Criando banco de dados bcodex...');

  try {
    const client = await pool.connect();
    console.log('✅ Conectado ao PostgreSQL');

    // Verificar se o banco já existe
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'bcodex'"
    );

    if (result.rows.length === 0) {
      // Criar o banco de dados
      await client.query('CREATE DATABASE bcodex');
      console.log('✅ Banco de dados "bcodex" criado com sucesso');
    } else {
      console.log('ℹ️  Banco de dados "bcodex" já existe');
    }

    client.release();
    console.log('🎉 Processo de criação do banco finalizado!');

  } catch (error) {
    console.error('❌ Erro durante a criação do banco:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  createDatabase()
    .then(() => {
      console.log('✅ Banco criado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha na criação do banco:', error);
      process.exit(1);
    });
}