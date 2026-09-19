const mysql = require('mysql2/promise'); 

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // <-- Esto es obligatorio para conectar con Aiven
  }
});

pool.getConnection()
  .then(connection => {
    console.log('¡Conectado exitosamente a la base de datos MariaDB en la nube!');
    connection.release();
  })
  .catch(err => {
    console.error('Error conectando a la base de datos:', err.message);
  });

module.exports = pool;