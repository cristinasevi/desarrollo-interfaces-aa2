const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cinescope',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

// Verificar conexión al arrancar
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado a MySQL/MariaDB');
    connection.release();
  } catch (error) {
    console.error('Error conectando a la base de datos:', error.message);
    process.exit(1);
  }
};

testConnection();

module.exports = pool;
