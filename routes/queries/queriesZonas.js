var express = require("express");
var router  = express.Router();
var connection = require("./connection");

router.get("/", function(req, res){
	connection.query("SELECT id_zona, zon_nombre FROM zona", function(err, results, fiels){
		if (err){
			console.log("ERROR: " + err.message);
			throw err;
		}
		res.send(results);
		console.log(results);
	});
});

router.post("/createZona/:jsonDatos", function(req, res){
	var jsonDatos = JSON.parse(req.params.jsonDatos);
	connection.query("SELECT zon_nombre FROM zona where zon_nombre=?",
		[jsonDatos.zon_nuevo_nombre], function(err, results, fiels){
		if (results.length < 1){
			connection.query("INSERT INTO zona(zon_nombre) VALUES(?)",
				[jsonDatos.zon_nuevo_nombre]);
			res.send("exito");
			console.log("exito");
		}else{
			res.send("fallo");
			console.log("fallo");
		}
	});
});

router.put("/updateZona/:jsonDatos", function(req, res){
	var jsonDatos = JSON.parse(req.params.jsonDatos);
	connection.query("UPDATE zona SET zon_nombre=? WHERE id_zona=?",
		[jsonDatos.zon_nombre_editar, jsonDatos.id_zona], function(err, results, fiels){
			if(err){
				console.log("ERROR: "+err.message);
				throw err;
			}
			console.log("Modificacion correcta!");
	});
	res.send("true");
});

router.delete("/deleteZona/:jsonDatos", function(req, res){
	var jsonDatos = JSON.parse(req.params.jsonDatos);
	connection.query("DELETE FROM zona WHERE id_zona=?",
		[jsonDatos.id_zona], function(){
			res.send("Zona eliminada correctamente!");
		});
});

module.exports = router;