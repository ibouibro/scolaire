const mysql = require("mysql");


// Create a connection to the database
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "scolaire",
  connectionLimit : 10,
  port: 3306
});



module.exports = connection;