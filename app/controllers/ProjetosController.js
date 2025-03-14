angular.module('meuApp')
    .controller('projetosController', function ($scope, $http, $state) {

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
                if (error.status == 401) {
                    deslogar();
                }
                console.log(error);
            });
        }

        tratarDados = function (dados) {
            for (x = 0; x < dados.length; x++) {
                dados[x]['dataDeInicio'] = new Date(dados[x]['dataDeInicio']);
                dados[x]["dataDeInicio"].setHours(dados[x]["dataDeInicio"].getHours() + 3);
                dados[x]['dataDeConclusao'] = new Date(dados[x]['dataDeConclusao']);
                dados[x]["dataDeConclusao"].setHours(dados[x]["dataDeConclusao"].getHours() + 3);
            }
            return dados;
        }

        tratarDadosConsultar = function (dados) {
            $scope.acao.pagina = 'editando';
            dados['dataDeInicio'] = new Date(dados['dataDeInicio']);
            dados['dataDeConclusao'] = new Date(dados['dataDeConclusao']);

            return dados;
        }

        $scope.consultar = function (id) {
            url = 'http://localhost:8000/api/projetos/consultar/' + id;
            $http.get(url, $config).then(function (response) {
                if (response.status = 200) {
                    $scope.editarProjeto = tratarDadosConsultar(response.data);
                }
                console.log(response);
            }, function (error) {
                console.log(error);
            })
        }


        $scope.listar();

        $scope.novoProjeto = {
            nome: '',
            descricao: '',
            dataDeInicio: '',
            prioridade: 'normal',
            dataDeConclusao: '',
            id_arquivo: '',
            tarefas: [],
            pontos: ''
        }

        $scope.editarProjeto = {
            id: '',
            nome: '',
            descricao: '',
            dataDeInicio: '',
            prioridade: '',
            dataDeConclusao: '',
            id_arquivo: '',
            pontos: ''
        }

        $scope.limpar = function () {

            $scope.novoProjeto = {
                nome: '',
                descricao: '',
                dataDeInicio: '',
                prioridade: 'normal',
                dataDeConclusao: '',
                id_arquivo: '',
                pontos: ''
            }

        }

        $scope.setArquivo = function (input) {
            var arquivo = input.files[0]; // Acessa o arquivo selecionado
            if (arquivo) {
                $scope.informacoes.arquivo = arquivo; // Armazena o arquivo no modelo
                $scope.$apply(); // Força o AngularJS a atualizar o modelo
            }
        };

        $scope.adicionarTarefa = function () {
            $scope.novoProjeto.tarefas.push({ nome: '', id: Date.now() });
        }

        $scope.deletarModal = function (id, id_arquivo) {
            
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
                    $scope.deletarDeVerdade(id, id_arquivo);

                }
            });
        }

        $scope.consultarTarefa = function (id, nome) {
            Swal.fire({
                input: "textarea",
                inputLabel: `Editando tarefa #${id} - ${nome}`,
                inputPlaceholder: nome,
                showCancelButton: true
            }).then(function (result) {
                // Verifique se o usuário não clicou no botão Cancelar
                if (result.isConfirmed && result.value) {
                    const text = result.value;

                    $scope.$apply(function () {
                        console.log('Chegou');
                        // Aqui você pode chamar a função para atualizar a tarefa
                        $scope.atualizaTarefa(id, text);
                    });
                }
            });
        }




        $scope.adicionarColaboradorNoProjeto = function () {
            Swal.fire({
                input: "textarea",
                inputLabel: `Adicionar colaborador`,
                inputPlaceholder: '',
                showCancelButton: true
            }).then(function (result) {
                if (result.isConfirmed && result.value) {
                    const text = result.value;
                    $scope.$apply(function () {

                        post = {};
                        post.user_id = text;
                        post.projeto_id = $scope.editarProjeto.id;


                        $http.post('http://localhost:8000/api/projetoUsuario/cadastrar', post, $config).then(function (response) {
                            // $scope.consultar($scope.editarProjeto.id);
                            console.log(response);
                            //fazer depois a atualizçao de informação

                        }, function (error) {
                            console.log(error);
                        })


                        // Aqui você pode chamar a função para atualizar a tarefa
                    });
                }
            });
        }

        $scope.adicionarTarefaNaEdicao = function () {
            Swal.fire({
                input: "textarea",
                inputLabel: `Adicionando tarefa`,
                inputPlaceholder: '',
                showCancelButton: true
            }).then(function (result) {
                if (result.isConfirmed && result.value) {
                    const text = result.value;
                    $scope.$apply(function () {

                        post = {};
                        post.nome = text;
                        post.id_projeto = $scope.editarProjeto.id;


                        $http.post('http://localhost:8000/api/tarefas/cadastrar', post, $config).then(function (response) {
                            $scope.consultar($scope.editarProjeto.id);

                        }, function (error) {
                            console.log(error);
                        })


                        // Aqui você pode chamar a função para atualizar a tarefa
                    });
                }
            });
        }



        $scope.atualizaTarefa = function (id, nome) {
            post = {};
            post.nome = nome;

            url = 'http://localhost:8000/api/tarefas/editarParcial/' + id
            $http.patch(url, post, $config).then(function (response) {
                if (response.status == 200) {
                    Swal.fire({
                        title: "Editado!",
                        text: "Sua tarefa foi editada",
                        icon: "success"
                    });
                    $scope.consultar($scope.editarProjeto.id);

                }
            }, function (error) {
                console.log(error);
            });
        }



        $scope.deletarColaboradorModal = function (id) {
            Swal.fire({
                title: "Você tem certeza?",
                text: "Deletar este colaborador é uma ação irreversível!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sim, delete!",
                cancelButtonText: "Cancelar!"
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.deletarColaboradorDeVerdade(id);

                }
            });
        }

        $scope.deletarTarefaModal = function (id) {
            Swal.fire({
                title: "Você tem certeza?",
                text: "Deletar esta tarefa é uma ação irreversível!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sim, delete!",
                cancelButtonText: "Cancelar!"
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.deletarTarefaDeVerdade(id);

                }
            });
        }



        $scope.deletarDeVerdade = function (id, id_arquivo) {
            if(id_arquivo != null) {
                $http.delete("http://localhost:8000/api/arquivos/" + id_arquivo, $config).then(function(response) {
                    console.log(response);
                }, function(error){
                    console.log(error);
                })
            }

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

        $scope.downloadDoArquivo = function () {


            
            console.log($scope.editarProjeto);
            id = $scope.editarProjeto.id_arquivo;
            console.log(id);

            $http.get('http://localhost:8000/api/arquivos/' + id + '/download', $config).then(function (response) {
                console.log(response);

                downloadFile(response.data);


            },
                function (error) {
                    console.log(error);
                })

        }



        function downloadFile(imgDocument) {
            var ext = [imgDocument.nome, imgDocument.extensao];
            // var ext = ["download", 'csv'];
            //var ext = ['.PNG', '.pdf'];

            var a = document.createElement("a");

            var binary_string = atob(imgDocument.data);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }

            var file = new Blob([bytes.buffer], { type: ext[1] });
            var fileName = ext[0].toLowerCase() + "." + ext[1];

            if (window.navigator.msSaveOrOpenBlob)
                // IE10+
                window.navigator.msSaveOrOpenBlob(file, fileName);
            else {
                // Others
                var url = URL.createObjectURL(file);
                a.href = url;
                a.target = "_blank";
                //if(ext[1].toLowerCase() == 'xlsx'){
                a.download = fileName;
                //}
                document.body.appendChild(a);
            }
            a.click();

            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 200);
            window.closeLoading();
        }


    






        $scope.deletarTarefaDeVerdade = function (id) {


            $http.delete('http://localhost:8000/api/tarefas/deletar/' + id, $config).then(function (response) {
                if (response.status == 200) {
                    Swal.fire({
                        title: "Deletado!",
                        text: "Sua tarefa foi deletada",
                        icon: "success"
                    });


                    $scope.consultar($scope.editarProjeto.id);
                }
            }, function (error) {
                console.log(error);
            });



        }


        $scope.deletarColaboradorDeVerdade = function (id) {


            $http.delete('http://localhost:8000/api/projetoUsuario/deletar/' + $scope.editarProjeto.id + '/' + id, $config).then(function (response) {
                if (response.status == 200) {
                    Swal.fire({
                        title: "Deletado!",
                        text: "Seu colaborador foi deletado",
                        icon: "success"
                    });


                    $scope.consultar($scope.editarProjeto.id);
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

        $scope.salvarEdicaoProjeto = function () {

            url = 'http://localhost:8000/api/projetos/editarParcial/' + $scope.editarProjeto.id
            $http.patch(url, $scope.editarProjeto, $config).then(function (response) {
                if (response.status == 200) {
                    Swal.fire({
                        title: "Editado!",
                        text: "Seu projeto foi editado",
                        icon: "success"
                    });
                    $scope.listar();
                    $scope.acao.pagina = 'listando';
                }
            }, function (error) {
                console.log(error);
            })
        }


        $scope.cadastrarNovoProjeto = function () {
            console.log($scope.novoProjeto);
            var formData = new FormData();
            formData.append('arquivo', $scope.informacoes.arquivo);

            $http.post('http://localhost:8000/api/arquivos/salvar', formData, $configContentUndefined).then(function (response) {
                console.log(response);
                if (response.status == 201) {
                    $scope.novoProjeto.id_arquivo = response.data.id;

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
            }, function (error) {
                console.log(error);
            })

        }




    });