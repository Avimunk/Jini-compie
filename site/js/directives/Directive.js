angular.module('JINI.directives', [])
/**
 * Category hover directive
 */
    .directive('categoryhover', function(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'templates/directives/categoryHover.html',
        }
    })
/**
 * Page block directive
 */
    .directive('pageBlock', function(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'templates/directives/pageBlock.html',
        }
    })
/**
 * Object directive
 */
    .directive('objectblock', function(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'templates/directives/objectBlock.html',
        }
    })
/**
 * Category list directive
 */
    .directive('categoriesblock', function(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'templates/directives/categoriesBlock.html',
        }
    })
/**
 * Category search page directive
 */
    .directive('categoriesSearchBlock', function(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'templates/directives/categoriesBlockSearch.html',
        }
    })
/**
 * Category map directive
 *
 * Init the google map,
 * Get the http data for the current category and create markers.
 */
    .directive('categoryMap', ['$http', '$rootScope', function($http, $rootScope) {
        // directive link function
        var mapData = [];
        var link = function(scope, element, attrs) {
            var map, infoWindow, infoBubble;
            var markers = [];

            // map config
            var mapOptions = {
                center: new google.maps.LatLng(32.0713513,34.8798235,9),
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: true,
                scrollwheel: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                },
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_CENTER,
                    style: google.maps.ZoomControlStyle.LARGE
                }
            };

            // init the map
            function initMap() {
                if(map !== void 0)
                {

                }
                if (map === void 0) {
                    map = new google.maps.Map(element[0], mapOptions);
                }
            }

            // place a marker
            function setMarker(location, info, iconUrl, isImage) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: location,
                    animation: google.maps.Animation.DROP
                });

                if (iconUrl) {
                    marker.setIcon(iconUrl);
                }

                if (info == "" || typeof info == 'undefined')
                    return;

                marker.info = info;

                markers.push(marker); // add marker to array

                google.maps.event.addListener(marker, 'click', function() {

                    if (infoBubble !== void 0) {
                        infoBubble.close();
                    }
                    infoBubble = new InfoBubble({
                        map: map,
                        content: marker.info,

                        padding: 0,
                        backgroundColor: 'white',
                        borderColor: 'transparent',
                        backgroundClassName: 'infoBubbleBlock',

                        minHeight: isImage ? '370' : '130',
                        maxHeight: isImage ? '370' : '130',
                        minWidth: '450',
                        maxWidth: '450',

                        borderRadius: 0,
                        borderWidth: 0,

                        arrowSize: 20,
                        arrowPosition: 30,
                        arrowStyle: 2,
                        shadowStyle: 0,
                        closeSrc: '/Jini3/images/icons/close-white-bg.png',
                    });
                    infoBubble.open(map, marker);
                });
            }

            // show the map and place some markers
            initMap();

            var categoryID = scope.currentItem.id;
            console.log('scope.keywords.keywords' ,scope.keywords.keywords, typeof scope.keywords.keywords);
            var queryString = typeof scope.keywords.keywords != 'undefined' && typeof scope.keywords.keywords != 'function' ? scope.keywords.keywords : '';
            $rootScope.categoryMapItemsLoaded = false;
            if(mapData[categoryID + queryString])
            {
                $rootScope.categoryMapItemsLoaded = true;

                // if there is no items in the map go back to list view
                if(mapData[categoryID + queryString].data.length == 0)
                {
                    $rootScope.showCategoriesList();
                    return false;
                }
                setMarkers(mapData[categoryID + queryString]);
            }
            else
            {
                $http.get('/Jini3/public/objects/locations?categoryid=' + categoryID + (queryString ? '&query=' + queryString : ''))
                    .then(function(response){
                        console.log('getMapData',response.data)

                        // if there is no items in the map go back to list view
                        if(response.data.data.length == 0)
                        {
                            $rootScope.showCategoriesList();
                            return false;
                        }

                        mapData[categoryID + queryString] = response.data;
                        console.log(mapData[categoryID + queryString]);
                        $rootScope.categoryMapItemsLoaded = true;
                        setMarkers(mapData[categoryID + queryString]);
                    });
            }

            function setMarkers(content)
            {
                for (var i = 0; i < content.data.length; i++){
                    var data = content.data[i];

                    if (data.score >= 1) {
                        iconUrl = '/Jini3/public/img/icons/map_pin_promoted_xs.png';
                    }
                    else {
                        iconUrl = '/Jini3/public/img/icons/map_pin_xs.png';
                    }

                    var html = '<div class="marker-popup' + (!data.content_image ? ' no-content-image' : '  content-image') +'">' +
                        '<div class="top-pane" style="background-image: url(' + data.content_image + ');"></div>' +
                        '   <div class="main-pane">' +
                        '       <div class="row heading">' +
                        '           <a href="#/'+ scope.currentItem.id +'-'+data.id+'/cat/'+scope.currentItem.title+'/'+data.name+'/" class="col-md-12">' +
                        '               <h2 class="title">' + data.title.trunc(38,true) + '</h2>' +
                        '           </a>' +
                        '       </div>' +
                        '       <div class="row heading">' +
                        '           <div class="col-md-12">' +
                        '               <div class="content">' + decodeEntities(data.excerpt).trunc(85,true) + '</div>' +
                        '           </div>' +
                        '       </div>' +
                        '       <div class="row actions actions-pane">' +
                        '           <div class="pull-left"><span class="address">' + data.address_street + ' ' + data.address_city + '</span></div>' +
                        '           <a class="more-info map-more-info" href="#/'+ scope.currentItem.id +'-'+data.id+'/cat/'+scope.currentItem.title+'/'+data.name+'/">More Info</a>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '</div>';

                    setMarker(new google.maps.LatLng(data.geo_latitude, data.geo_longitude), html, iconUrl, (data.content_image ? true : false));
                }
            }

        };

        return {
            restrict: 'EA',
            template: '<div id="gmaps" style="width: 1178px; height: 980px;"></div>',
            replace: true,
            link: link
        };
    }])
