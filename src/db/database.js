const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    database: "study",
    user: "root",
    password: "root",
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
        console.log("Consulta y valores de la consulta: ", query, values);
        if (err) {
            console.error("Error al ejecutar la consulta:", err);
            throw err;
        }
        callback(result);
        console.log("Resultados de la función executeQuery: ", result);
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

// Exporta las funciones
module.exports = {
    executeQuery: executeQuery,
    closeConnection: closeConnection,
    runQuery: runQuery
};
