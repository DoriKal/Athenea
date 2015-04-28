/**
*	@author Alan Olivares Ruiz
*/

var assert	= require("assert");
var crypto	= require("crypto");

// Esta es la llave con la que se encriptara todo en realidad pudo haber sido
// solo un "var key = 'llave';" pero me gusta lo complicado! =-)
var key 	= "<key>RAOR@_|.-.|_@:?940203!@OpenSSL</key>";

// Para que funcione todo esto se require de un algorimo OpenSSL el cual se puede encontrar
// poniendo en la consola 'openssl list-cipher-algorithms'... en mi caso escogí RC4
var openSSLCipherAlgorithm = "RC4";

// Con mi llave y con mi algoritmo 'RC4' de OpenSSL
// mensajeEncriptado = e329f96d512ac770ab124c8b6ad2f29fb0
var palabraSinCifrar = "mensajeEncriptado";
var cifradoEsperado   = "e329f96d512ac770ab124c8b6ad2f29fb0";

/*	Aqui vamos a recibir una palabra y se encriptará	*/
function encriptar(palabraRecibida){
	var cipher 	= crypto.createCipher(openSSLCipherAlgorithm, key);
	var cifrado = cipher.update(palabraRecibida, "utf8", "hex");
	cifrado 	+= cipher.final("hex");

	// Si la salida no es la esperada el programa arrojará un AssertionError
	assert.equal(cifrado, cifradoEsperado);

	console.log("Mensaje encriptado correctamente!");
};

function decifrar(palabraCifrada){
	var decipher = crypto.createDecipher(openSSLCipherAlgorithm, key);
	var palabraDecifrada = decipher.update(palabraCifrada, "hex", "utf8");
	palabraDecifrada	 += decipher.final("utf8");
	assert.equal(palabraDecifrada, palabraSinCifrar);
	console.log("Mensaje desifrado correctamente!");
}

encriptar(palabraSinCifrar);
decifrar(cifradoEsperado);