/**
 * Object map directive
 *
 * Init the google map,
 * Get the http data for the current object, create and open a marker on the map.
 */
    .directive('objectMap', ['$http', function($http) {
        // directive link function
        var mapData = [];
        var link = function(scope, element, attrs) {
            console.log('objectMap', attrs);
            var map, infoWindow, infoBubble;
            var markers = [];

            // map config
            var mapOptions = {
                center: new google.maps.LatLng(32.0713513,34.8798235,9),
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: true,
                scrollwheel: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                },
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_CENTER,
                    style: google.maps.ZoomControlStyle.LARGE
                }
            };

            // init the map
            function initMap() {
                if (map === void 0) {
                    map = new google.maps.Map(element[0], mapOptions);
                }
            }

            // place a marker
            function setMarker(location, info, iconUrl) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: location,
                    animation: google.maps.Animation.DROP
                });

                if (iconUrl) {
                    marker.setIcon(iconUrl);
                }

                if (info == "" || typeof info == 'undefined')
                    return;

                marker.info = info;

                markers.push(marker); // add marker to array
                infoBubble = new InfoBubble({
                    map: map,
                    content: marker.info,
                    position: new google.maps.LatLng(parseFloat(scope.sideObject.address.location_g) + 0.035, scope.sideObject.address.location_k),

                    padding: 0,
                    backgroundColor: 'white',
                    borderColor: 'transparent',
                    backgroundClassName: 'infoBubbleBlock',

                    minHeight: scope.sideObject._content_image ? '370' : '130',
                    maxHeight: scope.sideObject._content_image ? '370' : '130',
                    minWidth: '450',
                    maxWidth: '450',

                    borderRadius: 0,
                    borderWidth: 0,

                    arrowSize: 20,
                    arrowPosition: 30,
                    arrowStyle: 2,
                    shadowStyle: 0,
                    closeSrc: '/Jini3/images/icons/close-white-bg.png',
                });
                infoBubble.open(map);

                google.maps.event.addListener(marker, 'click', function() {
                    infoBubble.open(map, marker);
                });
            }

            // show the map and place some markers
            initMap();
            if(scope.sideObject.map)
            {
                console.log('mapItem')
                if (scope.sideObject.score >= 1) {
                    iconUrl = '/Jini3/public/img/icons/map_pin_promoted_xs.png';
                }
                else {
                    iconUrl = '/Jini3/public/img/icons/map_pin_xs.png';
                }

                var html = '<div class="marker-popup' + (!scope.sideObject._content_image ? ' no-content-image' : ' content-image') +'">' +
                    '<div class="top-pane" style="background-image: url(' + scope.sideObject._content_image + ');"></div>' +
                    '   <div class="main-pane">' +
                    '       <div class="row heading">' +
                    '           <a href="#/0-'+scope.sideObject.id+'/Home/'+scope.sideObject.title+'/" class="col-md-12">' +
                    '               <h2 class="title">' + scope.sideObject.title.trunc(38,true) + '</h2>' +
                    '           </a>' +
                    '       </div>' +
                    '       <div class="row heading">' +
                    '           <div class="col-md-12">' +
                    '               <div class="content">' + decodeEntities(scope.sideObject.excerpt).trunc(85,true) + '</div>' +
                    '           </div>' +
                    '       </div>' +
                    '       <div class="row actions actions-pane">' +
                    '           <div class="pull-left"><span class="address">' + scope.sideObject.address.address + ' ' + scope.sideObject.address.city + '</span></div>' +
                    '           <a class="more-info map-more-info" href="#/0-'+scope.sideObject.id+'/Home/'+scope.sideObject.title+'/">More Info</a>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>' +
                    '</div>';

                setMarker(new google.maps.LatLng(scope.sideObject.address.location_g, scope.sideObject.address.location_k), html, iconUrl);
            }
        };

        return {
            restrict: 'EA',
            template: '<div id="gmaps" style="width: 1178px; height: 980px;"></div>',
            replace: true,
            link: link
        };
    }])
