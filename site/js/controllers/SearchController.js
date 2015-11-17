angular.module('JINI.controllers')
    .controller('SearchController', ['$scope', '$rootScope', '$stateParams', '$state', SearchController]);

function SearchController($scope, $rootScope, $stateParams, $state) {
    console.log('SearchControllerLoaded. ID:')

    $rootScope.displayHandle.closeAll()
    $rootScope.keywords.keywords = $stateParams.search;
    console.log("$rootScope.keywords",$rootScope.keywords.keywords)
    $scope.currentID = $stateParams.id || 0;

    $rootScope.backUrl = false;
    if($state.current.name == 'searchInCategory')
    {
        $rootScope.backUrl = '#/search/' + $rootScope.keywords.keywords;
    }

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

    $rootScope.showCategoriesBlockMap = false;
    $rootScope.showCategoriesBlockList = true;
    $rootScope.showCategoriesSearchBlockMap = false;
    $rootScope.showCategoriesSearchBlockList = true;
    if($stateParams.map)
    {
        $rootScope.showCategoriesBlockMap = true;
        $rootScope.showCategoriesBlockList = false;
        $rootScope.showCategoriesSearchBlockMap = true;
        $rootScope.showCategoriesSearchBlockList = false;
    }

    $rootScope.search();
};
