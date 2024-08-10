const mysql = require("mysql");
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: "3306",
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    init_command: "SET name utf8mb4;",
    charset: "utf8mb4",
});

connection.connect(function (err) {
    if (err) {
        console.error("Error al conectar a la base de datos:", err);
        throw err;
    }
    console.log("Conexión a la base de datos realizada con exito!");
});

function executeQuery(query, values, callback = () => {}) {
    connection.query(query, values, function (err, result) {
        if (err) {
            throw err;
        }
        callback(result);
    });
}

function runQuery(query, values) {
    return new Promise((resolve, reject) => {
        connection.query(query, values, function (err, result) {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

function closeConnection() {
    connection.end(function (err) {
        if (err) {
            console.error("Error al cerrar la conexión:", err);
            throw err;
        }
        console.log("Conexión a la base de datos MySQL cerrada.");
    });
}

module.exports = {
    executeQuery: executeQuery,
    closeConnection: closeConnection,
    runQuery: runQuery
};
