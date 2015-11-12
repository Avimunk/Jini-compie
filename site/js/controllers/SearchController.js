angular.module('JINI.controllers')
    .controller('SearchController', ['$scope', '$rootScope', '$stateParams', SearchController]);

function SearchController($scope, $rootScope, $stateParams) {
    console.log('SearchControllerLoaded. ID:')

    $rootScope.keywords = $scope.search = $stateParams.search;
    $scope.currentID = $stateParams.id || 0;
    if($scope.currentID)
    {
        $rootScope.showCategorySearchBlock = true;
        $scope.showSearchBlock = false;
    }
    else
    {
        $scope.showSearchBlock = true;
        $rootScope.showCategorySearchBlock = false;
    }

    $rootScope.search();
};
