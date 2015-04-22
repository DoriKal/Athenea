function UniversidadesController($scope, $http){
	
	$scope.universidades = [];
	$scope.universidadEditar;
	$scope.universidadEliminar;
	$scope.zonas = [];
	$scope.socket = io();

	$scope.getUniversidades = function(){
		$http.get("/queriesUniversidades").success(function(data){
			$scope.universidades = data;
		});
	};

	$scope.getZonas = function(){
		$http.get("/queriesZonas").success(function(data){
			$scope.zonas = data;
		});
	};

	$scope.abrirModalRegUniversidad = function(){
		document.getElementById("modalRegUniversidad").toggle();
	};

	$scope.crearUniversidad = function(){
		if($scope.uniNuevoNombre.length >= 8){
			var select = document.querySelector("::shadow #opcZonaRegUniversidad");
			var option = select.options.selectedIndex;
			var id_zona = select.options[option].getAttribute("id_zona");
			json = {
				id_zona : id_zona,
				zon_nuevo_nombre  : $scope.uniNuevoNombre
			};
			$http.post("/queriesUniversidades/createUniversidad/"+JSON.stringify(json))
				.success(function(datos){
				$scope.socket.emit("nuevaUniversidad", "nuevaUniversidad");
				console.log(datos);
			});
		}
	};

	$scope.abrirModalEditUniversidad = function(id_universidad){
		$scope.universidadEditar = $scope.getUniversidadPorId(id_universidad);
		$scope.uniNombreEditar   = $scope.universidadEditar.uni_nombre;
		var select = document
					 .querySelector("#modalEditUniversidad > #opcZonaEditUniversidad");
		var options = select.options;
		var index = $scope.getSelectedItemAttrIdZonaSelect(options,
					$scope.universidadEditar.uni_id_zona).index;
		select.selectedIndex = index;
		document.getElementById("modalEditUniversidad").toggle();
	};

	$scope.getSelectedItemAttrIdZonaSelect = function(selectOptions, idZona){
		for(var i = 0; i < selectOptions.length; i++){
			if(selectOptions[i].getAttribute("id_zona") == idZona){
				return selectOptions[i];
			}
		}
		return null;
	}

	$scope.getUniversidadPorId = function(id){
		for(var i = 0; i < $scope.universidades.length; i++){
			if($scope.universidades[i].id_escuela_o_universidad == id){
				return $scope.universidades[i];
			}
		}
		return null;
	};

	$scope.editarUniversidad = function(){
		if($scope.uniNombreEditar.length >= 8){
			var select = document
					 .querySelector("::shadow #opcZonaEditUniversidad");
			var option = select.options.selectedIndex;
			var id_zona = select.options[option].getAttribute("id_zona");
			json = {
				id_universidad : $scope.universidadEditar.id_escuela_o_universidad,
				id_zona : id_zona,
				uni_nuevo_nombre : $scope.uniNombreEditar
			}
			console.log(JSON.stringify(json));
			$http.put("/queriesUniversidades/updateUniversidad/"+JSON.stringify(json))
				.success(function(datos){
					console.log("editando");
					$scope.socket.emit("universidadEditada", "universidadEditada");
				});
		}
	};

	$scope.abrirModalEliminarUniversidad = function(id){
		$scope.universidadEliminar = $scope.getUniversidadPorId(id);
		document.getElementById("modalEliminarUniversidad").toggle();
	};

	$scope.eliminarUniversidad = function(){
		$http.delete("/queriesUniversidades/deleteUniversidad/"+
			JSON.stringify($scope.universidadEliminar)).success(function(datos){
			console.log(datos);
			$scope.socket.emit("universidadEliminada", "universidadEliminada");
		});
	}

	$scope.socket.on("universidadEditada", function(msg){
		console.log("Alguien editó una universidad");
		$scope.getUniversidades();
	});

	$scope.socket.on("nuevaUniversidad", function(msg){
		console.log("Alguien creo una nueva universidad");
		$scope.getUniversidades();
	});

	$scope.socket.on("universidadEliminada", function(msg){
		console.log("Alguien elimino una universidad");
		$scope.getUniversidades();
	});


	$scope.getZonas();
	$scope.getUniversidades();
}