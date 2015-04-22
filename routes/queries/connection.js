var mysql = require("mysql");

var connection = mysql.createConnection({
	user : "root",
	password : "RAOR940203",
	host : "127.0.0.1",
	port : "3306"
});

connection.query("USE db_athenea;");

module.exports = connection;
