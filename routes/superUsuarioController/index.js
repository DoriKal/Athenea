var express = require("express");
var router  = express.Router();

router.get("/", function(req, res){
	res.render("superUsuario/index");
});

router.get("/zonas", function(req, res){
	res.render("superUsuario/zonas");
});

router.get("/escuelas_universidades", function(req, res){
	res.render("superUsuario/universidades");
});

router.get("/maratones", function(req, res){
	res.render("superUsuario/maratones");
});

router.get("/preguntas", function(req, res){
	res.render("superUsuario/preguntas");
});

module.exports = router;