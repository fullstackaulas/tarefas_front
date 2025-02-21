angular
  .module("meuApp")
  .controller("cadastroController", function ($scope, $http, $state) {
    $scope.info = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    $scope.cadastrarUsuario = function () {
      if ($scope.info.password != $scope.info.confirmPassword) {
        Swal.fire({
          title: "Error",
          text: "As senhas devem ser iguais",
          icon: "error",
        });
      } else {
        $http
          .post("http://localhost:8000/api/usuarios/cadastrarNovo", $scope.info)
          .then(
            function (response) {
              if (response.status == 201) {
                Swal.fire({
                  title: "success",
                  text: "Usuário Cadastrado",
                  icon: "success",
                });
                $state.go("login");
              }
            },
            function (error) {
              if (error.status == 409) {
                Swal.fire({
                  title: "Error",
                  text: "Este E-mail já existe :/",
                  icon: "error",
                });
              } else {
                console.log(error);
              }
            }
          );
      }
    };
  });
