function maratonesController($scope, $http) {

	$scope.maratones = [];
	$scope.maratonEditar;
	$scope.maratonEliminar;
	$scope.maratonConfiguracion;
	$scope.competidoresX = [{usu_nombre : "x"}];
	$scope.socket = io();

	$scope.getMaratones = function(){
		$http.get("/queriesMaratones").success(function(maratones){
			$scope.maratones = maratones;
		});
	}

	$scope.abrirModalRegMaraton = function() {
		document.getElementById("modalRegMaraton").toggle();
	};

	$scope.registrarMaraton = function() {
		if ($scope.nombreNuevoMaraton.length >= 8) {
			var json = JSON.stringify({
				mar_nombre : $scope.nombreNuevoMaraton
			});
			$http.post("/queriesMaratones/createMaraton/"+json)
				.success(function(datos){
				console.log(datos);
				$scope.socket.emit("nuevoMaraton", "nuevoMaraton");
			});
		}
	}

	$scope.abrirModalEditMaraton = function(idMaraton){
		$scope.maratonEditar = $scope.getMaratonPorId(idMaraton);
		$scope.nombreMaratonActualizar = $scope.maratonEditar.mar_nombre;
		document.getElementById("modalEditMaraton").toggle();
	};

	$scope.getMaratonPorId = function(idMaraton){
		for(var i = 0; i < $scope.maratones.length; i++){
			if($scope.maratones[i].id_maraton == idMaraton){
				return $scope.maratones[i];
			}
		}
		return null;
	};

	$scope.editarMaraton = function(){
		console.log($scope.maratonEditar);
		if($scope.nombreMaratonActualizar.length >= 8){
			json = JSON.stringify({
				id_maraton : $scope.maratonEditar.id_maraton,
				mar_nombre : $scope.nombreMaratonActualizar
			});
			$http.put("/queriesMaratones/updateMaraton/"+json)
				.success(function(datos){
				console.log(datos);
				$scope.socket.emit("maratonEditado", "maratonEditado");
			});
		}
	}

	$scope.abrirModalEliminarMaraton = function(idMaraton){
		$scope.maratonEliminar = $scope.getMaratonPorId(idMaraton);
		document.getElementById("modalEliminarMaraton").toggle();
	}

	$scope.eliminarMaraton = function(){
		$http.delete("/queriesMaratones/deleteMaraton/"+
			JSON.stringify($scope.maratonEliminar)).success(function(datos){
			console.log(datos);
			$scope.socket.emit("maratonEliminado", "maratonEliminado");
		});
	}

	$scope.socket.on("nuevoMaraton", function(msg){
		console.log("Alguien registró un maratón!");
		$scope.getMaratones();
	});

	$scope.socket.on("maratonEditado", function(msg){
		console.log("Alguien editó un maratón");
		$scope.getMaratones();
	});

	$scope.socket.on("maratonEliminado", function(msg){
		console.log("Alguien eliminó un maratón");
		$scope.getMaratones();
	});

	$scope.getMaratones();

	/*	Aquí termina la funcionalidad CRUD en tiempo real	*/

	/*	Aquí empieza la funcionalidad de todo lo referente al maratón 	*/

	$scope.meta;
    $scope.transition;
    $scope.state = {
      opened: false
    }

    $scope.getMeta = function () {
      if (!$scope.meta) {
        $scope.meta = document.createElement('core-meta');
        $scope.meta.type = 'transition';
      }
      return $scope.meta;
    };

    $scope.setup = function () {
      var target = document.getElementById('modalConfig');

      if ($scope.transition) {
        $scope.transition.teardown(target);
      }

      $scope.transition = $scope.getMeta().byId("core-transition-right");
      $scope.transition.setup(target);
    };

    $scope.getCompetidoresEnMaraton = function (id){
    	url = "/queriesMaratones/getCompetidoresEnMaraton/" + id;
    	console.log(url);
    	$http.get(url).success(function (competidores){
    		console.log(competidores);
    		$scope.competidoresX = competidores;
    	});
    	console.log($scope.competidoresX);
    }

    $scope.abrirConfiguracionMaraton = function (id) {
	    var target = document.getElementById('modalConfig');
    	document.getElementById("textoCompetidorIdMaraton").value = id;
    	$scope.getCompetidoresEnMaraton(id);
    	$scope.state.opened = true;
	    $scope.transition.go(target, $scope.state);
    };

    $scope.cerrarConfiguracionMaraton = function (){
	    var target = document.getElementById('modalConfig');
	    $scope.state.opened = false;
	    $scope.transition.go(target, $scope.state);
    };

    document.addEventListener('polymer-ready', function () {
	    $scope.setup();
	    $scope.initTabsConf();
	    document.getElementById('modalConfig').removeAttribute('hidden');
    });

    $scope.initTabsConf = function () {
    	tabs = document.getElementsByClassName("tabConfigMaratones");
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

    $scope.abrirModalAgregarUsuarioMaraton = function (){
    	document.getElementById("modalRegCompetidorMaraton").toggle();
    };

    $scope.crearCompetidor = function (){
    	if ($scope.competidorNuevoNombre.length >= 5 &&
    		$scope.competidorNuevoNombreUsuario.length >= 5){
    		json = JSON.stringify({
    			"id_maraton" : document.querySelector("::shadow #textoCompetidorIdMaraton").value,
    			"usu_nombre" : $scope.competidorNuevoNombre,
    			"usu_usuario" : $scope.competidorNuevoNombreUsuario
    		});
    		$http.post("/queriesMaratones/createCompetidorMaraton/" + encodeURIComponent(json))
    		.success(function (datos){
    			alert(datos);
    		});
    	}
    };

}