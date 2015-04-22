var express = require("express");
var router = express.Router();
var conection = require("./../queries/connection");

router.get("/", function (req, res){
	res.send("Hello !!");
});

router.get("/saludo/:variable", function (req, res){
	try{
		conection.query("SELECT * FROM usuario", function (err, result){
			res.send(JSON.stringify(result));
		});
	}catch(e){
		console.log("ERROR!: " + e.message);
	}
});

router.get("/vista", function (req, res){
	res.render("login");
});

module.exports = router;