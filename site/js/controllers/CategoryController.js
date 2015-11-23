angular.module('JINI.controllers')
    .controller('CategoryController', ['$rootScope', '$scope', '$stateParams', '$state', '$http', CategoryController]);

function CategoryController($rootScope, $scope, $stateParams, $state, $http) {
    console.log('CategoryControllerLoaded. ID:', $stateParams.id)
    console.log('CategoryController', $state.current)
    // set the current is to the scope.
    $scope.currentID = $stateParams.id;
    // clear the search.
    $rootScope.clearSearch();

    // prepare the back url if its from search.
    $rootScope.backUrl = false;
    switch($state.current.name)
    {
        case 'object':
            $rootScope.objectMapUrl = '#/'+ $state.params.id + '-' + $state.params.id2 + ($state.params.map ? '' : '/map') + '/' + $state.params.title + '/' + $state.params.title2 + '/';
            var fromSearch = ($state.params.fromSearch ? '/search/' + ($state.params.fromSearch).replace('fromSearch-', '') : '')
            if(fromSearch)
                $rootScope.backUrl = '#/'+ $state.params.id +'/' + $state.params.title + fromSearch;
            else
                $rootScope.backUrl = false;
            break;

        case 'category':
            $rootScope.backUrl = '#/search/' + ($state.params.fromSearch).replace('fromSearch-', '');
            break;
    }

    /**
     * show object map on map page or disable it.
     */
    $rootScope.showObjectBlockMap = false;
    if($stateParams.map)
    {
        $rootScope.showObjectBlockMap = true;
    }
};
