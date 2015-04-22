/*
* getJson recibe un formulario y retorna un json en formato {name:value}
* @param form requiere un form convertido en objeto -> $("#miForm")
*/
function getJson( form ){
	var nombre, id, valor, json = "{";
	console.log( form[0].elements );
	for(var i  = 0; i < form[0].elements.length; i++){
		if( form[0].elements[i].type == "submit" ){continue;}
		valor  = "";
		nombre = form[0].elements[i].name;
		id 	   = form[0].elements[i].id;
		if(document.getElementById(id).type == "checkbox"){
			valor = document.getElementById(id).checked ? 1 : 0;
		}else{
			valor = $("#" + id).val();
		}
		if(i < form[0].elements.length-2){
			json += "\""+nombre+"\" : \""+valor+"\",";
		}else{
			json += "\""+nombre+"\" : \""+valor+"\"";
		}
	}
	return JSON.parse(json + "}");
}
/**
*	@param form: objeto de una etiqueta form
*	Ej. getJsonForm( document.getElementById("miFormulario") )
*	@return json en forma [{ name : value }]
*/
function getJsonForm(form){
	json = [];
	for(var i = 0;i < form[0].elements.length;i++){
		nombre  = form[0].elements[i].name;
		if( form[0].elements[i].type == "checkbox"){
			valor = form[0].elements[i].checked ? 1 : 0;
		}else{
			valor = form[0].elements[i].value;
		}
		json[i] = JSON.parse( "{ \"" + nombre + "\" : \"" + valor + "\"}");
	}
	return json;
}

