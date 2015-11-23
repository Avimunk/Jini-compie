angular.module('JINI.controllers')
.controller('MainController', MainController);


MainController.$inject = ['$state', '$rootScope', 'pie', 'fixPie', '$http', '$location', '$scope', '$window'];

function MainController($state, $rootScope, pie, fixPie, $http, $location, $scope, $window) {

    console.log('MainController');

    /**
     * Setters.
     */
    // site and media url's
    $rootScope.siteUrl = '/Jini3/#';
    $rootScope.mediaUrl = 'http://jini.bob.org.il/jini3/public/uploads/';

    // the optional menu center image
    $rootScope.centerImage = centerImage = '../img/menu-logo.png';

    /**
     * change the image to the current
     * @param e element
     */
    $rootScope.imageOn = function(e){
        $rootScope.centerImage = e.featuredImageUrl;
    };

    /**
     * set back the default image
     */
    $rootScope.imageOff = function(){
        $rootScope.centerImage = centerImage;
    };

    // every route change
    // save the last page and do ZOOM Analytics
    var history = [];
    $rootScope.$on('$locationChangeSuccess', function() {

        // Zoom analytics
        try {
            __ZA.simulateNewPage();
        }
        catch (e) {}

        // History
        $rootScope.isPage = false;
        history.push($location.$$path);
    });

    // Go back to previous page
    $rootScope.back = function () {
        var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        $location.path(prevUrl);
    };

    // Fix the pie menu
    $rootScope.pie = pie;
    $rootScope.fixPie = function(){
        fixPie.init($rootScope.currentCategoriesLength, $rootScope.isFirst);
    };

    /**
     * fix the map width based on the current window width
     * digest is optional
     * @param digest
     */
    $rootScope.setMapWidth = function(digest){
        var width = window.innerWidth;
        if(width < 1627 && width > 980)
        {
            $rootScope.set_map_width = width - 10 - 365 - 80 - 70;
            if(digest)
                $rootScope.$digest();
        }
        else if(width >= 1627)
        {
            $rootScope.set_map_width = 1000;
            if(digest)
                $rootScope.$digest();
        }
    };
    // on load fix the map width
    $rootScope.setMapWidth(false);

    // On resize fix the map width
    angular.element($window).bind('resize', function() {
        $rootScope.setMapWidth(true);
    });

    /**
     * create objects for data storage
     */
        var sideCategoriesHover = [];
        var sideCategoriesList = [];
        var sideObjects = [];

    /**
     * Init all show variables to false
     */
        $rootScope.showCategoryBlock = false;
        $rootScope.showObjectBlock   = false;
        $rootScope.showCategoriesBlock   = false;

    /**
     * This function will change the view based on the item it recieved.
     * if it is home page, category, regular item or list category.
     * it will open the menu in the right place and show the left block with the right content.
     *
     * also will check that there is no change in the last 0.5 seconds or return false.
     * @param item
     * @param type
     * @returns {boolean}
     */
    var justOpened = false;
    $rootScope.openItem = function(item, type){
        // if is a search page will close all and not enable to change the view on hover unless is an object
        if(($state.current.name == 'search' || $state.current.name == 'searchInCategory') && type != 'object')
        {
            console.log('in search page');
            $rootScope.displayHandle.closeAll();
            return false;
        }
        // if its a signle content page will close all and not enable to change the view on hover unless is an object
        else if($state.current.name == 'singlePage' && type != 'object')
        {
            console.log('in single page');
            $rootScope.displayHandle.closeAll();
            return false;
        }
        // clear all search and close all views.
        else
        {
            $rootScope.clearSearch();
            $rootScope.showCategorySearchBlock = $scope.showSearchBlock = $rootScope.top_search_result = $rootScope.center_search_result = $rootScope.category_search_result = false;
        }

        // Disable open another object for 0.5 second
        justOpened = true;
        setTimeout(function(){justOpened = false;},500)

        console.log('openItem',item)

        // Home page, so show the home content and return.
        if(!Object.keys(item).length)
        {
            $rootScope.leftBlocksHandler.homePageView();
            return;
        }

        // not home page, hide home banner / content
        $rootScope.showHomeBanner = false;

        // switch the optional types and show the right content
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
    };

    var categoryHoverTimeOut = false;
    /**
     * disable the category last hover
     * will disable the timeout from the "$rootScope.categoryHoverHelper" function
     * @param id
     */
    $rootScope.disableCategoryHover = function(id)
    {
        console.log('disableCategoryHover', id)
        if(categoryHoverTimeOut)
        {
            clearTimeout(categoryHoverTimeOut);
            categoryHoverTimeOut = false;
        }
    };

    /**
     * Get the category data and set timeout of 0.3 seconds to show it.
     *
     * @param categoryData
     * @param fromParent
     */
    $rootScope.categoryHoverHelper = function(categoryData, fromParent){
        console.log('categoryHoverHelper', categoryData.id, categoryHoverTimeOut)
        if(categoryHoverTimeOut)
        {
            clearTimeout(categoryHoverTimeOut);
            categoryHoverTimeOut = false;
        }

        categoryHoverTimeOut = setTimeout(function(){
            $rootScope.leftBlocksHandler.categoryHover(categoryData, fromParent);
        }, 300);
    };

    /**
     * Handle left block content
     *
     * @type {{categoryHover: Function, categoryList: Function, objectView: Function, homePageView: Function}}
     */
    $rootScope.leftBlocksHandler = {

        /**
         * Show left category hover content.
         * @param categoryData
         * @param fromParent
         * @returns {boolean}
         */
        categoryHover: function(categoryData, fromParent)
        {
            // cancel on search or single page
            if($state.current.name == 'search' || $state.current.name == 'searchInCategory' || $state.current.name == 'singlePage')
            {
                $rootScope.displayHandle.closeAll();
                return false;
            }
            // cancel if its just opened
            if(typeof fromParent == 'undefined' && justOpened)
                return false;

            // Clear the map timeout.
            if(mapTimeout)
                clearTimeout(mapTimeout);

            // show current.
            $rootScope.displayHandle.showCategoryHover();
            $rootScope.showCategoryHover(categoryData);

        },

        /**
         * Show left category list
         * @param categoryData
         */
        categoryList: function(categoryData)
        {
            // fix the map width
            if($rootScope.showCategoriesBlockMap)
            {
                $rootScope.setMapWidth();
            }

            $rootScope.displayHandle.showCategoryList();
            $rootScope.showCategoryList(categoryData);

        },

        /**
         * Show left object data.
         * @param objectData
         */
        objectView: function(objectData)
        {
            // fix object map width
            if($rootScope.showCategoriesBlockMap)
            {
                $rootScope.setMapWidth();
            }

            $rootScope.displayHandle.showObject();
            $rootScope.showObject(objectData);

        },

        /**
         * close others and show home banner
         */
        homePageView: function()
        {
            $rootScope.displayHandle.closeAll();
            $rootScope.showHomePageBanner();
        }
    }

    /**
     * Handle the display of items
     * show the current and hide others.
     *
     * @type {{showCategoryHover: Function, showCategoryList: Function, showObject: Function, closeAll: Function}}
     */
    $rootScope.displayHandle = {
        // Show category hover and hide others
        showCategoryHover: function()
        {
            console.log('showCategoryHover');
            $rootScope.showCategoryBlock    = true;
            $rootScope.showCategoriesBlock  = false;
            $rootScope.showObjectBlock      = false;
        },
        // Show category list and hide others
        showCategoryList: function()
        {
            console.log('showCategoryList');
            $rootScope.showCategoriesBlock  = true;
            $rootScope.showCategoryBlock    = false;
            $rootScope.showObjectBlock      = false;

            if(!$rootScope.showCategoriesBlockList && !$rootScope.showCategoriesBlockMap)
                $rootScope.showCategoriesBlockList = true;
        },
        // Show object and hide others
        showObject: function()
        {
            console.log('showObject');
            $rootScope.showCategoriesBlock  = false;
            $rootScope.showCategoryBlock    = false;
            $rootScope.showObjectBlock      = true;
        },
        // Close all
        closeAll: function()
        {
            console.log('closeAll');
            $rootScope.showHomeBanner = $rootScope.showCategoryBlock = $rootScope.showObjectBlock = $rootScope.showCategoriesBlock = false;
        }
    }

    /**
     * Get the current category hover data
     * and store it in the original array and set it to the scope.
     *
     * @param categoryData
     * @returns {boolean}
     */
    $rootScope.showCategoryHover = function(categoryData){

        console.log('showCategoryHover', categoryData)

        // Disable the home banner
        $rootScope.showHomeBanner = false;

        // if the current category fetched already return it
        // else http get it.
        var id = categoryData.id;
        if(sideCategoriesHover[id])
        {
            if($rootScope.sideCategory == sideCategoriesHover[id])
                return false;

            $rootScope.sideCategory = sideCategoriesHover[id];
            $rootScope.$digest();
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
    };

    /**
     * Get the list data for the current category
     * and store it in the "sideCategoriesList" variable
     * and set it to the scope.
     *
     * @param categoryData
     */
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
    };

    /**
     * Get the current object data,
     * store it to the local "sideObjects" variable
     * and set it to the scope.
     *
     * @param objectData
     */
    $rootScope.showObject = function(objectData){
        var id = objectData.id;

        if (sideObjects[id]) {
            $rootScope.sideObject = sideObjects[id]
        }
        else {
            sideObjects[id] = $rootScope.sideObject = objectData;
        }

    };

    /**
     * Get a random home banner and set it to the scope.
     */
    $rootScope.showHomePageBanner = function() {
        $http.get('/Jini3/data/home/banner.json')
            .then(function(response){
                var items = response.data;
                $rootScope.showHomeBanner = items[Math.floor(Math.random()*items.length)];
            });
    };


    /**
     * Close the menu on mouse hover.
     *
     * if there is a search category page
     * the menu will act differently,
     * there is no open on hover.
     *
     * so its will check for the current page and act accordingly
     * on map pages will reset the map width.
     *
     * also will close all hover options
     * so that the menu will go back without hover options.
     * @returns {boolean}
     */
    var mapTimeout = false;
    $rootScope.closeMenuOnMouseover = function(){
        if(justOpened)
            return false;

        // Category list page
        if($rootScope.showCategoriesBlock)
        {
            // Map block is open.
            if($rootScope.showCategoriesBlockMap)
            {
                $rootScope.set_map_width = 0;
                mapTimeout = setTimeout(function(){
                    $rootScope.displayHandle.closeAll();
                    $rootScope.$digest();
                },300);

            }
            else
            {
                $rootScope.displayHandle.closeAll();
            }
        }
        // Object page
        else if($rootScope.showObjectBlock)
        {
            if($rootScope.showObjectBlockMap)
            {
                $rootScope.set_map_width = 0;
                // Map block is open.
                mapTimeout = setTimeout(function(){
                    $rootScope.displayHandle.closeAll();
                    $rootScope.$digest();
                },300);

            }
            else
            {
                $rootScope.displayHandle.closeAll();
            }
        }
    };

    /**
     * Show the categories map view and hide the list view
     * @returns {boolean}
     */
    $rootScope.showCategoriesMap = function(){
        if(!$rootScope.showCategoriesBlock)
            return false;

        if($rootScope.showCategoriesBlockMap)
            return true;

        $rootScope.showCategoriesBlockList = false;
        $rootScope.showCategoriesBlockMap  = true;
    };

    /**
     * Show the categories list view and hide the map view
     * @returns {boolean}
     */
    $rootScope.showCategoriesList = function(){
        if(!$rootScope.showCategoriesBlock)
            return false;

        if($rootScope.showCategoriesBlockList)
            return true;

        $rootScope.showCategoriesBlockList = true;
        $rootScope.showCategoriesBlockMap  = false;
    };


    /**
     * Search area:
     *
     * there are 3 search types.
     * 1. regular (auto complete)
     * 2. search page
     * 3. category search page
     */

    /**
     * create a few variables for the search options
     */
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
        regular: []
    };

    // Create a few scope params for the searches.
    $rootScope.keywords = {};
    $rootScope.top_search_result = false;
    $rootScope.center_search_result = false;
    $rootScope.category_search_result = false;

    /**
     * DO the search based on the search type.
     * @returns {boolean}
     */
    $rootScope.search = function(){

        /**
         * Search page
         */
        if($state.current.name == 'search')
        {
            /**
             * Clear other search
             */
            if(timeout2)
                clearTimeout(timeout2);
            if(timeout3)
                clearTimeout(timeout3);

            // Clear current old searches.
            if(interval1)
                clearTimeout(timeout1);

            /**
             * Start to search on a timeout
             *
             * store the search and on the next time return the stored search.
             */
            var currentSearch = $rootScope.keywords.keywords;
            interval1 = true;
            timeout1 = setTimeout(function()
            {
                interval1 = false;
                // empty other searches
                $rootScope.center_search_result = $rootScope.top_search_result = null;

                // Has the current search stored
                if(searches.page[currentSearch])
                {
                    $rootScope.center_search_result = searches.page[currentSearch];
                    if(!$rootScope.$$phase) $rootScope.$digest();
                }
                // http get the search
                else
                {
                    $http.get(centerSearchUrl + currentSearch).then(function(resp){
                        searches.page[currentSearch] = $rootScope.center_search_result = resp.data;
                        if(!$rootScope.$$phase) $rootScope.$digest();
                    });
                }

            }, 500);

        }
        /**
         * Category search.
         */
        else if($state.current.name == 'searchInCategory')
        {
            /**
             * Clear other search
             */
            if(timeout1)
                clearTimeout(timeout1);
            if(timeout3)
                clearTimeout(timeout3);

            // Clear current old searches.
            if(interval2)
                clearTimeout(timeout2);

            /**
             * Start to search on a timeout
             *
             * store the search and on the next time return the stored search.
             */
            interval2 = true;
            timeout2 = setTimeout(function()
            {

                interval2 = false;
                // empty other searches
                $rootScope.top_search_result = $rootScope.center_search_result = false;

                // Has the current search stored
                if(searches.page[$rootScope.keywords.keywords + '|' + $state.params.id])
                {
                    $rootScope.category_search_result = searches.page[$rootScope.keywords.keywords + '|' + $state.params.id];
                    if(!$rootScope.$$phase) $rootScope.$digest();
                }
                // http get the search
                else
                {
                    $http.get(centerSearchUrl + $rootScope.keywords.keywords + '&categoryid=' + $state.params.id).then(function(resp){
                        searches.page[$rootScope.keywords.keywords + '|' + $state.params.id] = $rootScope.category_search_result = resp.data;
                        if(!$rootScope.$$phase) $rootScope.$digest();
                    });
                }

            }, 500);
        }
        /**
         * Regular search
         */
        else
        {
            /**
             * Clear other search
             */
            if(timeout1)
                clearTimeout(timeout1);
            if(timeout2)
                clearTimeout(timeout2);

            // Clear current old searches.
            if(interval3)
                clearTimeout(timeout3);

            /**
             * Start to search on a timeout
             *
             * store the search and on the next time return the stored search.
             */
            interval3 = true;
            timeout3 = setTimeout(function()
            {
                interval3 = false;
                // Has the current search stored
                if(searches.regular[$rootScope.keywords.keywords])
                {
                    $rootScope.top_search_result = searches.regular[$rootScope.keywords.keywords];
                    if(!$rootScope.$$phase) $rootScope.$digest();
                }
                // http get the search
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
    };

    /**
     * Clear the search
     */
    $rootScope.clearSearch = function(){
        $rootScope.keywords.keywords = null;
        $rootScope.top_search_result = false;
    };

    /**
     * Handle the X (search close button)
     * @returns {boolean}
     */
    $rootScope.closeSearchBtn = function(){
        /**
         * Regular search:
         * clear the search.
         */
        if($rootScope.top_search_result && $rootScope.top_search_result.length)
        {
            $rootScope.clearSearch();
            return false;
        }

        /**
         * Search page:
         * go back to the back url.
         */
        if($rootScope.center_search_result && $rootScope.center_search_result.count)
            $rootScope.back();

        /**
         * Category Search page:
         * go back to regular search page
         */
        if($rootScope.category_search_result)
            $location.path('/' + $state.params.id + '/' + encodeURI($state.params.title));

        /**
         * Any way clear the search twice
         * if an http search will return
         */
        $rootScope.clearSearch();
        setTimeout(function(){
            $rootScope.clearSearch();
        },300);
    };

    /**
     * Change the search url on search field is change.
     *
     * @param isButtonClick
     * @returns {boolean}
     */
    $rootScope.changeUrl = function(isButtonClick){

        /**
         * Search page:
         * if there is any search change the url to search again.
         */
        if($state.current.name == 'search')
        {
            if($rootScope.keywords.keywords.length >= 1)
            {
                $location.path('/search/' + $rootScope.keywords.keywords)
            }

        }
        /**
         * Category search page:
         * if there is any search change the url to search again based on current view (map / list)
         */
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
        /**
         * Regular search (auto complete)
         * if there was a button click reffer to the search page,
         * else just search.
         */
        else
        {
            if(isButtonClick)
                $location.path('/search/' + $rootScope.keywords.keywords);
            else
                $rootScope.search();
        }
        return false;
    };

    /**
     * Change the url for category search on the map view
     * @returns {boolean}
     */
    $rootScope.showCategoriesSearchMap = function(){
        console.log('clicked!showCategoriesSeacrhMap');
        if(!$rootScope.showCategorySearchBlock)
            return false;

        if($rootScope.showCategoriesSearchBlockMap)
            return true;

        $location.path('/' + $state.params.id + '/' + $state.params.title + '/search/map/' + $rootScope.keywords.keywords)
    };

    /**
     * Change the url for category search on the list view
     * @returns {boolean}
     */
    $rootScope.showCategoriesSearchList = function(){
        console.log('clicked!showCategoriesList');
        if(!$rootScope.showCategorySearchBlock)
            return false;

        if($rootScope.showCategoriesSearchBlockList)
            return true;

        $location.path('/' + $state.params.id + '/' + $state.params.title + '/search/' + $rootScope.keywords.keywords);
    };
};