angular.module('JINI.controllers')
.controller('MainController', MainController);


MainController.$inject = ['$state', '$http', '$rootScope', '$scope'];

function MainController($state, $http, $rootScope, $scope) {

    $rootScope.siteUrl = 'http://localhost/Jini3/#';

    console.log('MainController');
};