/**
 * Submit the search field on enter click directive
 * set the search page with current search on enter.
 */
    .directive('enterSubmit', ['$location', function ($location) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('keydown', function(event) {
                    var code = event.keyCode || event.which;
                    if (code === 13 && elem.val() != '') {
                        $location.path('/search/' + elem.val());
                    }
                    /*
                    if(!$rootScope.top_search_position)
                        $rootScope.top_search_position = 0;

                    var searchResults = $rootScope.top_search_result.length;
                    if(searchResults){
                        if (code === 38) { // Up
                            console.log('upkey', searchResults, $rootScope.top_search_position)
                            if($rootScope.top_search_position <= 0)
                                return false;

                            $rootScope.top_search_position = $rootScope.top_search_position - 1;
                        }
                        if (code === 40) { // Down
                            console.log('downkey', searchResults, $rootScope.top_search_position)
                            if($rootScope.top_search_position >= searchResults)
                                return false;

                            $rootScope.top_search_position = $rootScope.top_search_position + 1;
                        }
                    }

                    if (code === 13) {
                        console.log('sdfsdfsdf', $rootScope.top_search_position, $rootScope.top_search_result.length);

                        var path = '/search/' + elem.val();
                        if($rootScope.top_search_position && $rootScope.top_search_result.length)
                        {
                            item = $rootScope.top_search_result[$rootScope.top_search_position + 1];
                            console.log('inScope',item)
                            if(item)
                            {
                                var path = item.type == 'category' ? ('/' + item.id + '/' + item.name) : ('/' + item.category['id'] + '-' + item.id + '/' + item.category['name'] + '/' + item.name + '/')
                                path = encodeURI(path);
                                console.log('inScope2',path)
                            }
                        }
                        console.log('inScope3',path)
                        $location.path(path);
                    }
                    */
                });
            }
        }
    }])
/**
 * Search page directive
 */
    .directive('searchBlock', function(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'templates/directives/searchBlock.html',
        }
    })
/**
 * Fix the height of the elements directive.
 * will fix the height for the scrollbars.
 */
    .directive('fixInsideSize', ['$window', '$rootScope', function($window, $rootScope) {
        return function(scope, elem, attrs) {

            angular.element($window).bind('resize', function() {
                var height = elem[0].offsetHeight;
                if(height > 730)
                    $rootScope.item_info_height = height;
                else
                    $rootScope.item_info_height = height + 53;

                console.log($rootScope.item_info_height);
                $rootScope.$digest();
            });

            var height = elem[0].offsetHeight;
            if(height > 730)
                $rootScope.item_info_height = height;
            else
                $rootScope.item_info_height = height + 53;

            $rootScope.$digest();
            console.log($rootScope.item_info_height)
        }
    }])
;
/**
 * html decode for map popups.
 */
var decodeEntities = (function() {
    // this prevents any overhead from creating the object each time
    var element = document.createElement('div');

    function decodeHTMLEntities (str) {
        if(str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }

        return str;
    }

    return decodeHTMLEntities;
})();