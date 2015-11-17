angular.module('JINI.controllers')
    .controller('CategoryController', ['$rootScope', '$scope', '$stateParams', '$state', '$http', CategoryController]);

function CategoryController($rootScope, $scope, $stateParams, $state, $http) {
    console.log('CategoryControllerLoaded. ID:', $stateParams.id)
    console.log('CategoryController', $state.current)
    $scope.currentID = $stateParams.id;
    $rootScope.clearSearch();

    $rootScope.backUrl = false;
    switch($state.current.name)
    {
        case 'object':
            $rootScope.objectMapUrl = '#/'+ $state.params.id + '-' + $state.params.id2 + ($state.params.map ? '' : '/map') + '/' + $state.params.title + '/' + $state.params.title2 + '/';
            var fromSearch = ($state.params.fromSearch ? '/search/' + ($state.params.fromSearch).replace('fromSearch-', '') : '')
            $rootScope.backUrl = '#/'+ $state.params.id +'/' + $state.params.title + fromSearch;
            break;

        case 'category':
            $rootScope.backUrl = '#/search/' + ($state.params.fromSearch).replace('fromSearch-', '');
            break;
    }


    $rootScope.showObjectBlockMap = false;
    if($stateParams.map)
    {
        console.log('$stateParams.map', $stateParams.map);
        $rootScope.showObjectBlockMap = true;
    }
};
