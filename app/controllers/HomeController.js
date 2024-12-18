angular.module('meuApp')
.controller('homeController', function($scope, $http, $state){


    $token = localStorage.getItem('token');
    $config = {
        headers: {
            'Authorization': 'Bearer ' + $token
        }
    }

    deslogar = function(){
        localStorage.removeItem('token');
        $state.go('login');
    }

    $scope.listar = function () {
        $http.get('http://localhost:8000/api/projetos/listar', $config).then(function (response) {
            if (response.status == 200) {
                $scope.projetos = tratarDados(response.data);
            }
        }, function (error) {
            if(error.status == 401){
                deslogar();
            }
            console.log(error);
        });
    }

    $scope.listar();

});