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
				console.log("Pregunta: ");
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

router.put("/updatePregunta/:jsonDatos", function(req, res){
	var jsonDatos = JSON.parse(req.params.jsonDatos);
	connection.query("UPDATE pregunta SET "+
	"pre_id_area_conocimiento = ?, pre_id_grado_dificultad = ?, pre_id_tipo_pregunta = ?, "+
	"pre_id_autor_reactivo = ?, pre_pregunta  = ?, pre_opcionA = ?, pre_opcionB = ?, "+
	"pre_opcionC = ?, pre_opcionD = ?, pre_respuesta_correcta = ?, pre_justificación "+
	"WHERE id_pregunta = ?",
		[jsonDatos.pre_id_area_conocimiento, jsonDatos.pre_id_grado_dificultad, 
		jsonDatos.pre_id_tipo_jsonDatos.pregunta,jsonDatos.pre_id_autor_reactivo, 
		jsonDatos.pre_jsonDatos.pregunta , jsonDatos.pre_opcionA, jsonDatos.pre_opcionB, 
		jsonDatos.pre_opcionC, jsonDatos.pre_opcionD, jsonDatos.pre_respuesta_correcta,
		jsonDatos.pre_justificación,jsonDatos.id_pregunta], function(err, results, fiels){
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

function getJsonCifrado(jsonPregunta){
	return {
		"pre_pregunta" : encriptacion_athenea.cifrar(jsonPregunta.pre_pregunta),
		"pre_opcionA"  : encriptacion_athenea.cifrar(jsonPregunta.pre_opcionA),
		"pre_opcionB"  : encriptacion_athenea.cifrar(jsonPregunta.pre_opcionB),
		"pre_opcionC"  : encriptacion_athenea.cifrar(jsonPregunta.pre_opcionC),
		"pre_opcionD"  : encriptacion_athenea.cifrar(jsonPregunta.pre_opcionD),
		"pre_opcionCorrecta" : encriptacion_athenea.cifrar(jsonPregunta.pre_opcionCorrecta),
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
