String.prototype.trunc =
    function( n, useWordBoundary ){
        var isTooLong = this.length > n,
            s_ = isTooLong ? this.substr(0,n-1) : this;
        s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
        return  isTooLong ? s_ + '&hellip;' : s_;
    };

angular.module('JINI', [
    'ui.router',
    'ngStorage',
    'ngMessages',
    'ngAnimate',
    'ngTinyScrollbar',
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

    // if route not found
    $urlRouterProvider.otherwise('/');
    //
    //// Routes
    //$stateProvider
    //    .state('home', {
    //        abstract: true,
    //        //cache: true,
    //        url: '/a',
    //        //controller: 'HomeController',
    //        controller: function(){
    //            alert('asdasdasd');
    //        },
    //        template: '<div> asdhkjla sdkajsd akls djlkasdas<div ui-view></div></div>',
    //        //templateUrl: 'templates/categories/8.html',
    //        /*resolve: {
    //            categories: ['CategoryService', '$stateParams', function(CategoryService, $stateParams){
    //                console.log('CALL: resolve.categories1')
    //                return CategoryService.getCategories($stateParams);
    //            }],
    //            setScope: ['$rootScope', '$state', '$stateParams', 'categories', 'setScopeService', function($rootScope, $state, $stateParams, categories, setScopeService){
    //                console.log('CALL: resolve.setScope1')
    //                return setScopeService.init($rootScope, $state, $stateParams, categories);
    //            }]
    //        },*/
    //    })
    //    .state('home.category', {
    //        //cache: true,
    //        url: '{id:[1-9][0-9]*}/{title:.*}',
    //        //controller: 'CategoryController',
    //        template: 'home.category',
    //        //templateUrl: 'templates/categories/8.html',
    //    })
    //    .state('home.object', {
    //        //cache: true,
    //        url: '{id:[1-9][0-9]*}-{id2:[1-9][0-9]*}/{title:.*}/{title2:.*}',
    //        //controller: 'CategoryController',
    //        template: 'home.object',
    //        //templateUrl: 'templates/categories/8.html',
    //        resolve: {
    //            object: ['$stateParams', 'objectService' ,'setScope', '$rootScope' , function($stateParams, objectService, setScope, $rootScope){
    //                console.log('CALL: resolve.object3', setScope)
    //                $rootScope.currentItem = false;
    //                return objectService.getObjectData($stateParams).then(function(item){
    //                    //$rootScope.openObject(item)
    //                    item.type = 'object';
    //                    $rootScope.openItem(item)
    //                    return true;
    //                });
    //            }]
    //        }
    //    })
    //;

    // Routes
    $stateProvider
        .state('home', {
            cache: true,
            url: '/',
            controller: 'HomeController',
            templateUrl: 'templates/categories/8.html',
            resolve: {
                categories: ['CategoryService', '$stateParams', function(CategoryService, $stateParams){
                    console.log('CALL: resolve.categories1')
                    return CategoryService.getCategories($stateParams);
                }],
                setScope: ['$rootScope', '$state', '$stateParams', 'categories', 'setScopeService', function($rootScope, $state, $stateParams, categories, setScopeService){
                    console.log('CALL: resolve.setScope1')
                    return setScopeService.init($rootScope, $state, $stateParams, categories);
                }]
            }
        })
        .state('searchInCategory', {
            cache: true,
            url: '/{id:[1-9][0-9]*}/{title:.*?}/search/{search:.+}',
            controller: 'SearchController',
            templateUrl: 'templates/categories/8.html',
            resolve: {
                categories: ['CategoryService', '$stateParams', function(CategoryService, $stateParams){
                    console.log('CALL: resolve.categories5')
                    return CategoryService.getCategories($stateParams);
                }],
                setScope: ['$rootScope', '$state', '$stateParams', 'categories', 'setScopeService', function($rootScope, $state, $stateParams, categories, setScopeService){
                    console.log('CALL: resolve.setScope5')
                    return setScopeService.init($rootScope, $state, $stateParams, categories);
                }],
            }
        })
        .state('category', {
            cache: true,
            url: '/{id:[1-9][0-9]*}/{title:.*}',
            controller: 'CategoryController',
            templateUrl: 'templates/categories/8.html',
            resolve: {
                categories: ['CategoryService', '$stateParams', function(CategoryService, $stateParams){
                    console.log('CALL: resolve.categories2')
                    return CategoryService.getCategories($stateParams);
                }],
                setScope: ['$rootScope', '$state', '$stateParams', 'categories', 'setScopeService', function($rootScope, $state, $stateParams, categories, setScopeService){
                    console.log('CALL: resolve.setScope2')
                    return setScopeService.init($rootScope, $state, $stateParams, categories);
                }]
            }
        })
        .state('object', {
            cache: true,
            url: '/{id:[0-9][0-9]*}-{id2:[1-9][0-9]*}{map:(?:/map)?}/{title:.*}/{title2:.*}',
            controller: 'CategoryController',
            templateUrl: 'templates/categories/8.html',
            resolve: {
                categories: ['CategoryService', '$stateParams', function(CategoryService, $stateParams){
                    console.log('CALL: resolve.categories3')
                    return CategoryService.getCategories($stateParams);
                }],
                setScope: ['$rootScope', '$state', '$stateParams', 'categories', 'setScopeService', function($rootScope, $state, $stateParams, categories, setScopeService){
                    console.log('CALL: resolve.setScope3')
                    return setScopeService.init($rootScope, $state, $stateParams, categories);
                }],
                object: ['$stateParams', 'objectService' ,'setScope', '$rootScope' , function($stateParams, objectService, setScope, $rootScope){
                    console.log('CALL: resolve.object3', setScope)
                    $rootScope.currentItem = false;
                    return objectService.getObjectData($stateParams).then(function(item){
                        //$rootScope.openObject(item)
                        item.type = 'object';
                        $rootScope.openItem(item, 'object')
                        return true;
                    });
                }]
            }
        })
        .state('search', {
            cache: true,
            url: '/search/{search:.+}',
            controller: 'SearchController',
            templateUrl: 'templates/categories/8.html',
            resolve: {
                categories: ['CategoryService', '$stateParams', function(CategoryService, $stateParams){
                    console.log('CALL: resolve.categories4')
                    return CategoryService.getCategories($stateParams);
                }],
                setScope: ['$rootScope', '$state', '$stateParams', 'categories', 'setScopeService', function($rootScope, $state, $stateParams, categories, setScopeService){
                    console.log('CALL: resolve.setScope4')
                    return setScopeService.init($rootScope, $state, $stateParams, categories);
                }],
            }
        })
    ;

};


Run.$inject = ['$rootScope', '$state', '$localStorage', '$sessionStorage', '$window', '$http'];
function Run($rootScope, $state, $localStorage, $sessionStorage, $window, $http) {

    // before router change pages..
    $rootScope.$on('$stateChangeStart', function(event, toState){

    });

};





