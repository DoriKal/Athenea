var express = require("express");
var router  = express.Router();
var connection = require("./connection");

router.get("/", function (req, res){
	connection.query("SELECT * FROM grado_dificultad",
		function(err, results, fields){
			res.send(results);
			console.log("Peticion de grados de dificultad");
		});
});

router.post("/createGradoDeDificultad/:jsonGradoDificultad", function (req, res) {
	var jsonGradoDificultad = JSON.parse(req.params.jsonGradoDificultad);
	connection.query("INSERT INTO grado_dificultad(grd_nombre) VALUES(?)",
		[jsonGradoDificultad.grd_nombre], function(err, results, fields){
			if (err) {
				console.log("ERROR: " + err);
				throw err;
			}
			res.send("Se registró correctamente!");
			console.log("Alguien registró un grado de dificultad");
		});
});

router.put("/updateGradoDeDificultad/:jsonGradoDificultad", function (req, res) {
	var jsonGradoDificultad = JSON.parse(req.params.jsonGradoDificultad);
	connection.query("UPDATE grado_dificultad SET grd_nombre=? WHERE id_grado_dificultad=?",
		[jsonGradoDificultad.grd_nombre, jsonGradoDificultad.id_grado_dificultad],
		function (err, results, fields) {
			if (err) {
				console.log("ERROR: " + err);
				throw err;
			}
			res.send("Se editó correctamente");
			console.log("Se editó correctamente");
		});
});

router.delete("/deleteGradoDeDificultad/:jsonGradoDificultad", function (req, res) {
	var jsonGradoDificultad = JSON.parse(req.params.jsonGradoDificultad);
	connection.query("DELETE FROM grado_dificultad WHERE id_grado_dificultad=?",
		[jsonGradoDificultad.id_grado_dificultad],
		function (err, results, fields) {
			if (err) {
				console.log("ERROR: " + err);
				throw err;
			}
			res.send("Ya elimine el registro");
			console.log("se eliminó correctamente");
		});
});

module.exports = router;