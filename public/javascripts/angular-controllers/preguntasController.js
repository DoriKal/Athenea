function preguntasController($scope, $http){

	$scope.preguntas = [];
	$scope.zonaEditar;
	$scope.zonaEliminar;
	$scope.socket = io();

	$scope.getPreguntas = function (){
		$http.get("/queriesPreguntas/").success(function (jsonDatos){
			console.log("getPreguntas");
			console.log(jsonDatos);
			$scope.preguntas = jsonDatos;
		});
	};

	$scope.abrirModalRegPregunta = function(){
		document.getElementById("modalRegPregunta").toggle();
	};

	$scope.crearPregunta = function(){
		if ($scope.validarFormulularioAgregarPregunta()){
			json = JSON.stringify($scope.getJsonPregunta());
			$http.post("/queriesPreguntas/createPregunta/" + encodeURIComponent(json))
			.success(function(datos){
				console.log(datos);
				$scope.socket.emit("nuevaPregunta", "nuevaPregunta");
			});
		}
	};

	$scope.abrirModalEditPregunta = function(idZona){
		$scope.preguntaEditar 		= $scope.getPreguntaPorId(idPregunta);
		$scope.nombrePreguntaEditar = $scope.PreguntaEditar.pre_pregunta;
		document.getElementById("modalEditPregunta").toggle();
	};

	$scope.getPreguntaPorId = function(id){
		for(var i = 0; i < $scope.pregunta.length; i++){
			if($scope.pregunta[i].idPregunta == id){
				return $scope.pregunta[i];
			}
		}
		return null;
	};

	$scope.editarPregunta = function(){
		if ($scope.nombrePreguntaEditar.length >= 8){
			var json = {
				idPregunta : $scope.preguntaEditar.idPregunta,
				zon_nombre_editar : $scope.nombrePreguntaEditar
			};
			$http.put("/queriesPreguntas/updatePregunta/"+JSON.stringify(json))
				.success(function(datos){
					console.log(datos);
					$scope.socket.emit("zonaEditada", "zonaEditada");
				});
		}
	};

	/**
	*	Este metodo valida si un campo dentro de una Shadow Root
	*	esta vacio...
	*	@return boolean
	*/
	$scope.elCampoEstaVacioEnShadowRootPorId = function(idCampo){
		campo = document.querySelector("::shadow #" + idCampo);
		return campo.value.length < 1;
	};

	/**
	*	Este metodo revisa si varios inputs dentro de un Shadow Root
	*	estan vacios
	*	@return boolean true en caso de que por lo menos 1 este vacio
	*/
	$scope.validarCamposVaciosShadowRootJson = function(jsonIds){
		for (var i = 0; i < jsonIds.length; i++) {
			if ($scope.elCampoEstaVacioEnShadowRootPorId(jsonIds[i])) {
				return true;
			}
		}
		return false;
	};

	/**
	*	Este metodo muestra un error si los campos ingresados estan vacios
	*	@return true si ninguno esta vacio
	*/
	$scope.mostrarErrorCamposVaciosShadowRoot = function (jsonIds, idLabelError){
		labelError = document.querySelector("::shadow #" + idLabelError);
		if ($scope.validarCamposVaciosShadowRootJson(jsonIds)){
			labelError.style.color = "red";
			labelError.innerHTML = "Debes llenar todos los campos *";
			return false;
		}else{
			labelError.innerHTML = "";
			return true;
		}
	};

	/**
	*	Si la opcion seleccionada contiene el attr indicado se retorna verdadero
	*/
	$scope.selectIsValidInShadowRootAttr = function(idSelect, attrContains){
		select = document.querySelector("::shadow #" + idSelect);
		indexSelected = select.options.selectedIndex;
		return select.options[indexSelected].getAttribute(attrContains) != null;
	}

	$scope.validarFormulularioAgregarPregunta = function(){
		return $scope.mostrarErrorCamposVaciosShadowRoot([
			"textPregunta",
			"respuestaA",
			"respuestaB",
			"respuestaC",
			"respuestaD"
		], "mostrarErrorPregunta")
		&&
		$scope.setListenerChangeOptionSelectedByJson([
			"selectAreaConocimiento",
			"selectTipoPreguntas",
			"selectGradoDificultad",
			"selectRespuestaCorrecta"
			]);
	};

	/**
	*	Validador automatico para que la opcion seleccionada no sea la primera
	*/
	$scope.setListenerChangeOptionSelectedById = function (idSelect){
		try{
			select = document.querySelector("::shadow #" + idSelect);
			select.addEventListener("change", function(){
				$scope.validarChangeSelect(this);
			});
			return $scope.validarChangeSelect(select);
		}catch(e){console.log(e.message);}
	}

	$scope.setListenerChangeOptionSelectedByJson = function(jsonIds){
		for (var i = 0; i < jsonIds.length; i++) {
			if (!$scope.setListenerChangeOptionSelectedById(jsonIds[i]) ){
				// Si un select no tiene un dato valido seleccionado entonces -> false
				return false;
			}
		}
		// Si todo esta bien entonces -> true
		return true;
	}

	/**
	*	@return true si la opcion seleccionada tiene un dato valido
	*/
	$scope.validarChangeSelect = function(select){
		indexSelected = select.options.selectedIndex;
		if (select.options[indexSelected].getAttribute("datoValido") != null){
			select.style.border = "solid 1px green";
			return true;
		}else{
			select.style.border = "solid 1px red";
			return false;
		}
	};

	/**
	*	Aquí obtenemos la respuesta correcta por el id de un select
	*	debe tener las 4 opciones A(pos->1), B(2), C(2), D(4)
	*/
	$scope.getRespuestaCorrecta = function (idSelect){
		try{
			select = document.querySelector("::shadow #" + idSelect);
			indexSelected = select.options.selectedIndex;
			opcionCorrecta = null;
			switch(indexSelected){
				case 1:
					opcionCorrecta = "A";
					break;
				case 2:
					opcionCorrecta = "B";
					break;
				case 3:
					opcionCorrecta = "C";
					break;
				case 4:
					opcionCorrecta = "D";
			}
			return opcionCorrecta;
		}catch(e){
			console.log(e.message);
		}
		return null;
	};

	$scope.getDatoValidoSelectShadoRootById = function (idSelect){
		try{
			select = document.querySelector("::shadow #" + idSelect);
			indexSelected = select.options.selectedIndex;
			return  select.options[indexSelected].getAttribute("datoValido");
		}catch(e){
			console.log(e);
		}
		return null;
	};

	$scope.getJsonPregunta = function(){
		return {
			"pre_pregunta" : $scope.textoAgregarPregunta,
			"pre_opcionA"  : $scope.textoOpcionA,
			"pre_opcionB"  : $scope.textoOpcionB,
			"pre_opcionC"  : $scope.textoOpcionC,
			"pre_opcionD"  : $scope.textoOpcionD,
			"pre_respuesta_correcta" : $scope.getRespuestaCorrecta("selectRespuestaCorrecta"),
			"pre_id_area_conocimiento" : 
			$scope.getDatoValidoSelectShadoRootById("selectAreaConocimiento"),
			"pre_id_tipo_pregunta" : 
			$scope.getDatoValidoSelectShadoRootById("selectTipoPreguntas"),
			"pre_id_grado_dificultad" : 
			$scope.getDatoValidoSelectShadoRootById("selectGradoDificultad"),
			"pre_id_autor_reactivo" : 1
		};
	};

	$scope.socket.on("nuevaPregunta", function(msg){
		console.log("Alguien creó una nueva pregunta");
		$scope.getPreguntas();
	});
	
	$scope.getPreguntas();

}
