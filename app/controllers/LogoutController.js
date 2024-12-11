angular.module('meuApp')
    .controller('logoutController', function ($scope, $http, $state) {

        $token = localStorage.getItem('token');


            $config = {
                headers: {
                    'Authorization': 'Bearer ' + $token 
                }
            }

            $http.get('http://localhost:8000/api/logout', $config).then(function (response) {
                localStorage.removeItem('token');
                $state.go('login');

            }, function (error) {
                localStorage.removeItem('token');
                $state.go('login');
            })




    });