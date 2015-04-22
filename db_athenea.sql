CREATE DATABASE db_athenea;
USE db_athenea;

/**
*	Basicamente la tabla usuario tentativamente tendrá 4 tipos de usuario
*	1. SUPERUSUARIO: Podrá hacer lo que quiera
*	2. Administrador: administra maratonistas y maratones,
*	   támbien revisará que los maratones se lleven a cabo correctamente y sin errores
*	3. Maratonista: Contestará las preguntas de su maratón
*	4. Asesor: Estos asesoran a un maratonista y en el sistema ven en tiempo real que es
* 	   lo que responde su maratonista y los demás maratonistas
*	5. Autor de reactivos: Esta ultima ayudará a que los usuarios
*	puedan registrar las preguntas en sus propias cuentas
*/
CREATE TABLE usuario(
id_usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
usu_tipo_usuario INT NOT NULL,
usu_nombre VARCHAR(30)NOT NULL,
usu_usuario VARCHAR(30)NOT NULL,
usu_contra VARCHAR(30)NOT NULL
);

/**
*	Esta tabla guardará los maratones
*/
CREATE TABLE maraton(
id_maraton INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
mar_nombre VARCHAR(30) NOT NULL,
mar_activo BOOLEAN
);

/**
*	Esta tabla tendrá 2 propositos
*	1. El SUPERUSUARIO se encargará de registrar los administradores y con ayuda
*	   de esta tabla se podrá asignar los maratones que pueden administrar
*	2. Los maratonistas serán asignados a un maratón
*/
CREATE TABLE usuario_maraton(
uma_id_usuario INT NOT NULL,
uma_id_maraton INT NOT NULL,
PRIMARY KEY(uma_id_usuario, uma_id_maraton),
FOREIGN KEY(uma_id_usuario) REFERENCES usuario(id_usuario),
FOREIGN KEY(uma_id_maraton) REFERENCES maraton(id_maraton)
);

/**
*	Esta tabla ayudará a saber que asesor esta a asociado con un maratonista
*/
CREATE TABLE asersor_de_maratonista(
asm_id_usuario INT NOT NULL,
asm_uma_id_usuario_maraton INT NOT NULL,
asm_uma_id_maraton INT NOT NULL,
PRIMARY KEY(asm_id_usuario, asm_uma_id_usuario_maraton),
FOREIGN KEY(asm_id_usuario) REFERENCES usuario(id_usuario),
FOREIGN KEY(asm_uma_id_usuario_maraton) REFERENCES usuario_maraton(uma_id_usuario),
FOREIGN KEY(asm_uma_id_maraton) REFERENCES usuario_maraton(uma_id_maraton)
);


/**		AQUI EMPIEZA EL "ENTORNO" DE LOS MARATONES	**/


/**
*	Esta tabla ayudará a generar más filtros para buscar mejor a los maratonista
*/
CREATE TABLE zona(
id_zona INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
zon_nombre VARCHAR(35) NOT NULL
);

/**
*	La universidad o escuela pertenece a una zona
*/
CREATE TABLE escuela_o_universidad(
id_escuela_o_universidad INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
uni_id_zona INT NOT NULL,
uni_nombre VARCHAR(40) NOT NULL,
FOREIGN KEY(uni_id_zona) REFERENCES zona(id_zona)
);

/**
*	Esta tabla nos ayudará para saber a que escuela o universidad pertenecen los maratonistas
*/
CREATE TABLE maratonista_pertenece_escuela_universidad(
mpe_id_usuario INT NOT NULL,
mpe_id_escuela_o_universidad INT NOT NULL,
PRIMARY KEY(mpe_id_usuario, mpe_id_escuela_o_universidad),
FOREIGN KEY(mpe_id_usuario) REFERENCES usuario(id_usuario),
FOREIGN KEY(mpe_id_escuela_o_universidad) REFERENCES escuela_o_universidad(id_escuela_o_universidad)
);

/**
*	Esta tabla almacenará las areas del conocimiento de las preguntas
*/
CREATE TABLE area_conocimiento(
id_area_conocimiento INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
arc_nombre VARCHAR(40) NOT NULL
);

/**
*	Las preguntas se asociarán con un grado de dificultad
*/

CREATE TABLE grado_dificultad(
id_grado_dificultad INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
grd_nombre VARCHAR(20) NOT NULL
);

/**
*	Esta tabla almacenará los tipos de preguntas que habrá
*	NORMALMENTE LOS TIPOS SON "Teoríca" y "práctica"
*/
CREATE TABLE tipo_pregunta(
id_tipo_pregunta INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
tip_nombre VARCHAR(20) NOT NULL
);

