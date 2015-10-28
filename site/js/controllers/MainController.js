angular.module('JINI.controllers')
.controller('MainController', MainController);


MainController.$inject = ['$stateParams', '$http', '$rootScope', '$scope', 'pie', 'fixPie'];

function MainController($state, $http, $rootScope, $scope, pie, fixPie) {

    $rootScope.siteUrl = '/Jini3/#';
    $rootScope.mediaUrl = '/Jini3/public/uploads/';

    $rootScope.pie = pie;
    $rootScope.fixPie = function(){
        fixPie.init($rootScope.currentCategories.length, $rootScope.isFirst);
    };

    $rootScope.centerImage = '../img/no_selector.png';

    $rootScope.imageOn = function(e){
        $rootScope.centerImage = e.featuredImageUrl;
    };

    $rootScope.imageOff = function(){
        $rootScope.centerImage = '../img/no_selector.png';
    };

    console.log('MainController');
};


