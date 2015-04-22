var express = require("express");
var router  = express.Router();
var connection = require("./connection");

/**
*	Aqui se regresarán todas las áreas del conocimiento
*/
router.get("/", function(req, res){
	connection.query("SELECT * FROM area_conocimiento",
		function(err, results, fields){
			if (err) {
				console.log("ERROR: " + err.message);
				throw err;
			}
			res.send(results);
		});
});

/**
*	Aquí se creará una nueva área del conocimiento
*/

router.post("/createAreaConocimiento/:jsonAreaConocimiento", function(req, res){
	var jsonAreaConocimiento = JSON.parse(req.params.jsonAreaConocimiento);
	connection.query("INSERT INTO area_conocimiento(arc_nombre) VALUES(?)",
		[jsonAreaConocimiento.nombreAreaConocimiento],
		function(err, results, fields){
			if (err) {
				console.log("ERROR: " + err.message);
				throw err;
			}
			res.send(results);
		});
});

/**
*	Aquí se editará un área del conocimiento
*/

router.put("/updateAreaConocimiento/:jsonAreaConocimiento", function(req, res){
	var jsonAreaConocimiento = JSON.parse(req.params.jsonAreaConocimiento);
	connection.query("UPDATE area_conocimiento SET arc_nombre=? "+
		"WHERE id_area_conocimiento=?", [jsonAreaConocimiento.nombreAreaConocimiento,
		jsonAreaConocimiento.id_area_conocimiento],
		function(err, results, fields){
			if (err) {
				console.log("ERROR: " + err.message);
				throw err;
			}
			res.send("Actualizacion correcta!");
		});
});

/**
*	Aquí se eliminará un área del conocimiento
*/

router.delete("/deleteAreaConocimiento/:jsonAreaConocimiento", function(req, res){
	var jsonAreaConocimiento = JSON.parse(req.params.jsonAreaConocimiento);
	connection.query("DELETE FROM area_conocimiento WHERE id_area_conocimiento=?",
		[jsonAreaConocimiento.id_area_conocimiento], function(err, results, fields){
			if (err) {
				console.log("ERROR: " + err.message);
				throw err;
			}
			res.send("Eliminación correcta!");
		});
});

module.exports = router;