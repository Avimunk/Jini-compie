angular.module('JINI.controllers')
.controller('MainController', MainController);


MainController.$inject = ['$state', '$rootScope', 'pie', 'fixPie', '$http', '$location', '$scope', '$window', '$timeout'];

function MainController($state, $rootScope, pie, fixPie, $http, $location, $scope, $window, $timeout) {

    console.log('MainController');
    /**
     * Setters.
     */
    // site and media url's
    $rootScope.siteUrl = '/Jini3/#';
    $rootScope.mediaUrl = 'http://jini.co.il/public/uploads/';

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
    var searchLast = '';
    $rootScope.$on('$locationChangeSuccess', function() {

        // Zoom analytics
        try {
            __ZA.simulateNewPage();
        }
        catch (e) {}

        // History
        $rootScope.isPage = false;
        //console.log('history', $location.$$path, history);
        history.push($location.$$path);

        if($location.$$path.indexOf('search') == -1)
            searchLast = $location.$$path;
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

        if(window.innerWidth < 980)
        {
            top.location.href = '/Jini3/mobile.html';
        }

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
        $rootScope.showHomeBanner = {};

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
        $rootScope.showHomeBanner.homeBanner = false;

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
            if($state.current.name == 'search' || $state.current.name == 'searchInCategory')
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
            $rootScope.showHomeBanner.homeBanner = $rootScope.showCategoryBlock = $rootScope.showObjectBlock = $rootScope.showCategoriesBlock = false;
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
        $rootScope.showHomeBanner.homeBanner = false;

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
    $rootScope.showCategoryList = function(categoryData, offset){

        $rootScope.currentCategoryData = categoryData;
        if(typeof offset == 'undefined')
            offset = 0;

        if(!offset)
        {
            // remove old data so the loader will show again
            $rootScope.sideCategories = false;

            console.log('$rootScope.showCategoryList', categoryData);
            var id = categoryData.id;
            if(sideCategoriesList[id])
            {
                console.log(sideCategoriesList[id].length);
                if(sideCategoriesList[id].length == 1)
                {
                    var item = sideCategoriesList[id][0];
                    //console.log('$rootScope.showCategoryList', item, sideCategoriesList[id]);
                    $rootScope.displayHandle.closeAll();
                    $location.path('/' + id + '-' + item.id + '/' + item.catName + '/' + item.name + '/');
                }
                $rootScope.sideCategories = sideCategoriesList[id];
            }
            else
            {
                $http.get('/Jini3/public/objects/search?categoryid='+ id +'&index=100')
                    .then(function(response){
                        var item = response.data.items;
                        if(item.length == 1)
                        {
                            item = item[0];
                            $rootScope.displayHandle.closeAll();
                            $location.path('/' + id + '-' + item.id + '/' + item.catName + '/' + item.name + '/');
                        }
                        $rootScope.sideCategories = sideCategoriesList[id] = response.data.items;
                        $rootScope.regularCategoryOffsetCount = response.data.offset ? response.data.offset : 0;
                    });
            }
        }
        else
        {
            if($rootScope.regularCategoryFetchMoreStarted == true)

                return false;

            $rootScope.regularCategoryFetchMoreStarted = true;

            var id = categoryData.id;
            $http.get('/Jini3/public/objects/search?categoryid='+ id +'&offset=' + offset)
                .then(function(response){
                    $rootScope.sideCategories = $rootScope.sideCategories.concat(response.data.items);
                    $rootScope.regularCategoryOffsetCount = response.data.offset ? response.data.offset : 0;
                    $rootScope.regularCategoryFetchMoreStarted = false;
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
        console.log('showHomePageBanner');
        $http.get('/Jini3/data/home/banner.json')
            .then(function(response){
                var items = response.data;
                $rootScope.showHomeBanner.homeBanner = items[Math.floor(Math.random()*items.length)];
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

        // trigger resize to fix scroller display
        $rootScope.doResize(300);
    };

    /**
     * Window will trigger resize handler
     * @param timeout
     */
    $rootScope.doResize = function(timeout){
        if(typeof timeout != 'number')
            timeout = 0;
        $timeout(
            function(){
                var w = angular.element($window);
                w.triggerHandler('resize');
            },
        timeout);
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
    $rootScope.search = function(offset){

        /**
         * Search page
         */
        if($state.current.name == 'search')
        {
            if(typeof offset == 'undefined')
                offset = 0;

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

            if(!offset)
            {
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
                        $rootScope.searchPageOffsetCount = searches.page[currentSearch].offset ? searches.page[currentSearch].offset : 0;
                        if(!$rootScope.$$phase) $rootScope.$digest();
                    }
                    // http get the search
                    else
                    {
                        $http.get(centerSearchUrl + currentSearch).then(function(resp){
                            searches.page[currentSearch] = $rootScope.center_search_result = resp.data;
                            $rootScope.searchPageOffsetCount = resp.data.offset ? resp.data.offset : 0;
                            if(!$rootScope.$$phase) $rootScope.$digest();
                        });
                    }

                }, 500);
            }
            else
            {
                if($rootScope.searchPageFetchMoreStarted == true)
                    return false;

                $rootScope.searchPageFetchMoreStarted = true;
                /**
                 * Start to search on a timeout
                 *
                 * store the search and on the next time return the stored search.
                 */
                interval1 = true;
                var currentSearch = $rootScope.keywords.keywords;
                timeout1 = setTimeout(function()
                {
                    interval1 = false;
                    // empty other searches

                    $http.get(centerSearchUrl + currentSearch + '&offset=' + offset).then(function(resp){
                        $rootScope.center_search_result.data = $rootScope.center_search_result.data.concat(resp.data.data);
                        //console.log($rootScope.center_search_result);
                        $rootScope.searchPageOffsetCount = resp.data.offset ? resp.data.offset : 0;

                        if(!$rootScope.$$phase) $rootScope.$digest();
                        $rootScope.searchPageFetchMoreStarted = false;
                    });
                }, 500);
            }
        }
        /**
         * Category search.
         */
        else if($state.current.name == 'searchInCategory')
        {
            console.log('new searchInCategory');
            if(typeof offset == 'undefined')
                offset = 0;

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

            if(!offset)
            {
                // remove old search so the loader will show again
                $rootScope.category_search_result = false;

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
                            searches.page[$rootScope.keywords.keywords + '|' + $state.params.id] = $rootScope.category_search_result = resp.data.items;
                            $rootScope.offsetCount = resp.data.offset ? resp.data.offset : 0;
                            if(!$rootScope.$$phase) $rootScope.$digest();
                        });
                    }

                }, 500);
            }
            else
            {
                if($rootScope.fetchMoreStarted == true)
                    return false;

                $rootScope.fetchMoreStarted = true;
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

                    $http.get(centerSearchUrl + $rootScope.keywords.keywords + '&categoryid=' + $state.params.id + '&offset=' + offset).then(function(resp){
                        $rootScope.category_search_result = $rootScope.category_search_result.concat(resp.data.items);
                        console.log($rootScope.category_search_result);
                        $rootScope.offsetCount = resp.data.offset ? resp.data.offset : 0;

                        if(!$rootScope.$$phase) $rootScope.$digest();
                        $rootScope.fetchMoreStarted = false;
                    });

                }, 500);
            }
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
        if($rootScope.center_search_result && $rootScope.center_search_result.count || $state.current.name == 'search')
        {
            $location.path(searchLast);
            //$rootScope.back();
            return false;
        }

        /**
         * Category Search page:
         * go back to regular search page
         */
        if($rootScope.category_search_result || $state.current.name == 'searchInCategory')
        {
            $location.path('/' + $state.params.id + '/' + encodeURI($state.params.title));
            return false;
        }

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
                $location.path('/search/' + $rootScope.keywords.keywords)
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
            if(isButtonClick){
                if($rootScope.keywords != null && $rootScope.keywords.keywords != null)
                    $location.path('/search/' + $rootScope.keywords.keywords);
            }
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

    /**
     * force to reload the page when category hover and tring to get the current page again.
     * @param page
     */
    $rootScope.goToPage = function(page){
        if($rootScope.showCategoryBlock && $rootScope.currentPage == page)
        {
            $state.reload();
        }
    }
};