/**
*	Esta tabla almacenará las preguntas de todo el sistema
*	IMPORTANTE!!: EL CAMPO "pre_pregunta" ALMACENARÁ LA PREGUNTA
*	Y OBVIAMENTE NO HAY PREGUNTAS DE 1500 CARACTERES... A LO MUY
* 	EXAGERADO TENDRÁN 600 CARACTERES... PERO PARA MAYOR SEGURIDAD
*	LA PREGUNTA SE ENCRIPTARÁ Y SALDRÁN MÁS CARACTERES.
*
*	SI SE PUEDE OBTENER UN MEJOR RENDIMIENTO CON OTRO TIPO DE DATO...
*	CAMBIARLO PERO INVESTIGAR BIEN SI EN VERDAD ES MEJOR, POR QUE EL
*	TIPO "TEXT" PARA NADA QUE ME CONVENCE
*	
*	LA RESPUESTA CORRECTA TAMBIEN SE ENCRIPTARÁ POR ESO TIENE UN VARCHAR(40)
*/
CREATE TABLE pregunta(
id_pregunta INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
pre_id_area_conocimiento INT NOT NULL,
pre_id_grado_dificultad INT NOT NULL,
pre_id_tipo_pregunta INT NOT NULL,
pre_id_autor_reactivo INT NOT NULL,
pre_pregunta VARCHAR(1500) NOT NULL,
/* Las respuestas tambien se encriptarán para estar más seguros */
pre_opcionA VARCHAR(220) NOT NULL,
pre_opcionB VARCHAR(220) NOT NULL,
pre_opcionC VARCHAR(220) NOT NULL,
pre_opcionD VARCHAR(220) NOT NULL,
pre_respuesta_correcta VARCHAR(40),
pre_justificación VARCHAR(200),
FOREIGN KEY(pre_id_area_conocimiento) REFERENCES area_conocimiento(id_area_conocimiento),
FOREIGN KEY(pre_id_grado_dificultad) REFERENCES grado_dificultad(id_grado_dificultad),
FOREIGN KEY(pre_id_tipo_pregunta) REFERENCES tipo_pregunta(id_tipo_pregunta),
FOREIGN KEY(pre_id_autor_reactivo) REFERENCES usuario(id_usuario)
);

/**
*	Asi sabremos que pregunta está en que maratón
*/
CREATE TABLE pregunta_en_maraton(
pnm_id_pregunta INT NOT NULL,
pnm_id_maraton INT NOT NULL,
PRIMARY KEY(pnm_id_pregunta, pnm_id_maraton),
FOREIGN KEY(pnm_id_pregunta) REFERENCES pregunta(id_pregunta),
FOREIGN KEY(pnm_id_maraton) REFERENCES maraton(id_maraton)
);

/**
*	Aquí se guardará las respuesta del maratonista
*/
CREATE TABLE respuesta_maratonista(
rem_id_usuario INT NOT NULL,
rem_id_pregunta INT NOT NULL,
rem_respuesta CHAR(1) NOT NULL,
FOREIGN KEY(rem_id_usuario) REFERENCES usuario(id_usuario),
FOREIGN KEY(rem_id_pregunta) REFERENCES pregunta(id_pregunta)
);


/* 	Para obtener una pregunta con sus respectiva información necesitamos la siguiente consulta	*/
SELECT 
/*	Datos pregunta	*/
id_pregunta, pre_pregunta, pre_opcionA,
pre_opcionB, pre_opcionC, pre_opcionC, pre_respuesta_correcta,
pre_justificación,
/* 	Datos area del conocimiento	 */
id_area_conocimiento, arc_nombre,
/*	Datos grado de dificultad	 */
id_grado_dificultad, grd_nombre,
/*	Datos del tipo de pregunta	 */
id_tipo_pregunta, tip_nombre,
/*	Datos del autor del reactivo */
id_usuario, usu_nombre
FROM
(/*join usu*/(/*join tip*/(/*join grd*/(/*join arc*/
pregunta
LEFT JOIN area_conocimiento ON
pre_id_area_conocimiento = id_area_conocimiento)
LEFT JOIN grado_dificultad ON 
pre_id_grado_dificultad = id_grado_dificultad)
LEFT JOIN tipo_pregunta ON
id_tipo_pregunta = id_tipo_pregunta)
LEFT JOIN usuario ON
pre_id_autor_reactivo = id_usuario)
;

