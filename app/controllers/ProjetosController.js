angular.module('meuApp')
    .controller('projetosController', function ($scope, $http) {

        $token = localStorage.getItem('token');
        $config = {
            headers: {
                'Authorization': 'Bearer ' + $token
            }
        }


        $scope.acao = {
            pagina: 'listando'
        };

        $scope.projetos = [];


        $scope.listar = function () {
            $http.get('http://localhost:8000/api/projetos/listar', $config).then(function (response) {
                if (response.status == 200) {
                    $scope.projetos = tratarDados(response.data);
                }
            }, function (error) {
                console.log(error);
            });
        }

        tratarDados = function (dados) {
            for (x = 0; x < dados.length; x++) {
                dados[x]['dataDeInicio'] = new Date(dados[x]['dataDeInicio']);
                dados[x]['dataDeConclusao'] =  new Date(dados[x]['dataDeConclusao']);
            }
            return dados;
        }


        $scope.listar();

        $scope.novoProjeto = {
            nome: '',
            descricao: '',
            dataDeInicio: '',
            prioridade: 'normal',
            dataDeConclusao: '',
            pontos: ''
        }

        $scope.limpar = function () {

            $scope.novoProjeto = {
                nome: '',
                descricao: '',
                dataDeInicio: '',
                prioridade: 'normal',
                dataDeConclusao: '',
                pontos: ''
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
                confirmButtonText: "Sim, cancele isso!",
                cancelButtonText: "Não delete!"
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.deletarDeVerdade(id);

                }
            });
        }



        $scope.deletarDeVerdade = function (id) {


            $http.delete('http://localhost:8000/api/projetos/deletar/' + id, $config).then(function (response) {
                if (response.status == 200) {
                    Swal.fire({
                        title: "Deletado!",
                        text: "Seu projeto foi deletado",
                        icon: "success"
                    });

                    $scope.listar();
                }
            }, function (error) {
                console.log(error);
            });



        }


        $scope.novoProjetoAcao = function () {
            $scope.acao.pagina = 'cadastrando';
        }

        $scope.listandoProjetoAcao = function () {
            $scope.acao.pagina = 'listando';
        }

        $scope.cadastrarNovoProjeto = function () {
            console.log($scope.novoProjeto);

            $http.post('http://localhost:8000/api/projetos/cadastrar', $scope.novoProjeto, $config).then(function (response) {
                console.log(response);

                if (response.status == 201) {
                    $scope.limpar();
                    Swal.fire({
                        title: "Proposta cadastrada!",
                        text: "Deseja cadastrar uma nova proposta?!",
                        icon: "success",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Sim, cadastrar nova!",
                        cancelButtonText: "Não, eu acabei!"
                    }).then((result) => {
                        $scope.listar();
                        console.log(result);
                        if (result.isDismissed) {

                            $scope.acao.pagina = 'listando';


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