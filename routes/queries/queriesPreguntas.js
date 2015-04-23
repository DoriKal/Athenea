var express = require("express");
var router  = express.Router();
var connection = require("./connection");
var encriptacion_athenea = require("./../encriptacion/encriptacion_athenea");

router.get("/:limitInicio/:limitFin/", function(req, res){
	var limitInicio = req.params.limitInicio;
	var limitFin = req.params.limitFin;
	connection.query("");
	/*ARREGLAR PARA PODER HACER PAGINACIÓN*/
});

/*	Obetener todos las preguntas */
router.get("/", function(req, res){
	connection.query("SELECT "+
			/*	Datos pregunta	*/
			"id_pregunta,pre_pregunta,pre_opcionA,pre_opcionB,pre_opcionC,"+
			"pre_opcionC,pre_respuesta_correcta,pre_justificación,id_area_conocimiento,"+
			"arc_nombre,id_grado_dificultad, grd_nombre,id_tipo_pregunta,"+
			"tip_nombre,id_usuario,usu_nombre "+
			"FROM((((pregunta "+
			"LEFT JOIN tipo_pregunta ON pre_id_tipo_pregunta = id_tipo_pregunta)"+
			"LEFT JOIN area_conocimiento ON pre_id_area_conocimiento = id_area_conocimiento)"+
			"LEFT JOIN grado_dificultad  ON  pre_id_grado_dificultad = id_grado_dificultad)"+
			"LEFT JOIN usuario ON pre_id_autor_reactivo = id_usuario);",
				function(err, results, fields){
				if (err) {
					console.log(err.message);
					throw err;
				}
				res.send(getJsonDecifrado(results));
				console.log("Pregunta: " + JSON.stringify(getJsonDecifrado(results)));
			});
});

router.get("/getPreguntasNoAsignadasAMaraton", function (req, res){
	connection.query("SELECT "+
			/*	Datos pregunta	*/
			"id_pregunta,pre_pregunta,pre_opcionA,pre_opcionB,pre_opcionC,"+
			"pre_opcionC,pre_respuesta_correcta,pre_justificación,id_area_conocimiento,"+
			"arc_nombre,id_grado_dificultad, grd_nombre,id_tipo_pregunta,"+
			"tip_nombre,id_usuario,usu_nombre "+
			"FROM((((pregunta "+
			"LEFT JOIN tipo_pregunta ON pre_id_tipo_pregunta = id_tipo_pregunta)"+
			"LEFT JOIN area_conocimiento ON pre_id_area_conocimiento = id_area_conocimiento)"+
			"LEFT JOIN grado_dificultad  ON  pre_id_grado_dificultad = id_grado_dificultad)"+
			"LEFT JOIN usuario ON pre_id_autor_reactivo = id_usuario)"+
			"LEFT JOIN pregunta_en_maraton on id_pregunta=pnm_id_pregunta WHERE "+
			"pnm_id_pregunta is null", function (err, results){
			if (err){
				console.log("ERROR: " + err);
			}
			res.send(getJsonDecifrado(results));
			console.log("Get preguntas no asignadas a un maraton");
		});
});

router.get("/getPreguntasAsignadasAMaratonYEtapa/:id_maraton/:id_etapa", function (req, res){
	connection.query("SELECT "+
			/*	Datos pregunta	*/
			"id_pregunta,pre_pregunta,pre_opcionA,pre_opcionB,pre_opcionC,"+
			"pre_opcionC,pre_respuesta_correcta,pre_justificación,id_area_conocimiento,"+
			"arc_nombre,id_grado_dificultad, grd_nombre,id_tipo_pregunta,"+
			"tip_nombre,id_usuario,usu_nombre "+
			"FROM((((pregunta "+
			"LEFT JOIN tipo_pregunta ON pre_id_tipo_pregunta = id_tipo_pregunta)"+
			"LEFT JOIN area_conocimiento ON pre_id_area_conocimiento = id_area_conocimiento)"+
			"LEFT JOIN grado_dificultad  ON  pre_id_grado_dificultad = id_grado_dificultad)"+
			"LEFT JOIN usuario ON pre_id_autor_reactivo = id_usuario)"+
			"LEFT JOIN pregunta_en_maraton on id_pregunta=pnm_id_pregunta WHERE "+
			"pnm_id_maraton=? AND pnm_id_etapa=?", [
				req.params.id_maraton,
				req.params.id_etapa
			], function (err, results){
			if (err){
				console.log("ERROR: " + err);
			}
			res.send(getJsonDecifrado(results));
			console.log("Get preguntas no asignadas a un maraton");
		});
});

router.post("/createPregunta/:jsonPregunta", function (req, res){
	try{
		var jsonPregunta = getJsonCifrado(JSON.parse(req.params.jsonPregunta));
		connection.query("INSERT INTO pregunta"+
			"(pre_pregunta, pre_opcionA, pre_opcionB, pre_opcionC, pre_opcionD,"+
			"pre_respuesta_correcta, pre_id_area_conocimiento,"+
			"pre_id_grado_dificultad, pre_id_tipo_pregunta, pre_id_autor_reactivo) "+
			"VALUES(?,?,?,?,?,?,?,?,?,?)", [
				jsonPregunta.pre_pregunta,
				jsonPregunta.pre_opcionA,
				jsonPregunta.pre_opcionB,
				jsonPregunta.pre_opcionC,
				jsonPregunta.pre_opcionD,
				jsonPregunta.pre_respuesta_correcta,
				jsonPregunta.pre_id_area_conocimiento,
				jsonPregunta.pre_id_grado_dificultad,
				jsonPregunta.pre_id_tipo_pregunta,
				jsonPregunta.pre_id_autor_reactivo	
			], function (err, results, fields){
				if (err){
					console.log(err.message);
				}
				console.log(JSON.stringify(jsonPregunta));
				console.log(results);
				res.send("Registro correcto");
				console.log("Registro de pregunta correcto");
			});
	}catch(e){
		console.log("ERROR: " + e.message);
	}
});

