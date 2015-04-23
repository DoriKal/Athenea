function preguntasConfigController($scope, $http) {
    $scope.areasConocimiento = [];
    $scope.areaConocimientoEditar;
    $scope.areaConocimientoEliminar;
    $scope.gradosDeDificultad = [];
    $scope.gradoDeDificultadEditar;
    $scope.gradoDeDificultadEliminar;
    $scope.meta;
    $scope.transition;
    $scope.state = {
      opened: false
    }
	$scope.socket = io();

    $scope.getMeta = function () {
      if (!$scope.meta) {
        $scope.meta = document.createElement('core-meta');
        $scope.meta.type = 'transition';
      }
      return $scope.meta;
    }

    $scope.setup = function () {
      var target = document.getElementById('modalConfig');

      if ($scope.transition) {
        $scope.transition.teardown(target);
      }

      var value = "core-transition-right";
      $scope.transition = $scope.getMeta().byId(value);
      $scope.transition.setup(target);
    }

    $scope.stuff = function () {
      var target = document.getElementById('modalConfig');
      $scope.state.opened = !$scope.state.opened;
      $scope.transition.go(target, $scope.state);
    }


    document.addEventListener('polymer-ready', function () {
	    $scope.setup();
	    document.getElementById('modalConfig').removeAttribute('hidden');
	    $scope.initTabsConf();
	    $scope.getAreasDelConocimiento();
    });

    $scope.initTabsConf = function () {
    	tabs = document.getElementsByClassName("tabConfigPreguntas");
    	for ( var i = 0; i < tabs.length; i++) {
    		tabs[i].addEventListener("click", function(){
    			attr = this.getAttribute("config");
    			$scope.divDisplayNone(document.getElementsByClassName("divConfig"));
    			document.getElementById(attr).style.display = "block";
    		});
    		if(tabs[i].getAttribute("tabSelectedConf") != null){
    			tabs[i].click();
    		}
    	};

    };

    $scope.divDisplayNone = function (arrayDivs) {
    	for ( var i = 0; i < arrayDivs.length; i++) {
    		arrayDivs[i].style.display = "none";
    	}
    };

    /* *Aqui empiezan las áreas del conocimiento* */

    $scope.getAreasDelConocimiento = function () {
    	$http.get("/queriesAreasConocimiento").success(function(jsonDatos){
    		$scope.areasConocimiento = jsonDatos;
    	});
    };

    $scope.abrirModalCrearAreaConocimiento = function () {
    	document.getElementById("modalRegAreaConocimiento").toggle();
    };

    $scope.crearAreaConocimiento = function () {
    	if ($scope.areaConocimientoNuevoNombre.length >= 8){
    		json = JSON.stringify({
    			nombreAreaConocimiento : $scope.areaConocimientoNuevoNombre
    		});
    		$http.post("/queriesAreasConocimiento/createAreaConocimiento/"+json)
    		.success(function(data){
                $scope.socket.emit("nuevaAreaDelConocimiento", "nuevaAreaDelConocimiento");
                console.log(data);
    		});
    	}
    };

    $scope.abrirModalEditAreaConocimiento = function (idAreaConocimiento) {
    	document.getElementById("modalEditAreaConocimiento").toggle();
    	$scope.areaConocimientoEditar = $scope.getAreasDelConocimientoPorId(
    		idAreaConocimiento);
    	$scope.areaConocimientoEditarNombre = $scope.areaConocimientoEditar.arc_nombre;
    };

	$scope.abrirModalEliminarAreaConocimiento = function (idAreaConocimiento) {
    	document.getElementById("modalEliminarAreaConocimiento").toggle();
    	$scope.areaConocimientoEliminar = $scope.getAreasDelConocimientoPorId(
    		idAreaConocimiento);
    };

    $scope.getAreasDelConocimientoPorId = function (id) {
    	for (var i = 0; i < $scope.areasConocimiento.length; i++){
			if ($scope.areasConocimiento[i].id_area_conocimiento == id){
				return $scope.areasConocimiento[i];
			}
    	}
    	return null;
    };

    $scope.editarAreaConocimiento = function () {
    	if ($scope.areaConocimientoEditarNombre.length >= 8) {
    		json = JSON.stringify({
    			id_area_conocimiento : $scope.areaConocimientoEditar.id_area_conocimiento,
    			nombreAreaConocimiento : $scope.areaConocimientoEditarNombre
    		});
    		$http.put("/queriesAreasConocimiento/updateAreaConocimiento/"+json)
    		.success(function(datos){
    			$scope.socket.emit("areaDelConocimientoEditada", "areaDelConocimientoEditada");
                console.log(datos);
    		});
    	}
    };

    $scope.eliminarAreaConocimiento = function () {
    		json = JSON.stringify({
    			id_area_conocimiento : $scope.areaConocimientoEliminar.id_area_conocimiento
    		});
    		$http.delete("/queriesAreasConocimiento/deleteAreaConocimiento/"+json)
    		.success(function(datos){
    			$scope.socket.emit("areaDelConocimientoEliminada", "areaDelConocimientoEliminada");
                console.log(datos);
    		});
    };

    /* *Aqui empiezan los grados de dificultad* */

    $scope.getGradosDeDificultad = function () {
        $http.get("/queriesGradosDeDificultad").success(function(jsonDatos){
            $scope.gradosDeDificultad = jsonDatos;
        });
    };

    $scope.abrirModalCrearGradoDeDificultad = function () {
        document.getElementById("modalRegGradoDeDificultad").toggle();
    };

    $scope.crearGradoDeDificultad = function(){
        if ($scope.gradoDeDificultadNuevoNombre.length >= 5) {
            json = JSON.stringify({
                grd_nombre : $scope.gradoDeDificultadNuevoNombre
            });
            $http.post("/queriesGradosDeDificultad/createGradoDeDificultad/"+json)
            .success(function(datos){
                console.log(datos);
                $scope.socket.emit("crearGradoDeDificultad", "crearGradoDeDificultad");

            });
        }
    };

    $scope.abrirModalEditGradoDeDificultad = function (id) {
        $scope.gradoDeDificultadEditar = $scope.getGradoDeDificultadPorId(id);
        $scope.gradoDeDificultadEditarNombre = $scope.gradoDeDificultadEditar.grd_nombre;
        document.getElementById("modalEditGradoDeDificultad").toggle();        
    };

    $scope.getGradoDeDificultadPorId = function (id) {
        for (var i = 0; i < $scope.gradosDeDificultad.length; i++){
            if ($scope.gradosDeDificultad[i].id_grado_dificultad == id){
                return $scope.gradosDeDificultad[i];
            }
        }
        return null;
    };

    $scope.editarGradoDeDificultad = function () {
        if ($scope.gradoDeDificultadEditarNombre.length >= 5) {
            json = JSON.stringify({
                id_grado_dificultad : $scope.gradoDeDificultadEditar.id_grado_dificultad,
                grd_nombre : $scope.gradoDeDificultadEditarNombre
            });
            $http.put("/queriesGradosDeDificultad/updateGradoDeDificultad/"+json)
            .success(function (datos) {
                console.log(datos);
                $scope.socket.emit("editarGradoDeDificultad", "editarGradoDeDificultad");

            });
        }
    };

    $scope.abrirModalEliminarGradoDeDificultad = function (id) {
        $scope.gradoDeDificultadEliminar = $scope.getGradoDeDificultadPorId(id);
        document.getElementById("modalEliminarGradoDeDificultad").toggle();        
    };

    $scope.eliminarGradoDeDificultad = function () {
        json = JSON.stringify({
            id_grado_dificultad : $scope.gradoDeDificultadEliminar.id_grado_dificultad,
        });
        $http.delete("/queriesGradosDeDificultad/deleteGradoDeDificultad/"+json)
            .success(function (datos) {
                console.log(datos);
                $scope.socket.emit("eliminarGradoDeDificultad", "eliminarGradoDeDificultad");
        });
    };




    $scope.tiposDePreguntas = [];
    $scope.tipoDePreguntaEditar;
    $scope.tipoDePreguntaEliminar;

    $scope.getTiposDePreguntas = function () {
        $http.get("/queriesTiposDePreguntas").success(function (json){
            $scope.tiposDePreguntas = json;
        });
    };

    $scope.getTiposDePreguntas();

    $scope.abrirModalCrearTipoDePregunta = function () {
        document.getElementById("modalRegTipoDePregunta").toggle();
    };

    $scope.crearTipoDePregunta = function () {
        if ($scope.tipoDePreguntaNuevoNombre.length >= 5){
            json = JSON.stringify({
                tip_nombre : $scope.tipoDePreguntaNuevoNombre
            });
            $http.post("/queriesTiposDePreguntas/createTipoDePregunta/" + json)
            .success(function (datos){
                console.log(datos);
                $scope.socket.emit("crearTipoDePregunta", "crearTipoDePregunta");
            });
        }
    }

    $scope.abrirModalEditTipoDePregunta = function (id) {
        $scope.tipoDePreguntaEditar = $scope.getTipoDePreguntaPorId(id);
        $scope.tipoDePreguntaEditarNombre = $scope.tipoDePreguntaEditar.tip_nombre;
        document.getElementById("modalEditTipoDePregunta").toggle();
    };

    $scope.editarTipoDePregunta = function () {
        if ($scope.tipoDePreguntaEditarNombre.length >= 5) {
            json = JSON.stringify({
                id_tipo_pregunta : $scope.tipoDePreguntaEditar.id_tipo_pregunta,
                tip_nombre : $scope.tipoDePreguntaEditarNombre
            });
            $http.put("/queriesTiposDePreguntas/updateTipoDePregunta/"+json)
            .success(function(datos){
                console.log(datos);
                $scope.socket.emit("editarTipoDePregunta", "editarTipoDePregunta");
            });
        }
    };

    $scope.abrirModalEliminarTipoDePregunta = function (id) {
        $scope.tipoDePreguntaEliminar = $scope.getTipoDePreguntaPorId(id);
        $scope.tipoDePreguntaEliminaeNombre = $scope.tipoDePreguntaEliminar.tip_nombre;
        document.getElementById("modalEliminarTipoDePregunta").toggle();
    };

    $scope.eliminarTipoDePregunta = function () {
        json = JSON.stringify({
            id_tipo_pregunta : $scope.tipoDePreguntaEliminar.id_tipo_pregunta
        });
        $http.delete("/queriesTiposDePreguntas/deleteTipoDePregunta/"+json)
        .success(function(datos){
            console.log(datos);
            $scope.socket.emit("eliminarTipoDePregunta", "eliminarTipoDePregunta");
        });
    };

    $scope.getTipoDePreguntaPorId = function(id){
        for (var i = 0; i < $scope.tiposDePreguntas.length; i++) {
            if ($scope.tiposDePreguntas[i].id_tipo_pregunta == id){
                return $scope.tiposDePreguntas[i];
            }
        }
        return null;
    };




    /**
    *
    *
    *   Escuchadores sockets io
    *
    *
    */

    $scope.socket.on("nuevaAreaDelConocimiento", function(datos) {
        $scope.getAreasDelConocimiento();
    });
    
    $scope.socket.on("areaDelConocimientoEditada", function(datos) {
        $scope.getAreasDelConocimiento();
    });
    
    $scope.socket.on("areaDelConocimientoEliminada", function(datos) {
        $scope.getAreasDelConocimiento();
    });

    // Grado de Dificultad
    $scope.socket.on("crearGradoDeDificultad", function(datos) {
        $scope.getGradosDeDificultad();
    });
    
    $scope.socket.on("editarGradoDeDificultad", function(datos) {
        $scope.getGradosDeDificultad();
    });
    
    $scope.socket.on("deleteGradoDeDificultad", function(datos) {
        $scope.getGradosDeDificultad();
    });

    // Tipo de pregunta
    $scope.socket.on("crearTipoDePregunta", function(datos) {
        $scope.getTiposDePreguntas();
    });
    
    $scope.socket.on("editarTipoDePregunta", function(datos) {
        $scope.getTiposDePreguntas();
    });
    
    $scope.socket.on("deleteTipoDePregunta", function(datos) {
        $scope.getTiposDePreguntas();
    });
    
    $scope.getGradosDeDificultad();

}