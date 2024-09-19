import mysql from 'mysql2/promise';

// Detalles de la nueva base de datos en MySQL Workbench
var pool = mysql.createPool({
    host: 'localhost',
    port: 3306,  // O el host donde esté tu base de datos, si es remoto
    user: 'root',  // Cambia por el nombre de usuario que configuraste
    password: '12345',  // Cambia por la contraseña de ese usuario
    database: 'MindFulLife'  // El nombre de la nueva base de datos que creaste en MySQL Workbench
});

// Probar la conexión
pool.getConnection()
  .then(connection => {
    console.log("Conexión exitosa a la base de datos en MySQL Workbench");
    connection.release(); // Soltar la conexión después de probar
  })
  .catch(error => {
    console.error("Error al conectarse a la base de datos:", error.message);
  });

export default pool;
