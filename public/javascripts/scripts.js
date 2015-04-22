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

