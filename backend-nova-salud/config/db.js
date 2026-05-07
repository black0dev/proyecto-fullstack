const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  connectionTimeout: 10000,
};

let poolPromise = null;

async function getPool() {
  try {
    if (!poolPromise) {
      poolPromise = await sql.connect(dbConfig);
      console.log('Conectado a SQL Server');
    }
    return poolPromise;
  } catch (error) {
    console.error('Error al conectar a SQL Server:', error.message);
    throw error;
  }
}

module.exports = { getPool, sql };