router.post("/registrarPreguntasEnMaraton/:jsonDatosPreguntas/:id_etapa/:id_maraton",
	function (req, res){
	jsonDatosPreguntas = JSON.parse(req.params.jsonDatosPreguntas);
	for (var i = 0; i < jsonDatosPreguntas.length; i++){
		connection.query("INSERT INTO pregunta_en_maraton(pnm_id_pregunta,"+
			"pnm_id_maraton, pnm_id_etapa) VALUES(?,?,?)",
		[jsonDatosPreguntas[i].id_pregunta, req.params.id_maraton, req.params.id_etapa],
		function(err, results){
			if (err){
				console.log("ERROR: " + err.message);
			}
		});
	}
	res.send("Exito al registrar");
	console.log("Exito al registrar preguntas en un maratón");
});

router.put("/updatePregunta/:jsonDatos", function(req, res){
	var jsonDatos = JSON.parse(req.params.jsonDatos);
	connection.query("UPDATE pregunta SET "+
		"pre_id_area_conocimiento=?, pre_id_grado_dificultad=?,"+
		"pre_id_tipo_pregunta=?, pre_id_autor_reactivo=?, pre_pregunta=?,"+
		"pre_opcionA=?, pre_opcionB=?, pre_opcionC=?, pre_opcionD=?,"+
		"pre_respuesta_correcta=?, pre_justificación "+
		"WHERE id_pregunta=?",[
			jsonDatos.pre_id_area_conocimiento,
			jsonDatos.pre_id_grado_dificultad, 
			jsonDatos.pre_id_tipo_jsonDatos.pregunta,
			jsonDatos.pre_id_autor_reactivo, 
			jsonDatos.pre_jsonDatos.pregunta,
			jsonDatos.pre_opcionA,
			jsonDatos.pre_opcionB, 
			jsonDatos.pre_opcionC,
			jsonDatos.pre_opcionD,
			jsonDatos.pre_respuesta_correcta,
			jsonDatos.pre_justificación,
			jsonDatos.id_pregunta
		],function(err, results, fiels){
			if(err){
				console.log("ERROR: "+err.message);
				throw err;
			}
			console.log("Modificacion correcta!");
	});
	res.send("true");
});

router.delete("/deletePregunta/:jsonDatos", function(req, res){
	var jsonDatos = JSON.parse(req.params.jsonDatos);
	connection.query("DELETE FROM pregunta WHERE id_pregunta=?",
		[jsonDatos.id_zona], function(){
			res.send("Pregunta eliminada correctamente!");
		});
});

function getJsonCifrado(jsonPregunta){
	return {
		"pre_pregunta" : encriptacion_athenea.cifrar(jsonPregunta.pre_pregunta),
		"pre_opcionA"  : encriptacion_athenea.cifrar(jsonPregunta.pre_opcionA),
		"pre_opcionB"  : encriptacion_athenea.cifrar(jsonPregunta.pre_opcionB),
		"pre_opcionC"  : encriptacion_athenea.cifrar(jsonPregunta.pre_opcionC),
		"pre_opcionD"  : encriptacion_athenea.cifrar(jsonPregunta.pre_opcionD),
		"pre_respuesta_correcta" : 
		encriptacion_athenea.cifrar(jsonPregunta.pre_respuesta_correcta),
		"pre_id_area_conocimiento" : jsonPregunta.pre_id_area_conocimiento,
		"pre_id_grado_dificultad" : jsonPregunta.pre_id_grado_dificultad,
		"pre_id_tipo_pregunta" : jsonPregunta.pre_id_tipo_pregunta,
		"pre_id_autor_reactivo" : jsonPregunta.pre_id_autor_reactivo
	};
}

function getJsonDecifrado(jsonPreguntaCifrada){
	jsonPreguntas = [];
	for (var i = 0; i < jsonPreguntaCifrada.length; i++){
		jsonPreguntas[i] = {
			"id_pregunta"  : jsonPreguntaCifrada[i].id_pregunta,
			"pre_pregunta" : encriptacion_athenea.decifrar(
				jsonPreguntaCifrada[i].pre_pregunta),
			"pre_opcionA" : encriptacion_athenea.decifrar(
				jsonPreguntaCifrada[i].pre_opcionA),
			"pre_opcionB" : encriptacion_athenea.decifrar(
				jsonPreguntaCifrada[i].pre_opcionB),
			"pre_opcionC" : encriptacion_athenea.decifrar(
				jsonPreguntaCifrada[i].pre_opcionC),
			"pre_opcionD" : encriptacion_athenea.decifrar(
				jsonPreguntaCifrada[i].pre_opcionD)
		};
	}
	return jsonPreguntas;
}

module.exports = router;
