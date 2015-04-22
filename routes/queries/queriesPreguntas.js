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
			"id_pregunta, pre_pregunta, pre_opcionA,"+
			"pre_opcionB, pre_opcionC, pre_opcionC, pre_respuesta_correcta,"+
			"pre_justificación,"+
			/* 	Datos area del conocimiento	 */
			"id_area_conocimiento, arc_nombre,"+
			/*	Datos grado de dificultad	 */
			"id_grado_dificultad, grd_nombre,"+
			/*	Datos del tipo de pregunta	 */
			"id_tipo_pregunta, tip_nombre,"+
			/*	Datos del autor del reactivo */
			"id_usuario, usu_nombre "+
			"FROM "+
			"(/*join usu*/(/*join tip*/(/*join grd*/(/*join arc*/"+
			"pregunta "+
			"LEFT JOIN area_conocimiento ON "+
			"pre_id_area_conocimiento = id_area_conocimiento)"+
			"LEFT JOIN grado_dificultad ON "+
			"pre_id_grado_dificultad = id_grado_dificultad)"+
			"LEFT JOIN tipo_pregunta ON "+
			"id_tipo_pregunta = id_tipo_pregunta)"+
			"LEFT JOIN usuario ON "+
			"pre_id_autor_reactivo = id_usuario)"+
			";", function(err, results, fields){
				if (err) {
					console.log(err.message);
					throw err;
				}
				res.send(getJsonDecifrado(results));
				console.log("Pregunta: " + results[0].pre_pregunta);
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
				jsonPregunta.pregunta,
				jsonPregunta.opcionA,
				jsonPregunta.opcionB,
				jsonPregunta.opcionC,
				jsonPregunta.opcionD,
				jsonPregunta.opcionCorrecta,
				jsonPregunta.areaConocimiento,
				jsonPregunta.gradoDificultad,
				jsonPregunta.tipoPregunta,
				jsonPregunta.autorReactivo
			], function (err, results, fields){
				if (err){
					console.log(err.message);
				}
				res.send("Registro correcto");
				console.log("Registro de pregunta correcto");
			});
	}catch(e){
		console.log("ERROR: " + e.message);
	}
});

function getJsonCifrado(jsonPregunta){
	return {
		"pregunta" : encriptacion_athenea.cifrar(jsonPregunta.pregunta),
		"opcionA"  : encriptacion_athenea.cifrar(jsonPregunta.opcionA),
		"opcionB"  : encriptacion_athenea.cifrar(jsonPregunta.opcionB),
		"opcionC"  : encriptacion_athenea.cifrar(jsonPregunta.opcionC),
		"opcionD"  : encriptacion_athenea.cifrar(jsonPregunta.opcionD),
		"opcionCorrecta" : encriptacion_athenea.cifrar(jsonPregunta.opcionCorrecta),
		"areaConocimiento" : jsonPregunta.areaConocimiento,
		"gradoDificultad" : jsonPregunta.gradoDificultad,
		"tipoPregunta" : jsonPregunta.tipoPregunta,
		"autorReactivo" : jsonPregunta.autorReactivo
	};
}

function getJsonDecifrado(jsonPreguntaCifrada){
	jsonPreguntas = [];
	for (var i = 0; i < jsonPreguntaCifrada.length; i++){
		jsonPreguntas[i] = {
			"id_pregunta"  : jsonPreguntaCifrada[i].id_pregunta,
			"pre_pregunta" : encriptacion_athenea.decifrar(
				jsonPreguntaCifrada[i].pre_pregunta),
			"opcionA" : encriptacion_athenea.decifrar(
				jsonPreguntaCifrada[i].pre_opcionA),
			"opcionB" : encriptacion_athenea.decifrar(
				jsonPreguntaCifrada[i].pre_opcionB),
			"opcionC" : encriptacion_athenea.decifrar(
				jsonPreguntaCifrada[i].pre_opcionC),
			"opcionD" : encriptacion_athenea.decifrar(
				jsonPreguntaCifrada[i].pre_opcionD)
		};
	}
	return jsonPreguntas;
}

module.exports = router;
