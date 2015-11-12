angular.module('JINI.controllers')
.controller('MainController', MainController);


MainController.$inject = ['$state', '$rootScope', 'pie', 'fixPie', '$http', '$location', '$scope'];

function MainController($state, $rootScope, pie, fixPie, $http, $location, $scope) {

    console.log('MainController');

    $rootScope.siteUrl = '/Jini3/#';
    $rootScope.mediaUrl = '/Jini3/public/uploads/';

    var history = [];
    $rootScope.$on('$locationChangeSuccess', function() {
        history.push($location.$$path);
    });

    $rootScope.back = function () {
        var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        $location.path(prevUrl);
        history = []; //Delete history array after going back
    };

    $rootScope.pie = pie;
    $rootScope.fixPie = function(){
        fixPie.init($rootScope.currentCategoriesLength, $rootScope.isFirst);
    };

    $rootScope.centerImage = '../img/no_selector.png';

    $rootScope.imageOn = function(e){
        $rootScope.centerImage = e.featuredImageUrl;
    };

    $rootScope.imageOff = function(){
        $rootScope.centerImage = '../img/no_selector.png';
    };

    var sideCategoriesHover = [];
    var sideCategoriesList = [];
    var sideObjects = [];
    $rootScope.showCategoryBlock = false;
    $rootScope.showObjectBlock   = false;
    $rootScope.showCategoriesBlock   = false;

    //return false;
    var justOpened = false;
    $rootScope.openItem = function(item, type){

        if($state.current.name == 'search' || $state.current.name == 'searchInCategory' && type != 'object')
        {
            $rootScope.displayHandle.closeAll();
            return false;
        }
        else
        {
            $rootScope.showCategorySearchBlock = $scope.showSearchBlock = $rootScope.top_search_result = $rootScope.center_search_result = $rootScope.category_search_result = false;
        }

        // Disable open another object for 0.5 second
        justOpened = true;
        setTimeout(function(){justOpened = false;},500)

        console.log('openItem',item)
        // Home page:
        if(!Object.keys(item).length)
        {
            $rootScope.leftBlocksHandler.homePageView();
            return;
        }

        // all types:
        switch(item.type)
        {
            case 'object':
                $rootScope.leftBlocksHandler.objectView(item);
                break;
            case 'category':
                console.log("case 'category':", item, item.items_count);
                if(item.items_count)
                {
                    // Show category hover
                    $rootScope.leftBlocksHandler.categoryHover(item, true);
                }
                else
                {
                    // show category list
                    $rootScope.leftBlocksHandler.categoryList(item);
                }
                break;
        }
    }

    $rootScope.leftBlocksHandler = {
        categoryHover: function(categoryData, fromParent)
        {
            if($state.current.name == 'search' || $state.current.name == 'searchInCategory')
            {
                $rootScope.displayHandle.closeAll();
                return false;
            }
            if(typeof fromParent == 'undefined' && justOpened)return false;
            $rootScope.displayHandle.showCategoryOrHomePage();
            $rootScope.showCategoryHover(categoryData);

        },
        categoryList: function(categoryData)
        {
            $rootScope.displayHandle.showCategoryList();
            $rootScope.showCategoryList(categoryData);

        },
        objectView: function(objectData)
        {
            $rootScope.displayHandle.showObject();
            $rootScope.showObject(objectData);

        },
        homePageView: function()
        {
            $rootScope.displayHandle.showCategoryOrHomePage();
            $rootScope.showHomePageBlock();
        }
    }

    $rootScope.displayHandle = {
        showCategoryOrHomePage: function()
        {
            console.log('showCategoryOrHomePage');
            $rootScope.showCategoriesBlock  = false;
            $rootScope.showCategoryBlock    = true;
            $rootScope.showObjectBlock      = false;
        },
        showCategoryList: function()
        {
            console.log('showCategoryList');
            $rootScope.showCategoriesBlock  = true;
            $rootScope.showCategoryBlock    = false;
            $rootScope.showObjectBlock      = false;
        },
        showObject: function()
        {
            console.log('showObject');
            $rootScope.showCategoriesBlock  = false;
            $rootScope.showCategoryBlock    = false;
            $rootScope.showObjectBlock      = true;
        },
        closeAll: function()
        {
            console.log('closeAll');
            $rootScope.showCategoryBlock = $rootScope.showObjectBlock = $rootScope.showCategoriesBlock = false;
        }
    }

    $rootScope.showCategoryHover = function(categoryData){
        var id = categoryData.id;
        if(sideCategoriesHover[id])
        {
            $rootScope.sideCategory = sideCategoriesHover[id];
        }
        else
        {
            $rootScope.sideCategory = sideCategoriesHover[id] = {
                id:      id,
                title:   categoryData.title,
                img:     categoryData.contentImageUrl,
                items_count: categoryData.items_count ? true : false,
                content: false,
            };

            $http.get('/Jini3/public/categories/'+id+'/content')
                .then(function(response){
                    $rootScope.sideCategory.content = sideCategoriesHover[id].content = response.data;
                });
        }
    }

    $rootScope.showCategoryList = function(categoryData){
        var id = categoryData.id;
        if(sideCategoriesList[id])
        {
            $rootScope.sideCategories = sideCategoriesList[id];
        }
        else
        {
            $http.get('/Jini3/public/objects/search?categoryid='+ id +'&index=100')
                .then(function(response){
                    $rootScope.sideCategories = sideCategoriesList[id] = response;
                });
        }
    }

    $rootScope.showObject = function(objectData){
        var id = objectData.id;

        if (sideObjects[id]) {
            $rootScope.sideObject = sideObjects[id]
        }
        else {
            sideObjects[id] = $rootScope.sideObject = objectData;
        }
    }

    $rootScope.showHomePageBlock = function() {
        $rootScope.displayHandle.showCategoryOrHomePage();

        if(sideCategoriesHover[0])
            $rootScope.sideCategory = sideCategoriesHover[0]
        else
            $rootScope.sideCategory = sideCategoriesHover[0] = {
                id:      '0',
                title:   'Home page',
                img:     false,
                content: 'This is the home page example data!',
            };
    }

    $rootScope.closeOnMouseover = function(){
        if(justOpened)
            return false;

        if($rootScope.showCategoriesBlock || $rootScope.showObjectBlock)
            $rootScope.displayHandle.closeAll();
    }

    $rootScope.showCategoriesMap = function(){
        if(!$rootScope.showCategoriesBlock)
            return false;

        if($rootScope.showCategoriesBlockMap)
            return true;

        $rootScope.showCategoriesBlockList = false;
        $rootScope.showCategoriesBlockMap  = true;
    }
    $rootScope.showCategoriesList = function(){
        if(!$rootScope.showCategoriesBlock)
            return false;

        if($rootScope.showCategoriesBlockList)
            return true;

        $rootScope.showCategoriesBlockList = true;
        $rootScope.showCategoriesBlockMap  = false;
    }

    var topSearchUrl = '/Jini3/public/objects/search?query=';
    var centerSearchUrl = '/Jini3/public/objects/searchPage?query=';
    var interval = false;
    var timeout;
    var searches = {
        page: [],
        regular: [],
    };
    $rootScope.search = function(){
        if(interval)
        {
            clearTimeout(timeout);
        }
        interval = true;
        timeout = setTimeout(function(){
            console.log($scope.keywords);
            if($state.current.name == 'search')
            {
                $rootScope.top_search_result = false;
                if(searches.page[$scope.keywords])
                {
                    $rootScope.center_search_result = searches.page[$scope.keywords];
                }
                else
                {
                    $http.get(centerSearchUrl + $scope.keywords).then(function(resp){
                        searches.page[$scope.keywords] = $rootScope.center_search_result = resp.data;
                    });
                }

            }
            else if($state.current.name == 'searchInCategory')
            {
                $rootScope.top_search_result = $rootScope.center_search_result = false;

                if(searches.page[$scope.keywords + '|' + $state.params.id])
                {
                    $rootScope.category_search_result = searches.page[$scope.keywords + '|' + $state.params.id];
                }
                else
                {
                    $http.get(centerSearchUrl + $scope.keywords + '&categoryid=' + $state.params.id).then(function(resp){
                        searches.page[$scope.keywords + '|' + $state.params.id] = $rootScope.category_search_result = resp.data;
                    });
                }
            }
            else
            {
                if(searches.regular[$scope.keywords])
                {
                    $rootScope.top_search_result = searches.page[$scope.keywords];
                }
                else
                {
                    $http.get(topSearchUrl + $scope.keywords).then(function(resp){
                        searches.page[$scope.keywords] = $rootScope.top_search_result = resp.data;
                    });
                }
            }
            interval = false;
        }, 500);
        return false;
    }
    $rootScope.clearSearch = function(){
        $scope.keywords = null;
        $rootScope.top_search_result = false;
    }

    $rootScope.changeUrl = function(){
        if($state.current.name == 'search')
        {
            if($scope.keywords.length >= 1)
                $location.path('/search/' + $scope.keywords)
        }
        else if($state.current.name == 'searchInCategory')
        {
            if($scope.keywords.length >= 1)
                $location.path('/' + $state.params.id + '/' + $state.params.title + '/search/' + $scope.keywords)
        }
        else
        {
            $rootScope.search();
        }
        return false;
    }

    $rootScope.showCategoriesSearchMap = function(){
        console.log('clicked!showCategoriesSeacrhMap');
        if(!$rootScope.showCategorySearchBlock)
            return false;

        if($rootScope.showCategoriesSearchBlockMap)
            return true;

        $rootScope.showCategoriesSearchBlockList = false;
        $rootScope.showCategoriesSearchBlockMap  = true;
    }
    $rootScope.showCategoriesSearchList = function(){
        console.log('clicked!showCategoriesList');
        if(!$rootScope.showCategorySearchBlock)
            return false;

        if($rootScope.showCategoriesSearchBlockList)
            return true;

        $rootScope.showCategoriesSearchBlockList = true;
        $rootScope.showCategoriesSearchBlockMap  = false;
    }
};