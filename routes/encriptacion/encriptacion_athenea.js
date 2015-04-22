/**
*	Este modulo sirve para encriptar y desencriptar lo que se requiera...
*	Si es necesario cambiar la key por defecto tiene que ser en la instalación.
*	Ya que despues no se podrá por que entonces no se podría decifrar lo que
*	se ha guardado en base de datos.
*
*	@author Alan Olivares Ruiz
*/

var crypto	= require("crypto");

var encriptacion_athenea = function EncriptacionAthenea(){};

encriptacion_athenea.prototype.openSSLCipherAlgorithm = "RC4";
encriptacion_athenea.prototype.key = "<key>Athenea!:@_|.-.|_@:!@OpenSSL</key>";

/*	Aqui vamos a recibir una palabra y se cifrará	*/
encriptacion_athenea.prototype.cifrar = function(palabraAEncriptar) {
	try{
		var cipher 	 = crypto.createCipher(
			encriptacion_athenea.prototype.openSSLCipherAlgorithm,
			encriptacion_athenea.prototype.key);
		var cifrado  = cipher.update(palabraAEncriptar, "utf8", "hex");
		cifrado 	+= cipher.final("hex");
	}catch(e){
		console.log(e.message);
	}
	return cifrado;
};

/*	Aqui se recibe la palabra que se decifrará			*/
encriptacion_athenea.prototype.decifrar = function(palabraADecifrar){
	try{
		var decipher = crypto.createDecipher(
			encriptacion_athenea.prototype.openSSLCipherAlgorithm,
			encriptacion_athenea.prototype.key);
		var palabraDecifrada  = decipher.update(palabraADecifrar, "hex", "utf8");
		palabraDecifrada	 += decipher.final("utf8");
	}catch(e){
		console.log(e.message + "  -->  " + palabraADecifrar);
	}
	return palabraDecifrada;
};

module.exports = encriptacion_athenea.prototype;