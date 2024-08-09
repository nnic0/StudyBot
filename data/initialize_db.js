const fs = require('fs');
const mysql = require("mysql");
require('dotenv').config();


const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const sqlDb = fs.readFileSync('squema.sql', 'utf8');

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida.');

  connection.query(sqlDb, (err, results) => {
    if (err) {
      console.error('Error al ejecutar el script SQL:', err);
    } else {
      console.log('Script SQL ejecutado correctamente.');
    }

    connection.end((err) => {
      if (err) {
        console.error('Error al cerrar la conexión:', err);
      } else {
        console.log('Conexión cerrada.');
      }
    });
  });
});
