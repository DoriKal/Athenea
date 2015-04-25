function maratonesConfigController ($scope, $http){
	
	$scope.competidores = [];
	$scope.competidorEditar;
	$scope.competidorEliminar;
	$scope.etapas = [];
	$scope.preguntasNoAsignadasAMaraton = [];
	$scope.preguntasNoAsignadasAMaratonAsignar = [];
	$scope.preguntasAsignadasAMaratonYEtapa = [];
	$scope.socket = io();

	$scope.getCompetidoresEnMaraton = function (id){
    	url = "/queriesMaratones/getCompetidoresEnMaraton/" + id;
    	$http.get(url).success(function (competidores){
    		$scope.competidores = competidores;
    	});
    };

    $scope.getEtapas = function(){
    	$http.get("/queriesEtapas/").success(function (etapas){
    		$scope.etapas = etapas;
    	});
    };

    $scope.getCompetidores = function(){
    	var target = document.getElementById('modalConfig');
    	console.log(target.getAttribute("id_maraton"));
    	$scope.getCompetidoresEnMaraton(target.getAttribute("id_maraton"));
    };

    $scope.abrirModalAgregarUsuarioMaraton = function (){
    	document.getElementById("modalRegCompetidorMaraton").toggle();
    };

    $scope.crearCompetidor = function (){
    	if ($scope.competidorNuevoNombre.length >= 5 &&
    		$scope.competidorNuevoNombreUsuario.length >= 5){
    		json = JSON.stringify({
    			"id_maraton" : document.getElementById('modalConfig').getAttribute("id_maraton"),
    			"usu_nombre" : $scope.competidorNuevoNombre,
    			"usu_usuario" : $scope.competidorNuevoNombreUsuario
    		});
    		$http.post("/queriesMaratones/createCompetidorMaraton/" + encodeURIComponent(json))
    		.success(function (datos){
    			alert(datos);
    		});
    		$scope.socket.emit("nuevoCompetidorEnMaraton", "nuevoCompetidorEnMaraton");
    	}
    };

    $scope.getCompetidorById = function (idCompetidor){
    	for (var i = 0; i < $scope.competidores.length; i++){
    		if ($scope.competidores[i].id_usuario == idCompetidor){
    			return $scope.competidores[i];
    		}
    	}
    	return null;
    };

    $scope.abrirModalEditCompetidores = function (id){
    	$scope.competidorEditar = $scope.getCompetidorById(id);
    	$scope.competidorNombreEditar = $scope.competidorEditar.usu_nombre;
    	$scope.competidorNombreUsuarioEditar = $scope.competidorEditar.usu_usuario;
    	$scope.competidorContraseniaEditar = $scope.competidorEditar.usu_contra;
    	document.getElementById("modalEditCompetidorMaraton").toggle();
    };

    $scope.editarCompetidor = function (){
    	if ($scope.validarCamposMinLength([
    		{campo : $scope.competidorNombreEditar, minLength : 5},
    		{campo : $scope.competidorNombreUsuarioEditar, minLength : 5},
    		{campo : $scope.competidorContraseniaEditar, minLength : 5}
    		])){
    		json = JSON.stringify({
    			id_usuario : $scope.competidorEditar.id_usuario,
    			usu_nombre : $scope.competidorNombreEditar,
    			usu_usuario : $scope.competidorNombreUsuarioEditar,
    			usu_contra : $scope.competidorContraseniaEditar
    		});
    		$http.put("/queriesMaratones/updateCompetidorMaraton/" +
    			encodeURIComponent(json)).success(function (datos){
    			alert(datos);
    		});
    		$scope.socket.emit("editarCompetidorEnMaraton", "editarCompetidorEnMaraton");
    	}else{
    		console.log("No validado");
    	}
    };

    $scope.abrirModalEliminarCompetidores = function (id){
    	$scope.competidorEliminar = $scope.getCompetidorById(id);
    	document.getElementById("modalEliminarCompetidorMaraton").toggle();
    };

    $scope.eliminarCompetidor = function (){
    	url = "/queriesMaratones/deleteCompetidorMaraton/" +
    	 encodeURIComponent(JSON.stringify($scope.competidorEliminar));
    	$http.delete(url).success(function(datos){
    		console.log(datos);
    	});
    	$scope.socket.emit("eliminarCompetidorEnMaraton", "eliminarCompetidorEnMaraton");
    };

    $scope.socket.on("nuevoCompetidorEnMaraton", function(datos){
    	console.log("Hay un nuevo competidor");
    	$scope.getCompetidores();
    });

    $scope.socket.on("editarCompetidorEnMaraton", function(datos){
    	console.log("editaron un competidor");
    	$scope.getCompetidores();
    });

    $scope.socket.on("eliminarCompetidorEnMaraton", function(datos){
    	console.log("Eliminaron un competidor");
    	$scope.getCompetidores();
    });

    $scope.validarCamposMinLength = function (jsonCampos){
    	for (var i = 0; i < jsonCampos.length; i++){
    		if (jsonCampos[i].campo.length < jsonCampos[i].minLength){
    			return false;
    		}
    	}
    	return true;
    };

    $scope.getPreguntasNoAsignadas = function (){
    	$http.get("/queriesPreguntas/getPreguntasNoAsignadasAMaraton").success(
    		function (jsonPreguntas){
		    	$scope.preguntasNoAsignadasAMaraton = jsonPreguntas;
		    	//$scope.addListenerChecarCheckBox();
    		});
    };

    $scope.addListenerChecarCheckBox = function(){
    	check = document.getElementById("checkBoxChecarTodo");
    	check.addEventListener("click", function (){
	    	checksPreguntas = document.getElementsByClassName("checkPregunta");
	    	for (var i = 0; i < checksPreguntas.length; i++){
	    		checksPreguntas[i].checked = !this.checked;
	    	}
    	});
    };

    $scope.checkPreguntaSeleccion = function(id){
    	posicion = $scope.getPosicionMaratonAsignar(id);
        preguntaAAsignar = $scope.getPreguntaNoAsignadasById(id);
        if(posicion == -1){
            $scope.preguntasNoAsignadasAMaratonAsignar.push(preguntaAAsignar);
            $scope.addPreguntaTemporal(preguntaAAsignar);
            if ($scope.preguntasNoAsignadasAMaratonAsignar.length > 0){
                document.getElementById("btnAgregarPreguntas").removeAttribute("disabled");
            }
        }else{
            $scope.preguntasNoAsignadasAMaratonAsignar.splice(posicion, 1);
            $scope.removePreguntaTemporal(preguntaAAsignar);
            if ($scope.preguntasNoAsignadasAMaratonAsignar.length < 1){
                document.getElementById("btnAgregarPreguntas").setAttribute("disabled", "");
            }
        }
        //$scope.numeroPreguntasAgregar = $scope.preguntasNoAsignadasAMaratonAsignar.length;
        document.getElementById("numeroPreguntasAgregar").innerHTML = 
                $scope.preguntasNoAsignadasAMaratonAsignar.length;
    };

    $scope.addPreguntaTemporal = function(pregunta){
        $scope.preguntasAsignadasAMaratonYEtapa.push(pregunta);
    };

    $scope.removePreguntaTemporal = function(pregunta){
        for (var i = 0; i < $scope.preguntasAsignadasAMaratonYEtapa.length; i++){
            if ($scope.preguntasAsignadasAMaratonYEtapa[i].id_pregunta == pregunta.id_pregunta){
                $scope.preguntasAsignadasAMaratonYEtapa.splice(i, 1);
            }
        }
    };

    $scope.getPreguntaNoAsignadasById = function (id){
    	for (var i = 0; i < $scope.preguntasNoAsignadasAMaraton.length; i++){
    		if ($scope.preguntasNoAsignadasAMaraton[i].id_pregunta == id){
    			return $scope.preguntasNoAsignadasAMaraton[i];
    		}
    	}
    	return null;
    };

    $scope.getPosicionMaratonAsignar = function(id){
    	for (var i = 0; i < $scope.preguntasNoAsignadasAMaratonAsignar.length; i++){
    		if ($scope.preguntasNoAsignadasAMaratonAsignar[i].id_pregunta == id){
    			return i;
    		}
    	}
    	return -1;
    };

    $scope.registrarPreguntasEnMaraton = function (){
    	etapaMaraton = $scope.getIdEtapaSeleccionada();
    	if (etapaMaraton != -1){
	    	idMaraton = document.getElementById('modalConfig').getAttribute("id_maraton");
	    	json = encodeURIComponent(JSON.stringify(
	    			$scope.preguntasNoAsignadasAMaratonAsignar));
	    	url = "/queriesPreguntas/registrarPreguntasEnMaraton/"+json+"/"+
	    			etapaMaraton+"/"+idMaraton;
	    	$http.post(url).success(function (datos){
	    		console.log(datos);
	    	});
    	}else{
    		alert("Selecciona la etapa a la que se asignaran las preguntas");
    	}
    };

    $scope.getIdEtapaSeleccionada = function(){
    	select = document.getElementById("selectEtapaAsignarAMaraton");
    	indexSelected = select.options.selectedIndex;
		return select.options[indexSelected].getAttribute("idEtapa") != null
				? select.options[indexSelected].getAttribute("idEtapa") : -1;
    };

    $scope.mostrarPreguntasEtapaMaratonEspecifico = function(){
    	select = document.getElementById("selectEtapaAsignarAMaraton");
    	indexSelected = select.options.selectedIndex;
		idEtapa = select.options[indexSelected].getAttribute("idEtapa") != null
				? select.options[indexSelected].getAttribute("idEtapa") : -1;
		idMaraton = document.getElementById('modalConfig').getAttribute("id_maraton");
		url = "/queriesPreguntas/getPreguntasAsignadasAMaratonYEtapa/"+idMaraton+"/"+idEtapa;
		$http.get(url).success(function (jsonPreguntas){
			$scope.preguntasAsignadasAMaratonYEtapa = jsonPreguntas;
		});
    }

    $scope.getEtapas();
    $scope.getPreguntasNoAsignadas();

}