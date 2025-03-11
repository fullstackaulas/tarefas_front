angular.module('meuApp')
    .controller('arquivosController', function ($scope, $http, $state) {

        $token = localStorage.getItem('token');
        $config = {
            headers: {
                'Authorization': 'Bearer ' + $token,
                'Content-Type': undefined
            }
        }

        deslogar = function(){
            localStorage.removeItem('token');
            $state.go('login');
        }
        
        $scope.informacoes = {
            arquivo: ''
        };

        $scope.setArquivo = function(input) {
            var arquivo = input.files[0]; // Acessa o arquivo selecionado
            if (arquivo) {
                $scope.informacoes.arquivo = arquivo; // Armazena o arquivo no modelo
                $scope.$apply(); // Força o AngularJS a atualizar o modelo
            }
        };

        $scope.cadastrarNovoArquivo = function () {

            console.log($scope.informacoes);

            var formData = new FormData();
            formData.append('arquivo', $scope.informacoes.arquivo);
           

            $http.post('http://localhost:8000/api/arquivos/salvar', formData, $config).then(function(response){
                console.log(response);
            }, function(error){
                console.log(error);
            })
            return;




            $http.post('http://localhost:8000/api/projetos/cadastrar', $scope.novoProjeto, $config).then(function (response) {
                console.log(response);

                if (response.status == 201) {


                    for ($i = 0; $i < $scope.novoProjeto.tarefas.length; $i++) {

                        // $tarefa->id_projeto = $request->id_projeto;
                        // $tarefa->nome = $request->nome;
                        post = {};
                        post.nome = $scope.novoProjeto.tarefas[$i].nome;
                        post.id_projeto = response.data.id;


                        $http.post('http://localhost:8000/api/tarefas/cadastrar', post, $config).then(function (response) {
                            console.log(response);
                        }, function (error) {
                            console.log(error);
                        })




                    }



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
                        if (result.isDismissed) {

                            $scope.$apply(function () {
                                $scope.listandoProjetoAcao();
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