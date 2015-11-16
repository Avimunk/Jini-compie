angular.module('JINI.controllers')
    .controller('HomeController', ['$scope', '$rootScope', 'pie', HomeController]);


function HomeController($scope, $rootScope, pie) {
    console.log('HomeController!')
    $rootScope.clearSearch();
    $scope.pie = pie;
};
