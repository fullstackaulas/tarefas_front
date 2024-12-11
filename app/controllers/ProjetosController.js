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