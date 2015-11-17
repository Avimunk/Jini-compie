angular.module('JINI.controllers')
    .controller('SinglePageController', ['$rootScope', '$scope', '$stateParams', '$state', '$http', SinglePageController]);

function SinglePageController($rootScope, $scope, $stateParams, $state, $http) {
    console.log('SinglePageControllerLoaded', $state.params.name)
    $rootScope.clearSearch();
    $rootScope.showCategorySearchBlock = $rootScope.showHomeBanner = $scope.showSearchBlock = $rootScope.top_search_result = $rootScope.center_search_result = $rootScope.category_search_result = false;

    $rootScope.displayHandle.closeAll();
    $scope.pageBlock = true;

    var pageName = $state.params.name;
    $rootScope.isPage = true;
    $rootScope.currentPage = pageName;

    var pages = {};
    if(pages[pageName])
    {
        $scope.pageContent = pages[pageName];
        console.log($scope.pageContent);
    }
    else
    {
        $http.get('/Jini3/data/pages/' + pageName + '.json')
            .then(function(response){
                $scope.pageContent = pages[pageName] = response.data;
                console.log($scope.pageContent);
            });
    }

    if(pageName == 'contact')
    {

        var fields = {
            "name": 'required',
            "phone": 'required',
            "email": 'required',
            "type": 'required',
        };
        $scope.contact = {};
        $scope.validate = function(user){
            if(!user.name)
            {

            }
        };

        $scope.save = function() {
            if($scope.validate())
            {
                console.log('Valid!', user);
                // Sand the email
            }
        };
    }
};
