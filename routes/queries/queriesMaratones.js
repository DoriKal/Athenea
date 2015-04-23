var express = require("express");
var router  = express.Router();
var connection = require("./connection");
var encriptacion_athenea = require("./../encriptacion/encriptacion_athenea");

router.get("/", function(req, res){
	connection.query("SELECT * FROM maraton", function(err, results, fields){
		if (err){
			console.log("ERROR: " + err.message);
			throw err;
		}
		res.send(results);
		console.log(results);
	});
});

router.get("/getMaraton/:id_maraton", function(req, res){
	connection.query("SELECT * FROM maraton WHERE id_maraton=?",
		[req.params.id_maraton], function(err, results, fields){
			res.send(results);
		}
	);
});

router.get("/getCompetidoresEnMaraton/:id_maraton", function (req, res){
	connection.query("SELECT * from usuario_maraton LEFT JOIN usuario on"+
		" id_usuario=uma_id_usuario WHERE uma_id_maraton=?", [req.params.id_maraton],
		function(err, results, fields){
			if (err){
				console.log("ERROR: " + err.message);
			}
			// Aquí se mandan los competidores de un maraton especifico
			res.send(getCompetidoresDecodificados(results));
			console.log("Se enviaron los competidores de un maraton...");
		});
});

function getCompetidoresDecodificados(jsonCompetidores){
	for (var i = 0; i < jsonCompetidores.length; i++){
		jsonCompetidores[i].usu_contra = encriptacion_athenea.decifrar(
			jsonCompetidores[i].usu_contra
			);
	}
	return jsonCompetidores;
}

router.post("/createMaraton/:jsonMaraton", function(req, res){
	var jsonMaraton = JSON.parse(req.params.jsonMaraton);
	connection.query("SELECT mar_nombre from maraton WHERE mar_nombre=?",
		[jsonMaraton.mar_nombre],
		function(err, results, fields){
		if (results.length < 1){
			connection.query("INSERT INTO maraton(mar_nombre) VALUES(?)",
				[jsonMaraton.mar_nombre], function(err, results, fields){
					res.send("Exito");
					console.log("Exito al registrar un unevo maraton");
			});
		}
	});
});

router.post("/createCompetidorMaraton/:jsonCompetidor", function (req, res){
	// Primero tenemos que asegurarnos que el usuario del nuevo competidor este disponible
	jsonCompetidor = JSON.parse(req.params.jsonCompetidor);
	connection.query("SELECT id_usuario FROM usuario WHERE usu_usuario=?",
		[jsonCompetidor.usu_usuario], function (err, results, fields){
			if (err){
				console.log("ERROR: " + err.message);
			}
			if (!(results.length > 0) ) {
				connection.query("INSERT INTO usuario(usu_tipo_usuario, usu_nombre,"+
					"usu_usuario, usu_contra) "+
					"VALUES(?,?,?,?)", [3/*Tipo de usu competidor*/, jsonCompetidor.usu_nombre,
					jsonCompetidor.usu_usuario,
					encriptacion_athenea.cifrar(jsonCompetidor.usu_usuario)],
					function(err, results, fields){
						console.log(results);
						connection.query("SELECT id_usuario FROM usuario WHERE usu_usuario=?",
							[jsonCompetidor.usu_usuario],
							function (err, results, fields){
								connection.query("INSERT INTO usuario_maraton"+
									"(uma_id_maraton,uma_id_usuario) VALUES(?,?)",
									[jsonCompetidor.id_maraton, results[0].id_usuario]);
							});
					});
			}else{
				res.send("El usuario " + jsonCompetidor.usu_usuario + " ya existe!");
			}
		});
});

router.put("/updateMaraton/:jsonMaraton", function(req, res){
	var jsonMaraton = JSON.parse(req.params.jsonMaraton);
	connection.query("UPDATE maraton SET mar_nombre=? WHERE id_maraton=?",
		[jsonMaraton.mar_nombre, jsonMaraton.id_maraton],
		function(err, results, fields){
			res.send("Maraton autualizado correctamente!");
		});
});

router.put("/updateCompetidorMaraton/:jsonCompetidor", function (req, res){
	jsonCompetidor = JSON.parse(req.params.jsonCompetidor);
	jsonCompetidor.usu_contra = encriptacion_athenea.cifrar(
		jsonCompetidor.usu_contra
		);
	connection.query("SELECT id_usuario FROM usuario WHERE usu_usuario=? AND "+
		"id_usuario!=?", [jsonCompetidor.usu_usuario, jsonCompetidor.id_usuario],
		function(err, results){
			if (err){
				console.log("ERROR: " + err.message);
			}

			console.log(results);
			if(!(results.length > 0)){
				connection.query("UPDATE usuario SET usu_nombre=?,usu_usuario=?,usu_contra=? "+
					"WHERE id_usuario=?",
					[jsonCompetidor.usu_nombre, jsonCompetidor.usu_usuario,
					jsonCompetidor.usu_contra, jsonCompetidor.id_usuario], function(err, results){
						if (err){
							console.log("ERROR: " + err.message);
						}
						console.log("competidor editado");
					});
			}else{
				res.send("¡El nombre de usuario ya existe!");
			}
		});
});

router.delete("/deleteMaraton/:jsonMaraton", function(req, res){
	var jsonMaraton = JSON.parse(req.params.jsonMaraton);
	connection.query("DELETE FROM maraton WHERE id_maraton=?", [jsonMaraton.id_maraton],
		function(err, results, fields){
			if(err){
				console.log("ERROR: "+err.message);
				throw err;
			}
			res.send("Ya elimine un maraton!");
			console.log("Ya elimine un maraton!");
		});
});

router.delete("/deleteCompetidorMaraton/:jsonCompetidor", function(req, res){
	var jsonCompetidor = JSON.parse(req.params.jsonCompetidor);
	connection.query("DELETE FROM usuario_maraton WHERE uma_id_usuario=? AND "+
		"uma_id_maraton=?", [jsonCompetidor.id_usuario, jsonCompetidor.uma_id_maraton],
		function(err, results, fields){
			if(err){
				console.log("ERROR: "+err.message);
				throw err;
			}
			connection.query("DELETE FROM usuario WHERE id_usuario=?",
				[jsonCompetidor.id_usuario],
				function(err, results, fields){
					if(err){
						console.log("ERROR: "+err.message);
						throw err;
					}
					res.send("Ya elimine un maraton!");
					console.log("Ya elimine un maraton!");
				});
		});
});



module.exports = router;
