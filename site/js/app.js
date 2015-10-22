angular.module('JINI', [
    'ui.router',
    'ngStorage',
    'ngMessages',
    'JINI.controllers',
    'JINI.directives',
    'JINI.filters',
    'JINI.services',
    'JINI.templates',
])

.config(Config)
.run(Run);

Config.$inject = ['$stateProvider', '$urlRouterProvider', '$localStorageProvider'];

function Config($stateProvider, $urlRouterProvider, $localStorageProvider) {

    console.log('Config');
    // Routes
    $stateProvider
        .state('home', {
            cache: false,
            url: '',
            controller: 'HomeController',
            templateUrl: 'templates/home/index.html'
        })
        .state('category', {
            cache: false,
            url: '/category/:id',
            controller: 'CategoryController',
            templateUrl: 'templates/categories/8.html'
        })
    ;

};


Run.$inject = ['$rootScope', '$state', '$localStorage', '$sessionStorage', '$window', '$http'];
function Run($rootScope, $state, $localStorage, $sessionStorage, $window, $http) {



    // before router change pages..
    $rootScope.$on('$stateChangeStart', function(event, toState){

    });

};





