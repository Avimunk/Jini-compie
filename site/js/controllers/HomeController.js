angular.module('JINI.controllers')
    .controller('HomeController', ['$scope', '$rootScope', 'pie', HomeController]);

function HomeController($scope, $rootScope, pie) {
    console.log('HomeController!')
    // clear the search and fix the pie.
    $rootScope.clearSearch();
    $scope.pie = pie;
};
