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
    'valdr',
    'angularLazyImg'
])
.config(Config)
.run(Run);

Config.$inject = ['$stateProvider', '$urlRouterProvider', 'valdrProvider', 'valdrMessageProvider'];

function Config($stateProvider, $urlRouterProvider, valdrProvider, valdrMessageProvider) {
    console.log('Config Loaded');

    // if route not found
    $urlRouterProvider.otherwise('/');

    // Routes
    $stateProvider
        .state('home', {
            cache: false,
            url: '/',
            controller: 'HomeController',
            templateUrl: 'templates/main/content.html',
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
            cache: false,
            url: '/{id:[1-9][0-9]*}/{title:.*?}/search{map:(?:/map)?}/{search:.+}',
            controller: 'SearchController',
            templateUrl: 'templates/main/content.html',
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
            cache: false,
            url: '/{id:[1-9][0-9]*}/{title:.*}{fromSearch:(?:/fromSearch/.*)?}',
            controller: 'CategoryController',
            templateUrl: 'templates/main/content.html',
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
        .state('singlePage', {
            cache: false,
            url: '/{name:(?:vision|recommended|info|contact|24news)}',
            controller: 'SinglePageController',
            templateUrl: 'templates/main/content.html',
            resolve: {
                categories: ['CategoryService', '$stateParams', function(CategoryService, $stateParams){
                    console.log('CALL: resolve.categories6')
                    return CategoryService.getCategories($stateParams);
                }],
                setScope: ['$rootScope', '$state', '$stateParams', 'categories', 'setScopeService', function($rootScope, $state, $stateParams, categories, setScopeService){
                    console.log('CALL: resolve.setScope6')
                    return setScopeService.init($rootScope, $state, $stateParams, categories);
                }]
            }
        })
        .state('object', {
            cache: false,
            url: '/{id:[0-9][0-9]*}-{id2:[1-9][0-9]*}{fromCategory:(?:/cat)?}{map:(?:/map)?}/{title:.*}/{title2:.*}/{fromSearch:(?:fromSearch-.*)?}',
            controller: 'CategoryController',
            templateUrl: 'templates/main/content.html',
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
                        item.type = 'object';
                        $rootScope.openItem(item, 'object')
                        return true;
                    });
                }]
            }
        })
        .state('search', {
            cache: false,
            url: '/search/{search:.+}',
            controller: 'SearchController',
            templateUrl: 'templates/main/content.html',
            resolve: {
                categories: ['CategoryService', '$stateParams', function(CategoryService, $stateParams){
                    console.log('CALL: resolve.categories4')
                    return CategoryService.getCategories($stateParams);
                }],
                setScope: ['$rootScope', '$state', '$stateParams', 'categories', 'setScopeService', function($rootScope, $state, $stateParams, categories, setScopeService){
                    console.log('CALL: resolve.setScope4')
                    $rootScope.allBreadCrumbs = categories.breadcrumbs;
                    return setScopeService.init($rootScope, $state, $stateParams, categories);
                }]
            }
        });

    /**
     * Valdr form options
     */
    valdrProvider.addConstraints({
        'Contact': {
            'name': {
                'maxLength': {
                    'number': 40,
                    'message': 'Name length cannot be more then 40 letters'
                },
                'required': {
                    'message': 'Name is required.'
                },
                'pattern' :{
                    'value' : '/^.{2,}\s.{2,}$/',
                    'message': 'Name must have at least 2 words'
                }
            },
            'phone': {
                'size': {
                    'min': 7,
                    'max': 20,
                    'message': 'Phone number must be between 7 and 20 digits.'
                },
                'pattern' : {
                    'value' : '/^[0-9]+$/',
                    'message': 'Phone number can contains only digits'
                }
            },
            'email': {
                "email": {
                    "message": "Must be a valid E-Mail address."
                },
                'required': {
                    'message': 'E-Mail address is required.'
                }
            },
            'reason': {
                'required': {
                    'message': '1You must select a reason'
                },
                'pattern' :{
                    'value' : '/[1-5]/',
                    'message': '2You must select a reason'
                }
            }
        }
    });
    valdrMessageProvider.setTemplate('<span class="error-txt">{{ violation.message }}</span>');
};


Run.$inject = ['$rootScope'];
function Run($rootScope) {
    // before router change pages..
        $rootScope.$on('$stateChangeStart', function(event, toState){});
};





