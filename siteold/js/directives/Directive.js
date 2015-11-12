angular.module('JINI.directives', [])
    .directive('categoryhover', function(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'templates/directives/categoryHover.html',
        }
    })
    .directive('objectblock', function(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'templates/directives/objectBlock.html',
        }
    })
    .directive('categoriesblock', function(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'templates/directives/categoriesBlock.html',
        }
    })
    .directive('categoriesSearchBlock', function(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'templates/directives/categoriesBlockSearch.html',
        }
    })
    .directive('myMap', ['$http', function($http) {
        // directive link function
        var mapData = [];
        var link = function(scope, element, attrs) {
            var map, infoWindow;
            var markers = [];

            // map config
            var mapOptions = {
                center: new google.maps.LatLng(31.9026026, 34.946152, 9.75),
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

                google.maps.event.addListener(marker, 'click', function() {
                    if (infoWindow !== void 0) {
                        infoWindow.close();
                    }
                    // create new window
                    var infoWindowOptions = {
                        content: marker.info,
                        maxWidth: 512,
                        height: 264
                    };
                    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                    infoWindow.open(map, marker);
                });
            }

            // show the map and place some markers
            initMap();

            var categoryID = scope.currentItem.id;
            console.log(scope.search, typeof scope.search);
            var queryString = typeof scope.search != 'undefined' && typeof scope.search != 'function' ? scope.search : '';
            if(mapData[categoryID + queryString])
            {
                setMarkers(mapData[categoryID + queryString]);
            }
            else
            {
                $http.get('/Jini3/public/objects/locations?categoryid=' + categoryID + (queryString ? '&query=' + queryString : ''))
                    .then(function(response){
                        console.log('getMapData',response.data)

                        mapData[categoryID + queryString] = response.data;
                        console.log(mapData[categoryID + queryString]);
                        setMarkers(mapData[categoryID + queryString]);
                    });
            }

            function setMarkers(content)
            {
                for (var i = 0; i < content.data.length; i++){
                    var data = content.data[i];

                    if (data.promoted == 1) {
                        iconUrl = '/Jini3/public/img/icons/map_pin_promoted_xs.png';
                    }
                    else {
                        iconUrl = '/Jini3/public/img/icons/map_pin_xs.png';
                    }

                    var html = '<a href="#/'+ scope.currentItem.id +'-'+data.id+'/'+scope.currentItem.title+'/'+data.title+'" class="marker-popup' + (!data.content_image ? ' no-content-image' : '') +'">' +
                        '<div class="top-pane" style="background-image: url(' + data.content_image + ');"></div>' +
                        '   <div class="main-pane">' +
                        '       <div class="row heading">' +
                        '           <div class="col-md-12">' +
                        '               <h2 class="title">' + data.title + '</h2>' +
                        '           </div>' +
                        '       </div>' +
                        '       <div class="row heading">' +
                        '           <div class="col-md-12">' +
                        '               <div class="content">' + data.excerpt + '</div>' +
                        '           </div>' +
                        '       </div>' +
                        '       <div class="row actions actions-pane">' +
                        '           <div class="pull-left"><span class="address">' + data.address_street + ' ' + data.address_city + '</span></div>' +
                        '           <div class="pull-right"><button class="book-button">Book</button></div>' +
                        '       </div>' +
                        '   </div>' +
                        '   <button class="close-button"></button>' +
                        '</div>' +
                        '</div>';

                    setMarker(new google.maps.LatLng(data.geo_latitude, data.geo_longitude), html, iconUrl);
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
    .directive('enterSubmit', ['$location', function ($location) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('keydown', function(event) {
                    var code = event.keyCode || event.which;
                    if (code === 13) {
                        $location.path('/search/' + elem.val());
                    }
                });
            }
        }
    }])
    .directive('searchBlock', function(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'templates/directives/searchBlock.html',
        }
    })
;

