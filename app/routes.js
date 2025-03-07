angular.module('meuApp', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
    .state('comMenu', {
        abstract: true,
        templateUrl: 'app/views/partials/comHeaderFooterEMenu.html', 
        controller: 'testeController'
    })
    .state('comMenu.home', {
        url: '/',
        templateUrl: 'app/views/paginas/home.html', 
        controller: 'homeController'
    })   
    .state('comMenu.projetos', {
        url: '/projetos',
        templateUrl: 'app/views/paginas/projetos.html', 
        controller: 'projetosController'
    })
    .state('comMenu.arquivos', {
        url: '/arquivos',
        templateUrl: 'app/views/paginas/arquivos.html', 
        controller: 'arquivosController'
    })
    .state('comMenu.usuarios', {
        url: '/usuarios',
        templateUrl: 'app/views/paginas/usuarios.html', 
        controller: 'usuariosController'
    })
    .state('login', {
        url: '/login',
        templateUrl: 'app/views/paginas/login.html', 
        controller: 'loginController'
    })
    .state('cadastro', {
        url: '/cadastro',
        templateUrl: 'app/views/paginas/cadastro.html', 
        controller: 'cadastroController'
    })
    .state('logout', {
        url: '/logout',
        templateUrl: 'app/views/paginas/logout.html', 
        controller: 'logoutController'
    })

    $urlRouterProvider.otherwise('/');
    

})