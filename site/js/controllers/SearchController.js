angular.module('JINI.controllers')
    .controller('SearchController', ['$scope', '$rootScope', '$stateParams', '$state', SearchController]);

function SearchController($scope, $rootScope, $stateParams, $state) {
    console.log('SearchControllerLoaded. ID:')

    // set back default image in the menu center
    $rootScope.imageOff();

    // Close all other views.
    $rootScope.displayHandle.closeAll()

    // set the current search to the scope.
    $rootScope.keywords.keywords = $stateParams.search;
    // set the current id to the scope.
    $scope.currentID = $stateParams.id || 0;

    /**
     * set the back url based on the search category page.
     */
    $rootScope.backUrl = false;
    if($state.current.name == 'searchInCategory')
    {
        $rootScope.backUrl = '#/search/' + $rootScope.keywords.keywords;
    }

    /**
     * Fix the views display based on the current view
     * show the current and close others.
     */
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

    /**
     * Do the search.
     */
    $rootScope.search();
};
