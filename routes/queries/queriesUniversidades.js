var express = require("express");
var router  = express.Router();
var connection = require("./connection");

router.get("/", function(req, res){
	connection.query("SELECT * FROM escuela_o_universidad", function(err, results, fiels){
		if (err){
			console.log("ERROR: " + err.message);
			throw err;
		}
		res.send(results);
		console.log(results);
	});
});

router.post("/createUniversidad/:jsonDatos", function(req, res){
	var jsonDatos = JSON.parse(req.params.jsonDatos);
	connection.query("SELECT uni_nombre from escuela_o_universidad WHERE uni_nombre=?",
		[jsonDatos.uni_nombre], function(err, results, fiels){
		if (results.length < 1){
			connection.query("INSERT INTO escuela_o_universidad(uni_id_zona, uni_nombre) VALUES(?, ?)",
				[jsonDatos.id_zona, jsonDatos.zon_nuevo_nombre]);
			res.send("exito");
			console.log("exito");
		}else {
			res.send("fallo");
			console.log("fallo");
		}
	});
});

router.put("/updateUniversidad/:jsonDatos", function(req, res){
	var jsonDatos = JSON.parse(req.params.jsonDatos);
	connection.query("UPDATE escuela_o_universidad SET uni_id_zona=?, uni_nombre=? "+
		"WHERE id_escuela_o_universidad=?",
		[jsonDatos.id_zona, jsonDatos.uni_nuevo_nombre, jsonDatos.id_universidad],
		function(err, results, fiels){
		if(err) {
			console.log("ERROR: " + err.message);
			throw err;
		}
		res.send("exito");
	});
});

router.delete("/deleteUniversidad/:jsonDatos", function(req, res){
	var jsonDatos = JSON.parse(req.params.jsonDatos);
	connection.query("DELETE FROM escuela_o_universidad WHERE id_escuela_o_universidad=?",
		[jsonDatos.id_escuela_o_universidad], function(){
			res.send("ya elimine");
		});
});

module.exports = router;