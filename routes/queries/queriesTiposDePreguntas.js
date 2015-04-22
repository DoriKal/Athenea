var express = require("express");
var router  = express.Router();
var connection = require("./connection");

router.get("/", function(req, res){
	connection.query("SELECT id_tipo_pregunta,"+
		"tip_nombre FROM tipo_pregunta",function(err, results, fields){
			res.send(results);
			console.log(results);
	});
});

router.post("/createTipoDePregunta/:jsonTipoPregunta", function(req, res){
	var jsonTipoPregunta = JSON.parse(req.params.jsonTipoPregunta);
	connection.query("INSERT INTO tipo_pregunta(tip_nombre) VALUES(?)",
		[jsonTipoPregunta.tip_nombre],
		function(err, results, fields){
			if (err) {
				console.log(err.message);
				throw err;
			}
			res.send("Registro exitoso!");
			console.log("Alguien registro un tipo de pregunta!");
		});
});

router.put("/updateTipoDePregunta/:jsonTipoPregunta", function(req, res){
	var jsonTipoPregunta = JSON.parse(req.params.jsonTipoPregunta);
	connection.query("UPDATE tipo_pregunta SET tip_nombre=? WHERE id_tipo_pregunta=?",
		[jsonTipoPregunta.tip_nombre, jsonTipoPregunta.id_tipo_pregunta],
		function(err, results, fields){
			if (err) {
				console.log(err.message);
				throw err;
			}
			res.send("Actualización exitosa!");
			console.log("Alguien actualizo un tipo de pregunta!");
		});
});

router.delete("/deleteTipoDePregunta/:jsonTipoPregunta", function(req, res){
	var jsonTipoPregunta = JSON.parse(req.params.jsonTipoPregunta);
	connection.query("DELETE FROM tipo_pregunta WHERE id_tipo_pregunta=?",
		[jsonTipoPregunta.id_tipo_pregunta],
		function(err, results, fields){
			if (err) {
				console.log(err.message);
				throw err;
			}
			res.send("ELiminación exitosa!");
			console.log("Alguien elimino un tipo de pregunta!");
		});
});



module.exports = router;