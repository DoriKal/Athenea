var express = require("express");
var router  = express.Router();
var connection = require("./connection");

/**
*	Aqui se regresarán todas las áreas del conocimiento
*/
router.get("/", function(req, res){
	connection.query("SELECT id_etapa, eta_nombre FROM etapa",
		function(err, results, fields){
			if (err) {
				console.log("ERROR: " + err.message);
				throw err;
			}
			res.send(results);
		});
});

module.exports = router;