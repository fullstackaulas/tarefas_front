angular.module('meuApp')
    .controller('usuariosController', function ($scope, $http, $state) {

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
        

        $scope.acao = {
            pagina: 'listando'
        };

        $scope.projetos = [];


        $scope.listar = function () {
            $http.get('http://localhost:8000/api/usuarios/listar', $config).then(function (response) {
                if (response.status == 200) {
                    $scope.projetos = response.data;
                }
            }, function (error) {
                if(error.status == 401){
                    deslogar();
                }
                console.log(error);
            });
        }


        $scope.consultar = function (id) {
            url = 'http://localhost:8000/api/usuarios/consultar/' + id;
            $http.get(url, $config).then(function (response) {
                if (response.status = 200) {
                    $scope.editarUsuario = response.data;
                    $scope.acao.pagina = 'editando';
                }
                console.log(response);
            }, function (error) {
                console.log(error);
            })
        }


        $scope.listar();

        $scope.novoUsuario = {
            name: '',
            email: '',
            password: ''
        }

        $scope.editarUsuario = {
            id: '',
            name: '',
            email: '',
            password: ''
        }

        $scope.limpar = function () {

            $scope.novoUsuario = {
                name: '',
                email: '',
                password: ''
            }

        }

     

        $scope.deletarModal = function (id) {
            Swal.fire({
                title: "Você tem certeza?",
                text: "Deletar este dado é uma ação irreversível!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sim, delete isso!",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.deletarDeVerdade(id);

                }
            });
        }

       



        $scope.deletarDeVerdade = function (id) {


            $http.delete('http://localhost:8000/api/usuarios/deletar/' + id, $config).then(function (response) {
                if (response.status == 200) {
                    Swal.fire({
                        title: "Deletado!",
                        text: "Seu usuario foi deletado",
                        icon: "success"
                    });

                    $scope.listar();
                }
            }, function (error) {
                console.log(error);
            });



        }



        $scope.novoUsuarioAcao = function () {
            $scope.acao.pagina = 'cadastrando';
        }

        $scope.listandoUsuarioAcao = function () {
            $scope.acao.pagina = 'listando';
        }

        $scope.salvarEdicaoUsuario = function () {

            url = 'http://localhost:8000/api/usuarios/editarParcial/' + $scope.editarUsuario.id
            $http.patch(url, $scope.editarUsuario, $config).then(function (response) {
                if (response.status == 200) {
                    Swal.fire({
                        title: "Editado!",
                        text: "Seu usuário foi editado",
                        icon: "success"
                    });
                    $scope.listar();
                    $scope.acao.pagina = 'listando';
                }
            }, function (error) {
                console.log(error);
            })
        }


        $scope.cadastrarNovoUsuario = function () {
            console.log($scope.novoUsuario);




            $http.post('http://localhost:8000/api/usuarios/cadastrar', $scope.novoUsuario, $config).then(function (response) {
                console.log(response);

                if (response.status == 201) {

                    $scope.limpar();
                    Swal.fire({
                        title: "Usuario cadastrado!",
                        text: "Deseja cadastrar um novo usuário?!",
                        icon: "success",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Sim, cadastrar!",
                        cancelButtonText: "Não, eu acabei!"
                    }).then((result) => {
                        $scope.listar();
                        if (result.isDismissed) {

                            $scope.$apply(function () {
                                $scope.listandoUsuarioAcao();
                            });


                        }
                    });
                }


            }, function (error) {

                Swal.fire({
                    title: "The Internet?",
                    text: "That thing is still around?",
                    icon: "question"
                });


            })


        }




    });