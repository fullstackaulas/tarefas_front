angular.module('meuApp')
    .controller('loginController', function ($scope, $http, $state) {

        $scope.usuario = {
            email: '',
            password: ''
        }

        $token = localStorage.getItem('token');


        if ($token != null) {
            $config = {
                headers: {
                    'Authorization': 'Bearer ' + $token
                }
            }

            $http.get('http://localhost:8000/api/me', $config).then(function (response) {
                console.log(response.status);
                if(response.status == 200){
                    $state.go('comMenu.home');
                }
            }, function (error) {
                console.log(error);
            })
        }

        $scope.logar = function () {


            $http.post('http://localhost:8000/api/login', $scope.usuario).then(function (response) {
                ///salvar credenciais
                localStorage.setItem('token', response.data.access_token)
                $state.go('comMenu.home');

            }, function (error) {

                Swal.fire({
                    title: 'Erro!',
                    text: 'Login inválido!',
                    icon: 'error'
                });

                $scope.usuario = {
                    email: '',
                    password: ''
                }



            })



        }


    });