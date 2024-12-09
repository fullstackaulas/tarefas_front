angular.module('meuApp', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
    .state('comMenu', {
        abstract: true,
        templateUrl: 'app/views/partials/comHeaderFooterEMenu.html', // colocar depois
        controller: 'testeController' // mudar depois também
    })
    .state('comMenu.home', {
        url: '/',
        templateUrl: 'app/views/paginas/home.html', // colocar depois
        controller: 'homeController' // mudar depois também
    })
    .state('login', {
        url: '/login',
        templateUrl: 'app/views/paginas/login.html', // colocar depois
        controller: 'loginController' // mudar depois também
    })
    .state('cadastro', {
        url: '/cadastro',
        templateUrl: 'app/views/paginas/cadastro.html', // colocar depois
        controller: 'cadastroController' // mudar depois também
    });

    $urlRouterProvider.otherwise('/');
    

})