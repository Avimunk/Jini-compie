angular.module('JINI.controllers')
.controller('MainController', MainController);


MainController.$inject = ['$state', '$rootScope', 'pie', 'fixPie', '$http', '$location', '$scope', '$window'];

function MainController($state, $rootScope, pie, fixPie, $http, $location, $scope, $window) {

    console.log('MainController');

    $rootScope.siteUrl = '/Jini3/#';
    $rootScope.mediaUrl = 'http://ec2-52-27-196-120.us-west-2.compute.amazonaws.com/uploads/';

    var history = [];
    $rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.isPage = false;
        history.push($location.$$path);
    });

    $rootScope.showHistory = function(){
        console.log(history);
    };

    $rootScope.back = function () {
        var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        $location.path(prevUrl);
    };

    $rootScope.pie = pie;
    $rootScope.fixPie = function(){
        fixPie.init($rootScope.currentCategoriesLength, $rootScope.isFirst);
    };

    $rootScope.setMapWidth = function(digest){
        var width = window.innerWidth;
        if(width < 1627 && width > 980)
        {
            $rootScope.set_map_width = width - 10 - 365 - 80 - 70;
            if(digest)
                $rootScope.$digest();
        }
    };
    $rootScope.setMapWidth(false);

    angular.element($window).bind('resize', function() {
        $rootScope.setMapWidth(true);
    });

    $rootScope.centerImage = '../img/menu-logo.png';

    $rootScope.imageOn = function(e){
        $rootScope.centerImage = e.featuredImageUrl;
    };

    $rootScope.imageOff = function(){
        $rootScope.centerImage = '../img/menu-logo.png';
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
        if(($state.current.name == 'search' || $state.current.name == 'searchInCategory') && type != 'object')
        {
            console.log('in search page');
            $rootScope.displayHandle.closeAll();
            return false;
        }
        else if($state.current.name == 'singlePage' && type != 'object')
        {
            console.log('in single page');
            $rootScope.displayHandle.closeAll();
            return false;
        }
        else
        {
            $rootScope.clearSearch();
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
            //$rootScope.displayHandle.closeAll();
            return;
        }

        $rootScope.showHomeBanner = false;

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
    $rootScope.a = [];
    $rootScope.a.length = 50;
    $rootScope.leftBlocksHandler = {
        categoryHover: function(categoryData, fromParent)
        {
            if($state.current.name == 'search' || $state.current.name == 'searchInCategory')
            {
                $rootScope.displayHandle.closeAll();
                return false;
            }
            else if($state.current.name == 'singlePage')
            {
                console.log('in single page');
                $rootScope.displayHandle.closeAll();
                return false;
            }

            if(typeof fromParent == 'undefined' && justOpened)return false;

            if(mapTimeout)
                clearTimeout(mapTimeout);

            $rootScope.displayHandle.showCategoryOrHomePage();
            $rootScope.showCategoryHover(categoryData);

        },
        categoryList: function(categoryData)
        {
            if($rootScope.showCategoriesBlockMap)
            {
                //$rootScope.set_map_width = 999;
                $rootScope.setMapWidth();
            }

            $rootScope.displayHandle.showCategoryList();
            $rootScope.showCategoryList(categoryData);

        },
        objectView: function(objectData)
        {
            if($rootScope.showCategoriesBlockMap)
            {
                //$rootScope.set_map_width = 999;
                $rootScope.setMapWidth();
            }

            $rootScope.displayHandle.showObject();
            $rootScope.showObject(objectData);

        },
        homePageView: function()
        {
            $rootScope.displayHandle.closeAll();
            $rootScope.showHomePageBanner();
        }
    }

    $rootScope.displayHandle = {
        showCategoryOrHomePage: function()
        {
            console.log('showCategoryOrHomePage');
            $rootScope.showCategoryBlock    = true;
            $rootScope.showCategoriesBlock  = false;
            $rootScope.showObjectBlock      = false;
        },
        showCategoryList: function()
        {
            console.log('showCategoryList');
            $rootScope.showCategoriesBlock  = true;
            $rootScope.showCategoryBlock    = false;
            $rootScope.showObjectBlock      = false;

            if(!$rootScope.showCategoriesBlockList && !$rootScope.showCategoriesBlockMap)
                $rootScope.showCategoriesBlockList = true;
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
            $rootScope.showHomeBanner = $rootScope.showCategoryBlock = $rootScope.showObjectBlock = $rootScope.showCategoriesBlock = false;
        }
    }

    $rootScope.showCategoryHover = function(categoryData){

        $rootScope.showHomeBanner = false;
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
        setTimeout(function(){
            $rootScope.$broadcast('rebuild:me');
            console.log('rebuild:me');
        },500);

    }

    $rootScope.showHomePageBanner = function() {
        $http.get('/Jini3/data/home/banner.json')
            .then(function(response){
                var items = response.data;
                $rootScope.showHomeBanner = items[Math.floor(Math.random()*items.length)];
            });
    }

    var mapTimeout = false;
    $rootScope.closeOnMouseover = function(){
        if(justOpened)
            return false;

        if($rootScope.showCategoriesBlock)
        {
            if($rootScope.showCategoriesBlockMap)
            {
                $rootScope.set_map_width = 0;
                mapTimeout = setTimeout(function(){
                    console.log('timeout!');
                    $rootScope.displayHandle.closeAll();
                    $rootScope.$digest();
                },300);

            }
            else
            {
                $rootScope.displayHandle.closeAll();
            }
        }
        else if($rootScope.showObjectBlock)
        {
            if($rootScope.showObjectBlockMap)
            {
                $rootScope.set_map_width = 0;
                mapTimeout = setTimeout(function(){
                    console.log('timeout!');
                    $rootScope.displayHandle.closeAll();
                    $rootScope.$digest();
                },300);

            }
        else
            {
                $rootScope.displayHandle.closeAll();
            }
        }

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

    var topSearchUrl = '/Jini3/public/objects/search?query=',
    centerSearchUrl = '/Jini3/public/objects/searchPage?query=',
    interval1 = false,
    interval2 = false,
    interval3 = false,
    timeout1,
    timeout2,
    timeout3,
    searches = {
        page: [],
        regular: [],
    };
    $rootScope.keywords = {};
    $rootScope.top_search_result = false;
    $rootScope.center_search_result = false;
    $rootScope.category_search_result = false;

    $rootScope.search = function(){

            if($state.current.name == 'search')
            {
                if(timeout2)
                    clearTimeout(timeout2);
                if(timeout3)
                    clearTimeout(timeout3);
                if(interval1)
                {
                    clearTimeout(timeout1);
                }
                var currentSearch = $rootScope.keywords.keywords;
                interval1 = true;
                timeout1 = setTimeout(function(){

                    interval1 = false;
                    $rootScope.center_search_result = $rootScope.top_search_result = null;

                    if(searches.page[currentSearch])
                    {
                        $rootScope.center_search_result = searches.page[currentSearch];
                        if(!$rootScope.$$phase) $rootScope.$digest();
                    }
                    else
                    {
                        $http.get(centerSearchUrl + currentSearch).then(function(resp){
                            searches.page[currentSearch] = $rootScope.center_search_result = resp.data;
                            if(!$rootScope.$$phase) $rootScope.$digest();
                        });
                    }


                }, 500);

            }
            else if($state.current.name == 'searchInCategory')
            {
                if(timeout1)
                    clearTimeout(timeout1);
                if(timeout3)
                    clearTimeout(timeout3);
                if(interval2)
                {
                    clearTimeout(timeout2);
                }
                interval2 = true;
                timeout2 = setTimeout(function(){

                    interval2 = false;
                    $rootScope.top_search_result = $rootScope.center_search_result = false;

                    if(searches.page[$rootScope.keywords.keywords + '|' + $state.params.id])
                    {
                        $rootScope.category_search_result = searches.page[$rootScope.keywords.keywords + '|' + $state.params.id];
                        if(!$rootScope.$$phase) $rootScope.$digest();
                    }
                    else
                    {
                        $http.get(centerSearchUrl + $rootScope.keywords.keywords + '&categoryid=' + $state.params.id).then(function(resp){
                            searches.page[$rootScope.keywords.keywords + '|' + $state.params.id] = $rootScope.category_search_result = resp.data;
                            if(!$rootScope.$$phase) $rootScope.$digest();
                        });
                    }

                }, 500);
            }
            else
            {
                //console.log($rootScope.keywords.keywords);
                if(timeout1)
                    clearTimeout(timeout1);
                if(timeout2) {
                    clearTimeout(timeout2);
                }
                if(interval3)
                {
                    clearTimeout(timeout3);
                }
                interval3 = true;
                timeout3 = setTimeout(function(){
                    interval3 = false;
                    if(searches.regular[$rootScope.keywords.keywords])
                    {
                        $rootScope.top_search_result = searches.regular[$rootScope.keywords.keywords];
                        if(!$rootScope.$$phase) $rootScope.$digest();
                    }
                    else
                    {
                        $http.get(topSearchUrl + $rootScope.keywords.keywords).then(function(resp){
                            searches.regular[$rootScope.keywords.keywords] = $rootScope.top_search_result = resp.data;
                            if(!$rootScope.$$phase) $rootScope.$digest();
                        });
                    }
                }, 500);
            }
        return false;
    }
    $rootScope.clearSearch = function(){
        $rootScope.keywords.keywords = null;
        $rootScope.top_search_result = false;
    }
    $rootScope.closeSearchBtn = function(){
        if($rootScope.top_search_result && $rootScope.top_search_result.length)
        {
            console.log('here1!');
            $rootScope.clearSearch();
            return false;
        }

        if($rootScope.center_search_result && $rootScope.center_search_result.count)
        {
            console.log('here2!');
            $rootScope.back();
        }

        if($rootScope.category_search_result)
        {
            console.log('here3!');
            console.log('center_search_result', ('#/' + $state.params.id + '/' + encodeURI($state.params.title)));
            $location.path('/' + $state.params.id + '/' + encodeURI($state.params.title));
        }

        $rootScope.clearSearch();
        setTimeout(function(){
            $rootScope.clearSearch();
        },300);
    }

    $rootScope.changeUrl = function(isButtonClick){
        if($state.current.name == 'search')
        {
            if($rootScope.keywords.keywords.length >= 1)
            {
                $location.path('/search/' + $rootScope.keywords.keywords)
            }

        }
        else if($state.current.name == 'searchInCategory')
        {
            console.log('changeUrl -> searchInCategory',$state.params)
            if($rootScope.keywords.keywords.length >= 1)
            {
                if($state.params.map)
                    $location.path('/' + $state.params.id + '/' + $state.params.title + '/search/map/' + $rootScope.keywords.keywords)
                else
                    $location.path('/' + $state.params.id + '/' + $state.params.title + '/search/' + $rootScope.keywords.keywords)
            }
        }
        else
        {
            if(isButtonClick)
                $location.path('/search/' + $rootScope.keywords.keywords);
            else
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

        $location.path('/' + $state.params.id + '/' + $state.params.title + '/search/map/' + $rootScope.keywords.keywords)

        //$rootScope.showCategoriesSearchBlockList = false;
        //$rootScope.showCategoriesSearchBlockMap  = true;
    }
    $rootScope.showCategoriesSearchList = function(){
        console.log('clicked!showCategoriesList');
        if(!$rootScope.showCategorySearchBlock)
            return false;

        if($rootScope.showCategoriesSearchBlockList)
            return true;

        $location.path('/' + $state.params.id + '/' + $state.params.title + '/search/' + $rootScope.keywords.keywords);

        //$rootScope.showCategoriesSearchBlockList = true;
        //$rootScope.showCategoriesSearchBlockMap  = false;
    }
};