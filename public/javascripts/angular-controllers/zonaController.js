function zonaController($scope, $http){
	
	$scope.zonas = [];
	$scope.zonaEditar;
	$scope.zonaEliminar;
	$scope.socket = io();
	
	$scope.getZonas = function(){
		$http.get("/queriesZonas").success(function(data){
			$scope.zonas = data;
		});
	};
	
	$scope.abrirModalRegZona = function(){
		document.getElementById("modalRegZona").toggle();
	};
	
	$scope.crearZona = function(){
		if ($scope.zonNuevoNombre.length >= 8){
			var json = {
				zon_nuevo_nombre : $scope.zonNuevoNombre
			};
			$http.post("/queriesZonas/createZona/"+JSON.stringify(json))
			    .success(function(data){
				console.log(data);
				$scope.zonNuevoNombre = "";
				$scope.socket.emit("nuevaZona", "nuevaZona");
			});
		}
	};
	
	$scope.abrirModalEditZona = function(idZona){
		$scope.zonaEditar 		= $scope.getZonaPorId(idZona);
		$scope.nombreZonaEditar = $scope.zonaEditar.zon_nombre;
		document.getElementById("modalEditZona").toggle();
	};

	$scope.getZonaPorId = function(id){
		for(var i = 0; i < $scope.zonas.length; i++){
			if($scope.zonas[i].id_zona == id){
				return $scope.zonas[i];
			}
		}
		return null;
	};

	$scope.editarZona = function(){
		if ($scope.nombreZonaEditar.length >= 8){
			var json = {
				id_zona : $scope.zonaEditar.id_zona,
				zon_nombre_editar : $scope.nombreZonaEditar
			};
			$http.put("/queriesZonas/updateZona/"+JSON.stringify(json))
				.success(function(datos){
					console.log(datos);
					$scope.socket.emit("zonaEditada", "zonaEditada");
				});
		}
	};

	$scope.abrirModalEliminarZona = function(idZona){
		$scope.zonaEliminar = $scope.getZonaPorId(idZona);
		document.getElementById("modalEliminarZona").toggle();
	};

	$scope.eliminarZona = function(){
		var json = JSON.stringify({id_zona : $scope.zonaEliminar.id_zona});
		$http.delete("/queriesZonas/deleteZona/"+json).success(function(datos){
			console.log(datos);
			$scope.socket.emit("zonaEliminada", "zonaEliminada");
		});
	};

	$scope.socket.on("zonaEditada", function(msg){
		console.log("Alguien edito una zona entonces recargare las zonas");
		$scope.getZonas();
	});

	$scope.socket.on("nuevaZona", function(msg){
		console.log("Alguien creó una zona entonces recargare las zonas");
		$scope.getZonas();
	});
	
	$scope.socket.on("zonaEliminada", function(msg){
		console.log("Alguien eliminó una zona entonces recargare las zonas");
		$scope.getZonas();
	});

	$scope.getZonas();
}