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
            cache: true,
            url: '/',
            controller: 'HomeController',
            templateUrl: 'templates/categories/8.html',
            resolve: {
                categories: ['CategoryService', function(CategoryService){
                    console.log('CALL: resolve.categories1')
                    return CategoryService.getCategories();
                }],
                setScope: ['$rootScope', '$state', '$stateParams', 'categories', 'setScopeService', function($rootScope, $state, $stateParams, categories, setScopeService){
                    console.log('CALL: resolve.setScope1')
                    return setScopeService.init($rootScope, $state, $stateParams, categories);
                }]
            }
        })
        .state('category', {
            cache: true,
            url: '/{id:[1-9][0-9]*}/{title:.*}',
            controller: 'CategoryController',
            templateUrl: 'templates/categories/8.html',
            resolve: {
                categories: ['CategoryService', function(CategoryService){
                    console.log('CALL: resolve.categories2')
                    return CategoryService.getCategories();
                }],
                setScope: ['$rootScope', '$state', '$stateParams', 'categories', 'setScopeService', function($rootScope, $state, $stateParams, categories, setScopeService){
                    console.log('CALL: resolve.setScope2')
                    return setScopeService.init($rootScope, $state, $stateParams, categories);
                }]
            }
        })
        .state('object', {
            cache: true,
            url: '/{id:[1-9][0-9]*}-{id2:[1-9][0-9]*}/{title:.*}/{title2:.*}',
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





