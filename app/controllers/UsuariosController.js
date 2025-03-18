angular.module('meuApp')
    .controller('usuariosController', function ($scope, $http, $state) {

        $token = localStorage.getItem('token');
        $config = {
            headers: {
                'Authorization': 'Bearer ' + $token
            }
        }

        $configContentUndefined = {
            headers: {
                'Authorization': 'Bearer ' + $token,
                'Content-Type': undefined
            }
        }



        deslogar = function () {
            localStorage.removeItem('token');
            $state.go('login');
        }


        $scope.informacoes = {
            arquivo: '',
            arquivoEditar: ''
        };

        $scope.setArquivo = function (input) {
            console.log("chegou");
            var arquivo = input.files[0]; // Acessa o arquivo selecionado
            if (arquivo) {
                $scope.informacoes.arquivo = arquivo; // Armazena o arquivo no modelo
                $scope.$apply(); // Força o AngularJS a atualizar o modelo
            }
        };

        $scope.setArquivoEditar = function (input) {
            var arquivo = input.files[0]; // Acessa o arquivo selecionado
            if (arquivo) {
                $scope.informacoes.arquivoEditar = arquivo; // Armazena o arquivo no modelo
                $scope.$apply(); // Força o AngularJS a atualizar o modelo
            }
        };


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
                if (error.status == 401) {
                    deslogar();
                }
                else if(error.status == 403){
                    Swal.fire({
                        title: "Falha",
                        text: "Você não tem permissão para essa ação!",
                        icon: "error"
                    });
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
            password: '',
            id_arquivo: ''
        }

        $scope.editarUsuario = {
            id: '',
            name: '',
            email: '',
            password: '',
            id_arquivo: ''
        }

        $scope.limpar = function () {

            $scope.novoUsuario = {
                name: '',
                email: '',
                password: '',
                id_arquivo: ''

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


            var formData = new FormData();
            formData.append('arquivo', $scope.informacoes.arquivoEditar);


            $http.post('http://localhost:8000/api/arquivos/salvar', formData, $configContentUndefined).then(function (response) {
                console.log(response);
                if (response.status == 201) {
                    console.log(response.data);
                    $scope.editarUsuario.id_arquivo = response.data.id;
                    console.log($scope.editarUsuario);


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
            });
        }


        $scope.cadastrarNovoUsuario = function () {
            console.log($scope.novoUsuario);

            var formData = new FormData();
            formData.append('arquivo', $scope.informacoes.arquivo);


            $http.post('http://localhost:8000/api/arquivos/salvar', formData, $configContentUndefined).then(function (response) {
                console.log(response);
                if (response.status == 201) {
                    console.log(response.data);

                    $scope.novoUsuario.id_arquivo = response.data.id;

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



            }, function (error) {
                console.log(error);
            })





        }



    });